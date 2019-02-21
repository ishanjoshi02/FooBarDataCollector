import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Picker } from "react-native";
import { Gyroscope, Accelerometer, Magnetometer } from "expo";
import { TouchableOpacity } from "react-native";
import Values from "./component/Values";
import firebaseApp from "./secrets/firebase";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gyro: {
        x: 0,
        y: 0,
        z: 0
      },
      acc: {
        x: 0,
        y: 0,
        z: 0
      },
      magneto: {
        x: 0,
        y: 0,
        z: 0
      },
      gyroArray: [],
      accArray: [],
      magnetoArray: [],
      events: ["Pothole", "Normal Road", "SpeedBreaker"],
      selectedEvent: "Pothole",
      recording: false
    };
  }
  handleGyroscopeData = data => {
    const { x, y, z } = data;
    this.setState({ gyro: { x, y, z } });
    if (this.state.recording) {
      let { gyroArray } = this.state;
      gyroArray.push({ x, y, z });
      this.setState({ gyroArray });
    }
  };
  handleAccelerometerData = data => {
    const { x, y, z } = data;
    this.setState({ acc: { x, y, z } });
    if (this.state.recording) {
      let { accArray } = this.state;
      accArray.push({ x, y, z });
      this.setState({
        accArray
      });
    }
  };
  handleMagnetometerData = data => {
    const { x, y, z } = data;
    this.setState({ magneto: { x, y, z } });
    if (this.state.recording) {
      let { magnetoArray } = this.state;
      magnetoArray.push({ x, y, z });
      this.setState({
        magnetoArray
      });
    }
  };
  componentDidMount = () => {
    Gyroscope.setUpdateInterval(100);
    Gyroscope.addListener(this.handleGyroscopeData);
    Accelerometer.setUpdateInterval(100);
    Accelerometer.addListener(this.handleAccelerometerData);
    Magnetometer.setUpdateInterval(100);
    Magnetometer.addListener(this.handleMagnetometerData);
  };
  componentWillUnmount() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    Magnetometer.removeAllListeners();
  }
  startRecording = () => {
    this.setState({ recording: true });
  };
  stopRecording = () => {
    this.setState({ recording: false });
    const dbRef = firebaseApp
      .database()
      .ref(this.state.selectedEvent)
      .push();
    const { gyroArray, accArray, magnetoArray } = this.state;
    dbRef.set({
      gyroArray,
      accArray,
      magnetoArray
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: `7.5%`, marginLeft: `5%` }}>
          {this.state.recording ? (
            <Text style={{ fontSize: 23 }}>Recording...</Text>
          ) : (
            <Text style={{ fontSize: 23, color: "red" }}>Not Recording</Text>
          )}
          <Picker
            selectedValue={this.state.selectedEvent}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedEvent: itemValue })
            }
          >
            {this.state.events.map((val, i) => (
              <Picker.Item key={i} label={val} value={val} />
            ))}
          </Picker>
          <Values
            x={this.state.gyro.x}
            y={this.state.gyro.y}
            z={this.state.gyro.z}
            sensorName="GyroScope"
          />
          <Values
            x={this.state.acc.x}
            y={this.state.acc.y}
            z={this.state.acc.z}
            sensorName="Accelerometer"
          />
          <Values
            x={this.state.magneto.x}
            y={this.state.magneto.y}
            z={this.state.magneto.z}
            sensorName="Magnetometer"
          />
          <TouchableOpacity
            onPress={this.startRecording}
            style={{
              marginTop: "5%",
              marginRight: "5%",
              padding: "2.5%",
              backgroundColor: "#333333"
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.stopRecording}
            style={{
              marginTop: "5%",
              marginRight: "5%",
              padding: "2.5%",
              backgroundColor: "#333333"
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Stop</Text>
          </TouchableOpacity>
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
