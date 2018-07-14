'use strict';

const faker = require("faker");

let users = [{
  id: 1, 
  username: "ZoeWoodward",
  email: "Zoe@test.com",
  password: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "standard"
},
{
id: 2,
username: "JohnDoe",
email: "John@test.com",
password: "1234567890",
createdAt: new Date(),
updatedAt: new Date(),
role: "standard"
},
{
  id: 3,
  username: "JaneDoe",
  email: "Jane@test.com",
  password: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
  role: "standard"
}

];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
