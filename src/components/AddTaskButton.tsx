import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AddTaskButton = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable 
      style={styles.addButton}
      onPress={() => navigation.navigate('AddTask')}>
      <Text style={styles.addButtonText}>＋</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
}); 