import styled, { css } from 'styled-components';

export const Button = styled.button`
  border-radius: 8px;
  padding: 0.25em 1em;
  margin: 20px 25px 5px;
  color: white;
  border: 2px solid #34423a;
  display: inline-block;
  font-size: 22px;
  font-family: 'Reem Kufi', sans-serif;
  width: 120px;
  height: 90px;
  opacity: 0.6;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  &:hover {
    opacity: 1;
  }

  ${props =>
    props.qb &&
    css`
      background: url(https://cdnph.upi.com/svc/sv/upi/9961472231234/2016/1/0512e46942365bdb04c22b78fc5165cf/Fantasy-Football-2016-Top-50-quarterback-rankings-led-by-Aaron-Rodgers.jpg);
      background-size: cover;
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
      background: url(https://www.ocregister.com/wp-content/uploads/2019/01/CHARGERS_HENRY_FOOTBALL_28010459-1.jpg?w=523);
      background-size: cover;
    `};

  ${props =>
    props.reload &&
    css`
      width: 100px;
      height: 40px;
      background-color: black;
      font-size: 14px;
    `};
`;
