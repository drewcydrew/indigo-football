import { StyleSheet } from 'react-native';

export const Text = ({ children, style }) => {
  return <Text style={[styles.defaultText, style]}>{children}</Text>;
};

export const View = ({ children, style }) => {
  return <View style={[styles.defaultView, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  defaultText: {
    color: '#000',
    fontSize: 16,
  },
  defaultView: {
    backgroundColor: '#fff',
    padding: 10,
  },
});