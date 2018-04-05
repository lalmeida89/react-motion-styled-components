import React from 'react';
import styled, { css } from 'styled-components';

export const Button = styled.button`
  border-radius: 3px;
  padding: 0.25em 1em;
  margin: 0 1em;
  color: palevioletred;
  border: 2px solid palevioletred;
  display: block;
  margin: auto;
  width: 150px;

  ${props =>
    props.primary &&
    css`
      color: white;
    `};
`;
