import {LitElement, html, css, property, customElement} from 'lit-element';
import {getFolder} from '../adapters/google-drive/google-drive';

// import './initializer';
// import {transition, slide, mark} from 'lit-transition';

@customElement('drive-audio-folder')
export class WPGoogleDriveFolder extends LitElement {
  @property() folderId:string = '';
  @property() apiKey:string = '';
  @property() filter:string = '.mp3$';
  @property() files:Array<any> = [];
  @property() sort = (a:any,b:any) => {
    return a.name.localeCompare(b.name);
  };

  static get styles() {
    return css`
    drive-audio-player {
      margin: 7px;
    }
    `;
  }

  /**
   * init media adapter
   * @param changed 
   */
  async updated(changed:Map<string,boolean>) {
    if(changed.has('url') || changed.has('apiKey')) {
      this.files = [];
      const {files} = await getFolder(this.folderId, {apiKey: this.apiKey});
      files.sort(this.sort);
      this.files = files;

    }
  }

  /**
   * main render function
   */
  render() {
    return html`<div>
    ${this.players}
    </div>`;
  }

  /**
   * finish hook, play next
   */
  private trackEnded(id:string) {
    const next = (this.files.findIndex(i => i.id === id) + 1 )
      % this.files.length;
    this.files.forEach(f => {
      const player = (this.shadowRoot?.querySelector(`[name="${f.id}"]`) as any)
      player.stop();
    });

    const player = (this.shadowRoot?.querySelector(`[name="${this.files[next].id}"]`) as any);
    player.play();
  }

  /**
   * stop all others
   * @param id 
   */
  private playTrack(id:string) {
    this.files.filter(f => f.id !== id).forEach(f => {
      const player = (this.shadowRoot?.querySelector(`[name="${f.id}"]`) as any)
      player.stop();
    });
  }
  /**
   * render players
   */
  get players() {
    const pattern = new RegExp(this.filter, 'i');
    const filtered = this.files.filter(f => f.name.match(pattern));
    return filtered.map(f => {
        const url = 'https://drive.google.com/file/d/'+f.id;
        return html `<drive-audio-player name=${f.id} 
        @ended=${() => this.trackEnded(f.id)}
        @play=${() => this.playTrack(f.id)}
        url=${url}>
          <!-- hides stop button -->
          <span slot="stop"></span>
        </drive-audio-player>`
      })
  }
}