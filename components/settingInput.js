import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
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
  state = { search: "", error: "", submitLocation: false };

  handleChangeIsPress = () => {
    const newValue = {
      [this.props.nameInput]: !this.props.selectionInput,
    };
    this.props.handleChangeIsPress(newValue);
  };

  componentDidMount = () => {
    // Init le state avec une adresse si et seulement si elle existe dans le reducer
    if (this.props.valueInput !== "") {
      this.setState({
        search: this.props.valueInput.name,
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
        const searchAddress = {
          name: this.state.search.trim(),
          coord: {
            lat: parseFloat(json[0].lat),
            lon: parseFloat(json[0].lon),
          },
        };

        // Je préviens que le formulaire a été soumis SANS erreur
        this.setState({ error: "", submitLocation: true });

        // Puis les envoies au reducer pour mise à jour
        this.props.setCoord(searchAddress, "ADDRESS");
      })
      // Je préviens que le formulaire a été soumis AVEC erreur
      .catch((error) => this.setState({ error, submitLocation: true }));
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

  render() {
    return (
      <View
        style={
          this.props.selectionInput
            ? [styles.containerBody, styles.selectionSetting]
            : styles.containerBody
        }
      >
        <Text
          style={styles.textBody}
          onPress={() => this.handleChangeIsPress()}
        >
          {this.props.textInput}
        </Text>

        <Input
          inputContainerStyle={styles.inputPosition}
          placeholderTextColor={APP_COLORS.grayColor}
          placeholder="Entrez votre adresse ici"
          onChangeText={this.updateSearch}
          onSubmitEditing={this.submitSearch}
          value={this.state.search}
          errorStyle={{ color: "red" }}
          autoCompleteType={"street-address"}
          dataDetectorTypes={"address"}
          textContentType={"addressCity"}
          errorMessage={this.renderError()}
          errorStyle={
            this.state.error === "" ? styles.inputNoError : styles.inputError
          }
          keyboardType={
            this.props.nameInput === "radius" ? "number-pad" : "default"
          }
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerBody: {
    justifyContent: "center",
    alignItems: "flex-start",
    height: hp("12%"),

    // Marge et padding:
    marginHorizontal: Math.round(wp("4%")),
    paddingHorizontal: Math.round(wp("3%")),
    marginVertical: Math.round(hp("1.1%")),

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
    width: wp("88%"),
  },
  inputPosition: {
    maxWidth: wp("80%"),
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

const mapDispatchToProps = {
  handleChangeSettings,
  setCoord,
};

export default connect(undefined, mapDispatchToProps)(SettingInput);
