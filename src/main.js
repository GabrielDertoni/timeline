import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data: {
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
  created() {
    this.$store.dispatch('fetch');
  },
  router,
  store,
  methods: {
    getColor(title, dark=false) {
      const color = this.colors[title.toLowerCase()]
      if (!color) return undefined;
      if (dark) return color.dark;
      else return color.light;
    }
  }
}).$mount('#app')
