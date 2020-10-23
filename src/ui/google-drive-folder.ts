import {LitElement, html, css, property, customElement} from 'lit-element';
import {getFileMeta, getFilesForFolder} from '../adapters/google-drive/google-drive';

@customElement('drive-audio-folder')
export class WPGoogleDriveFolder extends LitElement {
  @property() folderId:string = '';
  @property() apiKey:string = '';
  @property() filter:string = '.mp3$';
  @property() name:string = 'unknown folder';
  @property() prefetch:boolean = false;
  @property() customTag?:string;
  @property() _files:Array<any> = [];
  @property() sort = (a:any,b:any) => {
    return a.name.localeCompare(b.name);
  };

  static get styles() {
    return css`
    drive-audio-player {
      margin-bottom: 7px;
    }
    `;
  }

  get files() {
    const pattern = new RegExp(this.filter, 'i');
    return this._files.filter(f => !!f.name.match(pattern));
  }

  /**
   * init media adapter
   * @param changed 
   */
  async updated(changed:Map<string,boolean>) {
    if(changed.has('url') || changed.has('apiKey')) {
      this._files = [];
      const {name} = await getFileMeta(this.folderId, {apiKey: this.apiKey});
      this.name = name;
      const {files} = await getFilesForFolder(this.folderId, {apiKey: this.apiKey});
      if(files) {
        this.dispatchEvent(new CustomEvent('files', {
          detail: files,
          bubbles: true,
          composed: true
        }))
        files.sort(this.sort);
        this._files = files;
      }
    }
  }

  /**
   * main render function
   */
  render() {
    return html`<div>
    <h2>${this.name}</h2>
    ${this.players}
    </div>`;
  }

  createRenderRoot() {
    return this;
  }

  /**
   * finish hook, play next
   */
  private trackEnded(id:string) {
    const next = (this.files.findIndex(i => i.id === id) + 1 )
      % this.files.length;
    this.files.forEach(f => {
      const player = (this.renderRoot.querySelector(`[name="${f.id}"]`) as any)
      player.stop();
    });

    const player = (this.renderRoot.querySelector(`[name="${this.files[next].id}"]`) as any);
    player.play();
  }

  /**
   * stop all others
   * @param id 
   */
  private playTrack(id:string) {
    this.files.filter(f => f.id !== id).forEach(f => {
      const player = (this.renderRoot.querySelector(`[name="${f.id}"]`) as any)
      player.stop();
    });
  }
  /**
   * render players
   */
  get players() {
    return this.files.map(f => {
        const url = 'https://drive.google.com/file/d/'+f.id;
        return html `<drive-audio-player name=${f.id} 
        ?prefetch=${this.prefetch}
        @ended=${() => this.trackEnded(f.id)}
        @play=${() => this.playTrack(f.id)}
        url=${url}>
          <!-- hides stop button -->
          <span slot="stop"></span>
        </drive-audio-player>`
      })
  }
}