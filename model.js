export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
}
export function matchingTracks(tracks, query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return tracks.filter(track => words.every(word => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(word)));
}
export function nextTrack(queue, current, { shuffle = false, repeat = 'off', ended = false, random = Math.random } = {}) {
  if (!queue.length) return null;
  if (ended && repeat === 'one' && queue.includes(current)) return current;
  if (shuffle && queue.length > 1) { const other = queue.filter(id => id !== current); return other[Math.floor(random() * other.length)]; }
  const index = queue.indexOf(current);
  if (index + 1 < queue.length) return queue[index+1];
  return repeat === 'all' ? queue[0] : null;
}
export function previousTrack(queue,current) { return queue[Math.max(0,queue.indexOf(current)-1)] ?? null; }
export function filenameMetadata(name) {
  const base = name.replace(/\.[^.]+$/, '').trim(); const parts = base.split(' - ');
  return { title:parts.length > 1 ? parts.slice(1).join(' - ') : base || 'Untitled', artist:parts.length > 1 ? parts[0] : 'Unknown artist', album:'Unknown album' };
}
