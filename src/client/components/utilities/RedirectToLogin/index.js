import React, { useEffect } from 'react';
import {
  Redirect,
} from 'react-router-dom';
import { useStatusList } from '../../modules/Status';
import config from '../../../config/sanitizedClientConfig';

const RedirectToLogin = () => {
  const { addStatus } = useStatusList();

  useEffect(() => {
    addStatus({
      message: 'You need to log in to be able to do that.',
      type: 'error',
    });
  }, []);

  return (
    <Redirect to={`${config.routes.admin}/login`} />
  );
};

export default RedirectToLogin;
