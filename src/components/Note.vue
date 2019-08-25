<template>
  <div class="note" :style="posStyle" @click="click">
    <div :style="bacgroundColor" class="inner-container">
      <h2 :style="titleColor">{{ title }}</h2>
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
      this.$router.push(`note-view/${this.id}`);
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
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;

      h2 {
        padding: 0.3em;
        margin: 0;
      }
    }
  }
</style>