
import {TagAudioPlayer} from '../tag-audio.player';
import {getFileMeta, getFileBuffer} from './google-drive';

const options = {
  apiKey: 'AIzaSyDRbhyb-TWaXC4yYxksZB_5KekU4ujzLO4',
  prefetch: false
};

export class Player extends TagAudioPlayer {
  _fileId: string

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
    this._tag.crossOrigin = "anonymous"

    this._loading = true;
    getFileMeta(fileId, options).then(({name}) => {
      this.name = name;
      this._loading = false;
      this.dispatch('name');
    });
  }

  async load() {
    const blob = await getFileBuffer(this._fileId, options);
    this._tag.src = window.URL.createObjectURL(blob);
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