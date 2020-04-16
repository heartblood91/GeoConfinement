import React, { Component } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";

const DEFAULT_COORD = {
  lat: 48.859268,
  lng: 2.34706,
};

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: DEFAULT_COORD.lat,
            longitude: DEFAULT_COORD.lng,
            latitudeDelta: 0.2,
            longitudeDelta: 0.1,
          }}
          scrollEnabled={false}
          liteMode={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
