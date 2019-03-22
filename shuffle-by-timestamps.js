// ==UserScript==
// @name YT Shuffle by Timestamps
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/watch?v=*
// @grant none
// ==/UserScript==

//TODO
  // allow `s in raw_timestamps
  // allow for var playback speed

var raw_timestamps = `01 Faulkner - New Beginning 00:00 02 Yiruma - River Flows in You 04:05 03 Sakamoto - Aqua 07:06 04 Einaudi - Le Onde 10:37 05 Einaudi - Nefeli 13:45 06 Faulker - Ballade 17:30 07 Faulkner - Springtime 20:24 08 Trad. - Greensleves (arr. for cello and violin) 23:28 09 Litvinovsky - Le Grand Cahier I. La Foret et la Riviere 26:56 IV. Nos Etudes 29:42 V. La Servante et la l'Ordonnance 32:29 VI. Le Bain 34:54 VIII. Theatre 37:07 10 Stamitz - Sinfonia Concertante in D Major: II. Romanza 39:49 11 Vivaldi - The Four Seasons, Concerto No. 1 Spring: II. Largo e pianissimo sempre 46:24 12 Grieg - Holberg Suite, Op. 40 II. Sarabande 48:46 III. Gavotte 52:28 13 Vivaldi - String Concerto in G Minor, RV 152: II. Andante molto 55:41 14 Floridia - Maruzza: Interludio 57:33 15 Tchaikovsky - Symphony No. 6 in B Minor, Op. 74 Patetica: II. Allegro con grazia 1:01:05 16 Tchaikovsky - Serenade for Strings in C Major, Op.48: II. Valse 1:09:05 17 Beethoven - Piano Concerto No. 3 in C Minor, Op. 37: II. Largo 1:13:01 18 Liszt/Schubert - Ständchen (Serenade), S. 560, No. 7 1:22:53 19 Schubert - Four Impromptus, Op. 90, D. 899: No. 3 in G-Flat Major (Live Recording) 1:28:37 20 Mendelssohn - Songs Without Words, Book 1, Op. 19b: No. 1, Andante con moto 1:34:44 21 Beethoven - Piano Concerto No. 1 in C Major, Op. 15: II. Largo 1:38:34 22 Prokofiev - Suite No. 2 from Romeo and Juliet, Op. 64ter: No. 3, Friar Laurence 1:48:06 23 Faulkner - Daydreaming 1:50:16 24 Debussy - 2 Arabesques: No. 1, Andantino con moto 1:53:12 25 Debussy - Suite Bergamasque, L. 75: III. Clair de Lune 1:57:20`;

const timestamp_re = /[0-9]{1,2}:?[0-9]{1,2}:[0-9]{2}/g;

player = document.getElementById("movie_player");
video_end = player.getDuration();

var timestamp;
var timestamps = [];
do {
    timestamp = timestamp_re.exec(raw_timestamps);
    if (timestamp) {
        timestamps.push(timestamp.toString());
    }
} while (timestamp);
num_songs = timestamps.length;

/**
 * Returns random int between 0 and (max - 1)
 * @param {int} max A natural number indicating the max
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Converts timestamp into total seconds represented.
 * @param A string in a valid YouTube timestamp format (hh:mm:ss, h:mm:ss, hh:m:ss, h:m:ss, mm:ss, or m:ss)
*/
function timestamp_to_seconds(timestamp) {
    var time_fields = timestamp.split(":");
    var total_seconds = 0;
    var seconds_multiplier = 1;
    var i = time_fields.length - 1;
    while(i >= 0) {
      total_seconds += parseInt(time_fields[i], 10) * seconds_multiplier;
      seconds_multiplier *= 60;
      i--;
    }
    return total_seconds;
}

function play_random_timestamp() {
    let i = getRandomInt(num_songs);
    let next_song_start = timestamp_to_seconds(timestamps[i]);
    var next_song_end;
    if (i + 1 == num_songs) {
      next_song_end = video_end;
    } else {
      next_song_end = timestamp_to_seconds(timestamps[i+1]);
    }
    next_song_duration = next_song_end - next_song_start;
    player.seekTo(next_song_start, true);
    //setTimeout(play_random_timestamp, next_song_duration * 1000);
    var timer = setInterval(play_next, 1000, next_song_end, timer);
}

function play_next(end, timer) {
    if (player.getCurrentTime() >= end) {
        clearInterval(timer);
        play_random_timestamp();
    }
}

play_random_timestamp();
