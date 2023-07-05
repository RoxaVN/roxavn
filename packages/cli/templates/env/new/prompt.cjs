const { nanoid } = require('nanoid');

module.exports = {
  params: () => {
    return { random_token: nanoid(48) };
  },
};
