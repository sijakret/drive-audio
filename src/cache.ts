import Dexie from 'dexie';

const {name,version} = require('../package.json');

interface IBufferCacheEntry {
  id?: string,
  data: ArrayBuffer
}

interface IBlobCacheEntry {
  id?: string,
  data: Blob
}

interface IObjectCacheEntry {
  id?: string,
  data: Object
}

class Cache extends Dexie {
  entries: Dexie.Table<
    IObjectCacheEntry | IBufferCacheEntry | IBlobCacheEntry,
    number>; 

  constructor () {
      super(`${name}-${version}`);
      this.version(1).stores({
        entries: '&id, data',
      });
      this.entries = this.table("entries");
  }
}


// create cache db
const db = new Cache();
// add to cache
export async function cacheAdd(id:string, data:Object|ArrayBuffer|Blob) {
  await db.open();
  db.entries.add({id, data});
  return data;
}

// get cache hit if available
export async function cacheHit(id:string) : Promise<Object | ArrayBuffer | Blob | undefined> {
  await db.open();
  const hits = await db.entries.where('id').equals(id);
  const first = await hits.first();
  if(!!first) {
    return first.data;
  }
  return undefined;
}