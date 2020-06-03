import React from 'react';
import PropTypes from 'prop-types';
import useFieldType from '../../useFieldType';
import withCondition from '../../withCondition';
import Label from '../../Label';
import Error from '../../Error';
import { textarea } from '../../../../../fields/validations';

import './index.scss';

const Textarea = (props) => {
  const {
    path,
    required,
    defaultValue,
    validate,
    style,
    width,
    label,
    placeholder,
  } = props;

  const {
    value,
    showError,
    onFieldChange,
    formProcessing,
    errorMessage,
  } = useFieldType({
    path,
    required,
    defaultValue,
    validate,
  });

  const classes = [
    'field-type',
    'textarea',
    showError && 'error',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        ...style,
        width,
      }}
    >
      <Error
        showError={showError}
        message={errorMessage}
      />
      <Label
        htmlFor={path}
        label={label}
        required={required}
      />
      <textarea
        value={value || ''}
        onChange={onFieldChange}
        disabled={formProcessing ? 'disabled' : undefined}
        placeholder={placeholder}
        id={path}
        name={path}
      />
    </div>
  );
};

Textarea.defaultProps = {
  required: false,
  label: null,
  defaultValue: null,
  validate: textarea,
  width: undefined,
  style: {},
  placeholder: null,
};

Textarea.propTypes = {
  path: PropTypes.string.isRequired,
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  validate: PropTypes.func,
  width: PropTypes.string,
  style: PropTypes.shape({}),
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default withCondition(Textarea);
