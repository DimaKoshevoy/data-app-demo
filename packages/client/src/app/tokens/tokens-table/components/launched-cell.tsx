import React from 'react';
import { DEFAULT_TIMESTAMP } from '../constants';

export const LaunchedCell = ({ value }: any) => {
  const timeParts = new Date(value * 1000).toLocaleString('en-GB').split(', ');
  const date = timeParts[0];
  const time = timeParts[1];

  return value === DEFAULT_TIMESTAMP ? (
    'No timestamp'
  ) : (
    <div className="whitespace-nowrap text-right ml-auto">
      <div>{time}</div>
      <div>{date}</div>
    </div>
  );
};
