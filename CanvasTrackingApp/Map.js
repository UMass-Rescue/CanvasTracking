import React from "react";
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";
import { StyleSheet,  Dimensions } from "react-native";

const BACKEND_SERVER = "localhost:8000"


var randomColor = Math.floor(Math.random()*16777215).toString(16);

export default function Map(props) {   
    
    
    const [points, setPoints] = React.useState([]);

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
          };
    }, [])



    return (
        <>
            <MapView style={styles.map}>
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