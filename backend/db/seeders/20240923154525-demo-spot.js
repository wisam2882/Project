'use strict';

const { Spot } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 2,
        address: `1 Candy Cane Lane`,
        city: `Stege`,
        state: `Denmark`,
        country: `Denmark`,
        lat: 80.123,
        lng: -123.23,
        name: `The Enchanted Castle of Snacktopia`,
        description: `A magical abode where every room is filled with snacks! Enjoy breathtaking views of the candy mountains and the chocolate river, just a hop away from the beach of gummy bears.`,
        price: 1276.00,
      },
      {
        ownerId: 1,
        address: `2 Cactus Court`,
        city: `Austin`,
        state: `Texas`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `The Love Shack of Cactus Hugs`,
        description: `A cozy, Zen-like retreat where every cactus gives you a hug! Perfect for romantic getaways or solo cactus appreciation.`,
        price: 1244.00,
      },
      {
        ownerId: 1,
        address: `3 Whimsy Way`,
        city: `Lac-Beauport`,
        state: `Quebec`,
        country: `Canada`,
        lat: 30.123,
        lng: -123.23,
        name: `The Tiny Castle of Giggles`,
        description: `A pint-sized palace perched on a mountain, designed for laughter and joy, with panoramic views of the valley filled with dancing unicorns.`,
        price: 1865.00,
      },
      {
        ownerId: 1,
        address: `4 Mystery Lane`,
        city: `Rhinebeck`,
        state: `New York`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `The Secret Hideaway of Whimsical Wonders`,
        description: `A unique experience in the woods where every tree tells a story and the squirrels are your friendly neighbors.`,
        price: 2887.00,
      },
      {
        ownerId: 1,
        address: `5 Hobbiton Drive`,
        city: `Broadway`,
        state: `Virginia`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `The Hobbit Hole of Cozy Dreams`,
        description: `Nestled in the valley of the Blue Ridge Mountains, this charming Hobbit house is perfect for those who love to eat second breakfast in peace.`,
        price: 907.00,
      },
      {
        ownerId: 1,
        address: `6 Pirate's Cove`,
        city: `Springfield`,
        state: `Tennessee`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `The Floating Fortress of Fun`,
        description: `A boat in Springfield, Tennessee, where every wave brings a new adventure and the fish are always up for a chat.`,
        price: 1113.00,
      },
    ],)
  },

  

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['usa'] }
    }, {});
  }
};
