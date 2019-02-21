import React from "react";
import { StyleSheet, Text, View } from "react-native";
function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}
const Values = ({ x, y, z, sensorName }) => {
  return (
    <View>
      <Text>{sensorName}</Text>
      <Text>{round(x)}</Text>
      <Text>{round(y)}</Text>
      <Text>{round(z)}</Text>
    </View>
  );
};

export default Values;
