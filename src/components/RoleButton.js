import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const RoleButton = ({ title, filled = false , onPress }) => {
  return (
    <TouchableOpacity
    onPress={onPress}
      style={[
        styles.button,
        filled ? styles.filled : styles.outlined,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          filled ? styles.filledText : styles.outlinedText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    width: '85%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  filled: {
    backgroundColor: COLORS.primary,
  },
  outlined: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  filledText: {
    color: COLORS.white,
  },
  outlinedText: {
    color: COLORS.primary,
  },
});

export default RoleButton;