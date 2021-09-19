import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Region, MapEvent, Marker} from 'react-native-maps';
import places from "./places.json";


let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

const Toronto: Region = {latitude:43.651070, longitude:-79.347015, latitudeDelta:0.9, longitudeDelta: 0.9 }

type Place = typeof places[0];

export type MarkerData = Place | null

interface IMapProps {
  onMarkerPress?: (marker: MarkerData) => void
  onMapPress?: () => void
}

export const styles = StyleSheet.create({
    container: {
         flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    map: {
        width: deviceWidth,
        height: deviceHeight,
    },
    backdrop: {
     backgroundColor: "#A0A0A0",
    },
    modal: {
        flex: 1, textAlign: 'center'
    },
    upContainer: {},
    hookContainer: {},
    hook: {}
})

const Map: React.FunctionComponent<IMapProps> = ({ onMarkerPress, onMapPress}) => {
     function onPress(
    event: MapEvent<{action: "marker-press"; id: string;}>,
    data: MarkerData
  ): void {
    // this is needed so Mapview.onPress is not also triggered
    // which happens on iOS
    // see: https://github.com/react-native-maps/react-native-maps/issues/1689
    event.stopPropagation();
    if (onMarkerPress !== undefined) {
      onMarkerPress(data);
    }    
  } 
  return (
    <View style={styles.container}>
        <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={Toronto}
            showsUserLocation
            loadingEnabled
            showsMyLocationButton
            >
            {
                places.map((p: Place) => (
                    <Marker
                        key={p.name}
                        tracksViewChanges={false}
                        coordinate={{
                            latitude: p.latitude,
                            longitude: p.longitude
                        }}
                        onPress={(event) => onPress(event, p)}
                    />
                ))
            }
        </MapView>
    </View>
  );
};

export default Map;