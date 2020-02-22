/**
 * Returns random natural number between 0 and (max - 1), and not equal to prev
 * Adapted from example at:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {int} max - Natural number indicating the max
 * @param {int} prev - Natural number that the result cannot equal
 * @returns {int} Random natural number between 0 and (max - 1), and !== prev
*/
function getRandDiffNat(max, prev) {
  let randomNat = Math.floor(Math.random() * Math.floor(max));
  if (randomNat === prev) {
    return getRandDiffNat(max, prev);
  } else {
    return randomNat;
  }
}


/**
 * Computes total offset (in seconds) from start represented by a timestamp.
 * @example
 * // returns 70
 * computeTimestampSeconds("1:10");
 * @param {string} timestamp - The timestamp to be converted.
 * Accepts formats of [hh:mm:ss; h:mm:ss; hh:m:ss; h:m:ss; mm:ss; m:ss]
*/
function computeTimestampSeconds(timestamp) {
  let tsFields = timestamp.split(":").map(field => parseInt(field, 10));
  let numFields = tsFields.length;
  let totalSecs = tsFields[numFields - 1] + (tsFields[numFields - 2] * 60);
  if (numFields === 3) {
    totalSecs += tsFields[numFields - 3] * 3600;
  }
  return totalSecs;
}

export {
  getRandDiffNat,
  computeTimestampSeconds,
};
