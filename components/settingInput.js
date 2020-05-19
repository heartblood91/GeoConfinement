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
      LocationIQ.init("***REMOVED***"); // masquer l'API KEY sur Github

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
    }
  };

  renderError = () => {
    if (this.state.error === "" && this.state.submitLocation) {
      return "Parfait, merci, j'ai enregistré votre adresse";
    } else if (!this.state.submitLocation) {
      return "";
    } else if (this.state.error !== "" && this.state.submitLocation) {
      return "Oups... Je ne trouve pas votre adresse...";
    }
  };

  renderStyle = () => {
    let newStyles = [];
    if (this.props.isPress) {
      newStyles.push(styles.selectionSetting, styles.containerBody);
    } else {
      newStyles.push(styles.containerBody);
    }

    if (this.props.nameInput === "address") {
      newStyles.push(styles.containerBodyColumns);
    } else if (this.props.nameInput === "radius") {
      newStyles.push(styles.containerBodyRow);
    }

    return newStyles;
  };

  // Render radius
  renderInputRow = () => {
    return (
      <View style={styles.containerInputRadius}>
        <Input
          inputContainerStyle={{ height: hp("3%") }}
          containerStyle={styles.inputPositionRow}
          placeholderTextColor={APP_COLORS.grayColor}
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
          <Text style={styles.textBody}>m</Text>
          <Switch
            trackColor={{
              false: APP_COLORS.graySwitch,
              true: APP_COLORS.graySwitch,
            }}
            ios_backgroundColor={APP_COLORS.graySwitch}
            thumbColor={
              this.state.scaleRaddius
                ? APP_COLORS.blueColor
                : APP_COLORS.blueColor
            }
            onChange={() =>
              this.setState({ scaleRaddius: !this.state.scaleRaddius })
            }
            value={this.state.scaleRaddius}
          />
          <Text style={styles.textBody}>km</Text>
        </View>
      </View>
    );
  };

  // Render de l'address
  renderInputColumn = () => {
    return (
      <Input
        inputContainerStyle={styles.inputPositionColumns}
        placeholderTextColor={APP_COLORS.grayColor}
        placeholder={"Entrez votre adresse ici"}
        onChangeText={(inputValue) => this.setState({ inputValue })}
        onSubmitEditing={this.submitSearch}
        value={this.state.inputValue === "Default" ? "" : this.state.inputValue}
        autoCompleteType={"street-address"}
        dataDetectorTypes={"address"}
        textContentType={"addressCity"}
        errorMessage={this.renderError()}
        errorStyle={
          this.state.error === "" ? styles.inputNoError : styles.inputError
        }
        keyboardType={"default"}
        rightIcon={
          <Icon
            type="material-community"
            name="map-search"
            size={Math.round(wp("10%"))}
            color={APP_COLORS.blackColor}
            onPress={this.submitSearch}
          />
        }
      />
    );
  };

  render() {
    return (
      <View style={this.renderStyle()}>
        <Text
          style={
            this.props.nameInput === "address"
              ? [styles.textBody, styles.textBodyColumns]
              : [styles.textBody, styles.textBodyRows]
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
    backgroundColor: "#fff",

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
    color: APP_COLORS.blackColor,
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

const mapStateToProps = (store, ownProps) => {
  // En fonction des props du component, on récupère les infos dans le store
  return {
    input: store.tempSetting[ownProps.nameInput],
    isPress: store.tempSetting.isPress[ownProps.nameInput],
  };
};

const mapDispatchToProps = {
  handleChangeSettings,
  setCoord,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingInput);
