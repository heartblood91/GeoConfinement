import produce from "immer";
import {
  SET_SETTING,
  SET_LOCATION,
  SET_ADDRESS,
  SET_IS_PRESS,
  SYNCHRO_SETTING,
  SYNCHRO_SETTING_INIT,
} from "./action-types";

export const setCoord = (geocode, actionTypeBrute) => {
  return function (dispatch) {
    const actionType =
      actionTypeBrute === "location" ? SET_LOCATION : SET_ADDRESS;

    dispatch({ type: actionType, payload: geocode });
  };
};

export const handleChangeSettings = (name, type, inputValue) => {
  const actionType = type === "isPress" ? SET_IS_PRESS : SET_SETTING;

  return function (dispatch) {
    dispatch({ type: actionType, payload: { name, type, inputValue } });
  };
};

export const syncroTempToSettings = (tempSetting) => {
  return function (dispatch) {
    dispatch({ type: SYNCHRO_SETTING, payload: { ...tempSetting } });
  };
};

export const initSettingWithStorage = (storageSetting, reducerTempSetting) => {
  // Créé un nouveau storageSetting adapté au tempSetting
  const newStorageSetting = produce(
    reducerTempSetting,
    (draftStorageSetting) => {
      draftStorageSetting.timer.value = storageSetting.timer;
      draftStorageSetting.visualWarning.value = storageSetting.visualWarning;
      draftStorageSetting.geolocation.value = storageSetting.geolocation;
      draftStorageSetting.nightMode.value = storageSetting.nightMode;
      draftStorageSetting.notification.value = storageSetting.notification;
      draftStorageSetting.radius.value = storageSetting.radius;
      draftStorageSetting.address.coord = storageSetting.address.coord;
      draftStorageSetting.address.value = storageSetting.address.value;
    }
  );

  //Ajout de searchLocation ssi adresse.value est une saisie de l'utilisateur
  if (
    storageSetting.address.value !== "Géolocalisation" &&
    storageSetting.address.value !== "Default"
  ) {
    Object.assign(storageSetting, {
      searchlocation: {
        value: storageSetting.address.value,
        coord: {
          ...storageSetting.address.coord,
        },
      },
    });
  }

  return function (dispatch) {
    dispatch({ type: SYNCHRO_SETTING, payload: { ...storageSetting } });
    dispatch({ type: SYNCHRO_SETTING_INIT, payload: { ...newStorageSetting } });
  };
};
