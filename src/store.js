import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { find } from 'lodash'

Vue.use(Vuex);

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
const database = firebase.firestore();
const valOrNull = val => val !== undefined ? val : null;
const currentEvent = {
  state: {
    loading: true,
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    duration: null,
    description: null,
    color: null
  },
  getters: {
    'id': state => state.id !== null ? state.id : undefined
  },
  mutations: {
    'refactor': (state, payload) => {
      for (const key in state) {
        state[key] = valOrNull(payload[key]);
      }
    }
  },
  actions: {
    'fetch': async ({ commit }, id) => {
      return await database.collection('notes')
        .doc(id)
        .get().then(snapshot => {
          const data = snapshot.data();
          const endDate = data.duration ? data.date + data.duration : null;
          commit('refactor', {
            id: snapshot.id,
            title: data.title,
            endDate,
            startDate: data.date,
            duration: data.duration,
            description: data.description,
            color: data.color,
            loading: false
          });
        });
    }
  }
}

export default new Vuex.Store({
  modules: {
    currentEvent: {
      namespaced: true,
      ...currentEvent
    }
  },
  state: {
    startDate: 1900,
    endDate: 2000,
    timelineHeight: 1000,
    nticks: 10,
    notes: []
  },
  getters: {
    notes: state => state.notes,
    duration: state => state.endDate - state.startDate,
    getNoteById: (state, getters) => id => find(getters.notes, { id })
  },
  mutations: {
    'reset-notes': state => state.notes = [],
    'push-note': (state, note) => state.notes.push(note),
    'refactor-notes': (state, newNotes) => {
      state.notes = newNotes;
    },
    'config-timeline': (state, payload) => {
      state.startDate = parseInt(payload.startDate);
      state.endDate = parseInt(payload.endDate);
      state.nticks = parseInt(payload.nticks);
      for(let i = 0; i < state.notes.length; i++) {
        const note = state.notes[i];
        note.posY = state.timelineHeight * (note.startDate - state.startDate) / (state.endDate - state.startDate);
        note.length = state.timelineHeight * note.duration / (state.endDate - state.startDate);
      }
    }
  },
  actions: {
    'fetch': async ({ commit, getters, state }) => {
      await database.collection('notes')
        .onSnapshot(snapshot => {
          commit('reset-notes');
          snapshot.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            const posY = state.timelineHeight * (data.date - state.startDate) / getters.duration;
            const height = 60;
            const length = data.duration ?
              state.timelineHeight * data.duration / getters.duration :
              60;

            const duration = data.duration ? data.duration : length * getters.duration / height;
            const endDate = data.duration ? data.date + data.duration : data.date + duration;
            
            commit('push-note', {
              id,
              posY,
              height,
              length,
              endDate,
              duration,
              title: data.title,
              color: data.color,
              startDate: data.date,
              description: data.description
            });
          })
        });
    },
    'select-event': async ({ dispatch, commit, getters }, id) => {
      if (getters.getNoteById(id)) {
        if (getters['currentEvent/id'] !== id)
          return await Promise.resolve(commit('currentEvent/refactor', getters.getNoteById(id)));
      } else {
        return await dispatch('currentEvent/fetch', id);
      }
    },
    'delete-event': async (_, id) => {
      return await database.collection('notes')
        .doc(id)
        .delete();
    },
    'update-event': async ({ dispatch }, payload) => {
      await database.collection('notes')
        .doc(payload.id)
        .update(payload.note);
      return await dispatch('fetch');
    },
    'create-event': async (_, note) => {
      return await database.collection('notes').add(note);
    }
  }
})
