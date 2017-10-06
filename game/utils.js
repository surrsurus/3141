
/**
 * @desc Translate cartesian coordinates to isometric coordinates
 * 
 * @param {Number} x 
 * @param {Number} y 
 * 
 * @return {Array} A tuple of new iso coords
 */
const cart2Iso = (x, y) => {
  let isoX = x - y;
  let isoY = (x + y) / 2;

  return [isoX, isoY];
};

/**
 * @desc Translate isometric coordinates to cartesian coordinates
 * 
 * @param {Number} x 
 * @param {Number} y 
 * 
 * @return {Array} A tuple of new cartesian coords
 */
const iso2Cart = (isoX, isoY) => {
  let cartX = (2 * isoY + isoX) / 2;
  let cartY = (2 * isoY - isoX) / 2;

  return [cartX, cartY];
};

module.exports = {
  cart2Iso,
  iso2Cart
};
