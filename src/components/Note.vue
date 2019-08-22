<template>
  <div class="note" :style="posStyle" @click="click">
    <div :style="bacgroundColor" class="inner-container">
      <h2 :style="titleColor">{{ title }}</h2>
      <div class="description">
        <p v-for="(line, index) in description.split('\n')" :key="index">{{ line }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Note",
  props: {
    id: {
      type: String,
      required: true
    },
    posY: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: "Title Here"
    },
    description: {
      type: String,
      required: false,
      default: "Description here."
    },
    color: {
      type: String,
      required: false,
      default: "darkblue"
    },
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    posStyle() {
      return {
        top: this.posY + "px",
        height: this.height + "px"
      }
    },
    bacgroundColor() {
      return {
        'background-color': this.$root.getColor(this.color)
      }
    },
    titleColor() {
      return {
        'background-color': this.$root.getColor(this.color, true)
      }
    }
  },
  methods: {
    click() {
      this.$router.push(`note-form/${this.id}`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .note {
    cursor: pointer;
    position: absolute;
    width: 100%;
    
    .inner-container {
      overflow: hidden;
      color: white;
      border-radius: 5px;
      margin: 0 0.1em;
      height: 100%;
      display: grid;
      grid-template-rows: [start] 3em [after-title] 1fr [end];
      grid-template-columns: [start-col] 100% [end-col];
      grid-template-areas: 
        "title"
        "description";

      h2 {
        // grid-area: title;
        grid-row: start / after-title;
        grid-column: start-col / end-col;
        padding: 0.3em;
        margin: 0;
      }
      .description {
        grid-row: after-title / end;
        grid-column: start-col / end-col;
        // grid-area: description;
        margin-top: 0;
        text-align: left;
        padding: 0 1em;
        display: flex;
        flex-flow: column wrap;
        max-height: 90%;

        p {
          margin: 0;
        }
      }
    }
  }
</style>