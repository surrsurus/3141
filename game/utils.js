
/**
 * @desc Translate cartesian coordinates to isometric coordinates
 * @function
 * 
 * @param {Number} x 
 * @param {Number} y 
 * 
 * @return {Array} - A tuple of new iso coords
 */
const cart2Iso = (x, y) => {
  // isoX = x - y;
  // isoY = (x + y) / 2;

  return [x - y, (x + y) / 2];
  
};

/**
 * @desc Translate isometric coordinates to cartesian coordinates
 * @function
 * 
 * @param {Number} x 
 * @param {Number} y 
 * 
 * @return {Array} - A tuple of new cartesian coords
 */
const iso2Cart = (isoX, isoY) => {
  // cartX = (2 * isoY + isoX) / 2;
  // cartY = (2 * isoY - isoX) / 2;

  return [(2 * isoY + isoX) / 2, (2 * isoY - isoX) / 2];

};

/**
 * Sleep function
 */
// Not necessary to have rn
// const sleep = (milliseconds) => {
//   let start = new Date().getTime();
//   for (let i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// };

module.exports = {
  cart2Iso,
  iso2Cart,
  // sleep
};
