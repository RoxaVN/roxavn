module.exports = {
  params: ({ args }) => {
    return { ts: new Date().getTime(), name: args.name || 'migration' };
  },
};
