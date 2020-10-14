import Dexie from 'dexie';

const {name,version} = require('../package.json');

interface ICacheEntry {
  id?: string,
  meta: Object,
  buffer: ArrayBuffer
}

class Cache extends Dexie {
  entries: Dexie.Table<ICacheEntry, number>; 

  constructor () {
      super(`${name}-${version}`);
      this.version(1).stores({
        entries: '&id, meta, buffer',
      });
      this.entries = this.table("entries");
  }
}

// create cache db
const db = new Cache();

// add to cache
export async function cacheAdd(id:string, {meta, buffer}:any = {meta: Object, buffer:ArrayBuffer}) {
  await db.open();
  db.entries.add({id, meta, buffer});
  return {meta , buffer};
}

// get cache hit if available
export async function cacheHit(id:string) {
  await db.open();
  const hits = await db.entries.where('id').equals(id);
  const first = await hits.first();
  return !!first ? first : undefined;
}