import {IPlayer} from '../interfaces';

/**
 * generic audio player
 */
const TICK_MS = 200;

export class BufferAudioPlayer extends IPlayer {
  private _context: AudioContext = new AudioContext()
  private _analyzerNode: AnalyserNode = new AnalyserNode(this._context)
  private _buffer?: AudioBuffer
  private _bufferSource: AudioBufferSourceNode | undefined = undefined
  protected _ready: boolean = false
  protected __playing: any = undefined
  protected _position: number = 0

  public constructor() {
    super();
    this.newContext();
  }

  public get analyzer() {
    return this._analyzerNode;
  }

  public play() {
    if(!this._buffer) return;
    if(this._bufferSource) {
      this.pause();
    } else {
      this._context.resume();
      this._bufferSource = this._context.createBufferSource();
      this._bufferSource.buffer = this._buffer;
      this._bufferSource.connect(this._context.destination);
      this._bufferSource.connect(this._analyzerNode);
      this._bufferSource.start(undefined, Math.round(this._position/1000));
      this._playing = true;
      this.dispatch('play');
    }
  }

  public pause() {
    if(!this._bufferSource) {
      return;
    }
    if(this._playing) {
      this._playing = false;
      this._bufferSource.stop();
      this._bufferSource = undefined;
      this._context.suspend();
      this.dispatch('pause');
    } else {
      this.play();
    }
  }

  public seek(ms:number) {
    if(this.playing) {
      if(!this._bufferSource) {
        return;
      }
      this._bufferSource.stop();
      this._bufferSource = undefined;
      this._context.suspend();
      this._position = ms;
      this.play();
    } else {
      this._position = ms;
    }
    this.dispatch('seek');
  }

  public stop() {
    this._position = 0;
    this._playing = false;
    this.newContext();
    if(this._bufferSource) {
      this._bufferSource.stop();
    }
    this._bufferSource = undefined;
    this.dispatch('stop');
  }

  public get ready() {
    return this._ready;
  }

  public get playing(){
    return this._playing;
  }

  public get position(){
    return this._position;
  }

  public get duration(){
    if(!this._buffer) return 0;
    return this._buffer.duration * 1000;
  }

  /**
   * set buffer and prepare everything
   */
  set buffer(buffer:ArrayBuffer) {
    if(buffer) {
      this.setupAudio(buffer);
    }
  }

  private async setupAudio(buffer:ArrayBuffer) {
    this._buffer = await new Promise(r => this._context.decodeAudioData(buffer, r));
    this._ready = true;
    this.dispatch('ready');
  }

  protected tick() {
    if(this._position < this.duration - TICK_MS) {
      this._position += TICK_MS;
      this.dispatch('tick');
    } else {
      this.stop();
      this.dispatch('finish');
    }
  }

  protected set _playing(p:boolean) {
    if(p) {
      if(!this._playing) {
        this.__playing = setInterval(() => this.tick(), TICK_MS);
      }
    } else {
      clearInterval(this.__playing);
      this.__playing = undefined;
    }
  }

  protected get _playing() : boolean {
    return !!this.__playing;
  }

  private newContext() {
    this._context = new AudioContext();
    this._analyzerNode = this._context.createAnalyser();
  }

}