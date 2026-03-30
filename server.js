const { getConfig } = require('./src/config');
const { createApp } = require('./src/app');

const config = getConfig();
const app = createApp();

app.listen(config.port, () => {
  console.log(`Boston AI Tinkerers listening on ${config.port}`);
});
