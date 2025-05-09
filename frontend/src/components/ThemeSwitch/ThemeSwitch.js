import React, { useEffect } from 'react';
import { Switch } from 'antd';
import styles from './ThemeSwitch.module.css';

export const ThemeSwitch = ({ className }) => {
  const toggleTheme = (checked) => {
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Switch
      onChange={toggleTheme}
      defaultChecked={localStorage.getItem('theme') === 'dark'}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      className={`${styles.themeSwitch} ${className}`}
    />
  );
}; 