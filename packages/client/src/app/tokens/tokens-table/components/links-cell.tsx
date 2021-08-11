import {Link} from 'react-router-dom';
import {ChartBarIcon} from '@heroicons/react/outline';
import React from 'react';

export const LinksCell = ({row}: any) => {
  return (
    <div className="flex justify-center space-x-3 m-auto">
      <Link to={`/token/${row.values.tokenAddress}`}>
        <ChartBarIcon className="h-6 w-6"/>
      </Link>
    </div>
  );
}
