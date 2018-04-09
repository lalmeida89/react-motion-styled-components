import React from 'react';
import styled, { css } from 'styled-components';

export const Button = styled.button`
  border-radius: 3px;
  padding: 0.25em 1em;
  margin: 20px 25px 5px;
  color: white;
  border: 2px solid palevioletred;
  display: inline-block;
  width: 120px;
  height: 90px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }

  ${props =>
    props.qb &&
    css`
      background: url(https://78media.tumblr.com/avatar_6cd39ce25707_128.pnj);
    `};

  ${props =>
    props.wr &&
    css`
      background: url(https://cmgpbpdailydolphin.files.wordpress.com/2016/10/rams-lions-football-jpeg-0a.jpg);
      background-size: cover;
    `};

  ${props =>
    props.rb &&
    css`
      background: url(http://img.bleacherreport.net/img/images/photos/002/640/777/hi-res-186722602-running-back-adrian-peterson-of-the-minnesota-vikings_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top);
      background-size: cover;
    `};

  ${props =>
    props.te &&
    css`
      background: url(https://www.cheatsheet.com/wp-content/uploads/2016/06/Ladarius-Green_Harry-How_Getty-Images-640x489.jpg?x23912);
      background-size: cover;
    `};
`;
