import React from 'react';
import { Loader } from './loader';

export const LoadingOverlay = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader width={64} height={64} fill="#9CA3AF" />
  </div>
);
