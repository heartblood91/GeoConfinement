import React, { Component, Fragment } from "react";
import { Icon } from "react-native-elements";
import { StyleSheet, View, Text } from "react-native";
import { setCoordLocalization } from "../actions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";

import { APP_COLORS } from "../styles/color";

const initialState = {
  hours: 1,
  minutes: 0,
  timerIsOn: false,
};

class ShowTimer extends Component {
  state = {
    ...initialState,
  };

  // Stop le timer au démontage pour éviter des erreurs
  componentWillUnmount = () => {
    if (this.state.timerIsOn) {
      this.stopTimer(true);
    }
  };

  // Permet de mettre en pause le timer (et de reset complétement le state)
  stopTimer = (beReset) => {
    // Stop le timer
    clearInterval(this.myInterval);

    // Est ce que je dois reset complétement le state ou simplement timerIsOn ?
    beReset
      ? this.setState({ ...initialState })
      : this.setState({ timerIsOn: false });
  };

  // Lance ou mets en pause le timer
  startOrPauseTimer = () => {
    if (this.state.timerIsOn) {
      // Je mets en pause
      this.stopTimer(false);
    } else {
      // Si le timer n'a pas été lancé alors j'initialise
      // Je passe hours à 0, minutes à 59 et je lance l'interval
      this.state.hours === 1
        ? this.setState({ hours: 0, minutes: 59, timerIsOn: true })
        : this.setState({ timerIsOn: true });

      // Je lance le timer
      this.myInterval = setInterval(() => {
        // Je récupère les informations du state
        const { minutes } = this.state;

        if (minutes === 0) {
          this.stopTimer(false);

          // Dans les autres cas, je fais défiler les minutes et je préviens que le timer est repartie
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
          }));
        }
      }, 60000);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Icon
          raised
          name={this.state.timerIsOn ? "pause" : "play"}
          type="material-community"
          color={APP_COLORS.greenColor}
          reverseColor="#fff"
          reverse
          size={Math.round(wp("7%"))}
          onPress={() => this.startOrPauseTimer()}
        />
        <Text
          style={
            this.state.minutes <= 15 && this.state.hours === 0
              ? [styles.textTimer, styles.timeIsLessThanQuarter]
              : styles.textTimer
          }
        >
          {this.state.hours < 10 ? `0${this.state.hours}` : this.state.hours}:
          {this.state.minutes < 10
            ? `0${this.state.minutes}`
            : this.state.minutes}
        </Text>

        <Icon
          raised
          name="stop"
          type="material-community"
          color={APP_COLORS.redColor}
          reverseColor="#fff"
          reverse
          size={Math.round(wp("7%"))}
          onPress={() => this.stopTimer(true)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eee",

    //Border
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.blackColor,
  },

  textTimer: {
    color: APP_COLORS.grayColor,
    fontSize: Math.round(wp("15%")),
    textAlign: "justify",
    fontWeight: "700",
  },

  timeIsLessThanQuarter: {
    color: APP_COLORS.redColor,
  },
});

const mapStateToProps = (store) => {
  return {
    storeSettings: store.setting,
  };
};

const mapDispatchToProps = {
  setCoordLocalization,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowTimer);
