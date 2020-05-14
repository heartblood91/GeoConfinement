import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import axios from "axios";

const url =
  process.env.NODE_ENV !== "production"
    ? ***REMOVED***
    : ***REMOVED***;

export const suscribeToPushNotifications = (type) => {
  Permissions.getAsync(Permissions.NOTIFICATIONS).then((existingPermission) => {
    if (existingPermission.status !== "granted") {
      Permissions.askAsync(Permissions.NOTIFICATIONS).then((permission) => {
        if (permission.status === "granted") {
          sendNotification(type);
        }
      });
    } else {
      sendNotification(type);
    }
  });
};

const sendNotification = (type) => {
  Notifications.getExpoPushTokenAsync().then((token) => {
    axios
      .get(url + "/?token=" + token + "&type=" + type)
      .then((axiosResponse) => {
        return axiosResponse.data.ticket[0].status === "ok" ? "ok" : "erreur";
      });
  });
};
