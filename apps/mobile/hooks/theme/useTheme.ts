import React from 'react';
import { Theme } from './theme';
import ThemeContext from './Context';

const useTheme = (): Theme => React.useContext(ThemeContext);

export default useTheme;