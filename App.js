import React, { Component } from "react";
import { StatusBar } from "react-native";
import MapScreen from "./screens/map-screens";
import SettingScreen from "./screens/setting-screens";
import store from "./store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";

const Stack = createStackNavigator();

// Génère l'application avec un système de navigation entre les paramètres et l'écran principal
// Ajoute la barre haute pour que l'utilisateur conserve ces informations (heures, batterie, réseau ...)
// Récupère le store de redux pour diffusion

export default class App extends Component {
  // Ajoute un splash screen avec le logo de l'appli tant que map screen n'est pas chargé
  componentDidMount = () => {
    SplashScreen.preventAutoHideAsync();
  };

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
