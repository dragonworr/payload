import React from 'react';
import { render } from 'react-dom';
import { App } from 'payload/components';
import Routes from './components/Routes';
import store from './store';

import config from '../payload.config.js';

import Page from '../Page/Page.config';
import pageViews from '../Page/components';

import Order from '../Order/Order.config';
import orderViews from '../Order/components';

const views = {
  orders: orderViews,
  pages: pageViews
};

const collections = {
  orders: Order,
  pages: Page
}

const Index = () => {
  return (
    <App store={store} collections={collections} config={config}>
      <Routes views={views} />
    </App>
  );
};

render(<Index />, document.getElementById('app'));
