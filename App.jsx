import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import * as SQLite from 'expo-sqlite';

// componentes
import Row from './components/Row';
import Button from './components/Button';
import History from './components/History';

// criacao do sqlite
const db = SQLite.openDatabase('db.test');

// estilo dos componentes
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    justifyContent: 'flex-end',
    flex: 1,
  },
  value: {
    color: '#fff',
    fontSize: 40,
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 10,
  },
});

// valores iniciais
const initialState = {
  currentValue: '0',
  operator: null,
  previousValue: null,
};

// funcao principal
export default function App() {
  const [state, setState] = useState(initialState);
  const [historyData, setHistoryData] = useState([]);

  // funcao que busca no banco de dados os valores salvos
  const loadHistory = async () => {
    db.transaction((t) => {
      t.executeSql('select * from histories', [], (_, { rows: { _array } }) =>
        setHistoryData(_array)
      );
    });
  };

  // funcao para persistir o historico no banco de dados
  const saveHistory = async (history) => {
    db.transaction((t) => {
      t.executeSql(
        'insert into histories (history) values (?);',
        [history],
        (_, resultSet) => console.log(resultSet),
        (_, error) => console.log(error)
      );
    });

    // busca os novos valores e salva no estado
    loadHistory();
  };

  const handleNumber = (value) => {
    const { currentValue } = state;

    let newCurrentValue = '';
    if (value === 0 && currentValue === '0') {
      newCurrentValue = currentValue;
    } else if (currentValue === '0') {
      newCurrentValue = `${value}`;
    } else {
      newCurrentValue = `${currentValue}${value}`;
    }
    return setState((prevState) => ({
      ...prevState,
      currentValue: newCurrentValue,
    }));
  };

  const handleEqual = () => {
    const { currentValue, previousValue, operator } = state;
    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    const resetState = {
      operator: null,
      previousValue: null,
    };

    let result = 0;
    let history = '';
    switch (operator) {
      case '/':
        result = previous / current;
        history = `${previous} ${operator} ${current} = ${result}`;
        break;

      case '*':
        result = previous * current;
        history = `${previous} ${operator} ${current} = ${result}`;
        break;

      case '-':
        result = previous - current;
        history = `${previous} ${operator} ${current} = ${result}`;
        break;

      case '+':
        result = previous + current;
        history = `${previous} ${operator} ${current} = ${result}`;
        break;

      default:
        result = current;
    }

    if (history !== '') {
      saveHistory(history);
    }

    return setState({
      ...resetState,
      currentValue: result,
      history,
    });
  };

  const calculator = (type, value) => {
    switch (type) {
      case 'number':
        return handleNumber(value);
      case 'operator':
        return setState((prevState) => ({
          operator: value,
          previousValue: prevState.currentValue,
          currentValue: '0',
        }));
      case 'equal':
        return handleEqual();
      case 'clear':
        return setState(initialState);
      default:
        return null;
    }
  };

  const handleTap = (type, value) => {
    return calculator(type, value);
  };

  useEffect(() => {
    db.transaction(
      (t) => {
        t.executeSql(
          'create table if not exists histories (id integer primary key autoincrement, history text);'
        );
      },
      (error) => console.log('error', error),
      () => console.log('criado com sucesso')
    );
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <History history={historyData} />
      <StatusBar barStyle='light-content' />
      <SafeAreaView>
        <Text style={styles.value}>
          {parseFloat(state.currentValue).toLocaleString()}
        </Text>
        <Row />
        <Row>
          <Button text='7' onPress={() => handleTap('number', 7)} />
          <Button text='8' onPress={() => handleTap('number', 8)} />
          <Button text='9' onPress={() => handleTap('number', 9)} />
          <Button
            text='/'
            theme='accent'
            onPress={() => handleTap('operator', '/')}
          />
        </Row>

        <Row>
          <Button text='4' onPress={() => handleTap('number', 4)} />
          <Button text='5' onPress={() => handleTap('number', 5)} />
          <Button text='6' onPress={() => handleTap('number', 6)} />
          <Button
            text='x'
            theme='accent'
            onPress={() => handleTap('operator', '*')}
          />
        </Row>

        <Row>
          <Button text='1' onPress={() => handleTap('number', 1)} />
          <Button text='2' onPress={() => handleTap('number', 2)} />
          <Button text='3' onPress={() => handleTap('number', 3)} />
          <Button
            text='-'
            theme='accent'
            onPress={() => handleTap('operator', '-')}
          />
        </Row>

        <Row>
          <Button
            text='0'
            size='accent'
            onPress={() => handleTap('number', 0)}
          />
          <Button
            text='C'
            theme='secondary'
            onPress={() => handleTap('clear')}
          />
          <Button text='=' theme='accent' onPress={() => handleTap('equal')} />
          <Button
            text='+'
            theme='accent'
            onPress={() => handleTap('operator', '+')}
          />
        </Row>
      </SafeAreaView>
    </View>
  );
}
