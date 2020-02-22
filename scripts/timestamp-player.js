import { getRandDiffNat, computeTimestampSeconds  } from '../utils/Utils.js';

const player = document.getElementById("movie_player");


class Track {
  constructor(num, start, end) {
    this.num = num;
    this.start = start;
    this.end = end;
  }
}


function main() {
  //TODO allow ` in data
  const rawTrackData = `
  
  01 Fa - Nw B 00:00 02 Yi - Riv 01:01 03 Sa - Aq 02:02 04 Ei - Le 03:03 05 Ei - Nef 03:30
  
  `;

  const tstampRe = /[0-9]{1,2}:?[0-9]{1,2}:[0-9]{2}/g;
  let tstamps = [...rawTrackData.matchAll(tstampRe)].map(match => match[0]);
  let tstampsInSecs = tstamps.map(ts => computeTimestampSeconds(ts));
  //TODO sort beforehand, so track num is accurate

  let numTracks = tstamps.length;
  let endOfVideo = Math.floor(player.getDuration());
  let tracks = [];
  for (let i = 0; i < numTracks; i++) {
    let start = tstampsInSecs[i];
    let end = i < numTracks - 1 ? tstampsInSecs[i+1] - 1 : endOfVideo - 1;
    tracks[i] = new Track(i, start, end);
  }
  playRandDiffTrack(tracks, null);
}


function playRandDiffTrack(tracks, lastPlayedTrackNum) {
  let trackNum = getRandDiffNat(tracks.length, lastPlayedTrackNum);
  let track = tracks.filter(t => t.num === trackNum)[0];
  player.seekTo(track.start, true);
  playRandDiffTrackWhenTrackEnds(track, tracks);
}


function playRandDiffTrackWhenTrackEnds(track, tracks) {
  if (Math.floor(player.getCurrentTime()) === track.end) {
    playRandDiffTrack(tracks, track.num);
  }
  let currTrack = getCurrentTrack(tracks);
  if (currTrack === track) {
  //TODO look into optimizing by using timeout proportional to current
  //track end (unless user has manually seeked);
    setTimeout(playRandDiffTrackWhenTrackEnds, 500, track, tracks);
  } else {
    playRandDiffTrackWhenTrackEnds(currTrack, tracks);
  }
}


function getCurrentTrack(tracks) {
  let time = Math.floor(player.getCurrentTime());
  let currTracks = tracks.filter(track => time >= track.start && time <= track.end);
  let currTrack = currTracks.length > 0 ? currTracks[0] : null;
  return currTrack;
}


main();
