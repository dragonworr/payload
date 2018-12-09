import React, { Component } from 'react';
import { Form, Input } from 'payload/components';

class Filter extends Component {
  render() {
    return (
      <Form className="filter">
        <Input placeholder="Search" type="text" name="keywords" />
      </Form>
    );
  }
}

export default Filter;
