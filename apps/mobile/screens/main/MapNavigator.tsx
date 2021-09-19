import * as React from 'react';
import MapStack from './MapStack';
import useTheme from '../../hooks/theme/useTheme';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { IDrawerRoutes } from './drawer/Drawer';
import { DrawerProvider } from './drawer/DrawerContext';

const MainNavigator: React.FC<DrawerScreenProps<IDrawerRoutes, 'MapNavigator'>> = ({
  navigation: drawerNavigation,
}) => {
  const theme = useTheme();
  return (
    <DrawerProvider value={{ openDrawer: () => drawerNavigation.openDrawer() }}>
        <MapStack />
    </DrawerProvider>
  );
};

export default MainNavigator;
