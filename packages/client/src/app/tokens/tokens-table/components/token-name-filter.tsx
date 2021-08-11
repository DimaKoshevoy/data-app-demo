import React, { useCallback, useState, useEffect } from 'react';
import { debounce } from 'lodash';

const DEBOUNCE = 500;

export const TokenNameFilter = ({
  column: { preFilteredRows, setFilter, filterValue },
}: any) => {
  const [value, setValue] = useState();
  const count = preFilteredRows.length;

  const debouncedSetFilter = useCallback(
    debounce((value) => {
      setFilter(value || undefined);
    }, DEBOUNCE),
    []
  ); //eslint

  const onChange = (e: any) => {
    setValue(e.target.value || undefined);
    debouncedSetFilter(e.target.value || undefined);
  };

  useEffect(() => {
    setValue(filterValue);
  }, [filterValue]);

  return (
    <div className="flex w-full">
      <input
        className="w-full appearance-none bg-transparent border-none focus:outline-none"
        value={value || ''}
        onChange={onChange}
        placeholder={`Top ${count} tokens by hourly volume..`}
      />
    </div>
  );
};
