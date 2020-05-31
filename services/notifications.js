import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import axios from "axios";
import {
  URL_DEV_BACKEND,
  URL_PROD_BACKEND,
  BACKEND_API,
} from "../credentials/credentials";

// Change la destination du serveur selon la version (prod vs qualif)
const url =
  process.env.NODE_ENV === "development" ? URL_DEV_BACKEND : URL_PROD_BACKEND;

// Vérifie les permissions de notification. Si c'est ok, alors, j'envoie la notif.
// Dans le cas contraire, je demande l'autorisation. Si l'utilisateur refuse, je ne vais pas plus loin, si il accepte alors je lui transmet la notif
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

// Génère la notif selon le type
const sendNotification = (type) => {
  Notifications.getExpoPushTokenAsync().then((token) => {
    axios
      .post(`${url}/sendNotification`, {
        token,
        secret: BACKEND_API,
        type,
      })
      .then((axiosResponse) => {
        return axiosResponse.data.ticket[0].status === "ok" ? "ok" : "erreur";
      });
  });
};
