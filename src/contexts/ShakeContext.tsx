import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

type ShakeContextType = {
  shake: () => void;
};

const ShakeContext = createContext<ShakeContextType>({ shake: () => {} });

export const useShake = () => useContext(ShakeContext);

export const ShakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const createShakeAnimation = (value: Animated.Value, range: number) =>
    Animated.sequence([
      ...Array(8).fill(0).map(() => 
        Animated.sequence([
          Animated.timing(value, {
            toValue: range,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: -range,
            duration: 50,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.timing(value, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);

  const shake = () => {
    Animated.parallel([
      createShakeAnimation(shakeX, 20),
      createShakeAnimation(shakeY, 15),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        ...Array(4).fill(0).map(() =>
          Animated.sequence([
            Animated.timing(rotate, {
              toValue: 2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(rotate, {
              toValue: -2,
              duration: 100,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <ShakeContext.Provider value={{ shake }}>
      <Animated.View
        style={{
          flex: 1,
          transform: [
            { translateX: shakeX },
            { translateY: shakeY },
            { scale },
            {
              rotate: rotate.interpolate({
                inputRange: [-2, 2],
                outputRange: ['-2deg', '2deg'],
              }),
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </ShakeContext.Provider>
  );
}; 