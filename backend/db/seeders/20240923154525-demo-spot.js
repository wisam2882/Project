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
        address: `111 main st`,
        city: `Stege`,
        state: 'Denmark',
        country: `Denmark`,
        lat: 80.123,
        lng: -123.23,
        name: `modern fairytale holiday home`,
        description: `architect-designed summerhouse for the discerning and design-proof guest. beautiful view of the landscape. close to the beach.`,
        price: 1276.00,
      },
      {
        ownerId: 1,
        address: `122 main st`,
        city: `Austin`,
        state: `Texas`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `East Side Beehive romantic retreat`,
        description: `Clean, Zen modern backyard cottage`,
        price: 1244.00,
      },
      {
        ownerId: 1,
        address: `133 main st`,
        city: `Lac-Beauport`,
        state: `Quebec`,
        country: `Canada`,
        lat: 30.123,
        lng: -123.23,
        name: `The MICA`,
        description: `The Mica is a high-end tiny home perched atop a mountain, designed to offer the ultimate immersive scenic experience boasting a panoramic view of the surrounding valleys`,
        price: 1865.00,
      },
      {
        ownerId: 1,
        address: `144 main st`,
        city: `Rhinebeck`,
        state: `New York`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `Architectural wonder in the woods`,
        description: `Unique experience, secluded.`,
        price: 2887.00,
      },
      {
        ownerId: 1,
        address: `155 main st`,
        city: `Broadway`,
        state: `Virginia`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `Hobbit Style Underground Cabin`,
        description: `Nestled in the valley of the Blue Ridge Mountains, this secluded Hobbit House makes the perfect private getaway.`,
        price: 907.00,
      },
      {
        ownerId: 1,
        address: `166 main st`,
        city: `Springfield`,
        state: `Tennessee`,
        country: `USA`,
        lat: 30.123,
        lng: -123.23,
        name: `Sheet`,
        description: `Boat in Springfield, Tennessee`,
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
