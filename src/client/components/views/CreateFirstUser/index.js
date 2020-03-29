import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import StatusList, { useStatusList } from '../../modules/Status';
import ContentBlock from '../../layout/ContentBlock';
import Form from '../../forms/Form';
import RenderFields from '../../forms/RenderFields';
import FormSubmit from '../../forms/Submit';
import config from '../../../config/sanitizedClientConfig';
import { useUser } from '../../data/User';

import './index.scss';

const {
  routes: {
    admin,
  },
} = config;

const passwordField = {
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true,
};

const baseClass = 'create-first-user';

const CreateFirstUser = (props) => {
  const { setInitialized } = props;
  const { addStatus } = useStatusList();
  const { setToken } = useUser();
  const history = useHistory();

  const handleAjaxResponse = (res) => {
    res.json().then((data) => {
      if (data.token) {
        setToken(data.token);
        setInitialized(true);
        history.push(`${admin}`);
      } else {
        addStatus({
          type: 'error',
          message: 'There was a problem creating your first user.',
        });
      }
    });
  };

  const fields = [...config.user.fields];

  if (config.user.auth.passwordIndex) {
    fields.splice(config.user.auth.passwordIndex, 0, passwordField);
  } else {
    fields.push(passwordField);
  }

  return (
    <ContentBlock
      className={baseClass}
      width="narrow"
    >
      <div className={`${baseClass}__wrap`}>
        <h1>Welcome to Payload</h1>
        <p>To begin, create your first user.</p>
        <StatusList />
        <Form
          handleAjaxResponse={handleAjaxResponse}
          disableSuccessStatus
          method="POST"
          action="/first-register"
        >
          <RenderFields fields={fields} />
          <FormSubmit>Create</FormSubmit>
        </Form>
      </div>
    </ContentBlock>
  );
};

CreateFirstUser.propTypes = {
  setInitialized: PropTypes.func.isRequired,
};

export default CreateFirstUser;
