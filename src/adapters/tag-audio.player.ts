import {IAudioPlayer} from '../interfaces';

/**
 * generic audio tag-based player
 */

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;  // Safari and old versions of Chrome

export class TagAudioPlayer extends IAudioPlayer {
  private _context?: AudioContext
  private _analyzerNode?: AnalyserNode
  protected _tag:HTMLAudioElement = document.createElement('audio') as HTMLAudioElement
  protected _url:string
  protected _loading:boolean = false
  private __ready: boolean = false
  public name:string
  private _mem:any = {}

  public constructor(url:string) {
    super();
    this._url = this.name = url;
  }

  public static async canPlay(url:string) {
    return !!url;
  }

  prefetch() {
    this.load();
  }

  init() {
    if(!this._context) {
      document.body.appendChild(this._tag);

      this.createContext();
      this._tag.play();
      return new Promise(async r => {
        this.loading = true;
        this._tag.addEventListener('canplaythrough', () => {
          // setup code
          this.loading = false;
          this._ready = true;
          r();
        }, {
          once: true
        })
        await this.load();
      });
    }
    return true;
  }

  async load() {
    this._tag.src = this._url;
  }

  public get analyzer() {
    return this._analyzerNode;
  }

  public play() {
    const init = this.init();
    if(init !== true) {
      init.then(() => this.play());
    } else {
      this._tag.play();
      this.dispatch('play');
    }

  }

  public pause() {
    this._tag.pause()
    this.dispatch('pause');
  }

  public seek(ms:number) {
    this._tag.currentTime = ms / 1000;
    this.dispatch('seek');
  }

  public stop() {
    this.destroyContext();
    this.dispatch('stop');
  }

  public get loading() {
    return this._loading;
  }

  public set loading(loading:boolean) {
    this._loading = loading;
    this.dispatch('loading');
  }

  public get ready() {
    return this._ready;
  }

  private set _ready(ready:boolean) {
    ready && this.dispatch('ready');
    this.__ready = ready;
  }

  private get _ready() {
    return this.__ready;
  }

  public get playing(){
    if(this._tag.paused === true) {
      return false;
    }
    return !!this._tag.currentTime;
  }

  public get position(){
    const position = this._tag.currentTime;
    return position * 1000;
  }

  public get duration(){
    const duration = this._mem['duration'] = (this._tag.duration
      || this._mem['duration']);
    return duration * 1000;
  }

  private createContext() {
    this._context = new AudioContext();
    (window as any)._context = this._context;
    const node = this._context.createMediaElementSource(this._tag);
    this._analyzerNode = this._context.createAnalyser();
    node.connect(this._context.destination);
    node.connect(this._analyzerNode);
    this._tag.addEventListener('timeupdate', () => {
      this.loading = false;
      this.dispatch('tick');
    });
    this._tag.addEventListener('play', () => this.loading = false);
    this._tag.addEventListener('waiting', () => this.loading = true);
    this._tag.addEventListener('ended', () => this.dispatch('ended'));
  }

  private destroyContext() {
    try {
      this._context && this._context.close();
      this._context = undefined;
      this._tag = document.createElement('audio') as HTMLAudioElement;
    } catch(e) {
      console.error('context already destroyed')
    }
  }

}