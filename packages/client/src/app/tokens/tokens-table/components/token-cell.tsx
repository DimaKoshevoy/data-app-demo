import { InformationCircleIcon } from '@heroicons/react/outline';
import { AddressCopy } from './address-copy';
import React from 'react';

export const TokenCell = ({ value }: any) => {
  const { address, name, symbol, unlockedLP } = value;
  const explorer = (
    <a
      target="_blank"
      rel="noreferrer"
      href={`https://etherscan.com/token/${address}`}
    >
      <InformationCircleIcon className="h-4 w-4 relative top-px ml-1" />
    </a>
  );
  return (
    <div className="truncate">
      <div className="whitespace-nowrap font-medium">{name}</div>
      <div className="flex">
        <div>{symbol}</div> {explorer}
        <AddressCopy address={address} />{' '}
        <div className="ml-1">{unlockedLP}</div>
      </div>
    </div>
  );
};
