const httpStatus = require('http-status');
const formatSuccessResponse = require('../../express/responses/formatSuccess');
const { create } = require('../operations');

const createHandler = async (req, res, next) => {
  try {
    const doc = await create({
      req,
      Model: req.collection.Model,
      config: req.collection.config,
      data: req.body,
    });

    return res.status(httpStatus.CREATED).json({
      ...formatSuccessResponse(`${req.collection.config.labels.singular} successfully created.`, 'message'),
      doc,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = createHandler;
