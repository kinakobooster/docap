import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useShake } from '../contexts/ShakeContext';

type Particle = {
  animation: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
  rotate: Animated.Value;
  color: string;
  size: number;
  delay: number;
  distance: number;
};

type Props = {
  onComplete: () => void;
  position?: { x: number; y: number };
  isCenter?: boolean;
};

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9999'];
const PARTICLE_COUNT = 50;

const { width, height } = Dimensions.get('window');

export const ExplosionEffect = ({ onComplete, position, isCenter }: Props) => {
  const { shake } = useShake();
  const centerX = isCenter ? width / 2 : (position ? position.x : width / 2);
  const centerY = isCenter ? height / 2 : (position ? position.y : height / 2);

  const particles: Particle[] = Array(PARTICLE_COUNT).fill(0).map(() => ({
    animation: new Animated.Value(0),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    scale: new Animated.Value(8),
    rotate: new Animated.Value(0),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 5 + 10,
    delay: isCenter ? Math.random() * 200 : Math.random() * 4000,
    distance: isCenter ? Math.random() * 500 + 200 : Math.random() * 1000 + 5000,
  }));

  useEffect(() => {
    shake(); // 画面全体を揺らす

    const particleAnimations = particles.map((particle) => 
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.parallel([
          Animated.timing(particle.animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateX, {
            toValue: (Math.random() - 0.5) * 2 * particle.distance,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: (Math.random() - 0.5) * 2 * particle.distance,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 6000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.rotate, {
            toValue: 360 * (Math.random() * 2 + 1),
            duration: 8000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    Animated.parallel(particleAnimations).start(() => {
      onComplete();
    });
  }, []);

  return (
    <View style={styles.explosionContainer}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.animation,
              left: centerX,
              top: centerY,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
                {
                  rotate: particle.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  explosionContainer: {
    position: 'absolute',
    width: width,
    height: height,
    left: 0,
    top: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: 999,
  },
}); 