# About
Video chat web application using Vue, Express.js and WebRTC technology.
Project was made for my bachelor's thesis. Web app is deployed at https://video-chat3.herokuapp.com/#/.

## Used modules
Client
 * Vuetify
 * Axios
 * Socket.io
 * Vuex
Server
 * Joi
 * JWT
 * Multer
 * Sequelize
 * Socket.io
 * Bcrypt

## How to run locally
1. In the client folder add a **.env.development.local** file containing:
  * VUE_APP_ENV_BASE_URL=http://127.0.0.1:7070/
  * VUE_APP_ENV_TURN=<turn server url>
  * VUE_APP_ENV_TURN_USERNAME=<turn server username>
  * VUE_APP_ENV_TURN_CREDENTIAL=<turn server password>
2. Open a terminal and run *npm install* in the client.
3. Run *npm run serve* in the client to start the client proxy server.
4. Open a terminal and run *npm install* in the server.
5. Run *npm run dev* in the server to start a backend server.
6. Web app can be accesed with http://localhost:8080 url in the browser.
