module.exports = {
  prompt: ({ prompter, args }) => {
    return prompter
      .prompt({
        type: 'input',
        name: 'name',
        message: "What's your mirgarion name?",
      })
      .then(({ name }) => {
        return {
          name,
          ts: new Date().getTime(),
          upSqls: args.upSqls || '',
          downSqls: args.downSqls || '',
        };
      });
  },
};
