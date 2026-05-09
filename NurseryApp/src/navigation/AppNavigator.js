import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import AIHubScreen from '../screens/AIHubScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import AIChatScreen from '../screens/AIChatScreen';
import PlantFinderScreen from '../screens/PlantFinderScreen';
import WishlistScreen from '../screens/WishlistScreen';
import BlogScreen from '../screens/BlogScreen';

import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function TabIcon({ name, focused, cartCount }) {
  const icons = {
    Home:    { active: '🏡', inactive: '🏠' },
    Shop:    { active: '🌿', inactive: '🌱' },
    AI:      { active: '🤖', inactive: '🤖' },
    Cart:    { active: '🛒', inactive: '🛒' },
    Profile: { active: '👤', inactive: '👤' },
  };
  const icon = icons[name];
  return (
    <View style={{ position: 'relative' }}>
      <Text style={{ fontSize: 22 }}>{focused ? icon?.active : icon?.inactive}</Text>
      {name === 'Cart' && cartCount > 0 && (
        <View style={{
          position: 'absolute', top: -4, right: -8,
          backgroundColor: colors.coral, borderRadius: 8, minWidth: 16, height: 16,
          justifyContent: 'center', alignItems: 'center',
        }}>
          <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
        </View>
      )}
    </View>
  );
}

function Tabs() {
  const { cartCount } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} cartCount={cartCount} />,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : Platform.OS === 'web' ? 60 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="AI" component={AIHubScreen} options={{ tabBarLabel: 'AI Hub' }} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, presentation: 'card' }}>
        <RootStack.Screen name="Main" component={Tabs} />
        <RootStack.Screen name="PlantDetail" component={PlantDetailScreen} />
        <RootStack.Screen name="AIChat" component={AIChatScreen} />
        <RootStack.Screen name="PlantFinder" component={PlantFinderScreen} />
        <RootStack.Screen name="Wishlist" component={WishlistScreen} />
        <RootStack.Screen name="Blog" component={BlogScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
