# Cerebral-Demo

This application is a simple time-tracker built with `cerebral`, `@cerebral/firebase`, `@cerebral/forms` and `@cerebral/router`. It serves as an example on how all these modules work together to create a complete application with relational data, login, time based events and so on.

This project is an ongoing community effort so if you feel like you could add some features, please join in !


## Firebase setup

In case you want to run this application on your own firebase project, please follow the following steps:

### Config

Copy the `web app` config data from the firebase console into `src/firebaseConfig.js`.

### Authentification

Enable `email/password` authentification in the firebase console.

### Security rules

Set these security rules in the database section of the firebase console:

```js
{
  "rules": {
    "$uid": {
      "clients": {
        ".indexOn": "updated_at"
      },
      "projects": {
        ".indexOn": "updated_at"
      },
      "tasks": {
        ".indexOn": "updated_at"
      },  
      ".read": "auth != null && $uid == auth.uid",
      ".write": "auth != null && $uid == auth.uid"
    },
    ".read": false,
    ".write": false
  }
}
```

## Start application

Once the dependencies are installed, start the application with:

```
npm run start
```
