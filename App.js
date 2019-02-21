import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Gyroscope, Accelerometer, Magnetometer } from "expo";
import { Button } from "react-native";
import Values from "./component/Values";

class Gyro extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0
  };
  componentDidMount() {
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener(data => {
      this.setState(data);
    });
  }
  componentWillUnmount() {
    Gyroscope.removeAllListeners();
  }
  render() {
    const { x, y, z } = this.state;
    return <Values x={x} y={y} z={z} sensorName="GyroScope" />;
  }
}

class Accelero extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0
  };
  componentDidMount() {
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener(data => {
      this.setState(data);
    });
  }
  componentWillUnmount() {
    Accelerometer.removeAllListeners();
  }
  render() {
    const { x, y, z } = this.state;
    return <Values x={x} y={y} z={z} sensorName="Accelerometer" />;
  }
}
class Magneto extends Component {
  state = {
    x: 0,
    y: 0,
    z: 0
  };
  componentDidMount() {
    Magnetometer.setUpdateInterval(100);
    Magnetometer.addListener(data => {
      this.setState(data);
    });
  }
  componentWillUnmount() {
    Magnetometer.removeAllListeners();
  }
  render() {
    const { x, y, z } = this.state;
    return <Values x={x} y={y} z={z} sensorName="Magnetometer" />;
  }
}

export default class App extends React.Component {
  startRecording = () => {};
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: `7.5%`, marginLeft: `5%` }}>
          <Gyro />
          <Accelero />
          <Magneto />
          <View style={{ flexDirection: "row" }}>
            <Button>Start Recording Sensor Data</Button>
            <Button>Stop Recording Sensor Data</Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
