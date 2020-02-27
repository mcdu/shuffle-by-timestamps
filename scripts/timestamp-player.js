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
  //const rawTrackData = `
  //
  //01 Fa - Nw B 00:00 02 Yi - Riv 01:01 03 Ei - Le 03:03 04 Ei - Nef 03:30
  //
  //`;

  //const tstampRe = /[0-9]{1,2}:?[0-9]{1,2}:[0-9]{2}/g;
  //let tstamps = [...rawTrackData.matchAll(tstampRe)].map(match => match[0]);
  //let tstampsInSecs = tstamps.map(ts => computeTimestampSeconds(ts));

  let tstampsInSecs = [];
  let links = timeLinks();
  for (let link of links) {
    let match = link.href.match(/&t=([\d.]+)s/);
    if (match) {
      let startTime = parseFloat(match[1]);
      tstampsInSecs.push(startTime);
    }
  }

  //TODO sort beforehand, so track num is accurate

  let numTracks = tstampsInSecs.length;
  let endOfVideo = Math.floor(player.getDuration());
  let tracks = [];
  for (let i = 0; i < numTracks; i++) {
    let start = tstampsInSecs[i];
    let end = i < numTracks - 1 ? tstampsInSecs[i+1] - 1 : endOfVideo - 1;
    tracks[i] = new Track(i, start, end);
  }
  console.log(tracks);
  playRandDiffTrack(tracks, null);
}


function timeLinks() {
  let match = location.search.match(/(?:^\?|&)v=([^&]+)(?=&|$)/);
  if (match) {
    let id = match[1];
    return new Set(document.querySelectorAll(`#description a[href^="/watch?v=${id}"][href*="&t="]`));
  }
  return new Set();
}


function invokeAfterDomIsReady(func, context=document, time=400) {
    const domEl = context.querySelectorAll(`#description`).length;
    if (domEl != 0) {
        func();
    } else {
        setTimeout(function () {
            invokeAfterDomIsReady(func);
        }, time);
    }
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


//main();
invokeAfterDomIsReady(main);
