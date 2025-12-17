import { useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

const ThemeApplier = () => {
  useThemeColors(); // This hook applies the theme
  return null;
};

export default ThemeApplier;
