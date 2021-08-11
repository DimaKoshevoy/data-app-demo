import { writeStorage, useLocalStorage } from '@rehooks/local-storage';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const useTheme = () => {
  const [theme] = useLocalStorage<String>('theme', THEMES.DARK);

  const toggleTheme = () => {
    if (theme === THEMES.DARK) {
      writeStorage('theme', THEMES.LIGHT);
      document.documentElement.classList.remove(THEMES.DARK);
    } else {
      writeStorage('theme', THEMES.DARK);
      document.documentElement.classList.add(THEMES.DARK);
    }
  };

  return { theme, toggleTheme };
};
