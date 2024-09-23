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
        address: `123 main st`,
        city: `sometown`,
        country: `usa`,
        lat: 123.123,
        lng: -123.23,
        name: `the beach House`,
        description: `A nice and a lovely beach House`,
        price: 2500.00,
      },
    ],)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spot';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['usa'] }
    }, {});
  }
};
