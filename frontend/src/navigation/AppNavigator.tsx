import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Импорт экранов
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BonusesScreen from '../screens/BonusesScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import QuestScreen from '../screens/QuestScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';

// Типы навигации
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Home: undefined;
  Profile: undefined;
  Bonuses: undefined;
  Leaderboard: undefined;
  Achievements: undefined;
  Quests: undefined;
  Marketplace: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Геймифицированная нижняя навигация
const MainTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={color} 
              />;
            case 'Bonuses':
              return <MaterialCommunityIcons 
                name={focused ? 'gift' : 'gift-outline'} 
                size={size} 
                color={color} 
              />;
            case 'Leaderboard':
              return <MaterialCommunityIcons 
                name={focused ? 'trophy' : 'trophy-outline'} 
                size={size} 
                color={color} 
              />;
            case 'Achievements':
              return <Ionicons 
                name={focused ? 'medal' : 'medal-outline'} 
                size={size} 
                color={color} 
              />;
            case 'Profile':
              return <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size} 
                color={color} 
              />;
          }
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Главная' }} 
      />
      <Tab.Screen 
        name="Bonuses" 
        component={BonusesScreen} 
        options={{ title: 'Бонусы' }} 
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen} 
        options={{ title: 'Рейтинг' }} 
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen} 
        options={{ title: 'Достижения' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Профиль' }} 
      />
    </Tab.Navigator>
  );
};

// Основной навигатор с геймификацией
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Регистрация' }} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Quests" 
          component={QuestScreen} 
          options={{ title: 'Квесты' }} 
        />
        <Stack.Screen 
          name="Marketplace" 
          component={MarketplaceScreen} 
          options={{ title: 'Магазин бонусов' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
