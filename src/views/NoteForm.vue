<template>
  <div class="note-form">
    <div class="header">
      <router-link class="back" :to="$route.params.id ? `/note-view/${$route.params.id}` : '/'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
      </router-link>
      <h1>{{ id ? 'Edit Event' : 'Add Event' }}</h1>
    </div>
    <Loading v-if="loading"></Loading>
    <form v-else @submit.prevent="submit">
      <input type="text" name="title" v-model="title" placeholder="Event title" required>
      <div class="container">
        <input type="number" step="1" name="start-date" v-model="startDate" placeholder="Start date" required>
        <input type="number" step="1" name="end-date" v-model="endDate" placeholder="End date">
      </div>
      <textarea name="description" cols="30" rows="10" v-model="description" placeholder="Event description..." required></textarea>
      <div class="color-selection">
        <label v-for="(color, index) in colors" class="radio-container" :for="index" :key="index">{{ color.name }}
          <input type="radio" name="color" :id="index" :value="index" v-model="selectedColor" required>
          <span class="checkmark" :style="{ 'background-color': color.light }"></span>
        </label>
      </div>
      <input type="submit" value="Enviar">
    </form>
  </div>
</template>
<script>
import Loading from '../components/Loading.vue';

export default {
  name: "NoteForm",
  components: {
    Loading
  },
  data() {
    return {
      id: this.$route.params.id,
      loading: this.$route.params.id ? true : false,
      startDate: "",
      endDate: "",
      title: "",
      description: "",
      selectedColor: "darkblue"
    }
  },
  computed: {
    colors() {
      return this.$root.colors;
    }
  },
  created() {
    if (this.id) {
      this.$root.database.collection('notes').doc(this.id).get().then((snapshot => {
        const data = snapshot.data();
        this.title = data.title;
        this.startDate = data.date;
        this.endDate = parseInt(data.date) + parseInt(data.duration);
        this.description = data.description;
        this.selectedColor = data.color;
        this.loading = false;
      }).bind(this));
    }
  },
  methods: {
    submit() {
      const note = {
        date: parseInt(this.startDate),
        color: this.selectedColor,
        title: this.title,
        description: this.description
      }
      if (this.endDate) note.duration = parseInt(this.endDate) - parseInt(this.startDate);
      if (this.id) {
        this.loading = true;
        this.$root.database.collection('notes').doc(this.id).update(note).then(ref => {
          // this.$emit('submit');
          this.$router.push({ name: "home" });
        });
      } else {
        this.$root.database.collection('notes').add(note).then(ref => {
          // this.$emit('submit');
          this.$router.push({ name: "home" });
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
.note-form {
  display: flex;
  flex-flow: column nowrap;

  .header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    
    .back {
      position: absolute;
      left: 0;
      margin: 1em;
      cursor: pointer;
    }

    h1 {
      margin: .3em 0;
    }
  }
  form {
    display: flex;
    flex-flow: column nowrap;
    padding: 1em;
    border-radius: 5px;
    font-family: 'Roboto', sans-serif;

    .container {
      display: grid;
      // flex-flow: row nowrap;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 0.5em;
      width: 100%;
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
    }
    .color-selection {
      margin-top: 1em;
      display: flex;
      flex-flow: column wrap;
      width: fit-content;
      align-items: flex-start;
      height: 100px;

      @media screen and(max-width: 500px){
        height: 180px;
      }

      .radio-container {
        margin-right: 1.5em;
        display: block;
        position: relative;
        padding-left: 25px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 15px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        input {
          visibility: hidden;
          position: absolute;
          opacity: 0;
          cursor: pointer;

          &:checked ~ .checkmark {
            background-color: #2196F3;
          }
          &:checked ~ .checkmark {
            display: block;
            border: solid white 1px;

            &:after {
              display: block;
            }
          }
        }
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          box-sizing: border-box;

          &:after {
            $padding: -3px;

            content: "";
            display: none;
            position: absolute;
            top: $padding;
            right: $padding;
            bottom: $padding;
            left: $padding;
            // width: 100%;
            // height: 100%;
            border: solid #555555 2px;
            box-sizing: border-box;
            border-radius: 50%;
          }
        }
        &:hover input ~ .checkmark {
          background-color: #ccc;
        }
      }
    }
    input, textarea {
      margin-top: .8em;
      border-radius: 5px;
      padding: 0.5em 0.3em;
      border: solid rgb(161, 161, 161) 1px;
      font-family: 'Roboto', sans-serif;

      &::placeholder {
        font-family: 'Roboto', sans-serif;
      }
    }
    input[type=submit] {
      background-color: gray;
      color: white;
      font-weight: bold;
      font-size: 20px;
      padding: 0.3em 0;
    }
  }
}
</style>