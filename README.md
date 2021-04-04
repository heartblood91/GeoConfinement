<img src="https://cdn.hidemyhome.ovh/iconBig.webp" data-canonical-src="https://cdn.hidemyhome.ovh/iconBig.webp" alt="Logo de l'appli" width="200" height="200" />

# GeoConfinement, une application android

> Application permettant de visualiser facilement et rapidement sa zone de déconfinement :mask:

## Index

- [Description](#description)
- [Screenshots](#screenshots)
- [Installation Serveur API](#installationAPI)
- [Installation de l'application android](#installationAndroid)
- [Astuce](#astuce)
- [Package](#package)
- [Confidentialité](#confidentialité)
- [Merci](#merci)

## Description

Avant de débuter, il s'agit de ma première application android! :clap::clap: Je ne suis pas développeur professionnel, juste un autodidacte passionné!

Développé en avril-mai 2020, pendant le confinement! Rappelez-vous ?! Il s'agit de cette dernière année où la population vivait sans masque, se faisait la bise, se serrait les mains et sortait dans les bars et restaurants... Ah, la belle époque comme dirait mon grand père!

A l'ouverture de l'app, vous avez accès à une carte centrée sur la France (tout le monde le sait, la France est au centre du monde :smirk: ).
<ins> Pour définir un périmètre rien de plus simple : </ins>

- Soit vous tapez votre adresse dans la barre de recherche
- Soit vous activez la géolocalisation

Un cercle bleu apparaît avec rayon de 10kms :bird:. La distance est à vol d'oiseau bien entendu! J'ai dit oiseau, pas pigeon parisien...

<ins>En cliquant sur la roue crantée, vous avez accès aux options: </ins>

- Vous avez une brève description en cliquant sur chaque bouton
- Le champs <em> adresse </em> vous permet de l'enregistrer pour éviter de la retaper!
- Le <em> compte à rebours </em>, est un timer classique fixé sur 1h pour votre promenade
- <em> Couleur zone dynamique </em>, en vert si vous êtes dans le cercle, en rouge si vous êtes en dehors. Par défaut c'est un petit cercle bleu tout mignon. Nécessite la géolocalisation pour fonctionner si non --> désactivé
- <em>Géolocalisation: </em> Permet de savoir précisément votre position pour tracer le cercle ou de vous situer par rapport à celui-ci.
- <em> Mode sombre: </em> Passe l'application et la map dans un mode nuit / mode sombre. Pour protéger vos yeux des lumières bleues :sunglasses:
-   ~~<em> Notification: </em> Selon les options activées, vous pouvez recevoir une alerte si vous sortez du périmètre ou si vous votre longue balade arrive à sa fin. (Une notification 15 minutes avant la fin et une autre à la toute fin :cry:)~~ cette fonctionnalité a été mis en commentaire.
- <em> Rayon: </em> **Vous pouvez changer la taille du périmètre**. La taille peut varier entre 1m et 1000 kms, cela vous laisse une bonne marge!

## Screenshots

### Page principal

Vous pourrez apercevoir la page principale sous sa forme classique (à gauche), en mode sombre (au milieu) et en fonctionnement avec un timer (à droite)

<img src="https://cdn.hidemyhome.ovh/mainv2.webp" data-canonical-src="https://cdn.hidemyhome.ovh/mainv2.webp" alt="Page principale de l'application" width="833" height="545" integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"/>

### Page paramètre

Vous pourrez apercevoir la page paramètre sous sa forme classique (à gauche), lors d'une pression sur un input pour obtenir plus d'information (au milieu) et en mode sombre (à droite)

<img src="https://cdn.hidemyhome.ovh/settingv2.webp" data-canonical-src="https://cdn.hidemyhome.ovh/settingv2.webp" alt="Page paramètre de l'application" width="833" height="545" />

 <section id="installationAndroid">

## Installation de l'application android

```shell
$ git clone "https://github.com/heartblood91/GeoConfinement.git" && cd GeoConfinement\
$ npm i
```

**Pour des raisons de confidentialité, certaines données sensibles ont été masquées, ou retirées dans les derniers commits. Pour que l'application fonctionne correctement suivez les instructions ci-dessous, sinon l'appli crashera**

1. Ouvrir les fichiers dans le dossier toConfigure, et renseignez les informations manquantes. Voici la liste des fichiers à modifier:

- app-sample.json
- credentials-sample.js
- AndroidManifest-sample.xml

2. Après, faîtes quelques manipulations pour déplacer les fichiers au bonne endroit:

```shell
$ mv .\toConfigure\credentials-sample.js .\toConfigure\credentials.js
$ mv .\toConfigure\app-sample.json .\app.json
$ mv .\toConfigure\AndroidManifest-sample.xml .\android\app\src\main\AndroidManifest.xml
$ mv .\toConfigure .\credentials
```

**ATTENTION**: pour que les notifications fonctionnent, il vous faut un serveur API (faîtes un tour sur mon autre repo, https://github.com/heartblood91/GeoConfinement-srv )
**Pour gagner du temps, suivez la prochaine procédure, cela vous permettra d'installer le serveur API.**

 <section id="installationAPI">

## Installation du serveur API

```shell
$ git clone "https://github.com/heartblood91/GeoConfinement-srv.git" && cd GeoConfinement-srv\
$ npm i
```

**Pour les mêmes raisons de confidentialité, certaines données sensibles ont été masquées, ou retirées dans les derniers commits. Pour que l'application fonctionne correctement suivez les instructions ci-dessous, sinon le serveur crashera**

1. Ouvrir le fichier credentials-sample.js, et renseignez les informations manquantes.

2. Après, executez la commande suivante pour renommer le fichier:

```shell
$ mv .\credentials-sample.js .\credentials.js
```

3. Pour lancer le serveur, exécuter la commande suivante

- En mode développement ou qualification:

```shell
$ npm run start
```

- En mode production:

```shell
$ npm run prod
```

Si vous souhaitez tester la bonne configuration frontend - backend sur les notifications

1. Dans le frontend (Confinement), ouvrez le fichier _map-screens_ qui se trouve dans le dossier _screens_
2. Reperez la fonction _componentDidMount_, en haut du fichier
3. Ajoutez cette ligne dans la fonction _componentDidMount_ --> **suscribeToPushNotifications();**
4. Enregistrez le fichier, vous devriez recevoir une notification test sur votre téléphone.

**ATTENTION**: Les notifications push d'expo fonctionnent uniquement sur un téléphone réél, au dernière nouvelle, elle ne fonctionne pas sur un émulateur (<a href="https://docs.expo.io/versions/latest/sdk/notifications/"> voir la doc </a>).

## Astuce

J'ai rencontré quelques difficultés lors du build. J'espère que ces "astuces" vous seront utiles!

- Maps :
  Pour afficher une map, sur android, (probalement sous Google Maps) il vous faut impérativement une clé d'API de google! Même si l'appli fonctionne parfaitement en local sur votre téléphone via Expo! Suivez la doc d'Expo à partir de <em>Configuration</em> : [https://docs.expo.io/versions/latest/sdk/map-view/](https://docs.expo.io/versions/latest/sdk/map-view/)

- Notification:
  Pour envoyer une notification push à vos utilisateur, vous aurez besoin, avec cette appli, d'un serveur backend (API REST) et d'un compte sur FCM (Firebase). En local, tout fonctionne parfaitement avec Expo, mais après le build, la notification doit passer par Google Cloud Messaging puis par votre API et pour finir sur le serveur d'Expo... Easy ! Suivez la doc d'Expo: [https://docs.expo.io/guides/using-fcm/?redirected](https://docs.expo.io/guides/using-fcm/?redirected)

N'hésitez pas si vous avez d'autres astuces!

## Package

Il s'agit juste d'une liste des packages utilisées et des mes raisons:

- React Native (La base !) --> [https://reactnative.dev/](https://reactnative.dev/)
- Expo (l'utilitaire parfait !) --> https://expo.io/
- React (On ne le sépare pas de react native) -->[https://fr.reactjs.org/](https://fr.reactjs.org/)
- React Native Maps (Indispensable pour une appli avec une carte routière) --> [https://github.com/react-native-community/react-native-maps](https://github.com/react-native-community/react-native-maps)
- Expo permissions (pour vérifier les autorisations d'envoie de notification + géolocalisation) --> [https://docs.expo.io/versions/latest/sdk/permissions/](https://docs.expo.io/versions/latest/sdk/permissions/)
- React Navigation (pour "naviguer" dans l'appli) --> [https://reactnavigation.org/](https://reactnavigation.org/)
- React Native Elements (parce que je suis une quiche en css ...) --> [https://react-native-elements.github.io/react-native-elements/](https://react-native-elements.github.io/react-native-elements/)
- React Native Responsive Screens (pour faire un semblant de responsive) --> [https://github.com/marudy/react-native-responsive-screen](https://github.com/marudy/react-native-responsive-screen)
- Redux (un caprice personnel) --> [https://redux.js.org/](https://redux.js.org/)
- Axios (pour la requête post sur le serveur API) --> [https://github.com/axios/axios](https://github.com/axios/axios)
- immer (pour éviter une mutation de state) --> [https://github.com/immerjs/immer](https://github.com/immerjs/immer)
- Geolib (pour calculer une distance entre 2 coordonnées gps) --> [https://github.com/manuelbieh/geolib](https://github.com/manuelbieh/geolib)
- react-native-locationiq (Pour le geocodage inversé. Il propose plus d'appel / jour que Google sur un compte gratuit) -->[https://locationiq.com/](https://locationiq.com/)

## Confidentialité

Je pense qu'il est important de faire un point sur l'utilisation des données.

- Les paramètres sont stockés, **non chiffrés**, dans le téléphone. Si vous enregistrez votre adresse dans les paramètres, elle sera stockée de cette manière. Lors de la suppression de l'appli', ces informations seront effacées également.

- L'application utilise votre fournisseur de carte par défaut. Dans 99% des cas, sous Android, il s'agit de Google Maps. Elle traite l'affichage de la carte (et votre localisation si l'option est activée). Google a toute ces informations avec ou sans cette appli...

- Vos données de géolocalisation ne sont pas conservées, ni transmis sur un serveur tiers. L'application se limite à un usage traditionnel de Google Maps.

- Les adresses que vous saisissez sont transmises à LocationIQ pour faire du géocodage inversé (transformer une adresse en coordonnées GPS). Elles ne sont pas stockés sur un serveur tiers en supplément

- L'application ne transmet ni ne conserve de log. Aucun outil statistique n'est utilisé.

- Je conserve uniquement, dans le cadre des notifications, 1 ligne de code par notification, sur le serveur backend, pour vérifier son bon fonctionnement et son intégrité. La durée de conservation est d'une semaine. Aucune information personnelle n'est visible.

## Merci

N'hésitez pas à faire des commentaires ou proposés des évolutions de l'application, je verrais ce que je peux faire!
:heartpulse: Merci :heartpulse:
