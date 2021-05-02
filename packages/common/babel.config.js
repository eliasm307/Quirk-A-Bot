module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    ,
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "^@quirk-a-bot/(.+)": "../../packages/\\1/src",
          "^src": "./src",
        },
      },
    ],
  ],
};
