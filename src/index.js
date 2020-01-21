import React from 'react';
import { render } from 'react-dom';
import App from './components/app';

import './index.css';

const target = document.querySelector('#root');

render(
      <div>
        <App />
      </div>,
  target
);
