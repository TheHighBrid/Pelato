import { filenameMetadata } from './model.js';
const db = new Promise((resolve,reject) => {
  const request = indexedDB.open('pelato',1);
  request.onupgradeneeded = () => {
    request.result.createObjectStore('tracks',{keyPath:'id'});
    request.result.createObjectStore('audio',{keyPath:'id'});
    request.result.createObjectStore('playlists',{keyPath:'id'});
  };
  request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
});
async function transact(stores, mode, fn) {
  const database = await db;
  return new Promise((resolve,reject) => {
    const transaction = database.transaction(stores,mode); let result;
    transaction.oncomplete = () => resolve(result?.result); transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error || Error('Storage transaction cancelled'));
    try { result = fn(transaction); } catch(error) { transaction.abort(); reject(error); }
  });
}
export const allTracks = () => transact(['tracks'],'readonly',tx => tx.objectStore('tracks').getAll());
export const allPlaylists = () => transact(['playlists'],'readonly',tx => tx.objectStore('playlists').getAll());
export const getAudio = id => transact(['audio'],'readonly',tx => tx.objectStore('audio').get(id));
export const saveTrack = track => transact(['tracks'],'readwrite',tx => tx.objectStore('tracks').put(track));
export const savePlaylist = playlist => transact(['playlists'],'readwrite',tx => tx.objectStore('playlists').put(playlist));
export const deletePlaylist = id => transact(['playlists'],'readwrite',tx => tx.objectStore('playlists').delete(id));
export const importTrack = (track,file) => transact(['tracks','audio'],'readwrite',tx => {tx.objectStore('audio').put({id:track.id,file});return tx.objectStore('tracks').put(track);});
export const supported = file => file.type.startsWith('audio/') || /\.(mp3|m4a|flac|wav|ogg|opus|aac|aiff|aif)$/i.test(file.name);
const syncsafe = (bytes, offset) => bytes[offset]*2097152+bytes[offset+1]*16384+bytes[offset+2]*128+bytes[offset+3];
const decode = (bytes, encoding) => {
  let data=bytes; let label=['windows-1252','utf-16le','utf-16be','utf-8'][encoding] || 'utf-8';
  if(encoding===1 && bytes[0]===254 && bytes[1]===255){label='utf-16be';data=bytes.slice(2);} else if(encoding===1 && bytes[0]===255 && bytes[1]===254){data=bytes.slice(2);}
  return new TextDecoder(label).decode(data).replace(/\0.*$/s,'').trim();
};
export async function metadata(file) {
  const result = filenameMetadata(file.name);
  if(!/\.mp3$/i.test(file.name)) return result;
  const bytes = new Uint8Array(await file.slice(0,Math.min(file.size,4*1024*1024)).arrayBuffer());
  if (bytes.length < 10 || String.fromCharCode(...bytes.slice(0,3)) !== 'ID3' || ![3,4].includes(bytes[3]) || (bytes[5]&192)) return result;
  const end = Math.min(bytes.length,10+syncsafe(bytes,6)); const view = new DataView(bytes.buffer); let offset=10;
  while(offset+10<=end){
    const type=String.fromCharCode(...bytes.slice(offset,offset+4)); if(!/^[A-Z0-9]{4}$/.test(type)) break;
    const length=bytes[3]===4?syncsafe(bytes,offset+4):view.getUint32(offset+4); if(length<1 || offset+10+length>end) break;
    const frame=bytes.slice(offset+10,offset+10+length); const key={TIT2:'title',TPE1:'artist',TALB:'album'}[type];
    if(key && !bytes[offset+9]) result[key]=decode(frame.slice(1),frame[0]) || result[key];
    if(type==='APIC' && frame[0]===0 && !bytes[offset+9]){
      const mimeEnd=frame.indexOf(0,1); const descEnd=frame.indexOf(0,mimeEnd+2); const mime=decode(frame.slice(1,mimeEnd),0);
      if(mimeEnd>0 && descEnd>mimeEnd && /^image\/(jpeg|png)$/.test(mime) && frame.length-descEnd<1024*1024) result.artwork=new Blob([frame.slice(descEnd+1)],{type:mime});
    }
    offset+=10+length;
  }
  return result;
}
