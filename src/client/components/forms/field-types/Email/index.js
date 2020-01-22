import React from 'react';
import PropTypes from 'prop-types';
import useFieldType from '../../useFieldType';
import Label from '../../Label';
import Error from '../../Error';

import './index.scss';

const defaultError = 'Please enter a valid email.';
const defaultValidate = value => /\S+@\S+\.\S+/.test(value);

const Email = (props) => {
  const {
    name,
    required,
    defaultValue,
    valueOverride,
    validate,
    style,
    width,
    errorMessage,
    label,
    placeholder,
  } = props;

  const {
    value,
    showError,
    processing,
    onFieldChange,
  } = useFieldType({
    name,
    required,
    defaultValue,
    valueOverride,
    validate,
  });

  const fieldWidth = width ? `${width}%` : undefined;

  return (
    <div
      className="field-type email"
      style={{
        ...style,
        width: fieldWidth,
      }}
    >
      <Error
        showError={showError}
        message={errorMessage}
      />
      <Label
        htmlFor={name}
        label={label}
        required={required}
      />
      <input
        value={value || ''}
        onChange={onFieldChange}
        disabled={processing ? 'disabled' : undefined}
        placeholder={placeholder}
        type="email"
        id={name}
        name={name}
      />
    </div>
  );
};

Email.defaultProps = {
  label: null,
  required: false,
  defaultValue: null,
  valueOverride: null,
  placeholder: undefined,
  validate: defaultValidate,
  errorMessage: defaultError,
  width: 100,
  style: {},
};

Email.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  valueOverride: PropTypes.string,
  validate: PropTypes.func,
  errorMessage: PropTypes.string,
  width: PropTypes.number,
  style: PropTypes.shape({}),
  label: PropTypes.string,
};

export default Email;
