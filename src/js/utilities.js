/* Useful regexes */
const RGB_PATTERN = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
const RGBA_PATTERN = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01](?:\.\d+)*)\s*\)/;
const HEX_PATTERN = /#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})/;
const NUMBER_AND_UNIT_PATTERN = /(\d+\.\d+|\d+)([a-z]+)?/;

/* CSS to internal format import / export */

export const rgbToNumbers = (string) => {
  try {
    let [_, r, g, b] = RGB_PATTERN.exec(string);
    return [...[r, g, b].map(v => parseInt(v)), 1.0]; 
  }
  catch (err){
    return false;
  }
}

export const rgbaToNumbers = (string) => {
  try {
    let [_, r, g, b, a] = RGBA_PATTERN.exec(string);
    return [r, g, b, a].filter(v => v).map(v => parseInt(v)) 
  }
  catch (err){
    return false;
  }
}

export const hexToNumbers = (string) => {
  try {
    let [_, r, g, b] = HEX_PATTERN.exec(string);
    return [...[r, g, b].map(x => parseInt(x, 16) * ((x.length === 1) ? 0x11 : 0x1)), 1.0];
  } 
  catch (err) {
    return false;  
  }
}

export const extractNumberAndUnit = (string) => {
  let [_, num, unit] = NUMBER_AND_UNIT_PATTERN.exec(string);
  return [parseInt(num), unit || '']
}

export const tryGetValue = (string) => {
  switch(string[0]){
    case '#':
      return hexToNumbers(string);
    case 'r':
      return (string[3] === 'a' ? rgbaToNumbers : rgbToNumbers)(string);
    default:
      return extractNumberAndUnit(string);
  }
}

export const colourToCSSString = ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a})`;
export const valueToCSSString = (val, unit) => `${val}${unit}`;

/* Easing functions */
export const lerp = (a, b, frac) => a + ((b - a) * frac);

export const easeArray = (array, easeFn, frac) => {
    /* 
    For 2 values, it should always spit out [0, 1] as idx and nextIdx.
    For 3 values
    */
    let idx = Math.round(frac / idxFrac);
    let nextIdx = idx === array.length - 1 ? idx : idx + 1;
    return easeFn(array[idx], array[nextIdx], frac);
}

/* Property calculation function-generation functions */

export const transpose = (array) => {
  return array[0].map((_, i) => array.map(r => r[i]));  
}

export const styleValueToFunction = (styleValue) => {
  let k = styleValue.map(s => tryGetValue(s));
  
  
  if (k[0].length === 2){
    let unit = k[0][1];
    let values = k.map(v => v[0]);
    return (frac) => valueToCSSString(easeArray(values, lerp, frac), unit)
  } else {
    let k_t = transpose(k);
    return (frac) => colourToCSSString(k_t.map(c => easeArray(c, lerp, frac)))  
  } 
}