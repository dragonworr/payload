import React, { Component } from 'react';
import { Tooltip, FormContext } from 'payload/components';

import './index.css';

class Input extends Component {
  constructor() {
    super();

    this.errors = {
      text: 'Please fill in the field',
      email: 'Please enter a valid email'
    };

    this.validate = this.validate.bind(this);
  }

  validate(value) {
    let emailTest = /\S+@\S+\.\S+/;

    switch (this.props.type) {
    case 'text':
      return value.length > 0;

    case 'password':
      return value.length > 0;

    case 'email':
      return emailTest.test(value);

    case 'hidden':
      return true;

    default:
      return false;
    }
  }

  componentDidMount() {

  }

  render() {
    const Required = this.props.required
      ? () => <span className="required">*</span>
      : () => null;

    const Error = this.props.valid === false
      ? () => <Tooltip className="error-message">{this.errors[this.props.type]}</Tooltip>
      : () => null;

    const Label = this.props.label
      ? () => <label htmlFor={this.props.id ? this.props.id : this.props.name}>{this.props.label}<Required /></label>
      : () => null;

    let className = `interact ${this.props.type}`;
    className = this.props.valid !== false
      ? className
      : `${className} error`;

    const validate = this.props.required ? this.validate : () => true;

    return (
      <div className={className} style={this.props.style}>
        <Error />
        <Label />
        <input
          value={this.props.context.fields[this.props.name] ? this.props.context.fields[this.props.name].value : ''}
          onChange={(e) => { this.props.context.handleChange(e, validate) }}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder}
          type={this.props.type}
          id={this.props.id ? this.props.id : this.props.name}
          name={this.props.name} />
      </div>
    );
  }
}

export default props => {
  return (
    <FormContext.Consumer>
      {context => <Input {...props} context={context} />}
    </FormContext.Consumer>
  );
};
