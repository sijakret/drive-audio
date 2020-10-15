
/**
 * interface to be implemented by audio player backents
 */
export abstract class IPlayer extends EventTarget {
  static canPlay: ( url:string ) => Promise<boolean>;
  name?:string;
  abstract play(): any;
  abstract pause(): any;
  abstract stop(): any;
  abstract seek(ms:number): any;
  get initializing() { return false; }
  get waitingForUser() { return false; }
  get loading() { return false; }
  abstract get ready(): boolean;
  abstract get playing(): boolean;
  abstract get position(): number; //ms
  abstract get duration(): number; // ms
  dispatch(name:string, detail:any = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}

export type IPlayerConstructor = new () => IPlayer
