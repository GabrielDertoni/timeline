<template>
  <div class="note-view" :style="fontStyle">
    <div class="background" :style="backgroundStyle"></div>
    <div class="header">
      <router-link class="back" to="/">
        <svg :style="svgStyle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
      </router-link>
      <router-link class="edit" :to="`/note-form/${$route.params.id}`">
        <svg :style="svgStyle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 14.45v6.55h-16v-12h6.743l1.978-2h-10.721v16h20v-10.573l-2 2.023zm1.473-10.615l1.707 1.707-9.281 9.378-2.23.472.512-2.169 9.292-9.388zm-.008-2.835l-11.104 11.216-1.361 5.784 5.898-1.248 11.103-11.218-4.536-4.534z"/></svg>
      </router-link>
      <h1>{{ title }}</h1>
    </div>
    <Loading v-if="loading"></Loading>
    <div v-else class="inner-container">
      <div class="container">
        <h4>Start date: {{ startDate }}</h4>
        <h4>End date: {{ endDate }}</h4>
      </div>
      <div class="description">
        <h3>Description</h3>
        <div v-for="(obj, index) in parsedDescription" :key="`p-${index}`">
          <ol v-if="obj.type === 'ol'">
            <li v-for="(line, liIndex) in obj.lines" :key="`p-${index}-ol-${liIndex}`">{{ line }}</li>
          </ol>
          <ul v-else-if="obj.type === 'ul'">
            <li v-for="(line, liIndex) in obj.lines" :key="`p-${index}-ol-${liIndex}`">{{ line }}</li>
          </ul>
          <p v-else v-for="(line, lineIndex) in obj.lines" :key="`p-${index}-ol-${lineIndex}`">{{ line }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from '../components/Loading.vue';

export default {
  name: "NoteView",
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
      color: ""
    }
  },
  computed: {
    colors() {
      return this.$root.colors;
    },
    parsedDescription() {
      const lines = this.description.split('\n');
      const parsed = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.indexOf("- ") === 0) {
          line = line.substring(2, line.length);
          let type;
          if (parsed.length === 0) type = undefined;
          else type = parsed[parsed.length-1].type;

          if (type === "ul") {
            parsed[parsed.length-1].lines.push(line);
          } else {
            parsed.push({
              type: "ul",
              lines: [
                line
              ]
            });
          }
        } else if (line.search(/(\d\. )+/g) === 0) {
          line = line.substring(line.match(/(\d\. )+/)[0].length, line.length);
          let type;
          if (parsed.length === 0) type = undefined;
          else type = parsed[parsed.length-1].type;

          if (type === "ol") {
            parsed[parsed.length-1].lines.push(line);
          } else [
            parsed.push({
              type: "ol",
              lines: [
                line
              ]
            })
          ]
        } else {
          let type;
          if (parsed.length === 0) type = undefined;
          else type = parsed[parsed.length-1].type;

          if (type === "p") {
            parsed[parsed.length-1].lines.push(line);
          } else {
            parsed.push({
              type: "p",
              lines: [
                line
              ]
            });
          }
        }
      }
      return parsed;
    },
    backgroundStyle() {
      const color = this.color ? this.$root.getColor(this.color) : "white";
      return {
        'background-color': color
      }
    },
    svgStyle() {
      return {
        'fill': 'white'
      }
    },
    fontStyle() {
      return {
        'color': 'white'
      }
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
        this.color = data.color;
        this.loading = false;
      }).bind(this));
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  z-index: -1;
}
.note-view {
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
    .edit {
      position: absolute;
      right: 0;
      margin: 1em;
      cursor: pointer;
    }
    h1 {
      margin: .3em 0;
    }
  }
  .inner-container {
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
      h4 {
        margin: 0.3em 0;
      }
    }
    .description {
      margin-top: .8em;
      padding: 0.5em 0.3em;
      text-align: left;
      h3 {
        margin-bottom: 0;
      }
      ul, ol {
        margin: 0.3em 0;
      }
    }
  }
}
</style>