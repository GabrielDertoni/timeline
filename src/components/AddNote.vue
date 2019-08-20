<template>
  <div>
    <div class="plus-btn" @click="addNote">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddNote",
  components: {
  },
  methods: {
    addNote() {
      this.$router.push('note-form');
    }
  }
}
</script>
<style lang="scss" scoped>
  .plus-btn {
    border-radius: 50%;
    background-color: blue;
    transition: background-color 200ms;
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background-color: darkblue;
    }

    svg {
      path {
        fill: white;
      }
    }
  }
  .note-form-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #80808067;
    
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;

    form {
      background-color: white;
      width: 70vw;
    }
  }
</style>