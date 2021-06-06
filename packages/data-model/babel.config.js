module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "^@quirk-a-bot/(.+)": "../../packages/\\1/src",
        },
      },
    ],
  ],
};
