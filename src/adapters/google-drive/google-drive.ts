
import {cacheAdd,cacheHit} from '../../cache';
import axios from 'axios';

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

export async function getFileBuffer(fileId: String, {
    apiKey,
    cached = true,
    onProgress
  } : any = {}) : Promise<ArrayBuffer|Blob> {
  const key = `blob://${fileId}`;
  if(cached) {
    const hit = await cacheHit(key);
    if(hit) return hit as ArrayBuffer | Blob;
  }

  // progress wrapper
  const blob = (await axios({
    responseType: 'blob',
    url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`,
    onDownloadProgress: progress => {
      onProgress && onProgress(progress.loaded / progress.total);
    }
  })).data;

  if(cached) {
    await cacheAdd(key, blob);
  }
  return blob;
}