//TODO
  // allow `s in raw_timestamps
  // allow for var playback speed
  // every time start or end, dont instantly end and jump to new track, by checking if start = end (has to b emore than a sec). maybe check for user seeks as well?
// check seek bar
    // track 3 is playing
    // if curtime before track 3 start, change sp to end of new playing track
    // if curtime after track 3 end, change sp to end of new playing track
    // if curtime equals track 3 start, or less than end, leave sp as is
    // if curtime equals track 3 end, 
    //  if user jumped there, change sp to end of new playing track
    //  (can i detect if player got seeked to? by click of either timestamp or bar?)
    //  (test if could it skip that time entirely, bc 2x or other reason?)
    //  if it naturally got there, shuffle

const player = document.getElementById("movie_player");
const endOfVideo = player.getDuration();


/**
 * Returns random int between 0 and (max - 1), and not equal to prev
 * Adapted from example at:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param  {int} max  Natural number indicating the max
 * @param  {int} prev Natural number that the result cannot equal
 * @return {int}      Random natural number between 0 and (max - 1) and !== prev
*/
function getRandomDifferentInt(max, prev) {
  const randomInt = Math.floor(Math.random() * Math.floor(max));
  if (randomInt === prev) {
    return getRandomDifferentInt(prev, max);
  } else {
    return randomInt;
  }
}


/**
 * Converts timestamp into total seconds represented.
 * @param A string in a valid YouTube timestamp format (hh:mm:ss, h:mm:ss, hh:m:ss, h:m:ss, mm:ss, or m:ss)
*/
function computeTimestampSeconds(timestamp) {
  let timeFields = timestamp.split(":");
  let secondsMultiplier = 1;
  let totalSeconds = 0;
  for (let i = timeFields.length - 1; i >= 0; i--) {
    totalSeconds += parseInt(timeFields[i], 10) * secondsMultiplier;
    secondsMultiplier *= 60;
  }
  return totalSeconds;
}


class Track {
  constructor(num, start, end, isNowPlaying) {
    this.num = num;
    this.start = start;
    this.end = end;
    this.isNowPlaying = isNowPlaying;
  }
}


function startShuffling() {
  const rawTrackData = `
  
  01 Fa - Nw B 00:00 02 Yi - Riv 01:01 03 Sa - Aq 02:02 04 Ei - Le 03:03 05 Ei - Nef 03:30
  
  `;

  const timestampRe = /[0-9]{1,2}:?[0-9]{1,2}:[0-9]{2}/g;
  const timestampMatches = [...rawTrackData.matchAll(timestampRe)];
  const timestamps = timestampMatches.map(match => match[0]);
  const timestampsInSecs = timestamps.map(ts => computeTimestampSeconds(ts));
  //TODO sort beforehand, so track num is accurate

  const numTracks = timestamps.length;
  let tracks = [];
  for (let i = 0; i < numTracks; i++) {
    let start = timestampsInSecs[i];
    let end = i < numTracks - 1 ? timestampsInSecs[i+1] : endOfVideo;
    tracks[i] = new Track(i, start, end, false);
  }
  playRandomDifferentTrack(tracks, null);
}



function playRandomDifferentTrack(tracks, lastPlayedTrackNum) {
  const trackNum = getRandomDifferentInt(tracks.length, lastPlayedTrackNum);
  const possTracks = tracks.filter(t => t.num === trackNum);
  const track = possTracks[0];
  player.seekTo(track.start, true);
  //track.isNowPlaying = true;
  //let timer = setInterval(updateNowPlayingInfo, 1000, tracks, track);
  function run() {
    console.log("Now playing track" + track.num);
    let currTrack = getCurrentTrack(tracks);
    //if (player.getCurrentTime() >= end) {
    if (currTrack !== track) {
      //track.isNowPlaying = false;
      //currTrack.isNowPlaying = true;
      //clearInterval(timer);
      playRandomDifferentTrack(tracks, track.num);
    } else {
      setTimeout(run, 500);
    }
  }
  run();
  //let next_song_duration = track.end - track.start;
  //setTimeout(playRandomTimestamp, next_song_duration * 1000);
}


function updateNowPlayingInfo(tracks, track) {
  let currTrack = getCurrentTrack(tracks);
  //if (player.getCurrentTime() >= end) {
  if (currTrack !== track) {
    track.isNowPlaying = false;
    currTrack.isNowPlaying = true;
  }
}


function getCurrentTrack(tracks) {
  let time = player.getCurrentTime();
  let currTracks = tracks.filter(track => time >= track.start && 
                                          time < track.end);
  let currTrack = currTracks.length > 0 ? currTracks[0] : null;
  return currTrack;
}


startShuffling();
