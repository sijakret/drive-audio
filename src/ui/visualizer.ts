import {LitElement, html, css, customElement, property} from 'lit-element';
import {run, mobileCheck} from '../utils';

const MOBILE = mobileCheck();
const FPS = MOBILE ? 20 : 30;
const FFTSIZE = MOBILE ? 64 : 256;
const MINDECIBELS = -100;
const MAXDECIBELS = -40;
const SMOOTH = 0.65;

@customElement('drive-audio-visualizer')
export class WPVisualizer extends LitElement {
  @property() player?: any

  private buffer:Uint8Array = new Uint8Array()
  private bias:Float32Array = new Float32Array()
  private cancel: any

  static get styles() {
    return css`
    :host {
      display: flex;
      align-items: flex-end;
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      z-index: -1;
    }
    canvas {
      image-rendering: pixelated;
      width: 100%;
      height: 100%;
      fill: var(--p-col-l);
      color: var(--s-col-l);
    }`;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.cancel = run(FPS, () => this.tick());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cancel && this.cancel();
  }

  // update bars
  tick() {
    const analyzer:AnalyserNode = this.player.analyzer;
    analyzer.fftSize = FFTSIZE;
    analyzer.smoothingTimeConstant = SMOOTH;
    analyzer.minDecibels = MINDECIBELS;
    analyzer.maxDecibels = MAXDECIBELS;
    const length = analyzer.frequencyBinCount;
    const canvas = this.shadowRoot?.querySelector('canvas');
    if(canvas) {
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      if(this.buffer.length !== length) {
        const range = 255;
        this.buffer = new Uint8Array(length);
        this.bias = new Float32Array(length).map((_,i) => 
          Math.pow(1.1, 1 + (i/length) * 6) - 0.2
        );
        canvas.width = length;
        canvas.height = range;
        const style = window.getComputedStyle(canvas);
        const grd = ctx.createLinearGradient(0, 0, 0, range);
        grd.addColorStop(0, style.getPropertyValue('color'));
        grd.addColorStop(1, style.getPropertyValue('fill'));
        ctx.fillStyle = grd;
      }
      analyzer.getByteFrequencyData(this.buffer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.buffer.forEach((v,i) => {
        v = v * this.bias[i];
        ctx.fillRect(i, 255-v, 1, v);
      })
    }
  }

  // render html (once)
  render() {
    return html`<canvas></canvas>`;
  }
}