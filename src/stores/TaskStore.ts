import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const STORAGE_KEY = '@docap_tasks';

type TaskStoreListener = () => void;

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export class TaskStore {
  private static tasks: Task[] = [];
  private static listeners: TaskStoreListener[] = [];

  static async initialize() {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    } catch (error) {
      console.error('タスクの読み込みに失敗しました:', error);
    }
  }

  private static async save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
      this.notifyListeners();
    } catch (error) {
      console.error('タスクの保存に失敗しました:', error);
    }
  }

  static addListener(listener: TaskStoreListener) {
    this.listeners.push(listener);
  }

  static removeListener(listener: TaskStoreListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  static async addTask(content: string) {
    const task: Task = {
      id: generateId(),
      content,
      createdAt: Date.now(),
    };
    this.tasks.push(task);
    await this.save();
  }

  static async deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    await this.save();
  }

  static async getRandomTask(): Promise<Task | null> {
    if (this.tasks.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.tasks.length);
    return this.tasks[randomIndex];
  }

  static async getAllTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  static async updateTask(id: string, content: string) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        content,
      };
      await this.save();
    }
  }
} 