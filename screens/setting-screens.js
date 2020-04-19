import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
//import { setCoordLocalization } from "../actions";
import { connect } from "react-redux";

class SettingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (store) => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
