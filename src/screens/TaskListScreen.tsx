import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
 // Start of Selection
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task } from '../types/Task';
// TaskStoreのインポートパスを修正
import { TaskStore } from '../stores/TaskStore';
import { ExplosionEffect } from '../components/ExplosionEffect';
import { AddTaskButton } from '../components/AddTaskButton';

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
};

const TaskItem = ({ task, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [showExplosion, setShowExplosion] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent.trim() !== task.content) {
      onUpdate(task.id, editedContent.trim());
    }
  };

  const handleDelete = () => {
    setShowExplosion(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 500);
  };

  return (
    <View style={styles.taskItem}>
      {isEditing ? (
        <TextInput
          style={styles.taskInput}
          value={editedContent}
          onChangeText={setEditedContent}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <Pressable 
          style={styles.taskText} 
          onPress={() => setIsEditing(true)}>
          <Text>{task.content}</Text>
        </Pressable>
      )}
      <Pressable 
        style={styles.deleteButton}
        onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>爆破</Text>
      </Pressable>
      {showExplosion && (
        <ExplosionEffect 
          onComplete={() => setShowExplosion(false)}
          isCenter={true}
        />
      )}
    </View>
  );
};

export const TaskListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = useCallback(async () => {
    const loadedTasks = await TaskStore.getAllTasks();
    setTasks(loadedTasks);
  }, []);

  // 画面がフォーカスされた時に一覧を更新
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  useEffect(() => {
    // TaskStoreの変更を監視
    TaskStore.addListener(loadTasks);
    return () => {
      TaskStore.removeListener(loadTasks);
    };
  }, [loadTasks]);

  const handleDelete = async (id: string) => {
    await TaskStore.deleteTask(id);
    // TODO: 爆発エフェクトを追加
    loadTasks();
  };

  const handleUpdate = async (id: string, content: string) => {
    await TaskStore.updateTask(id, content);
    loadTasks();
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>TOPに戻る</Text>
      </Pressable>
      <ScrollView style={styles.scrollView}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>スッキリ</Text>
        )}
      </ScrollView>
      <AddTaskButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  homeButton: {
    padding: 10,
    marginTop: 30,
    marginLeft: 10,
  },
  homeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 