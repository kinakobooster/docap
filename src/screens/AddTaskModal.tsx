import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskStore } from '../stores/TaskStore';

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AddTaskModal = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const [taskText, setTaskText] = useState('');

  const handleAdd = async () => {
    if (taskText.trim()) {
      const tasks = taskText.split('\n').filter(task => task.trim());
      for (const task of tasks) {
        await TaskStore.addTask(task.trim());
      }
      // 一覧画面から来た場合は一覧に戻る
      if (route.name === 'TaskList') {
        navigation.navigate('TaskList');
      } else {
        navigation.goBack();
      }
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={() => navigation.goBack()}
    >
      <View style={styles.overlay}>
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
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
    marginTop: height * 0.3, // 画面の30%下からスタート
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