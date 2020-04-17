import React, { Component } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";

import { SearchBar } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { connect } from "react-redux";

const DEFAULT_COORD = {
  lat: 48.859268,
  lng: 2.34706,
};

class SearchScreen extends Component {
  state = { search: "" };

  updateSearch = (search) => {
    this.setState({ search });
  };

  submitSearch = () => {
    console.log(this.state.search);
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: DEFAULT_COORD.lat,
            longitude: DEFAULT_COORD.lng,
            latitudeDelta: 0.2,
            longitudeDelta: 0.1,
          }}
          scrollEnabled={false}
          liteMode={true}
        />
        <SearchBar
          lightTheme
          onChangeText={this.updateSearch}
          value={this.state.search}
          onSubmitEditing={this.submitSearch}
          placeholder="Entrez votre ville..."
          containerStyle={{
            position: "absolute",
            top: hp("5%"),
            left: wp("5%"),
            width: wp("90%"),
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (store) => {
  return {
    currentParams: store.params.data,
  };
};

export default connect(mapStateToProps, undefined)(SearchScreen);
