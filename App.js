import React, { Component } from "react";
import { StatusBar } from "react-native";
import MapScreen from "./screens/map-screens";
import SettingScreen from "./screens/setting-screens";
import store from "./store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" headerMode="none">
            <Stack.Screen name="Home" component={MapScreen} />
            <Stack.Screen name="Settings" component={SettingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
