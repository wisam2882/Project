'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "This was good",
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: "This was bad",
        stars: 1
      },
      {
        spotId: 2,
        userId: 1,
        review: "This was good for spot 2",
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: "This was bad for spot 2",
        stars: 1
      },
      
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['This was good', 'This was bad', 'This was good for spot 2', 'This was bad for spot 2']}
    }, {});
  }
};
