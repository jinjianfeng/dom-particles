import TextParticleManager from './text_particle_manager';

let t = new TextParticleManager({ max: 10000 });

let c = { x: document.body.clientWidth / 2 , y: document.body.clientHeight / 2 };
const GRAVITY = 0.1;

const HEAT_COLORS = [
  [0, 0, 0], // we're out
  [31, 0, 0,], // even fainter
  [61, 12, 8], // faint red
  [98, 12, 11], // blood red
  [167, 18, 14], // dark cherry
  [220, 25, 21], // medium cherry 
  [232, 39, 24], // cherry
  [255, 54, 28], // bright cherry
  [255, 72, 24], // salmon
  [255, 105, 16], // dark orange
  [255, 166, 36], // orange
  [255, 246, 79], // lemon
  [255, 253, 148], // light yellow
  [254, 254, 200], // white
  [254, 254, 254], // white
].reverse();

document.querySelector('button').addEventListener('click', () => {
  t.createEmitter({
    get position () { return { x: document.body.clientWidth / 2 - 50, y: document.body.clientHeight / 2} },
    emitEvery: 32,
    maxEmissions: 1,
    particleOptions: {
      get ttl () { return 5000 * Math.random() },
      get text () { return '' },
      get velocity () {
        let h = 2 * Math.PI * Math.random();
        let k = 100 + 400 * Math.random();
        return { x: k * Math.cos(h), y: k * Math.sin(h) }  
      },
      
      style: { backgroundColor: '#fff', width: '16px', height: '100px', width: '100px', borderStyle: 'solid', borderWidth: '2px', display: 'block', borderRadius: ['0px'] },
      onUpdate: (p) => {
        if (p.frameNumber % 30 === 0){
          // p.setText(['#', '!', '$', '%', '?'][Math.floor(5 * Math.random())]);
        }
      }
    },
  });
});