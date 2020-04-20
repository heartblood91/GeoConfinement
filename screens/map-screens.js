import React, { Component, Fragment } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { Icon } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import LocationIQ from "react-native-locationiq";
import { setCoordLocalization } from "../actions";
import { SearchBar } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";

import { APP_COLORS } from "../styles/color";

// Coordonnées par défaut du centre de Paris
const DEFAULT_COORD = {
  lat: 48.859268,
  lon: 2.34706,
};

//const navigation = useNavigation();

class MapScreen extends Component {
  state = { search: "", firstChange: false };

  // Init le state avec une adresse si et seulement si elle existe dans le reducer
  componentDidMount = () => {
    if (
      this.props.storeSearch.name !== "Default" &&
      this.props.storeSearch.name !== "Géolocalisation"
    ) {
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
            strokeColor={APP_COLORS.blueLightcolor}
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

  firstChangeRegionWithUserCoordinate = (userCoordinate) => {
    // Récupère les coordonnées
    const userLocalization = {
      name: "Géolocalisation",
      coord: {
        lat: userCoordinate.nativeEvent.coordinate.latitude,
        lon: userCoordinate.nativeEvent.coordinate.longitude,
      },
    };

    // Puis les envoies au reducer pour mise à jour de la région
    this.props.setCoordLocalization(userLocalization);

    // On set le state pour avertir que nous avons récupéré les données de la 1ère géolocalisation de l'utilisateur
    this.setState({ firstChange: true });
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
          userLocationUpdateInterval={30000}
          followsUserLocation={true}
          // Récupère les coordonnées de l'utilisateur 1 seule fois pour centrer la carte sur son emplacement
          {...(this.state.firstChange === false
            ? {
                onUserLocationChange: this.firstChangeRegionWithUserCoordinate,
              }
            : {})}
          region={{
            ...coord,
            latitudeDelta: 0.037370910726444606,
            longitudeDelta: 0.029233060777187347,
          }}
        >
          {this.renderCircle(coord)}
        </MapView>
        <Icon
          name="settings"
          type="SimpleLineIcons"
          color={APP_COLORS.grayColor}
          reverseColor="#fff"
          reverse
          size={Math.round(wp("5%"))}
          containerStyle={{
            position: "absolute",
            top: hp("1%"),
            left: wp("85%"),
          }}
          onPress={() => this.props.navigation.navigate("Settings")}
        />

        <SearchBar
          lightTheme
          round
          onChangeText={this.updateSearch}
          value={this.state.search}
          onSubmitEditing={this.submitSearch}
          placeholder="Entrez votre adresse..."
          placeholderTextColor={APP_COLORS.blackColor}
          inputStyle={{ color: APP_COLORS.blackColor }}
          containerStyle={{
            position: "absolute",
            top: hp("1%"),
            left: wp("3%"),
            width: wp("80%"),
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
    storeSearch: store.setting.searchLocalization,
  };
};

const mapDispatchToProps = {
  setCoordLocalization,
};

//
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
