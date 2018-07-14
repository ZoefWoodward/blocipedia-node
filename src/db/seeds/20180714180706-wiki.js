'use strict';

const faker = require("faker");

let wikis = [ ];

for(let i = 1; i <= 10; i++){
  wikis.push({
    title: `${faker.hacker.noun()}-${i}`,
    body: `${faker.hacker.phrase()}-${i}`,
    userId: 1,
    private: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
