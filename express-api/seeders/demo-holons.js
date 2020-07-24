'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Holons', [
      { // id: 1
        handle: 'root',
        name: 'All',
        description: 'This is the root holon...',
        flagImagePath: 'https://assets.weforum.org/project/image/HTpPcpjX9elUNR5L6VvDaixzL9GgCoGaasn1nTj74e0.jpeg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 2
        handle: 'science',
        name: 'Science',
        description: 'Welcome to the Science holon...',
        flagImagePath: 'https://schoolsweek.co.uk/wp-content/uploads/2020/04/Science-scientists-SM.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 3
        handle: 'physics',
        name: 'Physics',
        description: 'Welcome to Physics',
        flagImagePath: 'https://images.theconversation.com/files/191827/original/file-20171025-25516-g7rtyl.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 4
        handle: 'biology',
        name: 'Biology',
        description: 'Welcome to Biology',
        flagImagePath: 'https://ugc.futurelearn.com/uploads/images/31/5b/header_315b07b5-ecbc-46ef-a0ce-a9e551381864.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 5
        handle: 'chemistry',
        name: 'Chemistry',
        description: 'Welcome to Chemistry',
        flagImagePath: 'https://images2.minutemediacdn.com/image/upload/c_crop,h_1221,w_2171,x_142,y_0/v1554734406/shape/mentalfloss/65139-istock-660523940.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 6
        handle: 'qm',
        name: 'Quantum Mechanics',
        description: 'Welcome to Quantum Mechanics',
        flagImagePath: 'https://images.ctfassets.net/cnu0m8re1exe/3DufMfv3s61Wgqem0jxOaI/06d4769516e09575754c8779f5596f0b/waroverreality.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 7
        handle: 'bristol',
        name: 'Bristol',
        description: 'The Bristol space',
        flagImagePath: 'https://i2-prod.bristolpost.co.uk/incoming/article987658.ece/ALTERNATES/s1200b/Bristol-vista.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // id: 8
        handle: 'art',
        name: 'Art',
        description: 'Art wooooo...',
        flagImagePath: 'https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg',
        coverImagePath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Holons', null, {});
  }
};
