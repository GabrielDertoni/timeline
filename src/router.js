import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import NoteForm from './views/NoteForm.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/note-form/:id?',
      name: 'add-note',
      component: NoteForm
    }
  ]
})
