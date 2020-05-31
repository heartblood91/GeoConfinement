import React, { Component } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { Input, Icon } from "react-native-elements";
import { handleChangeSettings } from "../actions";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LocationIQ from "react-native-locationiq";
import { setCoord } from "../actions";
import { APP_COLORS } from "../styles/color";
import { LOCATION_IQ_API } from "../credentials/credentials";

class SettingInput extends Component {
  state = {
    inputValue: "",
    error: "",
    submitLocation: false,
    scaleRaddius: false,
  };
  componentDidMount = () => {
    // Init le state avec une adresse si et seulement si elle existe dans le reducer
    if (this.props.input.value !== "" && this.props.nameInput === "address") {
      this.setState({ inputValue: this.props.input.value });
    }

    //Verifie le nombre de chiffre inscrit dans le raddius. Si > 4 alors, l'échelle est en km, sinon, elle est est en m
    if (
      this.props.input.value.toString().length > 4 &&
      this.props.nameInput === "radius"
    ) {
      this.setState({ scaleRaddius: true });
    } else if (
      this.props.input.value.toString().length <= 4 &&
      this.props.nameInput === "radius"
    ) {
      this.setState({ scaleRaddius: false });
    }
  };

  componentDidUpdate = (prevState) => {
    // Je vérifie que la valeur inscrite dans radius est de 4 digits max (ou 7 pour les kms)
    // Si MAJ du switch dans l'input radius
    if (
      this.state.scaleRaddius !== prevState.scaleRaddius &&
      this.props.nameInput === "radius"
    ) {
      // Je récupère la valeur du radius + je compte le nombre de chiffres + et le max de chiffres possibles (4 pour m - 7 pour km)
      let { value } = this.props.input;
      const digits = value.toString().length;
      const maxDigits = this.state.scaleRaddius ? 7 : 4;

      // Si la quantité de chiffres est plus importantes que la taille max, alors je resize la valeur
      if (digits > maxDigits) {
        value = parseInt(value.toString().substring(0, maxDigits));
        this.props.handleChangeSettings("radius", "input", value);
      }
    }
  };

  submitSearch = () => {
    if (this.state.inputValue !== "") {
      // Init le module avec l'API Key:
      LocationIQ.init(LOCATION_IQ_API);

      // Puis effectue la recherche
      LocationIQ.search(this.state.inputValue)
        .then((json) => {
          // Récupère les coordonnées
          const searchAddress = {
            value: this.state.inputValue.trim(),
            coord: {
              lat: parseFloat(json[0].lat),
              lon: parseFloat(json[0].lon),
            },
            text: "Adresse:",
          };

          // Je préviens que le formulaire a été soumis SANS erreur
          this.setState({ error: "", submitLocation: true });

          // Puis les envoies au reducer pour mise à jour
          this.props.setCoord(searchAddress, "ADDRESS");
        })
        // Je préviens que le formulaire a été soumis AVEC erreur
        .catch((error) => this.setState({ error, submitLocation: true }));
    } else {
      // Puis les envoies au reducer le reset
      this.props.setCoord("", "ADDRESS");

      // Et reset l'envoi et les erreurs s'ils en existent
      this.state.submitLocation !== "" &&
        this.setState({ error: "", submitLocation: false });
    }
  };

  // Génère les erreurs lors de la saisie de l'adresse
  renderError = () => {
    if (this.state.error === "" && this.state.submitLocation) {
      return "Parfait, merci, j'ai enregistré votre adresse";
    } else if (!this.state.submitLocation) {
      return "";
    } else if (this.state.error !== "" && this.state.submitLocation) {
      return "Oups... Je ne trouve pas votre adresse...";
    }
  };

  // Génère le style de l'input
  renderStyle = () => {
    let newStyles = [];

    // Ajoute un halo bleu si le bouton est pressé
    this.props.isPress
      ? newStyles.push(styles.selectionSetting, styles.containerBody)
      : newStyles.push(styles.containerBody);

    // Ajoute un style en fonction du type d'input
    this.props.nameInput === "address"
      ? newStyles.push(styles.containerBodyColumns)
      : newStyles.push(styles.containerBodyRow);

    // Gestion du dark mode
    this.props.darkMode
      ? newStyles.push(styles.settingBackgroundDark)
      : newStyles.push(styles.settingBackgroundNormal);

    return newStyles;
  };

  // Génère le style du texte en fonction
  // Erreur ou non
  // Dark ou non
  renderErrorStyle = () => {
    if (this.state.error === "") {
      if (this.props.darkMode) {
        return styles.inputNoErrorDark;
      } else {
        return styles.inputNoErrorNormal;
      }
    } else if (this.props.darkMode) {
      return styles.inputErrorDark;
    } else {
      return styles.inputErrorNormal;
    }
  };

  // Render de l'input radius
  renderInputRow = () => {
    return (
      <View style={styles.containerInputRadius}>
        <Input
          inputContainerStyle={{ height: hp("3%") }}
          containerStyle={styles.inputPositionRow}
          inputStyle={this.props.darkMode ? styles.textBodyDark : {}}
          placeholderTextColor={
            this.props.darkMode ? APP_COLORS.textDarkMode : APP_COLORS.grayColor
          }
          maxLength={4}
          placeholder={"Distance"}
          onChangeText={(inputValue) =>
            this.props.handleChangeSettings(
              this.props.nameInput,
              "input",
              this.state.scaleRaddius ? inputValue * 1000 : inputValue
            )
          }
          value={
            this.state.scaleRaddius
              ? (this.props.input.value / 1000).toString()
              : this.props.input.value.toString()
          }
          keyboardType={"number-pad"}
        />
        <View style={styles.containerInputSwitchScale}>
          <Text
            style={[
              styles.textBody,
              this.props.darkMode ? styles.textBodyDark : styles.textBodyNormal,
            ]}
          >
            m
          </Text>
          <Switch
            trackColor={{
              false: APP_COLORS.graySwitch,
              true: APP_COLORS.graySwitch,
            }}
            ios_backgroundColor={APP_COLORS.graySwitch}
            thumbColor={
              this.props.darkMode
                ? APP_COLORS.blueDarkColor
                : APP_COLORS.blueColor
            }
            onChange={() =>
              this.setState({ scaleRaddius: !this.state.scaleRaddius })
            }
            value={this.state.scaleRaddius}
          />
          <Text
            style={[
              styles.textBody,
              this.props.darkMode ? styles.textBodyDark : styles.textBodyNormal,
            ]}
          >
            km
          </Text>
        </View>
      </View>
    );
  };

  // Render de l'address
  renderInputColumn = () => {
    return (
      <Input
        inputContainerStyle={styles.inputPositionColumns}
        placeholderTextColor={
          this.props.darkMode ? APP_COLORS.textDarkMode : APP_COLORS.grayColor
        }
        inputStyle={this.props.darkMode ? styles.textBodyDark : {}}
        placeholder={"Entrez votre adresse ici"}
        onChangeText={(inputValue) => this.setState({ inputValue })}
        onSubmitEditing={this.submitSearch}
        value={this.state.inputValue === "Default" ? "" : this.state.inputValue}
        autoCompleteType={"street-address"}
        dataDetectorTypes={"address"}
        textContentType={"addressCity"}
        errorMessage={this.renderError()}
        errorStyle={this.renderErrorStyle()}
        keyboardType={"default"}
        rightIcon={
          <Icon
            type="material-community"
            name="map-search"
            size={Math.round(wp("10%"))}
            color={
              this.props.darkMode
                ? APP_COLORS.grayLightColor
                : APP_COLORS.blackColor
            }
            onPress={this.submitSearch}
          />
        }
      />
    );
  };

  // Fais un rendu global de l'input (soit il s'agit de l'input adresse soit il s'agit de l'input rayon)
  render() {
    return (
      <View style={this.renderStyle()}>
        <Text
          style={
            this.props.nameInput === "address"
              ? [
                  styles.textBody,
                  this.props.darkMode
                    ? styles.textBodyDark
                    : styles.textBodyNormal,
                  styles.textBodyColumns,
                ]
              : [
                  styles.textBody,
                  this.props.darkMode
                    ? styles.textBodyDark
                    : styles.textBodyNormal,
                  styles.textBodyRows,
                ]
          }
          onPress={() =>
            this.props.handleChangeSettings(this.props.nameInput, "isPress")
          }
        >
          {this.props.input.text}
        </Text>
        {this.props.nameInput === "address"
          ? this.renderInputColumn()
          : this.renderInputRow()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // Render Style Row
  containerBodyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: hp("6%"),
  },
  textBodyRows: {
    //width: wp("15%"),
  },
  inputPositionRow: {
    maxWidth: wp("14%"),
    maxHeight: hp("4%"),
  },

  // Render Style Input Radius
  containerInputRadius: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  containerInputSwitchScale: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 5,
  },

  // Render Style Column
  containerBodyColumns: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: hp("12%"),
  },
  textBodyColumns: {
    width: wp("88%"),
  },

  inputPositionColumns: {
    maxWidth: wp("80%"),
  },

  // Commun
  containerBody: {
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
  },

  inputNoError: {
    fontSize: Math.round(wp("4%")),
    fontWeight: "700",
  },
  inputError: {
    fontSize: Math.round(wp("4%")),
    fontWeight: "700",
  },

  // Couleur mode normal:
  settingBackgroundNormal: {
    backgroundColor: "#fff",
  },

  textBodyNormal: {
    color: APP_COLORS.blackColor,
  },
  inputNoErrorNormal: {
    color: APP_COLORS.greenColor,
  },

  inputErrorNormal: {
    color: APP_COLORS.redColor,
  },

  // Couleur mode nuit:
  textBodyDark: {
    color: APP_COLORS.textDarkMode,
  },
  inputNoErrorDark: {
    color: "#32CD32",
  },

  inputErrorDark: {
    color: "#EB9532",
  },

  settingBackgroundDark: {
    backgroundColor: APP_COLORS.settingBackground,
  },
});

const mapStateToProps = (store, ownProps) => {
  // En fonction des props du component, on récupère les infos dans le store
  return {
    input: store.tempSetting[ownProps.nameInput],
    isPress: store.tempSetting.isPress[ownProps.nameInput],
    darkMode: store.tempSetting.nightMode.value,
  };
};

const mapDispatchToProps = {
  handleChangeSettings,
  setCoord,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingInput);
