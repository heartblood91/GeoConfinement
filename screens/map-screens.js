import React, { Component, Fragment } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { Icon, SearchBar } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import LocationIQ from "react-native-locationiq";
import { setCoord } from "../actions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { getDistance } from "geolib";

import ShowTimer from "../components/timer";
import { APP_COLORS } from "../styles/color";

// Coordonnées par défaut du centre de Paris
const DEFAULT_COORD = {
  lat: 47.384714655010384,
  lon: 2.449696697294711,
};

class MapScreen extends Component {
  state = {
    search: "",
    firstChange: true,
    distance: 0,
    error: "",
    submitLocation: false,
  };

  componentDidMount = () => {
    // Init le state avec une adresse si et seulement si elle existe dans le reducer
    if (
      this.props.storeSettings.searchlocation.value !== "Default" &&
      this.props.storeSettings.searchlocation.value !== "Géolocalisation"
    ) {
      this.setState({
        search: this.props.storeSettings.searchlocation.value,
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    //Change firstChange en fonction du paramètre "Géolocalisation"
    if (
      this.props.storeSettings.geolocation !==
      prevProps.storeSettings.geolocation
    ) {
      this.setState({ firstChange: this.props.storeSettings.geolocation });
    }

    //Si searchlocation value change dans les props mais pas dans le state (sauf pour Default + Géolocalisation):
    if (
      this.props.storeSettings.searchlocation.value !==
        prevProps.storeSettings.searchlocation.value &&
      this.props.storeSettings.searchlocation.value !== "Default" &&
      this.props.storeSettings.searchlocation.value !== "Géolocalisation"
    ) {
      this.setState({
        search: this.props.storeSettings.searchlocation.value,
      });
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
        const searchlocation = {
          value: this.state.search.trim(),
          coord: {
            lat: parseFloat(json[0].lat),
            lon: parseFloat(json[0].lon),
          },
        };

        // Je préviens que le formulaire a été soumis SANS erreur
        this.setState({ error: "", submitLocation: true });

        // Puis les envoies au reducer pour mise à jour
        this.props.setCoord(searchlocation, "location");
      })
      .catch((error) => this.setState({ error, submitLocation: true }));
  };

  // Permet de créer un cercle sur la carte si une adresse a été entré
  // +
  // Ajoute un marker positionné aux coordonées de cette adresse
  renderCircle = (coord) => {
    if (this.props.storeSettings.searchlocation.value !== "Default") {
      return (
        <Fragment>
          <Circle
            center={{
              ...coord,
            }}
            radius={this.props.storeSettings.radius}
            strokeWidth={1}
            strokeColor={this.colorCircle("strokeColor")}
            fillColor={this.colorCircle("fillColor")}
          />
          <Marker
            title="Maison"
            coordinate={{
              ...coord,
            }}
            description={this.props.storeSettings.searchlocation.value}
          />
        </Fragment>
      );
    }
  };

  colorCircle = (option) => {
    let color;

    // Colorie la zone en fonction du paramètre choisie par l'utilisateur (soit bleu par défaut soit vert / rouge selon la distance)
    if (this.props.storeSettings.visualWarning) {
      color = this.state.distance < 1000 ? "green" : "red";
    } else {
      color = "blue";
    }

    // En fonction de l'option (strokeColor VS fillColor) on adapte le type de couleur
    if (option === "strokeColor") {
      switch (color) {
        case "blue":
          return APP_COLORS.blueLightcolor;

        case "green":
          return APP_COLORS.greenLightcolor;

        case "red":
          return APP_COLORS.redLightcolor;
      }
    } else if (option === "fillColor") {
      switch (color) {
        case "blue":
          return APP_COLORS.blueCircle;

        case "green":
          return APP_COLORS.greenCircle;

        case "red":
          return APP_COLORS.redCircle;
      }
    }
  };

  userLocationChange = (userCoordinate, coord) => {
    // S'il s'agit de la première initialisation on récupère les coordonées + calcule la distance si besoin + envoie les données au reducer pour MAJ de la région
    // + on set le state pour prévenir que la première initialisation est terminée

    if (this.state.firstChange) {
      // Récupère les coordonnées
      const userlocation = {
        value: "Géolocalisation",
        coord: {
          lat: userCoordinate.nativeEvent.coordinate.latitude,
          lon: userCoordinate.nativeEvent.coordinate.longitude,
        },
      };

      // On lance un calcul de distance si les coord transmises sont différentes des coordonnées par défaut
      if (
        coord.latitude !== DEFAULT_COORD.lat &&
        coord.longitude !== DEFAULT_COORD.lon
      ) {
        this.calculDistance(userCoordinate, coord);
      }

      // Puis les envoies au reducer pour mise à jour de la région
      this.props.setCoord(userlocation, "location");

      // On set le state pour avertir que nous avons récupéré les données de la 1ère Géolocalisation de l'utilisateur
      this.setState({ firstChange: false });
    } else {
      this.calculDistance(userCoordinate, coord);
    }
  };

  calculDistance = (userCoordinate, coord) => {
    const distance = Math.abs(
      getDistance(
        {
          latitude: userCoordinate.nativeEvent.coordinate.latitude,
          longitude: userCoordinate.nativeEvent.coordinate.longitude,
        },
        { latitude: coord.latitude, longitude: coord.longitude }
      )
    );
    // si la distance a évolué de ~5m alors on set le state
    //(- de 5 cela signifie que la personne ne bouge pas)
    const diffDistance = Math.abs(this.state.distance - distance);

    if (diffDistance >= 5) {
      this.setState({ distance });
    }
  };

  renderError = () => {
    if (this.state.error === "" && this.state.submitLocation) {
      return "Parfait, merci, je m'occupe de l'affichage";
    } else if (!this.state.submitLocation) {
      return "";
    } else if (this.state.error !== "" && this.state.submitLocation) {
      return "Oups... Je ne trouve pas votre adresse...";
    }
  };

  refocus = (coord) => {
    // Récupère les coordonnées de zoom pour les ajouter aux coordonnées
    const latAndLonDelta = {
      latitudeDelta:
        this.props.storeSettings.searchlocation.value === "Default"
          ? 19.411919009812614
          : 0.037370910726444606,
      longitudeDelta:
        this.props.storeSettings.searchlocation.value === "Default"
          ? 15.498672053217886
          : 0.029233060777187347,
    };

    // Merge les coordonnées de zoom avec les coordonnées
    const newCoord = Object.assign({}, coord, latAndLonDelta);

    // Permet de rendre avec une animation aux coordonées
    this._mapView.animateToRegion(newCoord, 2000);
  };

  render() {
    // Mets dans une constante les coordonnées pour éviter des répétitions
    const coord = {
      latitude: this.props.storeSettings.searchlocation
        ? this.props.storeSettings.searchlocation.coord.lat
        : DEFAULT_COORD.lat,
      longitude: this.props.storeSettings.searchlocation
        ? this.props.storeSettings.searchlocation.coord.lon
        : DEFAULT_COORD.lon,
    };
    return (
      <View style={styles.container}>
        <MapView
          ref={(mapView) => (this._mapView = mapView)}
          style={{ flex: 1 }}
          showsUserLocation={this.props.storeSettings.geolocation}
          userLocationAnnotationTitle={"Moi"}
          userLocationUpdateInterval={30000}
          followsUserLocation={this.props.storeSettings.geolocation}
          // Récupère les coordonnées de l'utilisateur 1 seule fois pour centrer la carte sur son emplacement
          onUserLocationChange={(userCoordinate) =>
            this.userLocationChange(userCoordinate, coord)
          }
          region={{
            ...coord,
            latitudeDelta:
              this.props.storeSettings.searchlocation.value === "Default"
                ? 19.411919009812614
                : 0.037370910726444606,
            longitudeDelta:
              this.props.storeSettings.searchlocation.value === "Default"
                ? 15.498672053217886
                : 0.029233060777187347,
          }}
        >
          {this.renderCircle(coord)}
        </MapView>

        {/* Icône permettrant de recentrer la carte aux coordonnées (équivalent à celle de maps) */}
        <Icon
          raised
          name="my-location"
          type="material"
          color="#fff"
          reverseColor={APP_COLORS.blueColor}
          reverse
          size={Math.round(wp("5%"))}
          containerStyle={{
            position: "absolute",
            bottom: this.props.storeSettings.timer ? hp("10%") : hp("1%"),
            left: wp("83.5%"),
          }}
          onPress={() => this.refocus(coord)}
        />

        {/* Icône permettrant d'accéder aux paramètres de l'application */}
        <Icon
          raised
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
          errorMessage={this.renderError()}
          errorStyle={
            this.state.error === "" ? styles.inputNoError : styles.inputError
          }
          placeholderTextColor={APP_COLORS.blackColor}
          inputStyle={{ color: APP_COLORS.blackColor }}
          containerStyle={{
            position: "absolute",
            top: hp("1%"),
            left: wp("3%"),
            width: wp("80%"),

            // Shadow
            borderRadius: 20,
            backgroundColor: "#fff",

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
          style={{
            color: APP_COLORS.blackColor,
          }}
        />
        {this.props.storeSettings.timer && <ShowTimer />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputNoError: {
    fontSize: Math.round(wp("4%")),
    fontWeight: "700",
    color: APP_COLORS.greenColor,
  },
  inputError: {
    fontSize: Math.round(wp("4%")),
    fontWeight: "700",
    color: APP_COLORS.redColor,
  },
});

const mapStateToProps = (store) => {
  return {
    storeSettings: store.setting,
  };
};

const mapDispatchToProps = {
  setCoord,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
