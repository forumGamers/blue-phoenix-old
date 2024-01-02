module.exports = {
  apps: [
    {
      name: "blue-phoenix",
      script: "./build/bin/www.js",
      instances: 1,
      autoRestart: true,
    },
  ],
};
