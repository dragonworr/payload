import React from 'react';
import { SetStepNav } from 'payload/components';

import './index.scss';

const Archive = props => {
  return (
    <article className="collection-archive">
      <SetStepNav nav={ [
        {
          label: props.collection.label
        }
      ] } />
      {props.children}
    </article>
  );
};

export default Archive;
