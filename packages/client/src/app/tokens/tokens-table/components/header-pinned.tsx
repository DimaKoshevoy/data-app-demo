import React from 'react';
import {SearchIcon, XIcon} from '@heroicons/react/outline';

export const HeaderPinned = ({state, setFilter}: any) => {
  return (
    <div className="m-auto">
      {state.filters.find(({id}: any) => id === 'token')?.value ? (
        <XIcon className="w-5 h-5 text-red-400 hover:text-red-600 cursor-pointer" onClick={() => setFilter('token', undefined)}/>
      ) : (
        <SearchIcon className="h-5 w-5"/>
      )}
    </div>
  );
}

