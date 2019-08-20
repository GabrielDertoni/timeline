import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app';
import 'firebase/firestore';
import router from './router'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyDwq07XFXcu5Dy95DR_UTss5x9NEA6s7dc",
  authDomain: "timeline-c6d6c.firebaseapp.com",
  databaseURL: "https://timeline-c6d6c.firebaseio.com",
  projectId: "timeline-c6d6c",
  storageBucket: "",
  messagingSenderId: "488249470038",
  appId: "1:488249470038:web:4dc89a2b8c81d4c3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize cloud firestore through firebase
const db = firebase.firestore();

new Vue({
  render: h => h(App),
  data: {
    database: db,
    colors: {
      "pink": {
        name: "Pink",
        light: "#E67C73",
        dark: ""
      },
      "red": {
        name: "Red",
        light: "#D50000",
        dark: ""
      },
      "orange": {
        name: "Orange",
        light: "#F4511E",
        dark: ""
      },
      "yellow": {
        name: "Yellow",
        light: "#F6BF26",
        dark: ""
      },
      "lightgreen": {
        name: "Light green",
        light: "#33B679",
        dark: ""
      },
      "darkgreen": {
        name: "Dark green",
        light: "#0B8043",
        dark: ""
      },
      "lightblue": {
        name: "Light blue",
        light: "#039BE5",
        dark: ""
      },
      "darkblue": {
        name: "Dark blue",
        light: "#3F51B5",
        dark: ""
      },
      "lightpurple": {
        name: "Light purple",
        light: "#7986CB",
        dark: ""
      },
      "darkpurple": {
        name: "Dark purple",
        light: "#8E24AA",
        dark: ""
      },
      "grey": {
        name: "Grey",
        light: "#616161",
        dark: ""
      }
    }
  },
  router,
  methods: {
    getColor(title, dark=false) {
      const color = this.colors[title.toLowerCase()]
      if (!color) return undefined;
      if (dark) return color.dark;
      else return color.light;
    }
  }
}).$mount('#app')
