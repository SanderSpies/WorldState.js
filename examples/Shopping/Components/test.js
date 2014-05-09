/**
 * @type {Shopping}
 */
var Shopping = require('../Graph/Shopping');

Shopping.newInstance().canvasItems().insert(
  ShoppingCanvasItem.newInstance({
    a: 1,
    b: 2,
    c: 3
  })
);