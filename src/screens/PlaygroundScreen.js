import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import React, { useRef, useState } from 'react';




/* Animated press wrapper */
const AnimatedPress = ({ children, style, activeStyle, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const pressIn = () => {
    setPressed(true);
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setPressed(false));
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={[
          style,
          pressed && activeStyle,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};


const PlaygroundScreen = () => {
   const [count, setCount] = useState(0)
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
     

      <Text style={styles.header}>PlaygroundScreen</Text>
       <AnimatedPress
        style= {styles.button}
        activeStyle={{ backgroundColor: 'silver', borderColor: 'white' }}
        onPress={() => navigation.replace('Student')}
        >

          <Text style={styles.boxText}>Testing </Text>
        </AnimatedPress>

        
    </View>

    
  );
};


export default PlaygroundScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'hwb(0, 0%, 100%)',
  },
  header: {    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop:15    
  },
  
  button: {    
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop:18,
    borderRadius: 20,
    padding: 10,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 12,
    borderWidth: 2,
    borderColor: 'transparent',

  },
  boxText: {
    color: 'black',
    padding:16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
})





 