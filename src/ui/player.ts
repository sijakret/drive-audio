import {LitElement, html, css, property, customElement} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';
import {until} from 'lit-html/directives/until';
import {derivePlayer} from '../adapters';
import {IAudioPlayer} from '../interfaces';
import {formatMs, mobileCheck} from '../utils';

// svgs
import svgPlay from './assets/play.svg';
import svgPause from './assets/pause.svg';
import svgStop from './assets/stop.svg';

import './initializer';
import './visualizer';
import {transition, slide, mark} from 'lit-transition';

const MOBILE = mobileCheck();

const EVENTS = [
  'name',
  'ready',
  'loading',
  'tick',
  'pause',
  'resume',
  'play',
  'stop',
  'seek',
  'ended'
];

@customElement('drive-audio-player')
export class WPPlayer extends LitElement {
  @property() url:String = '';
  @property({attribute: false}) player?:IAudioPlayer;
  @property({attribute: false}) timeLeft:string = '';
  @property() hover:any = undefined;

  public stop() {
    if(this.player) {
      this.player.stop();
    }
  }
  public play() {
    if(this.player) {
      this.player.play();
    }
  }
  public pause() {
    if(this.player) {
      this.player.pause();
    }
  }
  public seek(ms:number) {
    if(this.player) {
      this.player.seek(ms);
    }
  }

  static get styles() {
    return css`
    :host {
      -webkit-tap-highlight-color: transparent;
      --height: 26px;
      --primary-color: 214,93,188;
      --secondary-color: 170,227,234;
      --alt-color: 255,255,255;
    }
    :host {
      --s-col: rgba(var(--secondary-color), 1.0);
      --s-col-l: rgba(var(--secondary-color), 0.3);
      --p-col: rgba(var(--primary-color), 1.0);
      --p-col-h: rgba(var(--primary-color), 0.7);
      --p-col-l: rgba(var(--primary-color), 0.3);
      --a-col: rgba(var(--alt-color), 1);
    }

    slot {
      margin: 0px;
      padding: 0px;
      display: inline-block;
    }
    :host {
      flex: 1 1 1;
      display: flex;
      width: 100%;
    }
    [controls] {
      height: 100%;
      display: flex;
    }
    [controls] svg:hover {
      fill: var(--p-col);
    }
    [controls] svg {
      transition: all 0.5s;
      cursor: pointer;
      border: 0px;
      stroke: var(--p-col);
      stroke-width: 2px;
      fill: var(--a-col);
      margin: 0px;
      border: 0px;
      padding: 0px;
      height: var(--height);
      width: var(--height);
    }
    [time] {
      flex: 0 1 20px;
      line-height: var(--height);
    }
    [mid-section] {
      cursor: pointer;
      margin: auto;
      height: var(--height);
      vertical-align: bottom;
      margin: 0px;
      flex: 1 0;
      margin-left: 8px;
      margin-right: 8px;
      overflow: visible;
      position: relative;
      display: flex;
      min-width: 0px;
    }
    [title] {
      height: 100%;
      line-height: var(--height);
      white-space: nowrap;
      overflow: hidden;
      min-width: 0;
      padding-left: 8px;
      padding-right: 8px;
      text-overflow: ellipsis;
    }
    div {
      opacity: 0.5;
    }
    [ready] div {
      opacity: 1;
    }
    div[ready] {
      opacity: 1;
    }
    drive-audio-visualizer {
      position: absolute;
      left: 0px;
      bottom: 2px;
      top: 2px;
    }
    [seek] {
      pointer-events: none;
      transition: all 0.2s;
      background-color: var(--p-col-h);
      position: absolute;
      left: 0px;
      bottom: 2px;
      height: 2px;
    }`;
  }

  /**
   * init media adapter
   * @param changed 
   */
  updated(changed:Map<string,boolean>) {
    if(changed.has('url')) {
      // stop destroy and unhook old player if present
      if(this.player) {
        this.player.stop();
      }
      // create and hook up new player
      this.player = derivePlayer(this.url);
      EVENTS.forEach(event => 
        this.player?.addEventListener(event, (e) => this.listener(e)))
    }
  }
  
  /**
   * called on all events from player
   */
  listener(e:Event) {
    if(e.type !== 'tick') {
      // bubble up major events
      this.dispatchEvent(new CustomEvent(e.type, {
        detail: (e as CustomEvent).detail,
        bubbles: true,
        composed: true
      }));
    }
    this.requestUpdate();
  }

  /**
   * primary render function
   */
  render() {
    if(!this.player) {
      return 'cannot play media'
    };
    if(this.player.initializing) {
      return html`<drive-audio-initializer>initializing..</drive-audio-initializer>`; 
    }

    return html`
      <div controls>${this.controls}</div>
      <div mid-section
      ?ready=${this.player.ready}
      @click=${(e:MouseEvent) => {
        if(this.player) {
          if(!this.player.playing) {
            this.player?.play();
          } else {
            const width = (e.target as HTMLElement).clientWidth;
            const detail = e.offsetX / width;
            e.target?.dispatchEvent(new CustomEvent('seek', {detail, bubbles: true}));  
          }
        }
      }}
      @seek=${({detail:fraction} : { detail:number}) => {
        this.player?.seek(fraction * this.player.duration);
      }}
      @mousemove=${(e:MouseEvent) => {
        if(!MOBILE) {
          const width = (e.target as HTMLElement).clientWidth;
          this.hover = e.offsetX / width;
          this.requestUpdate();
        }
      }}
      @mouseout=${() => {
        this.hover = undefined;
        this.requestUpdate();
      }}>
        ${this.player.playing ? this.renderVisualizer : ''}
        ${this.renderSeek}
        ${this.player.loading ? html`
        <drive-audio-initializer>loading..</drive-audio-initializer>
        ` : this.trackTitle}
      </div>
      ${until(this.time, html``)}
      `;
  }

  /**
   * render helper for time seeking
   */
  get trackTitle() {
    return html`<div title>${this.player?.name}</div>`;
  }
  
  /**
   * render helper for time seeking
   */
  get renderSeek() {
    const progress = (this.player?.position || 0) / (this.player?.duration || 1);
    const percent = 100 * progress;
    return html`<div seek style=${styleMap({width: percent+'%'})}></div>`;
  }

  /**
   * render helper for time display
   */
  get time() {
    if(!this.player || !this.player.ready) {
      return undefined;
    }
    const time = formatMs(this.player.playing ? 
      this.player.position // (this.player.duration || 0) - (this.player.position || 0)
      : this.player.duration);
    const hover = this.hover !== undefined ? formatMs(this.hover * this.player?.duration) : '';
    return html`<div time>
      ${transition(
        hover ? mark(html`<span>${hover}</span>`,'hover'): 
        mark(html`<span>${time}</span>`,'left')
        , slide)}
      </div>`;
  }

  /**
   * render helper for controls display
   */
  get controls() {
    const pause = html`<slot name="pause" @click=${() => this.player?.pause()}>${svgPause}</slot>`;
    const play = html`<slot name="play" @click=${() => this.player?.play()}>${svgPlay}</slot>`;
    const stop = html`<slot name="stop" @click=${() => this.player?.stop()}>${svgStop}</slot>`;
    return this.player?.ready ? [this.player?.playing ? pause : play , stop] : [play];
  }

  /**
   * render visualizer helper
   */
  get renderVisualizer() {
    return html`<slot style="position: absolute; width:100%; height: 100%;" name="visualizer">
      <drive-audio-visualizer .analyzer=${this.player?.analyzer}></drive-audio-visualizer>
    </slot>`;
  }
}