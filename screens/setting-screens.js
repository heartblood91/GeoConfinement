import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { handleChangeSettings } from "../actions";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SettingSwitch from "../components/settingSwitch";
import SettingInput from "../components/settingInput";
import { APP_COLORS } from "../styles/color";

const initialStateIsPress = {
  geolocalisation: false,
  notification: false,
  visualWarning: false,
  timer: false,
  nightMode: false,
};

class SettingScreen extends Component {
  state = {
    isPress: initialStateIsPress,
  };

  handleChangeIsPress = (valueIsPress) => {
    // Remet l'ensemble des isPress à l'initial + je passe à true celui qui a été touché en dernier
    this.setState({ isPress: { ...initialStateIsPress, ...valueIsPress } });
  };

  renderTextDescription = () => {
    const isPress = Object.assign({}, this.state.isPress);

    switch (true) {
      case isPress.geolocalisation:
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
  render() {
    return (
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
        <View style={styles.descriptionContainer}>
          <Text style={styles.textDescription}>
            {this.renderTextDescription()}
          </Text>
        </View>
        <View style={styles.containerSetting}>
          <SettingInput
            textInput={"Adresse:"}
            nameInput={"address"}
            valueInput={this.props.storeSettings.address}
            selectionInput={this.state.isPress.address}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingInput
            textInput={"Rayon (en m):"}
            nameInput={"radius"}
            valueInput={this.props.storeSettings.radius}
            selectionInput={this.state.isPress.radius}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingSwitch
            textSwitch={"Géolocalisation"}
            nameSwitch={"geolocalisation"}
            valueSwitch={this.props.storeSettings.geolocalisation}
            selectionSwitch={this.state.isPress.geolocalisation}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingSwitch
            textSwitch={"Notification"}
            nameSwitch={"notification"}
            valueSwitch={this.props.storeSettings.notification}
            selectionSwitch={this.state.isPress.notification}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingSwitch
            textSwitch={"Couleur zone dynamique"}
            nameSwitch={"visualWarning"}
            valueSwitch={this.props.storeSettings.visualWarning}
            selectionSwitch={this.state.isPress.visualWarning}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingSwitch
            textSwitch={"Compte à rebours"}
            nameSwitch={"timer"}
            valueSwitch={this.props.storeSettings.timer}
            selectionSwitch={this.state.isPress.timer}
            handleChangeIsPress={this.handleChangeIsPress}
          />
          <SettingSwitch
            textSwitch={"Mode nuit"}
            nameSwitch={"nightMode"}
            valueSwitch={this.props.storeSettings.nightMode}
            selectionSwitch={this.state.isPress.nightMode}
            handleChangeIsPress={this.handleChangeIsPress}
          />
        </View>
      </View>
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
  return { storeSettings: store.setting };
};

const mapDispatchToProps = {
  handleChangeSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
