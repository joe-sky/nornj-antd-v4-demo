import React from 'react';

export const AppLink: React.FC<{ showText: boolean }> = props => (
  <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
    <if condition={props.showText}>Learn React</if>
  </a>
);
