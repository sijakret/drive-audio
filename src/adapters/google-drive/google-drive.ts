
import {cacheAdd,cacheHit} from '../../cache';

export async function getFolder(folderId: String, {apiKey} : any = {}) {
  const folder = await fetch(
    `https://www.googleapis.com/drive/v3/files/?q=${
    encodeURIComponent(`'${folderId}' in parents`)
    }&key=${apiKey}`);
  return folder.json();
}

export async function getFileMeta(fileId: string, {apiKey, cached = true} : any = {}) {
  const key = `meta://${fileId}`;
  if(cached) {
    const hit = await cacheHit(key);
    if(hit) return hit;
  }
  const metaTransfer = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*&key=${apiKey}`);
  const meta = await metaTransfer.json()
  if(cached) {
    await cacheAdd(key, meta);
  }
  return meta;
}

export async function getFileBuffer(fileId: String, {apiKey, cached = true} : any = {}) {
  const key = `blob://${fileId}`;
  if(cached) {
    const hit = await cacheHit(key);
    if(hit) return hit;
  }
  const dataTransfer = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`);
  
  const blob = await dataTransfer.blob();
  if(cached) {
    await cacheAdd(key, blob);
  }
  return blob;
}