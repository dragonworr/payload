import Cookies from 'universal-cookie';
import qs from 'qs';

const cookies = new Cookies();

const setJWT = () => {
  const jwt = cookies.get('token');
  return jwt ? { 'Authorization': `JWT ${jwt}` } : {}
};

const requests = {
  get: (url, params) => {
    const query = qs.stringify(params, { addQueryPrefix: true });
    return fetch(`${url}${query}`, {
      headers: {
        ...setJWT()
      }
    });
  },

  post: (url, body) =>
    fetch(`${url}`, {
      method: 'post',
      body,
      headers: {
        ...setJWT()
      },
    }),

  put: (url, body) =>
    fetch(`${url}`, {
      method: 'put',
      body,
      headers: {
        ...setJWT()
      },
    }),
};

export default {
  requests
};
