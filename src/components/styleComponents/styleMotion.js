import React from 'react';
import styled, { css } from 'styled-components';
import { Motion, spring } from 'react-motion';

export const StyleMotion = styled(Motion)`
  &&& {
    border-radius: 15px;
    font-weight: bold;
    margin-left: 100px;
  }
`;
