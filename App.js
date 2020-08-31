import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Theater from "./Theater";
import Seat from "./Seat";

export default function App() {
  return (
    <View style={styles.container}>
      <Theater />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
