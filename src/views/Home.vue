<template>
  <div class="home">
    <Timeline
    :height="timelineHeight"
    :ticks="10"
    :columns="timelineColumns"
    ></Timeline>
    <div class="row">
      <div class="column" v-for="(column, index) in columns" :key="index">
        <Note
        v-for="(note, noteIdx) in column"
        :id="note.id"
        :posY="note.posY"
        :height="note.height"
        :color="note.color"
        :title="note.title"
        :description="note.description"
        :key="`${index}-${noteIdx}`"
        ></Note>
      </div>
    </div>
    <AddNote></AddNote>
  </div>
</template>

<script>
import Timeline from '../components/Timeline.vue';
import Note from '../components/Note.vue';
import AddNote from '../components/AddNote.vue';

export default {
  name: 'home',
  components: {
    Timeline,
    Note,
    AddNote
  },
  data() {
    return {
      startTime: 1900,
      endTime: 2000,
      timelineHeight: 1000,
      columns: [],
      timelineColumns: []
    }
  },
  mounted() {
    const data = [];
    this.$root.database.collection('notes').onSnapshot((snapshot => {
      snapshot.forEach((doc => {
        const element = doc.data();
        element.id = doc.id;
        element.posY = this.timelineHeight * (element.date - this.startTime) / (this.endTime - this.startTime);
        const nlines = element.description.split('\n').length;
        // element.height = 60 + 19 * nlines;
        element.height = 60;
        element.length = this.timelineHeight * element.duration / (this.endTime - this.startTime);
        data.push(element);
      }).bind(this));
      this.columns = this.mountColumns(data);
      this.timelineColumns = this.mountColumns(data, "length");
    }).bind(this));
  },
  methods: {
    mountColumns(data, method="height") {
      const filtered = method === "height" ? 
        data.filter(el => el.date >= this.startTime && el.date <= this.endTime) :
        data.filter(el => el.date <= this.endTime && el.date + el.duration >= this.startTime);
      
      if (filtered.length === 0) return [];
      const sorted = filtered.sort((a, b) => a.date - b.date);
      const columns = [[sorted[0]]];
      for (let i = 1; i < sorted.length; i++) {
        let minEnd = Infinity;
        let minEndColumn = undefined;
        for (let c = 0; c < columns.length; c++) {
          const note = columns[c][columns[c].length-1];
          const size = method === "height" ? note.height : note.length;
          if (note.posY + size < minEnd) {
            minEnd = note.posY + size;
            minEndColumn = c;
          }
        }
        if (sorted[i].posY >= minEnd) columns[minEndColumn].push(sorted[i]);
        else columns.push([sorted[i]]);
      }
      return columns;
    }
  }
}
</script>
<style lang="scss">
.home {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
}
.row {
  margin: 10px 0 0 10px;
  width: 100%;

  display: grid;
  grid-template-rows: [start] 0 100% [end];

  .column {
    position: relative;
    grid-row: start / end;
    width: 100%;
  }
}
</style>