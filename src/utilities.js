/* Useful regexes */
const RGB_PATTERN = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
const RGBA_PATTERN = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01](?:\.\d+)*)\s*\)/;
const HEX_PATTERN = /#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})/;
const NUMBER_AND_UNIT_PATTERN = /(\d+\.\d+|\d+)([a-z]+)?/;

/* CSS to internal format import / export */

export const rgbToNumbers = string => {
  try {
    let [_, r, g, b] = RGB_PATTERN.exec(string);
    return [...[r, g, b].map(v => parseInt(v)), 1.0];
  } catch (err) {
    console.warn(`Invalid RGB value: ${string}`);
    return false;
  }
};

export const rgbaToNumbers = string => {
  try {
    let [_, r, g, b, a] = RGBA_PATTERN.exec(string);
    return [...[r, g, b].map(v => parseInt(v)), parseFloat(a)];
  } catch (err) {
    console.warn(`Invalid RGBA value: ${string}`);
    return false;
  }
};

export const hexToNumbers = string => {
  try {
    let [_, r, g, b] = HEX_PATTERN.exec(string);
    return [
      ...[r, g, b].map(x => parseInt(x, 16) * (x.length === 1 ? 0x11 : 0x1)),
      1.0
    ];
  } catch (err) {
    console.warn(`Invalid hex value: ${string}`);
    return false;
  }
};

export const valueToNumberAndUnit = string => {
  try {
    let [_, num, unit] = NUMBER_AND_UNIT_PATTERN.exec(string);
    return [parseFloat(num), unit || ""];
  } catch (err) {
    console.warn(`Invalid CSS unit string: ${string}`);
    return false;
  }
};

export const tryGetValue = string => {
  switch (string[0]) {
    case "#":
      return hexToNumbers(string);
    case "r":
      return (string[3] === "a" ? rgbaToNumbers : rgbToNumbers)(string);
    default:
      return valueToNumberAndUnit(string);
  }
};

export const colourToCSSString = ([r, g, b, a]) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;
export const valueToCSSString = (val, unit) => `${val}${unit}`;

/* Easing functions */

export const lerp = (a, b, frac) => a + (b - a) * frac;

export const easeArray = (array, easeFn, frac) => {
  let total = frac * (array.length - 1);
  let start = Math.min(Math.floor(total), array.length - 1);
  let end = Math.min(start + 1, array.length - 1);
  return easeFn(array[start], array[end], total % 1);
};

/* Property calculation function-generation functions */

export const transpose = array => {
  return array[0].map((_, i) => array.map(r => r[i]));
};

export const propValueToFunction = propValue => {
  let k = propValue.map(s => tryGetValue(s));
  if (k[0].length === 2) {
    // CSS unit property (either like '12px' or like '1.0'
    let unit = k[0][1];
    let values = k.map(v => v[0]);
    return frac => valueToCSSString(easeArray(values, lerp, frac), unit);
  } else {
    // Colour in [[r, g, b, a],...] format
    let k_t = transpose(k);
    return frac => colourToCSSString(k_t.map(c => easeArray(c, lerp, frac)));
  }
};
