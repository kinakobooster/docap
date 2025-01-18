import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddTaskButton } from '../components/AddTaskButton';

type RootStackParamList = {
  Home: undefined;
  TaskView: undefined;
  AddTask: undefined;
  TaskList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const hatAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 少し待ってからアニメーション開始
      Animated.delay(100),
      // 上に跳ねる
      Animated.spring(hatAnimation, {
        toValue: -30,
        useNativeDriver: true,
        speed: 1,
        bounciness: 12,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.hat,
          {
            transform: [{ translateY: hatAnimation }]
          }
        ]}>
        🎩
      </Animated.Text>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('TaskView')}>
          <Text style={styles.buttonText}>
            引く
          </Text>
        </Pressable>
        <Pressable 
          style={styles.button} 
          onPress={() => navigation.navigate('AddTask')}>
          <Text style={styles.buttonText}>入れる</Text>
        </Pressable>
        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('TaskList')}>
          <Text style={styles.buttonText}>
            一覧
          </Text>
        </Pressable>
      </View>
      <AddTaskButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hat: {
    fontSize: 72,
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 