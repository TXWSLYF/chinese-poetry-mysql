const Sequelize = require("sequelize");

const sequelize = new Sequelize("chinese_poetry", "root", "txwslyf", {
  host: "127.0.0.1",
  dialect: "mysql"
});

module.exports = sequelize;
