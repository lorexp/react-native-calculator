import React from 'react';
import { FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#123',
  },
  value: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'right',
  },
});

export default function History({ history }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={history}
        renderItem={({ item }) => {
          return (
            <Text key={item.key} style={styles.value}>
              {item.history}
            </Text>
          );
        }}
      />
    </SafeAreaView>
  );
}
