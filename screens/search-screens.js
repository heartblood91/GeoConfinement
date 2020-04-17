import React, { Component } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import LocationIQ from "react-native-locationiq";
import { setCoordLocalization } from "../actions";

import { SearchBar } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { connect } from "react-redux";

const DEFAULT_COORD = {
  lat: 48.859268,
  lon: 2.34706,
};

class SearchScreen extends Component {
  state = { search: "" };

  updateSearch = (search) => {
    this.setState({ search });
  };

  submitSearch = () => {
    // Init le module avec l'API Key:
    LocationIQ.init("***REMOVED***"); // masquer l'API KEY sur Github

    // Puis effectue la recherche
    LocationIQ.search(this.state.search)
      .then((json) => {
        // Récupère les coordonnées
        const searchLocalization = {
          name: this.state.search.trim(),
          coord: {
            lat: parseFloat(json[0].lat),
            lon: parseFloat(json[0].lon),
          },
        };

        // Puis les envoies au reducer pour mise à jour
        this.props.setCoordLocalization(searchLocalization);

        //console.log(lat, lon);
      })
      .catch((error) => console.warn(error));
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: this.props.storeSearch
              ? this.props.storeSearch.coord.lat
              : DEFAULT_COORD.lat,
            longitude: this.props.storeSearch
              ? this.props.storeSearch.coord.lon
              : DEFAULT_COORD.lon,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
          scrollEnabled={false}
          liteMode={true}
        />

        <SearchBar
          lightTheme
          onChangeText={this.updateSearch}
          value={this.state.search}
          onSubmitEditing={this.submitSearch}
          placeholder="Entrez votre adresse..."
          containerStyle={{
            position: "absolute",
            top: hp("5%"),
            left: wp("5%"),
            width: wp("90%"),
          }}
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

const mapStateToProps = (store) => {
  return {
    storeSearch: store.params.searchLocalization,
  };
};

const mapDispatchToProps = {
  setCoordLocalization,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
