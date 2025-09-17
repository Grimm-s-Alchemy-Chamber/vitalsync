import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage<boolean | null>('darkMode', null);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const isDark = darkMode === true || (darkMode === null && systemPrefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [darkMode, systemPrefersDark]);

  const toggleDarkMode = () => {
    if (darkMode === null) {
      // If no preference is set, toggle opposite of system preference
      setDarkMode(!systemPrefersDark);
    } else {
      // Toggle current setting
      setDarkMode(!darkMode);
    }
  };

  const currentDarkMode = darkMode === true || (darkMode === null && systemPrefersDark);

  return [currentDarkMode, toggleDarkMode] as const;
}