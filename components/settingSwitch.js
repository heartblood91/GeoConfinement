import React, { Component } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { handleChangeSettings } from "../actions";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { APP_COLORS } from "../styles/color";

class SettingSwitch extends Component {
  // Verifie si l'utilisateur a autorisé l'appli (géoloc ou notification) sinon l'appli demande l'autorisation
  // Si autorisation alors le bouton switch, sinon il ne bouge pas
  verifyPermission = () => {
    const type =
      this.props.nameSwitch === "geolocation" ? "LOCATION" : "NOTIFICATIONS";

    Permissions.getAsync(Permissions[type]).then((existingPermission) => {
      if (existingPermission.status !== "granted") {
        Permissions.askAsync(Permissions[type]).then(() => {
          permission.status === "granted" &&
            this.props.handleChangeSettings(this.props.nameSwitch, "value");
        });
      } else {
        this.props.handleChangeSettings(this.props.nameSwitch, "value");
      }
    });
  };

  // Si besoin de checker les permissions de l'appli alors on utilisera la fonction verifyPermission
  // (dans le cadre d'activation d'un des paramètres suivants : NOTIFICATIONS ou LOCATION)
  // Sinon il s'agit d'un paramètre standard sans permission particulière, pas besoin de passer sur cette étape
  // (circuit court pour la désactivation d'une option avec permission)
  handleChangeValue = () => {
    if (
      (this.props.nameSwitch === "geolocation" ||
        this.props.nameSwitch === "notification") &&
      !this.props.switch.value
    ) {
      this.verifyPermission();
    } else {
      this.props.handleChangeSettings(this.props.nameSwitch, "value");

      // + Si l'option géolocalisation passe sur 'off' & 'couleur zone dynamique' est sur 'on' alors on désactive l'option 'couleur zone dynamique'
      this.props.nameSwitch === "geolocation" &&
        this.props.storeTempSetting.geolocation.value &&
        this.props.storeTempSetting.visualWarning.value &&
        this.props.handleChangeSettings("visualWarning", "value");
    }
  };

  renderStyle = () => {
    const newStyles = [styles.containerBody];

    // Si le bouton est pressée alors on ajoute un style supplémentaire
    this.props.isPress && newStyles.push(styles.selectionSetting);

    // Verifie si 'visualWarning' est désactivé
    const visualWarningIsDisabled =
      this.props.nameSwitch === "visualWarning" &&
      !this.props.storeTempSetting.geolocation.value
        ? true
        : false;

    // Si le bouton est désactivée alors on ajoute un style supplémentaire
    // Sinon, on ajoute le background selon le dark mode
    if (
      visualWarningIsDisabled &&
      this.props.storeTempSetting.nightMode.value
    ) {
      newStyles.push(styles.disableInputDark);
    } else if (
      visualWarningIsDisabled &&
      !this.props.storeTempSetting.nightMode.value
    ) {
      newStyles.push(styles.disableInputNormal);
    } else {
      // Gestion du dark mode
      this.props.storeTempSetting.nightMode.value
        ? newStyles.push(styles.settingBackgroundDark)
        : newStyles.push(styles.settingBackgroundNormal);
    }

    return newStyles;
  };

  render() {
    return (
      <View style={this.renderStyle()}>
        <Text
          style={[
            styles.textBody,
            this.props.storeTempSetting.nightMode.value
              ? styles.textBodyDark
              : styles.textBodyNormal,
          ]}
          onPress={() =>
            this.props.handleChangeSettings(this.props.nameSwitch, "isPress")
          }
        >
          {this.props.switch.text}
        </Text>

        <Switch
          style={styles.switchPosition}
          trackColor={{
            false: APP_COLORS.graySwitch,
            true: APP_COLORS.graySwitch,
          }}
          ios_backgroundColor={APP_COLORS.graySwitch}
          thumbColor={
            this.props.switch.value
              ? APP_COLORS.greenColor
              : APP_COLORS.redColor
          }
          onChange={() => this.handleChangeValue()}
          value={this.props.switch.value}
          // Désactive le switch s'il s'agit de l'input 'couleur zone dynamique' et que la géolocalisation est désactivée
          disabled={
            this.props.nameSwitch === "visualWarning" &&
            !this.props.storeTempSetting.geolocation.value
              ? true
              : false
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp("6%"),

    // Marge et padding:
    marginHorizontal: Math.round(wp("4%")),
    paddingHorizontal: Math.round(wp("3%")),

    // Shadow
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  selectionSetting: {
    //Border
    borderWidth: 2,
    borderColor: APP_COLORS.blueColor,
  },

  textBody: {
    fontSize: Math.round(wp("5%")),
    width: wp("72%"),
  },
  switchPosition: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },

  // Couleur mode normal:
  settingBackgroundNormal: {
    backgroundColor: "#fff",
  },
  textBodyNormal: {
    color: APP_COLORS.blackColor,
  },
  disableInputNormal: {
    backgroundColor: APP_COLORS.grayLightColor,
  },

  // Couleur mode nuit:
  settingBackgroundDark: {
    backgroundColor: APP_COLORS.settingBackground,
  },
  textBodyDark: {
    color: APP_COLORS.textDarkMode,
  },
  disableInputDark: {
    backgroundColor: APP_COLORS.GeneralBackgroundDarkMode,
  },
});

const mapStateToProps = (store, ownProps) => {
  // En fonction des props du component, on récupère les infos dans le store
  return {
    switch: store.tempSetting[ownProps.nameSwitch],
    isPress: store.tempSetting.isPress[ownProps.nameSwitch],
    storeTempSetting: store.tempSetting,
  };
};

const mapDispatchToProps = {
  handleChangeSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingSwitch);
