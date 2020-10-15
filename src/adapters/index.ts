import {Player as googleAudioTag} from './google-drive/google-audio-tag';

// avialable players
export const players : any[] = [
  googleAudioTag
]

const _players = players;
export function derivePlayer(url:String, players : any[] = _players) {
  const candidates = players.filter(p => p.canPlay(url));
  if(candidates.length > 0) {
    return new candidates[0](url); 
  }
  return undefined;
}