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
  state = { inputValue: "", error: "", submitLocation: false };

  handleChangeIsPress = () => {
    const newValue = {
      [this.props.nameInput]: !this.props.selectionInput,
    };
    this.props.handleChangeIsPress(newValue);
  };

  componentDidMount = () => {
    // Init le state avec une adresse si et seulement si elle existe dans le reducer
    if (this.props.valueInput !== "") {
      const valueToInput =
        this.props.nameInput === "address"
          ? this.props.valueInput.name
          : this.props.valueInput;

      this.setState({
        inputValue: valueToInput,
      });
    }
  };

  // Mets à jour le texte dans la search bar
  updateInput = (inputValue) => {
    this.setState({ inputValue });
  };

  submitSearch = () => {
    // Init le module avec l'API Key:
    LocationIQ.init("***REMOVED***"); // masquer l'API KEY sur Github

    // Puis effectue la recherche
    LocationIQ.search(this.state.inputValue)
      .then((json) => {
        // Récupère les coordonnées
        const searchAddress = {
          name: this.state.inputValue.trim(),
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

  renderStyle = () => {
    let newStyles = [];
    if (this.props.selectionInput) {
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
      <Input
        inputContainerStyle={styles.inputPositionRow}
        placeholderTextColor={APP_COLORS.grayColor}
        maxLength={6}
        placeholder={"Distance en m"}
        onChangeText={this.updateInput}
        value={this.state.inputValue.toString()}
        keyboardType={"number-pad"}
      />
    );
  };

  // Render de l'address
  renderInputColumn = () => {
    return (
      <Input
        inputContainerStyle={styles.inputPositionColumns}
        placeholderTextColor={APP_COLORS.grayColor}
        placeholder={"Entrez votre adresse ici"}
        onChangeText={this.updateInput}
        onSubmitEditing={this.submitSearch}
        value={this.state.inputValue}
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
          onPress={() => this.handleChangeIsPress()}
        >
          {this.props.textInput}
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
    width: wp("68%"),
  },
  inputPositionRow: {
    maxWidth: wp("14%"),
    maxHeight: hp("4%"),
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

const mapDispatchToProps = {
  handleChangeSettings,
  setCoord,
};

export default connect(undefined, mapDispatchToProps)(SettingInput);
