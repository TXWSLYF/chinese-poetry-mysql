const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = require('./sequelize');
const { getAuthorModel } = require('./loadAuthor');

/**
 * @description 导入古诗
 * @param {String} type song | tang
 */
function loadPoet(type) {
  let fileNameReg = undefined;

  if (type === 'song') {
    fileNameReg = /poet\.song.+/;
  } else if (type === 'tang') {
    fileNameReg = /poet\.tang.+/;
  }

  const filePathList = fs
    .readdirSync(path.resolve(__dirname, '../data/'))
    .filter(fileName => fileNameReg.test(fileName))
    .map(fileName => path.resolve(__dirname, '../data/', fileName));

  const authorModel = getAuthorModel(type);

  class PoetModel extends Sequelize.Model {}

  PoetModel.init(
    {
      author_name: {
        type: Sequelize.STRING
      },
      author_id: {
        type: Sequelize.INTEGER
      },
      paragraphs: {
        type: Sequelize.TEXT
      },
      strains: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: `${type}_poets`,
      timestamps: false
    }
  );

  function createPoets(filePath) {
    const poets = require(filePath);

    return Promise.all(
      poets.map(async poet => {
        poet.author_name = poet.author;
        poet.paragraphs = poet.paragraphs.join('|');
        poet.strains = poet.strains.join('|');

        const authorInfo = await authorModel.findOne({
          where: { name: poet.author_name }
        });

        if (authorInfo) {
          poet.author_id = authorInfo.id;
        } else {
          poet.author_id = null;
        }

        delete poet.author;
        return PoetModel.create(poet);
      })
    );
  }

  return PoetModel.sync({ force: true }).then(() => {
    (async () => {
      for (const filePath of filePathList) {
        await createPoets(filePath);
      }
    })();
  });
}

module.exports = loadPoet;
