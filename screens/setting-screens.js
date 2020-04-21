import React, { Component } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { Icon } from "react-native-elements";
import { handleChangeSettings } from "../actions";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import SettingSwitch from "../components/settingSwitch";
import { APP_COLORS } from "../styles/color";

class SettingScreen extends Component {
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
        <View style={styles.containerSetting}>
          <SettingSwitch
            textSwitch={"Géolocalisation"}
            nameSwitch={"geolocalisation"}
            valueSwitch={this.props.storeSettings.geolocalisation}
          />
          <SettingSwitch
            textSwitch={"Notification"}
            nameSwitch={"notification"}
            valueSwitch={this.props.storeSettings.notification}
          />
          <SettingSwitch
            textSwitch={"Couleur zone dynamique"}
            nameSwitch={"visualWarning"}
            valueSwitch={this.props.storeSettings.visualWarning}
          />
          <SettingSwitch
            textSwitch={"Compte à rebours"}
            nameSwitch={"timer"}
            valueSwitch={this.props.storeSettings.timer}
          />
          <SettingSwitch
            textSwitch={"Mode nuit"}
            nameSwitch={"nightMode"}
            valueSwitch={this.props.storeSettings.nightMode}
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
    justifyContent: "center",
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
