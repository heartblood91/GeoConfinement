import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements";
import { handleChangeSettings, syncroTempToSettings } from "../actions";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SettingSwitch from "../components/settingSwitch";
import SettingInput from "../components/settingInput";
import { APP_COLORS } from "../styles/color";

class SettingScreen extends Component {
  state = { isKeyboard: false };

  // Ajoute un listener sur l'affichage du keyboard
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this.keyboardIsVisible(true)
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.keyboardIsVisible(false)
    );
  }

  // Enlève le listener lors du démontage + synchronise les paramètres entre les 2 reducers (TempSetting & Setting)
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.syncSettingReducer();
  }

  // Permet de save dans le state la présence / absence du clavier
  keyboardIsVisible = (isShow) => {
    this.setState({ isKeyboard: isShow });
  };

  renderTextDescription = () => {
    const isPress = Object.assign({}, this.props.storeTempSettings.isPress);

    switch (true) {
      case isPress.geolocation:
        return "Permet de vous géolocalisez sur la carte. Ce paramètre est modifiable uniquement si vous avez autorisé l'application à vous suivre.";

      case isPress.notification:
        return "L'application vous envoie une notification si vous dépassez le périmètre autorisé.\nNécessite la géolocalisation.";

      case isPress.visualWarning:
        return "Si vous êtes dans le périmètre autorisé, le cercle est vert. Si vous dépassez les bornes des limites, comme Maurice, le cercle est rouge. Par défaut, il est tout le temps bleu.\nNécessite la géolocalisation.";

      case isPress.timer:
        return "Une simple et petite minuterie, rêglée sur 1h. Si vous avez autorisé les notifications, l'application vous enverra un petit rappel 15 minutes avant la fin.";

      case isPress.nightMode:
        return "Permet de jongler entre le mode normal, et, le mode sombre de l'application.";

      case isPress.address:
        return "Permet d'enregistrer votre adresse. Cela vous évitera de la retaper à chaque fois.\nEntrez votre adresse puis cliquez sur la loupe";

      case isPress.radius:
        return "Permet de modifier la taille du périmètre, exprimée en mètre.\nPar défaut, elle est fixée à 1000m";

      default:
        return "Cliquez sur un des paramètres pour avoir plus d'informations";
    }
  };

  syncSettingReducer = () => {
    //Récupére les informations provenant du reducer temporaire des settings
    // Puis on fait un nettoyage pour s'adapter au reducer classique
    const newAddressObject = Object.assign(
      {},
      this.props.storeTempSettings.address
    );
    delete newAddressObject.text;
    let tempSetting = {
      address: { ...newAddressObject },
      geolocation: this.props.storeTempSettings.geolocation.value,
      nightMode: this.props.storeTempSettings.nightMode.value,
      notification: this.props.storeTempSettings.notification.value,
      radius: this.props.storeTempSettings.radius.value,
      visualWarning: this.props.storeTempSettings.visualWarning.value,
      timer: this.props.storeTempSettings.timer.value,
    };

    // Si une adresse a été paramétré alors on enregistre les données dans searchlocation (sauf si similaire )
    if (
      this.props.storeTempSettings.address.value !== "" &&
      this.props.storeSettings.searchlocation.value !==
        this.props.storeTempSettings.address.value
    ) {
      tempSetting = Object.assign(tempSetting, {
        searchlocation: { ...newAddressObject },
      });
    }

    //Envoie au réducer les nouveaux paramètres du reducer temporaire pour les synchronisés
    this.props.syncroTempToSettings(tempSetting);
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.containerReturn}>
            <Icon
              name="arrow-back"
              type="SimpleLineIcons"
              color={APP_COLORS.blueLightcolor}
              reverseColor="#fff"
              reverse
              size={Math.round(wp("5%"))}
              onPress={() => this.props.navigation.navigate("Home")}
            />

            <Text
              onPress={() => this.props.navigation.navigate("Home")}
              style={styles.textReturn}
            >
              Retour à la carte
            </Text>
          </View>
          {!this.state.isKeyboard && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.textDescription}>
                {this.renderTextDescription()}
              </Text>
            </View>
          )}
          <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
            <View style={styles.containerSetting}>
              <SettingInput nameInput={"address"} />
              {!this.state.isKeyboard && (
                <Fragment>
                  <SettingSwitch nameSwitch={"timer"} />
                  <SettingSwitch nameSwitch={"visualWarning"} />
                  <SettingSwitch nameSwitch={"geolocation"} />
                  <SettingSwitch nameSwitch={"nightMode"} />
                  <SettingSwitch nameSwitch={"notification"} />
                </Fragment>
              )}

              <SettingInput nameInput={"radius"} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  containerReturn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: Math.round(wp("5%")),
    marginTop: Math.round(hp("2%")),
  },

  containerSetting: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  descriptionContainer: {
    paddingHorizontal: Math.round(wp("5%")),
    paddingVertical: Math.round(hp("1%")),
    justifyContent: "center",
    height: Math.round(hp("20%")),
  },
  textDescription: {
    fontSize: Math.round(wp("5%")),
    color: APP_COLORS.blackColor,
    textAlign: "justify",
  },
  textReturn: {
    fontSize: Math.round(wp("7%")),
    color: APP_COLORS.blueLightcolor,
  },
});

const mapStateToProps = (store) => {
  return { storeTempSettings: store.tempSetting, storeSettings: store.setting };
};

const mapDispatchToProps = {
  handleChangeSettings,
  syncroTempToSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
