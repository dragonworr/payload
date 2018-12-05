import React from 'react';
import { Button } from 'payload/components';

import './index.scss';

const HeadingButton = props => {
  return (
    <header className="heading-button">
      <h1>{props.heading}</h1>
      <Button size="small" type="secondary" el={props.buttonType} url={props.buttonUrl}>{props.buttonLabel}</Button>
    </header>
  );
};

export default HeadingButton;
