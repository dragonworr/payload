const jwt = require('jsonwebtoken');
const { AuthenticationError, LockedAuth } = require('../../errors');
const getCookieExpiration = require('../../utilities/getCookieExpiration');
const isLocked = require('../isLocked');

async function login(incomingArgs) {
  const { config, operations } = this;

  let args = incomingArgs;

  // /////////////////////////////////////
  // beforeOperation - Collection
  // /////////////////////////////////////

  await args.collection.config.hooks.beforeOperation.reduce(async (priorHook, hook) => {
    await priorHook;

    args = (await hook({
      args,
      operation: 'login',
    })) || args;
  }, Promise.resolve());

  const {
    collection: {
      Model,
      config: collectionConfig,
    },
    data,
    req,
    depth,
    overrideAccess,
    showHiddenFields,
  } = args;

  // /////////////////////////////////////
  // Login
  // /////////////////////////////////////

  const { email: unsanitizedEmail, password } = data;

  const email = unsanitizedEmail ? unsanitizedEmail.toLowerCase() : null;

  const userDoc = await Model.findByUsername(email);

  if (!userDoc || (args.collection.config.auth.verify && userDoc._verified === false)) {
    throw new AuthenticationError();
  }

  if (userDoc && isLocked(userDoc.lockUntil)) {
    throw new LockedAuth();
  }

  const authResult = await userDoc.authenticate(password);

  const maxLoginAttemptsEnabled = args.collection.config.auth.maxLoginAttempts > 0;

  if (!authResult.user) {
    if (maxLoginAttemptsEnabled) await userDoc.incLoginAttempts();
    throw new AuthenticationError();
  }

  if (maxLoginAttemptsEnabled) {
    await operations.collections.auth.unlock({
      collection: {
        Model,
        config: collectionConfig,
      },
      req,
      data,
      overrideAccess: true,
    });
  }

  const userQuery = await operations.collections.find({
    where: {
      email: {
        equals: email,
      },
    },
    collection: {
      Model,
      config: collectionConfig,
    },
    req,
    overrideAccess: true,
  });

  let user = userQuery.docs[0];

  const fieldsToSign = collectionConfig.fields.reduce((signedFields, field) => {
    const result = {
      ...signedFields,
    };

    if (!field.name && field.fields) {
      field.fields.forEach((subField) => {
        if (subField.saveToJWT) {
          result[subField.name] = user[subField.name];
        }
      });
    }

    if (field.saveToJWT) {
      result[field.name] = user[field.name];
    }

    return result;
  }, {
    email,
    id: user.id,
    collection: collectionConfig.slug,
  });

  const token = jwt.sign(
    fieldsToSign,
    config.secret,
    {
      expiresIn: collectionConfig.auth.tokenExpiration,
    },
  );

  if (args.res) {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      expires: getCookieExpiration(collectionConfig.auth.tokenExpiration),
      secure: collectionConfig.auth.cookies.secure,
      sameSite: collectionConfig.auth.cookies.sameSite,
    };

    if (collectionConfig.auth.cookies.domain) cookieOptions.domain = collectionConfig.auth.cookies.domain;

    args.res.cookie(`${config.cookiePrefix}-token`, token, cookieOptions);
  }

  // /////////////////////////////////////
  // afterLogin - Collection
  // /////////////////////////////////////

  await collectionConfig.hooks.afterLogin.reduce(async (priorHook, hook) => {
    await priorHook;

    user = await hook({
      doc: user,
      req: args.req,
      token,
    }) || user;
  }, Promise.resolve());

  // /////////////////////////////////////
  // afterRead - Fields
  // /////////////////////////////////////

  user = await this.performFieldOperations(collectionConfig, {
    depth,
    req,
    data: user,
    hook: 'afterRead',
    operation: 'login',
    overrideAccess,
    reduceLocales: true,
    showHiddenFields,
  });

  // /////////////////////////////////////
  // afterRead - Collection
  // /////////////////////////////////////

  await collectionConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
    await priorHook;

    user = await hook({
      req,
      doc: user,
    }) || user;
  }, Promise.resolve());

  // /////////////////////////////////////
  // Return results
  // /////////////////////////////////////

  return {
    token,
    user,
    exp: jwt.decode(token).exp,
  };
}

module.exports = login;
