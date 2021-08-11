import React from 'react';
import { useTheme, THEMES } from './useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  const Icon = theme === THEMES.DARK ? SunIcon : MoonIcon;

  return <Icon onClick={toggleTheme} className="clickable h-7 h-7" />;
};
