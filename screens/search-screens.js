import React, { Component, Fragment } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import LocationIQ from "react-native-locationiq";
import { setCoordLocalization } from "../actions";

import { SearchBar } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { connect } from "react-redux";

// Coordonnées par défaut du centre de Paris
const DEFAULT_COORD = {
  lat: 48.859268,
  lon: 2.34706,
};

class SearchScreen extends Component {
  state = { search: "" };

  // Init le state avec une adresse si et seulement si elle existe dans le reducer
  componentDidMount = () => {
    if (this.props.storeSearch.name !== "Default") {
      this.setState({ search: this.props.storeSearch.name });
    }
  };

  // Mets à jour le texte dans la search bar
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
      })
      .catch((error) => console.warn(error));
  };

  // Permet de créer un cercle sur la carte si une adresse a été entré
  // +
  // Ajoute un marker positionné aux coordonées de cette adresse
  renderCircle = (coord) => {
    if (this.props.storeSearch.name !== "Default") {
      return (
        <Fragment>
          <Circle
            center={{
              ...coord,
            }}
            radius={1000}
            strokeWidth={1}
            strokeColor={"#1a66ff"}
            fillColor={"rgba(230,238,255,0.5)"}
          />
          <Marker
            title="Maison"
            coordinate={{
              ...coord,
            }}
            description={this.props.storeSearch.name}
          />
        </Fragment>
      );
    }
  };

  render() {
    // Mets dans une constante les coordonnées pour éviter des répétitions
    const coord = {
      latitude: this.props.storeSearch
        ? this.props.storeSearch.coord.lat
        : DEFAULT_COORD.lat,
      longitude: this.props.storeSearch
        ? this.props.storeSearch.coord.lon
        : DEFAULT_COORD.lon,
    };
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          userLocationAnnotationTitle={"Moi"}
          followsUserLocation={true}
          region={{
            ...coord,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
        >
          {this.renderCircle(coord)}
        </MapView>

        <SearchBar
          lightTheme
          round
          onChangeText={this.updateSearch}
          value={this.state.search}
          onSubmitEditing={this.submitSearch}
          placeholder="Entrez votre adresse..."
          placeholderTextColor={"black"}
          inputStyle={{ color: "black" }}
          containerStyle={{
            position: "absolute",
            top: hp("7%"),
            left: wp("5%"),
            width: wp("90%"),
          }}
          style={{
            color: "black",
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
