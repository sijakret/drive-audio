
import {TagAudioPlayer} from '../tag-audio.player';
import {getFileMeta, getFileBuffer} from './google-drive';
//import {setupCSP} from '../../utils';
//setupCSP();

const options = {
  apiKey: 'AIzaSyDRbhyb-TWaXC4yYxksZB_5KekU4ujzLO4',
  prefetch: false
};


export class Player extends TagAudioPlayer {
  _fileId: string
  _loadingMeta?: boolean
  _progress?: number

  constructor(url:string) {

    // process url
    const parsed = parseUrl(url);
    if(!parsed) {
      throw new Error('Cannot parse url: '+url)
    }
    const {fileId} = parsed;
    url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${options.apiKey}`
    
    // need to cache since google is very restrictive
    // with non-authorized access
    super(url);

    this._fileId = fileId;

    this._loadingMeta = true;
    getFileMeta(fileId, options).then(({name}) => {
      this.name = name;
      this._loadingMeta = false;
      this.dispatch('name');
    });
  }

  public get progress() {
    return this._progress;
  }

  public get loading() {
    return super.loading || !!this._loadingMeta;
  }
  public set loading(l:boolean) {
    super.loading = l;
  }

  async load() {
    const createObjectURL = window.URL.createObjectURL || (window as any).webkitUrl.createObjectURL;  // Safari and old versions of Chrome
    const blob = await getFileBuffer(this._fileId, {
      ...options,
      onProgress: (p:number) => {
        this._progress = p;
        this.dispatch('loading');
      }
    });
    this._tag.src = createObjectURL(blob);
  }

  static async canPlay(url:string) {
    return !!parseUrl(url);
  }
}

// helper
function parseUrl(url:string) {
  const m = url.match(/https:\/\/drive\.google\.com\/file\/([^/]+)\/([^/]+)/);
  if(!m) {
    return undefined;
  } 
  return {fileId: m[2]};
}