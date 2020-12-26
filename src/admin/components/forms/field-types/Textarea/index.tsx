import React, { useCallback } from 'react';
import useFieldType from '../../useFieldType';
import withCondition from '../../withCondition';
import Label from '../../Label';
import Error from '../../Error';
import { textarea } from '../../../../../fields/validations';
import { Props } from './types';

import './index.scss';

const Textarea: React.FC<Props> = (props) => {
  const {
    path: pathFromProps,
    name,
    required,
    validate = textarea,
    admin: {
      readOnly,
      style,
      width,
      placeholder,
      rows,
    } = {},
    label,
    minLength,
    maxLength,
  } = props;

  const path = pathFromProps || name;

  const memoizedValidate = useCallback((value) => {
    const validationResult = validate(value, { minLength, maxLength, required });
    return validationResult;
  }, [validate, maxLength, minLength, required]);

  const {
    value,
    showError,
    setValue,
    errorMessage,
  } = useFieldType({
    path,
    validate: memoizedValidate,
    enableDebouncedValue: true,
  });

  const classes = [
    'field-type',
    'textarea',
    showError && 'error',
    readOnly && 'read-only',
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
        onChange={setValue}
        disabled={readOnly}
        placeholder={placeholder}
        id={path}
        name={path}
        rows={rows}
      />
    </div>
  );
};
export default withCondition(Textarea);
