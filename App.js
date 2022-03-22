import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TextInput, StyleSheet, Button, FlatList, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'rn_sqlite',
});

const App = () => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  console.log(categories);

  const createTables = () => {
    db.transaction((txn) => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log('table created success');
        },
        (error) => {
          console.log('error on creating table' + error.message);
        }
      );
    });
  };

  const addCategory = () => {
    if (!category) {
      alert('Enter category!');

      return false;
    }

    db.transaction((txn) => {
      txn.executeSql(
        `INSERT INTO categories (name) VALUES (?)`,
        [category],
        (sqlTxn, res) => {
          console.log(`${category} category added with success`);

          getCategories();
        },
        (error) => {
          console.log('Error on adding category', error.message);
        }
      );
    });
  };

  const getCategories = () => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM categories ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log('categories retrieved success');

          let len = res.rows.length;

          if (len > 0) {
            let results = [];

            for (i = 0; i < len; i++) {
              let item = res.rows.item(i);

              results.push({ id: item.id, name: item.name });
            }

            setCategories(results);
          }
        },
        (error) => console.log('Error in find category', error.message)
      );
    });
  };

  useEffect(async () => {
    await createTables();

    await getCategories();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="orange" />
      <TextInput
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
      />

      <Button title="REGISTER" onPress={addCategory} />

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: 100,
    paddingHorizontal: 20,
  },
});

export default App;
