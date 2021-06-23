import React, { useState } from "react";
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from "react-native";

import Row from "./components/Row";
import Button from "./components/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end",
  },
  value: {
    color: "#fff",
    fontSize: 40,
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10,
  },
});

export default function App() {
  const [state, setState] = useState({
    currentValue: 0,
    operator: null,
    previousValue: null,
    history: "",
  });

  const handleNumber = (value) => {
    return setState((prevState) => ({
      ...prevState,
      currentValue: `${prevState.currentValue}${value}`,
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

    switch (operator) {
      case "/":
        result = previous / current;
        break;

      case "*":
        result = previous * current;
        break;

      case "-":
        result = previous - current;
        break;

      case "+":
        result = previous + current;
        break;

      default:
        result = current;
    }

    return setState({
      ...resetState,
      currentValue: result,
    });
  };

  const calculator = (type, value) => {
    switch (type) {
      case "number":
        return handleNumber(value);
      case "operator":
        return setState((prevState) => ({
          operator: value,
          previousValue: prevState.currentValue,
          currentValue: 0,
        }));
      case "equal":
        return handleEqual();
      case "clear":
        return setState({
          currentValue: 0,
          operator: null,
          previousValue: null,
        });
      default:
        return null;
    }
  };

  const handleTap = (type, value) => {
    return calculator(type, value);
  };

  console.log(state);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Text style={styles.value}>
          {parseFloat(state.currentValue).toLocaleString()}
        </Text>
        <Row />
        <Row>
          <Button text="7" onPress={() => handleTap("number", 7)} />
          <Button text="8" onPress={() => handleTap("number", 8)} />
          <Button text="9" onPress={() => handleTap("number", 9)} />
          <Button
            text="/"
            theme="accent"
            onPress={() => handleTap("operator", "/")}
          />
        </Row>

        <Row>
          <Button text="4" onPress={() => handleTap("number", 4)} />
          <Button text="5" onPress={() => handleTap("number", 5)} />
          <Button text="6" onPress={() => handleTap("number", 6)} />
          <Button
            text="x"
            theme="accent"
            onPress={() => handleTap("operator", "*")}
          />
        </Row>

        <Row>
          <Button text="1" onPress={() => handleTap("number", 1)} />
          <Button text="2" onPress={() => handleTap("number", 2)} />
          <Button text="3" onPress={() => handleTap("number", 3)} />
          <Button
            text="-"
            theme="accent"
            onPress={() => handleTap("operator", "-")}
          />
        </Row>

        <Row>
          <Button
            text="0"
            size="accent"
            onPress={() => handleTap("number", 0)}
          />
          <Button
            text="C"
            theme="secondary"
            onPress={() => handleTap("clear")}
          />
          <Button text="=" theme="accent" onPress={() => handleTap("equal")} />
          <Button
            text="+"
            theme="accent"
            onPress={() => handleTap("operator", "+")}
          />
        </Row>
      </SafeAreaView>
    </View>
  );
}
