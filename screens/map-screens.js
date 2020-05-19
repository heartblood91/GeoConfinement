import React, { Component, Fragment } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { Icon, SearchBar } from "react-native-elements";
import { StyleSheet, View, AsyncStorage } from "react-native";
import LocationIQ from "react-native-locationiq";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { getDistance } from "geolib";

import { setCoord, initSettingWithStorage } from "../actions";
import ShowTimer from "../components/timer";
import { APP_COLORS } from "../styles/color";
import { suscribeToPushNotifications } from "../services/notifications";

// Coordonnées par défaut du centre de Paris
const DEFAULT_COORD = {
  latitude: 47.384714655010384,
  longitude: 2.449696697294711,
  latitudeDelta: 19.411919009812614,
  longitudeDelta: 15.498672053217886,
};

class MapScreen extends Component {
  state = {
    search: "",
    firstChange: true,
    firstFocus: true,
    distance: 0,
    error: "",
    submitLocation: false,
    notificationIsSend: false,
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

    // Récupération des settings de l'utilisateur dans le storage
    this.getSettings();
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
    } else if (
      this.props.storeSettings.searchlocation.value !==
        prevProps.storeSettings.searchlocation.value &&
      (this.props.storeSettings.searchlocation.value === "Default" ||
        this.props.storeSettings.searchlocation.value === "Géolocalisation")
    ) {
      this.setState({
        search: "",
      });
    }

    // S'il y a un changement dans les coordonnées alors je force une MAJ de la région avec une animation ou un changement dans le rayon
    if (
      this.props.storeSettings.searchlocation.coord.lat !==
        prevProps.storeSettings.searchlocation.coord.lat ||
      this.props.storeSettings.searchlocation.coord.lon !==
        prevProps.storeSettings.searchlocation.coord.lon ||
      this.props.storeSettings.radius !== prevProps.storeSettings.radius
    ) {
      this.refocus();
    }
  };

  // Récupère l'ensemble des paramètres de l'utilisateur
  getSettings = async () => {
    // Vérifie l'existence de data dans le storage
    try {
      const jsonTempSettings = await AsyncStorage.getItem(
        "@geoconfinement_Settings"
      );

      // Si je trouve de la data alors je set le reducer
      if (jsonTempSettings !== null) {
        this.props.initSettingWithStorage(
          JSON.parse(jsonTempSettings),
          this.props.storeTempSetting
        );
      }
    } catch (error) {
      console.warn("error getSettings: ", error);
    }
  };

  // Mets à jour le texte dans la search bar
  updateSearch = (search) => {
    this.setState({ search });
  };

  submitSearch = () => {
    if (this.state.search !== "") {
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
    } else {
      // Puis les envoies au reducer le reset
      this.props.setCoord("", "location");
    }
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
      if (coord.lat !== DEFAULT_COORD.lat && coord.lon !== DEFAULT_COORD.lon) {
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

    // Si les notifications sont activées alors j'envoie une notification si la personne sort du périmètre
    // Si la personne est sortie du périmètre puis revenue dans ce périmètre alors je reset la notif warning pour une prochaine sortie
    if (
      distance > this.props.storeSettings.radius &&
      !this.state.notificationIsSend &&
      this.props.storeSettings.notification
    ) {
      // Envoie la notification
      suscribeToPushNotifications("warning");

      // Informe le state de l'envoie
      this.setState({ notificationIsSend: true });
    } else if (
      distance < this.props.storeSettings.radius &&
      this.state.notificationIsSend
    ) {
      this.setState({ notificationIsSend: false });
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

  refocus = () => {
    // Calcul le taux de zoom / delta de la map
    const delta = this.renderZoomRadius();

    // Récupère les coordonnées des props
    const latAndLon = {
      latitude: this.props.storeSettings.searchlocation.coord.lat,
      longitude: this.props.storeSettings.searchlocation.coord.lon,
    };

    // Récupère les coordonnées de zoom pour les ajouter aux coordonnées
    const latAndLonDelta = {
      latitudeDelta:
        this.props.storeSettings.searchlocation.value === "Default"
          ? 19.411919009812614
          : delta.latitudeDelta,
      longitudeDelta:
        this.props.storeSettings.searchlocation.value === "Default"
          ? 15.498672053217886
          : delta.longitudeDelta,
    };
    // Merge les coordonnées de zoom avec les coordonnées
    const newCoord = Object.assign({}, latAndLon, latAndLonDelta);

    // Permet de rendre avec une animation aux coordonées
    // Lors du premier focus, il y a un délai de 2s avant de lancer l'animation (permet de résoudre un bug d'animation à l'ouverture de l'appli)
    const timeoutForFirstFocus = this.state.firstFocus ? 2000 : 0;

    setTimeout(() => {
      this._mapView.animateToRegion(newCoord, 2000);
    }, timeoutForFirstFocus);

    this.setState({ firstFocus: false });
  };

  renderZoomRadius = () => {
    // Je compare le rayon actuel avec un rayon de 1000m
    const ratio = 1000 / this.props.storeSettings.radius;

    //Je multiplie le ratio par les valeurs de latitudeDelta et de longitudeDelta correspondant à un rayon de 1000m
    const delta = {
      latitudeDelta: 0.037370910726444606 / ratio,
      longitudeDelta: 0.029233060777187347 / ratio,
    };

    //Je retourne la valeur de delta
    return delta;
  };

  render() {
    // Mets dans une constante les coordonnées pour éviter des répétitions
    const coord = {
      latitude: this.props.storeSettings.searchlocation
        ? this.props.storeSettings.searchlocation.coord.lat
        : DEFAULT_COORD.latitude,
      longitude: this.props.storeSettings.searchlocation
        ? this.props.storeSettings.searchlocation.coord.lon
        : DEFAULT_COORD.longitude,
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
          initialRegion={{
            ...DEFAULT_COORD,
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
        {this.props.storeSettings.timer && (
          <ShowTimer notification={this.props.storeSettings.notification} />
        )}
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
    storeTempSetting: store.tempSetting,
  };
};

const mapDispatchToProps = {
  setCoord,
  initSettingWithStorage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
