import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task } from '../types/Task';
import { TaskStore } from '../stores/TaskStore';
import { ExplosionEffect } from '../components/ExplosionEffect';
import { AddTaskButton } from '../components/AddTaskButton';

// ネイティブプラットフォームの場合のみNotificationsをインポート
const Notifications = Platform.OS !== 'web' 
  ? require('expo-notifications')
  : null;

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_FONT_SIZE = 100;
const MIN_FONT_SIZE = 24;

export const TaskViewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);
  const textRef = useRef<Text>(null);

  const loadRandomTask = async () => {
    const task = await TaskStore.getRandomTask();
    setCurrentTask(task);
    if (task) {
      scheduleNotification();
    }
  };

  const scheduleNotification = async () => {
    if (Platform.OS === 'web') {
      // Web向けの通知処理
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('できた？', {
            body: '30分経過しました。タスクは完了しましたか？',
          });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('できた？', {
                body: '30分経過しました。タスクは完了しましたか？',
              });
            }
          });
        }
      }, 30 * 60 * 1000); // 30分
    } else if (Notifications) {
      // ネイティブ向けの通知処理
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'できた？',
          body: '30分経過しました。タスクは完了しましたか？',
        },
        trigger: {
          seconds: 30 * 60, // 30分
        },
      });
    }
  };

  const handleComplete = async () => {
    if (currentTask) {
      setShowExplosion(true);
      setTimeout(async () => {
        await TaskStore.deleteTask(currentTask.id);
        navigation.navigate('Home');
      }, 500);
    }
  };

  const handleBreak = async () => {
    if (currentTask) {
      const taskToDelete = currentTask.id;
      
      // TaskStoreのリスナーを設定
      const onTaskAdded = async () => {
        await TaskStore.deleteTask(taskToDelete);
        TaskStore.removeListener(onTaskAdded);
        // タスク追加後、TOPに戻る（モーダルは自動的に閉じる）
        navigation.navigate('Home');
      };
      
      // リスナーを追加してからナビゲーション
      TaskStore.addListener(onTaskAdded);
      navigation.navigate('AddTask');
    }
  };

  const handleChange = () => {
    setCurrentTask({ content: 'やれ！' } as Task);
    setTimeout(() => {
      setCurrentTask(currentTask); // 元のタスクに戻す
    }, 500);
  };

  const measureText = () => {
    if (textRef.current && currentTask) {
      let testSize = MAX_FONT_SIZE;
      const text = currentTask.content;
      const maxWidth = SCREEN_WIDTH - 40; // padding分を引く

      // 文字数から概算のフォントサイズを計算
      const estimatedSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, 
        Math.floor(maxWidth / (text.length * 0.7))));
      
      setFontSize(estimatedSize);
    }
  };

  useEffect(() => {
    loadRandomTask();
  }, []);

  useEffect(() => {
    if (currentTask) {
      measureText();
    }
  }, [currentTask?.content]);

  if (!currentTask) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>タスクがありません</Text>
        <Pressable 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>TOPに戻る</Text>
        </Pressable>
        <View style={styles.addButtonContainer}>
          <AddTaskButton />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.taskContainer}>
        <Text 
          ref={textRef}
          style={[styles.taskText, { fontSize }]}
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          {currentTask.content}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>終わった</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleBreak}>
          <Text style={styles.buttonText}>砕く</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleChange}>
          <Text style={styles.buttonText}>チェンジ</Text>
        </Pressable>
      </View>
      <AddTaskButton />
      {showExplosion && (
        <ExplosionEffect 
          onComplete={() => setShowExplosion(false)}
          position={{ x: SCREEN_WIDTH / 2, y: SCREEN_WIDTH / 2 }}
          isCenter
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  taskText: {
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 100,
    height: 300,
    margin: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
  homeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
}); 