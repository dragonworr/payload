import Page from './Page.model';

const pagePolicy = {

  read(req, res, next) {
    next();
  },

  create(req, res, next) {
    // TODO: how to get current authenticated user?
    next();
  },

  update(req, res, next) {
    next();
  },

  destroy(req, res, next) {
    next();
  },
};

export default pagePolicy;
