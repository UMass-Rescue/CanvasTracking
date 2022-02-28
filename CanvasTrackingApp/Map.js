import React from "react";
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import { StyleSheet,  Dimensions } from "react-native";

const BACKEND_SERVER = "localhost:8000"


var randomColor = Math.floor(Math.random()*16777215).toString(16);
function getMiddle(prop, markers) {
    let values = markers.map(m => m[prop]);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (prop === 'longitude' && (max - min > 180)) {
      values = values.map(val => val < max - 180 ? val + 360 : val);
      min = Math.min(...values);
      max = Math.max(...values);
    }
    let range = max - min;
    let result = (min + max) / 2;
    if (prop === 'longitude' && result > 180) {
      result -= 360
    }
    return [result, range];
  }
  
  function findCenter(markers) {
    let [latitude, latitudeRange] = getMiddle('latitude', markers);
    let [longitude, longitudeRange] = getMiddle('longitude', markers);
    return {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeRange || 0.01,
      longitudeDelta: longitudeRange || 0.01,
    }
  }

export default function Map(props) {   
    
    
    const [points, setPoints] = React.useState([]);
    const [region, setRegion] = React.useState({
        "latitude": 0,
        "latitudeDelta": .01,
        "longitude": 0,
        "longitudeDelta": .01,
      });

    var colors = {}

    React.useEffect(()=>{
        var ws = new WebSocket(`ws://${BACKEND_SERVER}/investigator_locations/`);
        ws.onmessage = (e) => {
            // a message was received
            const data = JSON.parse(e.data).entries
            setPoints(data);
            
            for (const point in data) {
                if (data[point].name in colors) {} 
                else {
                    colors[data[point].name] = randomColor;
                }
              }

              setRegion(findCenter(data))
          };
    }, [])



    return (
        <>
            <MapView region={region} style={styles.map}>
            {
                points.map((point, index)=>{
                    return <Marker 
                    key={index} 
                    title={point.name} 
                    coordinate={point}
                    pinColor={colors[point.name]}
                    />
                })
            }
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height / 2,
    },
  });