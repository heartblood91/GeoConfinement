import React, { Component } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { handleChangeSettings } from "../actions";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { APP_COLORS } from "../styles/color";

class SettingSwitch extends Component {
  handleChangeIsPress = () => {
    const newValue = {
      [this.props.nameSwitch]: !this.props.selectionSwitch,
    };
    this.props.handleChangeIsPress(newValue);
  };
  render() {
    return (
      <View
        style={
          this.props.selectionSwitch
            ? [styles.containerBody, styles.selectionSetting]
            : styles.containerBody
        }
      >
        <Text
          style={styles.textBody}
          onPress={() => this.handleChangeIsPress()}
        >
          {this.props.textSwitch}
        </Text>

        <Switch
          style={styles.switchPosition}
          trackColor={{
            false: APP_COLORS.graySwitch,
            true: APP_COLORS.graySwitch,
          }}
          ios_backgroundColor={APP_COLORS.graySwitch}
          thumbColor={
            this.props.valueSwitch ? APP_COLORS.greenColor : APP_COLORS.redColor
          }
          onChange={() =>
            this.props.handleChangeSettings(
              !this.props.valueSwitch,
              this.props.nameSwitch
            )
          }
          value={this.props.valueSwitch}
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
    height: hp("8%"),

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
    fontSize: Math.round(wp("7%")),
    color: APP_COLORS.blackColor,
    width: wp("72%"),
  },
  switchPosition: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
});

const mapDispatchToProps = {
  handleChangeSettings,
};

export default connect(undefined, mapDispatchToProps)(SettingSwitch);
