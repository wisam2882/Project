'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1 Lane',
        city:'city 1',
        state: 'state 1',
        country: 'country 1',
        lat: 1,
        lng: 1,
        name: 'name-1',
        description:'description 1',
        price: 1
      },
      {
        ownerId: 1,
        address: '2 Lane',
        city:'city 2',
        state: 'state 2',
        country: 'country 2',
        lat: 2,
        lng: 2,
        name: 'name-2',
        description:'description 2',
        price: 1
      },
      {
        ownerId: 2,
        address: '3 Lane',
        city:'city 3',
        state: 'state 3',
        country: 'country 3',
        lat: 1,
        lng: 1,
        name: 'name-3',
        description:'description 3',
        price: 1
      },
      
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['name-1', 'name-2', 'name-3'] }
    }, {});
  }
};
