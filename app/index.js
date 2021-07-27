const config = require('../config');
const app = require('./app');

const port = config.get('PORT');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});

module.exports = app;
