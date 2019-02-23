import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Picker,
  Platform,
  ToastAndroid
} from "react-native";
import {
  Gyroscope,
  Accelerometer,
  Magnetometer,
  Constants,
  Location,
  Permissions
} from "expo";
import { TouchableOpacity } from "react-native";
import Values from "./component/Values";
import firebaseApp from "./secrets/firebase";

const UPDATE_TIME = 100;

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
      recording: false,
      location: null,
      locationState: false,
      uploadState: 0
    };
  }
  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      ToastAndroid.show(
        "Cannot access location.\n Please ensure you have the correct device",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      this.setLocation();
    }
  }
  setLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      ToastAndroid.show(
        "Location access not grant.\n This app needs location permissions to work",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    let location = await Location.getCurrentPositionAsync();
    this.setState({ location });
    this.setState({ locationState: true });
  };
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
    Gyroscope.setUpdateInterval(UPDATE_TIME);
    Gyroscope.addListener(this.handleGyroscopeData);
    Accelerometer.setUpdateInterval(UPDATE_TIME);
    Accelerometer.addListener(this.handleAccelerometerData);
    Magnetometer.setUpdateInterval(UPDATE_TIME);
    Magnetometer.addListener(this.handleMagnetometerData);
  };
  componentWillUnmount() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    Magnetometer.removeAllListeners();
  }
  startRecording = () => {
    this.setState({ recording: true, uploadState: 1 });
    this.setLocation();
  };
  stopRecording = () => {
    this.setState({ recording: false });
    const dbRef = firebaseApp
      .database()
      .ref(this.state.selectedEvent)
      .push();
    const { gyroArray, accArray, magnetoArray, location } = this.state;
    dbRef
      .set({
        gyroArray,
        accArray,
        magnetoArray,
        location
      })
      .then(() => {
        this.setState({ uploadState: 2 });
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: `7.5%`, marginLeft: `5%` }}>
          <View style={{ marginTop: "5%" }}>
            {this.state.recording ? (
              <Text style={{ fontSize: 23, color: "green" }}>Recording...</Text>
            ) : (
              <Text style={{ fontSize: 23, color: "red" }}>Not Recording</Text>
            )}
            {this.state.uploadState === 1 ? (
              <Text style={{ fontSize: 19, color: "blue" }}>
                Uploading data to Firebase.
              </Text>
            ) : this.state.uploadState === 2 ? (
              <Text style={{ fontSize: 23, color: "green" }}>
                Uploaded Data to Firebase
              </Text>
            ) : null}
          </View>
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
          {this.state.locationState ? (
            <Text>GPS Found</Text>
          ) : (
            <Text>GPS not found. Please wait a while.</Text>
          )}
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
