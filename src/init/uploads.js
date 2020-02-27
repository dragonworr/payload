const express = require('express');

const initUploads = (app, config) => {
  const staticUrl = config.staticUrl ? config.staticUrl : `/${config.staticDir}`;
  app.use(staticUrl, express.static(config.staticDir));
};

module.exports = initUploads;
