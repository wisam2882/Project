'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2025-01-01',
        endDate: '2025-01-15',
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2025-02-01',
        endDate: '2025-02-15',
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2025-03-01',
        endDate: '2025-03-15',
      },
     
      
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      endDate: { [Op.in]: ['2025-01-15', '2025-02-15', '2025-03-15']}
    }, {});
  }
};
