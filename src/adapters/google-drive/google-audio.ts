
import {BufferAudioPlayer} from '../buffer-audio-player';
import {getFileBuffer, getFileMeta} from './google-drive';
import {cacheAdd,cacheHit} from '../../cache';

const options = {
  apiKey: 'AIzaSyDRbhyb-TWaXC4yYxksZB_5KekU4ujzLO4',
  prefetch: false
};

// example
// https://drive.google.com/file/d/1kY2PkRGa116ubnpkWbx9PjLKsmERKLnU/view?usp=sharing
function parseUrl(url:String) {
  const m = url.match(/https:\/\/drive\.google\.com\/file\/([^/]+)\/([^/]+)/);
  if(!m) {
    return undefined;
  } 
  return {fileId: m[2]};
}

export class Player extends BufferAudioPlayer {
  fileId: string
  protected _waitingForUser: boolean = true
  protected _initializing: boolean = true
  protected _loading: boolean = false

  constructor(url:string) {
    super();
    const parsed = parseUrl(url);
    if(!parsed) {
      throw new Error('Cannot parse url: '+url)
    }
    this.fileId = parsed.fileId;
    this.load();
  }

  async play() {
    // force load
    await this.load(true);

    if(!this.ready) {
      // make sure we are ready
      await new Promise(r => 
        this.addEventListener('ready', r, {once: true})
        )
    }
    // play
    super.play()
  }

  public get waitingForUser() {
    return this._waitingForUser;
  }

  public get initializing() {
    return this._initializing;
  }

  public get loading() {
    return this._loading;
  }

  async load(fetchBuffer = options.prefetch) {
    if(this.buffer) {
      return;
    }
    const hit:any = await cacheHit(this.fileId);
    if(hit) {
      this._loading = true;
      this.dispatch('loading');
      const {meta, buffer} = hit;
      this.name = meta.name;
      this.buffer = buffer.slice(0);
      // await new Promise(r => setTimeout(r, 300000));
      this._waitingForUser = false;
      this._initializing = false;
      this._loading = false;
    } else {
      const metaId = `meta:${this.fileId}`;
      const hit:any = await cacheHit(metaId);
      let meta: any;
      if(hit) {
        meta = hit.meta;
      } else {
        // fetch and cache partially
        meta = await getFileMeta(this.fileId, options);
        await cacheAdd(metaId, {meta});
      }
      this._initializing = false;
      this.name = meta.name;
      
      if(fetchBuffer) {
        this._loading = true;
        this.dispatch('loading');
        const buffer = await getFileBuffer(this.fileId, options);
        this.buffer = buffer.slice(0);
        this._loading = false;
        // cache fully
        this._waitingForUser = false;
        await cacheAdd(this.fileId, {meta, buffer});
      } else {
        this._loading = false;
        this._waitingForUser = true;
      }
    }
    this.dispatch('name');
  }

  static async canPlay(url:String) {
    return !!parseUrl(url);
  }

}