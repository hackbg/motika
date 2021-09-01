module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: { preload: "src/preload.ts" },
    },
  },
};
