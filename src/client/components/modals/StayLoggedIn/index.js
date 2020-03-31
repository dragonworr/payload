import React from 'react';
import PropTypes from 'prop-types';
import { asModal } from '@trbl/react-modal';
import ContentBlock from '../../layout/ContentBlock';
import Button from '../../controls/Button';
import config from '../../../config/sanitizedClientConfig';

import './index.scss';

const baseClass = 'stay-logged-in';

const StayLoggedInModal = (props) => {
  const {
    modal: {
      closeAll: closeAllModals,
    },
    refreshToken,
  } = props;

  return (
    <ContentBlock
      className={baseClass}
      width="narrow"
    >
      <h1>Stay logged in</h1>
      <p>You haven&apos;t been active in a little while and will shortly be automatically logged out for your own security. Would you like to stay logged in?</p>
      <div className={`${baseClass}__actions`}>
        <Button onClick={() => {
          refreshToken();
          closeAllModals();
        }}
        >
          Stay logged in
        </Button>
        <Button
          el="link"
          to={`${config.routes.admin}/logout`}
        >
          Log out
        </Button>
      </div>
    </ContentBlock>
  );
};

StayLoggedInModal.propTypes = {
  modal: PropTypes.shape({
    closeAll: PropTypes.func,
  }).isRequired,
  refreshToken: PropTypes.func.isRequired,
};

export default asModal(StayLoggedInModal, 'stay-logged-in');
