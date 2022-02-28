import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as Permissions from "expo-permissions";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const BACKEND_SERVER = "http://localhost:8000/"
const LOCATION_TRACKING = "location-tracking";

export default function App() {
  const [text, onChangeText] = React.useState("");
  const [startedTracking, setStartedTracking] = React.useState(false);

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log("tracking started?", hasStarted);
  };

  const stopLocationTracking = async () => {
    return await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
  }

  React.useEffect(() => {
    const config = async () => {
      let res = await Permissions.askAsync(Permissions.LOCATION);
      if (res.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };

    config();
  }, []);

  return (
    <View>
      <Text
        style={{
          marginTop: 30,
          marginLeft: 12,
        }}
      >
        Please enter your name and press start
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: !startedTracking ? "black" : "red",
          backgroundColor: !startedTracking ? "white" : "#d8d8d8",
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }}
        onChangeText={onChangeText}
        value={text}
        editable={!startedTracking}
      />
      <Button
        title="Start Tracking"
        onPress={() => {
          axios.post(BACKEND_SERVER + "register", {
            name: text,
          });
          AsyncStorage.setItem('canvas_tracking_name', text);
          startLocationTracking();
          setStartedTracking(true);
        }}
      />
      <Button
        title="Stop Tracking"
        onPress={async () => {
          AsyncStorage.setItem('canvas_tracking_name', "");
          let x = await stopLocationTracking();
          console.log("tracking stopped?", x)
          setStartedTracking(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {},
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    let name = await AsyncStorage.getItem('canvas_tracking_name');

    // HERE is where we will put our server communication logic

    if (name) {
      axios.post(BACKEND_SERVER + "location", {
        name: name,
        latitude: lat,
        longitude: long,
      });
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${lat},${long},${name}`
      );
    }
    
  }
});
