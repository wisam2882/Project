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
        url: 'https://media.architecturaldigest.com/photos/64f9963c40e6901746ae64fe/master/w_1920%2Cc_limit/GettyImages-1205733413.jpg',
        preview: true
      },
      {
        spotId: 4, 
        url: `https://cdn-imgix.headout.com/mircobrands-content/image/9bebcf89a61be2b8c99d76ee86cb598c-Palazzo%20Pitti.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 4, 
        url: `https://selectitaly.com/blog/wp-content/uploads/2017/02/florence-palazzo-pitti-1024x681.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 4, 
        url: `https://girlinflorence.com/wp-content/uploads/2014/02/IMG_6084.jpg`, // Use Cloudinary URL
        preview: false
      },

      {
        spotId: 5,
        url: 'https://travelingeurope.biz/wp-content/uploads/2016/02/Hohenzollern-Castle.jpg',
        preview: true
      },
      {
        spotId: 5, 
        url: `https://images.locationscout.net/2020/06/hohenzollern-castle-germany-uoyw.webp?h=1400&q=80`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 5, 
        url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQryvCNo978bqVb_gV1c-nev0SLfnVm45aQctgGahoqUJ6dJ1HUSCsNbUK6gYcxv8-mm90&usqp=CAU`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 5, 
        url: `https://knightstemplar.co/wp-content/uploads/2023/10/hohenzollern_castle.jpg`, // Use Cloudinary URL
        preview: false
      },

      
      {
        spotId: 6,
        url: 'https://www.shutterstock.com/image-photo/wonderful-romantic-medieval-castles-germany-600nw-2387880927.jpg',
        preview: true
      },
      {
        spotId: 6, 
        url: `https://i.pinimg.com/originals/fb/64/73/fb64737a4ebcd4044f24b0907729b914.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 6, 
        url: `https://m.media-amazon.com/images/I/81Ha76PfVuL.jpg`, // Use Cloudinary URL
        preview: false
      },
      {
        spotId: 6, 
        url: `https://static.vecteezy.com/system/resources/previews/030/580/737/non_2x/enchanting-fairytale-castle-generate-ai-photo.jpg`, // Use Cloudinary URL
        preview: false
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
