import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MeasureWindow } from 'payload/components';
import { MeasureScroll } from 'payload/components';
import { LoadContent } from 'payload/components';

import '../scss/app.css';

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <React.Fragment>
            <MeasureScroll />
            <MeasureWindow />
            <LoadContent />
            {this.props.children}
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
