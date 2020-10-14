

export function listFolder() {

}



export async function getFolder(folderId: String, {apiKey} : any = {}) {
  const folder = await fetch(
    `https://www.googleapis.com/drive/v3/files/?q=${
    encodeURIComponent(`'${folderId}' in parents`)
    }&key=${apiKey}`);
  return folder.json();
}

export async function getFileMeta(fileId: String, {apiKey} : any = {}) {
  const metaTransfer = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=*&key=${apiKey}`);
  const meta = await metaTransfer.json()
  return meta;
}

export async function getFileBuffer(fileId: String, {apiKey} : any = {}) {
  const dataTransfer = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`);

  const buffer = await dataTransfer.arrayBuffer();
  return buffer;
}