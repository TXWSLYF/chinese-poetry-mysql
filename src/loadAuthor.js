const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

function getAuthorModel(type) {
  class AuthorModel extends Sequelize.Model {}

  AuthorModel.init(
    {
      desc: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: `${type}_authors`,
      // 是否自动创建 createdAt 和 updatedAt 字段
      timestamps: false
    }
  );

  return AuthorModel;
}

/**
 * @description 导入作者
 * @param {String} type song | tang
 */
function loadAuthor(type) {
  const filePath = path.resolve(__dirname, '../data/', `authors.${type}.json`);
  const authorList = require(filePath);

  const AuthorModel = getAuthorModel(type);

  return AuthorModel.sync({ force: true }).then(() => {
    return Promise.all(
      authorList.map(author => {
        return AuthorModel.create(author);
      })
    );
  });
}

module.exports = {
  getAuthorModel,
  loadAuthor
};
