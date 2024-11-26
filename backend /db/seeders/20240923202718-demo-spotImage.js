'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://i.postimg.cc/59Xc8d56/1000-F-721501006-TN3-QMUv-MBXIDj-T84x-LFJ8-Q1l-BK3lc-LBg.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: `https://i.postimg.cc/Y2Z53n88/1000-F-721500974-n-FUSsmz8-Fp-PWZUI3-Grma-RX428kywx-CZo.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 1, 
        url: `https://i.postimg.cc/T1zJDWVq/1000-F-721501035-ETFUW8q-Td-Kq-AYnc-Qt-Lipt-Gd-Xu-HSl-XBDv.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 1, 
        url: `https://i.postimg.cc/T1zJDWVq/1000-F-721501035-ETFUW8q-Td-Kq-AYnc-Qt-Lipt-Gd-Xu-HSl-XBDv.jpg`, // Use Cloudinary URL
        preview: false
      },



      {
        spotId: 2,
        url: 'https://i.postimg.cc/XJTswh3C/1000-F-805992473-QL6u-Rr-Po-H9-Ge-Wc-Vf-BM3q8it0a-EBIDXc8.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: `https://i.postimg.cc/v8VqQQLL/1000-F-856297074-me-Nrq-FENOj-IFm-NGRyp42k-Rx-Gq-V1dp8d-U.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 2, 
        url: `https://i.postimg.cc/021tjLVg/1000-F-900361618-fpxd-KE4h-Aswz-Md-Aqmfc-Pcw-Eif2e-ONNw5.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 2, 
        url: `https://i.postimg.cc/SNLgMDPn/1000-F-900361770-wj7-Zkbl3-FHa-SP7ogj-Io-Erdjum6s-Ylq52.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 2, 
        url: `https://i.postimg.cc/TwH9Tshs/240-F-884373147-l-Khy6-Anqu-X0-Wy-AENx-Nsz-A936-Qcquaso-Y.jpg`, // Use Cloudinary URL
        preview: false
      },






      {
        spotId: 3,
        url: 'https://i.postimg.cc/vZz2p37J/1000-F-629970750-bik-J6in-A3mhch-I2-Lrp-Oj9ni-UOWo-UG3-NI.jpg',
        preview: true
      },
      {
        spotId: 3, 
        url: `https://i.postimg.cc/W3D9qjRV/1000-F-723742233-h-Mf-CMZh-Bd-ROT0-KNBGQs-P3-Rwl-Bluf-PKYx.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 3, 
        url: `https://i.postimg.cc/d3r4nBtS/1000-F-778292400-Xz-HIi-Mu-Bf-Qrw-Khfu-BQspu92lahu3u89v.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 3, 
        url: `https://i.postimg.cc/TwH9Tshs/240-F-884373147-l-Khy6-Anqu-X0-Wy-AENx-Nsz-A936-Qcquaso-Y.jpg`, // Use Cloudinary URL
        preview: false
      },




      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/ml/photo_enhancement/pictures/323b2430-a7fa-44d7-ba7a-6776d8e682df.jpg?im_w=1440',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-42388319/original/0d34f7da-14ad-469b-a218-1a2668acd428.jpeg?im_w=1200',
        preview: true
      },




    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
