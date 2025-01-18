import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { TaskViewScreen } from './src/screens/TaskViewScreen';
import { AddTaskModal } from './src/screens/AddTaskModal';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { TaskStore } from './src/stores/TaskStore';
import { ShakeProvider } from './src/contexts/ShakeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    TaskStore.initialize();
  }, []);

  return (
    <ShakeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TaskView"
            component={TaskViewScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskModal}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ShakeProvider>
  );
} 