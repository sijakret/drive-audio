import {Player as googleAudio} from './google-drive/google-audio';
import {IPlayer} from '../interfaces';


export const players : any[] = [
  googleAudio
]

const _players = players;
export function derivePlayer(url:String, players : any[] = _players):IPlayer|undefined {
  const candidates = players.filter(p => p.canPlay(url));
  if(candidates.length > 0) {
    return new candidates[0](url); 
  }
  return undefined;
}