import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskStore } from '../stores/TaskStore';

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AddTaskScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [taskText, setTaskText] = useState('');

  const handleAdd = async () => {
    if (taskText.trim()) {
      // 改行で分割して複数のタスクとして追加
      const tasks = taskText.split('\n').filter(task => task.trim());
      for (const task of tasks) {
        await TaskStore.addTask(task.trim());
      }
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="タスクを入力してください（改行で複数入力可能）"
          value={taskText}
          onChangeText={setTaskText}
          autoFocus
        />
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => navigation.goBack()}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>閉じる</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.addButton]} 
            onPress={handleAdd}>
            <Text style={styles.buttonText}>追加</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#007AFF',
  },
}); 