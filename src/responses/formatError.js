const formatErrorResponse = (incoming, source) => {
  switch (source) {
    case 'mongoose':
      return {
        errors: Object.keys(incoming.errors).reduce((acc, key) => {
          acc.push({
            message: incoming.errors[key].message,
          });
          return acc;
        }, []),
      };


    case 'APIError':
      return {
        errors: [
          {
            message: incoming.name,
          },
        ],
      };

    default:
      return incoming;
  }
};

module.exports = formatErrorResponse;
