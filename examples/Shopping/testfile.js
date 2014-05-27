/**
 * @type {Shopping}
 */
var Shopping = require('./Graph/Shopping');

var data = {
  "userInfo": {
    "name": "Sander Spies",
    "address": "Hier"
  },

  "orders": [
    {
      "id": 1,
      "deliveryDate": "{date}",
      "type": 1
    }
  ],

  "card": {
    "items": [
      {
        "product": "{item of /products}",
        "amount": 0
      }
    ]
  },

  "shelves": [
    {
      "id": 1,
      "title": "bla",
      "shelves": "{array of /shelves}"
    }
  ],

  "brands": [
    {
      "id": 1,
      "title": ""
    }
  ],

  "features": [
    {
      "title": ""
    }
  ],

  "products": [
    {
      "id": 1,
      "title": "",
      "description": "",
      "isSoldOut": false,
      "isSpecial": false,
      "img": "",
      "price": "",
      "oldPrice": "",
      "unit": "",
      "unitAmount": 1,
      "shelves": "{array of /shelves}",
      "brand": "{item of /brands}",
      "features": "{array of /shelves}"
    }
  ],

  "canvasItems": [
    {
      "id": 1,
      "product": "{item of /products}",
      "style": "{enum of bla:2|x:5|y:2|z:5}"
    }
  ],

  "favorites": "{array of /products}"
};

var CanvasItem = require('./Graph/CanvasItem');
var shopping = Shopping.newInstance(data);

var old = shopping.read();

shopping.canvasItems().insert(
  CanvasItem.newInstance({
    id: 2,
    title: 'ayyaya'
  })
);

//console.log(shopping.canvasItems().__private.graph.__private.parents);
var canvasItems = shopping.canvasItems();
shopping.afterChange(function() {

  var a = shopping.canvasItems().at(1);
  var b = shopping.canvasItems().at(0);
  console.log(a.read() === b.read());
  console.assert(a.read() !== b.read(), 'Should not be true of course');

  var c = shopping.products().read();
  a.changeReferenceTo(
    b.read()
  );
  var old = shopping.read();
  shopping.afterChange(function() {
    //var x = a.read();
    console.log(c === shopping.products().read());

    console.assert(a.read() === b.read(), 'Should be true of course');

    a.changeValueTo({id:4, title:'yadayada'});
    console.log(shopping.canvasItems().at(1).read() === shopping.canvasItems().at(0).read());

    shopping.afterChange(function(){
      //"use strict";
      console.log(b.read());
      console.log(a.read());
      console.log(canvasItems.where({id:4})[0].read().id);
      canvasItems.insert(CanvasItem.newInstance({id:4, title:'brr'}));
      shopping.afterChange(function(){
        "use strict";
        console.log(canvasItems.where({id:4})[0].read());
        console.log(canvasItems.where({id:4})[1].read());
        canvasItems.insertMulti([CanvasItem.newInstance({id:44, title:'zzz'})]);
        shopping.afterChange(function(){
          console.log(canvasItems.where({id:4})[0].read());
          console.log(canvasItems.where({id:4})[1].read());
          console.log(canvasItems.at(2).read());
          console.log(shopping.read());
        });
      });
    });



    //console.log()

  });
  /*shopping.canvasItems().at(0).changeValueTo({
    id: 3,
    title: 'hoooi'
  });*/

});