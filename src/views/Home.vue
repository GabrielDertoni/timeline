<template>
  <div class="home">
    <div class="ticks-container">
      <Tick v-for="index in nticks+1" :posY="(index-1)*tickSpacing" :year="startDate + (index-1) * tickYearSpacing" :key="index"></Tick>
    </div>
    <Timeline
    :ticks="nticks"
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
    <div class="timeline-config">
      <h4>Timeline settings</h4>
      <form @submit.prevent="setTimeline">
        <div class="form-row">
          <div class="form-column">
            <label for="startDate">Start date:</label>
            <label for="endDate">End date:</label>
            <label for="nticks">Ticks:</label>
          </div>
          <div class="form-column">
            <input type="number" step="1" name="startDate" v-model="newStartDate" placeholder="Start date...">
            <input type="number" step="1" name="endDate" v-model="newEndDate" placeholder="End date...">
            <input type="number" step="1" name="nticks" v-model="newNTicks" placeholder="Ticks...">
          </div>
        </div>
        <input type="submit" value="Apply">
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Timeline from '../components/Timeline.vue';
import Note from '../components/Note.vue';
import AddNote from '../components/AddNote.vue';
import Tick from '../components/Tick.vue';

export default {
  name: 'home',
  components: {
    Timeline,
    Note,
    AddNote,
    Tick
  },
  data() {
    return {
      newStartDate: this.$store.state.startDate,
      newEndDate: this.$store.state.endDate,
      newNTicks: this.$store.state.nticks
    }
  },
  computed: {
    columns() {
      return this.mountColumns(this.$store.getters.notes);
    },
    timelineColumns() {
      return this.mountColumns(this.$store.getters.notes, "length");
    },
    tickSpacing() {
      const ticks = 10;
      return this.timelineHeight / this.nticks;
    },
    tickYearSpacing() {
      return this.duration / this.nticks;
    },
    ...mapState(['startDate', 'endDate', 'timelineHeight', 'nticks']),
    ...mapGetters(['duration'])
  },
  methods: {
    mountColumns(data, method="height") {
      const filtered = method === "height" ? 
        data.filter(el => el.startDate >= this.startDate && el.startDate <= this.endDate) :
        data.filter(el => el.startDate <= this.endDate && el.startDate + el.duration >= this.startDate);
      
      if (filtered.length === 0) return [];
      const sorted = filtered.sort((a, b) => a.startDate - b.startDate);
      const columns = [[sorted[0]]];
      for (let i = 1; i < sorted.length; i++) {
        let minEnd = Infinity;
        let minEndColumn = 0;
        for (let c = 0; c < columns.length; c++) {
          const note = columns[c][columns[c].length-1];
          const size = method === "height" ? note.height : note.length;
          if (note.posY + size <= sorted[i].posY) {
            minEnd = note.posY + size;
            minEndColumn = c;
            break;
          }
          if (note.posY + size < minEnd) {
            minEnd = note.posY + size;
            minEndColumn = c;
          }
        }
        if (sorted[i].posY >= minEnd || minEnd === Infinity) columns[minEndColumn].push(sorted[i]);
        else columns.push([sorted[i]]);
      }
      return columns;
    },
    setTimeline() {
      this.$store.commit('config-timeline', {
        startDate: this.newStartDate,
        endDate: this.newEndDate,
        nticks: this.newNTicks
      })
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
.timeline-config {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-flow: column nowrap;
  margin: 0.5em 0.5em 0 0;

  h4 {
    margin: 0.3em 0;
  }
  .form-row {
    display: flex;
    flex-flow: row nowrap;
    
    & .form-column:not(:first-child) {
      margin-left: 0.5em;
    }
  }
  .form-column {
    display: flex;
    flex-flow: column nowrap;
  }
  form {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    label {
      text-align: left;
    }
    label, input {
      margin-top: 0.3em;
    }
    input {
      width: 60px;
    }
  }
}
.ticks-container {
  position: relative;
  margin-left: .5em;
  width: 12px;
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