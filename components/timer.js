import React, { Component, Fragment } from "react";
import { Icon } from "react-native-elements";
import { StyleSheet, View, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";

import { APP_COLORS } from "../styles/color";
import { suscribeToPushNotifications } from "../services/notifications";

const initialState = {
  hours: 1,
  minutes: 0,
  timerIsOn: false,
  notificationIsSend: {
    timer15: false,
    timer0: false,
  },
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

        // Si les notifications sont autorisées, alors je préviens l'utilisateur que le compteur est soit à 15 soit à 0
        this.props.notification &&
          (minutes === 0 || minutes === 15) &&
          this.senderNotification("timer" + minutes);

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

  // Envoie une notif (soit timer0 soit timer15)
  senderNotification = (type) => {
    suscribeToPushNotifications(type);
    this.setState({
      notificationIsSend: {
        ...this.state.notificationIsSend,
        [type]: true,
      },
    });
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

export default connect(mapStateToProps, undefined)(ShowTimer);
