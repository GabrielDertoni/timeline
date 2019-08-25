<template>
  <div :style="posStyle">
    <h4>{{ Math.round(year) }}</h4>
  </div>
</template>
<script>
export default {
  name: "Tick",
  props: {
    posY: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  computed: {
    posStyle() {
      return {
        'top': this.posY + "px"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
div {
  position: absolute;
  left: 0;
  h4 {
    margin: 0;
  }
}
</style>