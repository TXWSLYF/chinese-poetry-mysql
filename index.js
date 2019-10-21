const { loadAuthor } = require('./src/loadAuthor');
const loadPoet = require('./src/loadPoet');

(async () => {
  const startTime = Date.now();
  await loadAuthor('song');
  await loadAuthor('tang');
  await loadPoet('song');
  await loadPoet('tang');
  const endTime = Date.now();

  console.log(
    `数据导入成功，共花费${Math.round((endTime - startTime) / 1000)}s`
  );
})();
