import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {ChevronRightIcon} from '@heroicons/react/outline'
import {ThemeSwitch} from '../theme/theme-switch';
import {useAppSelector} from '../store/hooks';

export const HEADER_HEIGHT = 64;

export const Header = () => {
  const match = useRouteMatch<{address: string}>('/token/:address');
  const address = match?.params?.address;
  const tokenData = useAppSelector(({tokensDataSlice: {dataByAddress}}) => address ? dataByAddress[address] : null);

  console.log()
  return (
    <header>
      <div
        style={{height: HEADER_HEIGHT}}
        className="container mx-auto px-2 flex flex-row justify-between items-center">
        <div className="flex items-center sm:space-x-1">
          <Link to="/" className="text-lg sm:text-xl flex items-center sm:space-x-1">
            <div>Ethereum</div>
            <ChevronRightIcon className="h-4 w-4"/>
            <div>Uniswap2</div>
          </Link>
          {address && tokenData?.tokenName ? (
            <div className="text-lg sm:text-xl flex items-center sm:space-x-1">
              <ChevronRightIcon className="h-4 w-4"/>
              <div>{tokenData.tokenName}</div>
            </div>
          ) : null}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch/>
        </div>
      </div>
    </header>
  )
};
