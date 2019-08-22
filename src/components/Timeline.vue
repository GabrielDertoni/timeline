<template>
  <canvas></canvas>
</template>
<script>
export default {
  name: "Timeline",
  props: {
    height: Number,
    ticks: Number,
    columns: Array
  },
  data() {
    return {
      width: 30,
      margin: 10,
      lineColor: "#3f3f3f",
      timelinewidth: 10,
      tickWidth: 5,
      timelineMarkerWidth: 15,
      tickSize: 20
    }
  },
  watch: {
    columns: {
      deep: true,
      handler() {
        this.drawTimeline();
      }
    }
  },
  computed: {
    tickSpacing() {
      return this.height / this.ticks;
    }
  },
  mounted() {
    this.width = this.timelineMarkerWidth * this.columns.length + 30;
    this.$el.width = this.getPixelWidth();
    this.$el.height = this.getPixelHeight();
    this.drawTimeline();
  },
  methods: {
    getPixelWidth() {
      return (this.width + 2 * this.margin);
    },
    getPixelHeight() {
      return (this.height + 2 * this.margin);
    },
    updateWidth() {
      this.width = this.timelineMarkerWidth * this.columns.length + this.tickSize + this.timelinewidth;
      this.$el.width = this.getPixelWidth();
    },
    drawTimeline() {
      this.updateWidth();
      const context = this.$el.getContext("2d");
      const lineColor = "#3f3f3f";

      context.lineWidth = this.timelinewidth;
      context.strokeStyle = lineColor;
      
      const timelineX = this.margin + this.timelinewidth / 2 + this.tickSize;
      // Draw timeline.
      context.beginPath();
      context.moveTo(timelineX, this.margin);
      context.lineTo(timelineX, this.margin + this.height);
      context.stroke();

      const ticksX = timelineX + this.timelinewidth / 2;
      // Draw timeline ticks.
      for (let i = 0; i <= this.ticks; i++) {
        context.lineWidth = this.tickWidth;
        context.beginPath();
        context.moveTo(ticksX, this.margin + this.tickSpacing * i);
        context.lineTo(ticksX - this.tickSize, this.margin + this.tickSpacing * i);
        context.stroke();
      }

      for (let i = this.columns.length-1; i >= 0 ; i--) {
        for (let j = 0; j < this.columns[i].length; j++) {
          const note = this.columns[i][j];
          const color = this.$root.getColor(note.color);
          context.fillStyle = color;
          context.strokeStyle = color;
          if (note.posY < 0) {
            const length = note.length + note.posY;
            this.drawRect(
              context,
              timelineX + this.timelinewidth / 2, this.margin - Math.ceil(this.tickWidth / 2),
              this.timelineMarkerWidth * (i + 1), length + Math.ceil(this.tickWidth / 2),
              0, 0, 10, 0
            );
          } else if (note.posY + note.length > this.height) {
            const length = this.height - note.posY;
            this.drawRect(
              context,
              timelineX + this.timelinewidth / 2, this.margin + note.posY,
              this.timelineMarkerWidth * (i + 1), length + Math.ceil(this.tickWidth / 2),
              0, 10, 0, 0
            );
          } else {
            this.drawRect(
              context,
              timelineX + this.timelinewidth / 2, this.margin + note.posY,
              this.timelineMarkerWidth * (i + 1), note.length,
              0, 10, 10, 0
            );
          }
        }
      }
    },
    // drawRect(context, rectX, rectY, rectWidth, rectHeight, cornerRadius) {
    //   context.lineWidth = cornerRadius;
    //   context.lineJoin = "round";
    //   context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    //   context.beginPath();
    //   context.moveTo(rectX, rectY+(cornerRadius/2));
    //   context.lineTo(rectX+(cornerRadius/2) + rectWidth-cornerRadius, rectY+(cornerRadius/2));
    //   context.lineTo(rectX+(cornerRadius/2) + rectWidth-cornerRadius, rectY+(cornerRadius/2) + rectHeight-cornerRadius);
    //   context.lineTo(rectX, rectY+(cornerRadius/2) + rectHeight-cornerRadius);
    //   context.stroke();

    //   context.fillRect(rectX, rectY+(cornerRadius/2), rectWidth-(cornerRadius/2), rectHeight-cornerRadius);
    // }
    drawRect(context, rectX, rectY, rectWidth, rectHeight, topLeftCornerRadius, topRightCornerRadius, bottomRightCornerRadius, bottomLeftCornerRadius) {
      if (
        topLeftCornerRadius === undefined &&
        topRightCornerRadius === undefined &&
        bottomRightCornerRadius === undefined &&
        bottomLeftCornerRadius === undefined
      ) {
        context.fillRect(rectX, rectY, rectWidth, rectHeight);
      } else {
        function getMinCornerRadius() {
          const tl = topLeftCornerRadius ? topLeftCornerRadius : Infinity;
          const tr = topRightCornerRadius ? topRightCornerRadius : Infinity;
          const br = bottomRightCornerRadius ? bottomRightCornerRadius : Infinity;
          const bl = bottomLeftCornerRadius ? bottomLeftCornerRadius : Infinity;
          return Math.min(tl, tr, br, bl);
        }
        const minCornerRadius = getMinCornerRadius();

        function getMaxCornerRadius() {
          const tl = topLeftCornerRadius ? topLeftCornerRadius : 0;
          const tr = topRightCornerRadius ? topRightCornerRadius : 0;
          const br = bottomRightCornerRadius ? bottomRightCornerRadius : 0;
          const bl = bottomLeftCornerRadius ? bottomLeftCornerRadius : 0;
          return Math.max(tl, tr, br, bl);
        }
        const maxCornerRadius = getMaxCornerRadius();
        context.fillRect(rectX, rectY+maxCornerRadius, rectWidth, rectHeight-maxCornerRadius*2);
        context.fillRect(rectX+maxCornerRadius, rectY, rectWidth-(maxCornerRadius*2), maxCornerRadius);
        context.fillRect(rectX+maxCornerRadius, rectY+rectHeight-maxCornerRadius, rectWidth-(maxCornerRadius*2), maxCornerRadius);

        /**
         * Top left corner
         */
        if (topLeftCornerRadius !== undefined) {
          context.lineWidth = topLeftCornerRadius;
          context.lineJoin = "round";
        } else {
          topLeftCornerRadius = minCornerRadius;
          context.lineWidth = topLeftCornerRadius;
          context.lineJoin = "miter";
        }
        if (topLeftCornerRadius < maxCornerRadius) {
          const buffJoin = context.lineJoin;
          const buffWidth = context.lineWidth;
          const w = maxCornerRadius - topLeftCornerRadius;
          context.lineJoin = "miter";
          context.lineWidth = w;
          context.beginPath();
          context.moveTo(rectX, rectY+topLeftCornerRadius+(w/2));
          context.lineTo(rectX+topLeftCornerRadius+(w/2), rectY+topLeftCornerRadius+(w/2));
          context.lineTo(rectX+topLeftCornerRadius+(w/2), rectY);
          context.stroke();

          context.lineJoin = buffJoin;
          context.lineWidth = buffWidth
        }
        context.beginPath();
        context.moveTo(rectX+(topLeftCornerRadius/2), rectY+topLeftCornerRadius);
        context.lineTo(rectX+(topLeftCornerRadius/2), rectY+(topLeftCornerRadius/2));
        context.lineTo(rectX+topLeftCornerRadius, rectY+(topLeftCornerRadius/2));
        context.stroke();

        /**
         * Top right corner
         */
        if (topRightCornerRadius !== undefined) {
          context.lineWidth = topRightCornerRadius;
          context.lineJoin = "round";
        } else {
          topRightCornerRadius = minCornerRadius;
          context.lineWidth = topRightCornerRadius;
          context.lineJoin = "miter";
        }
        if (topRightCornerRadius < maxCornerRadius) {
          const buffJoin = context.lineJoin;
          const buffWidth = context.lineWidth;
          const w = maxCornerRadius - topRightCornerRadius;
          context.lineJoin = "miter";
          context.lineWidth = w;
          context.beginPath();
          context.moveTo(rectX+rectWidth-topRightCornerRadius-(w/2), rectY);
          context.lineTo(rectX+rectWidth-topRightCornerRadius-(w/2), rectY+topRightCornerRadius+(w/2));
          context.lineTo(rectX+rectWidth, rectY+topRightCornerRadius+(w/2));
          context.stroke();

          context.lineJoin = buffJoin;
          context.lineWidth = buffWidth
        }
        context.beginPath();
        context.moveTo(rectX+rectWidth-(topRightCornerRadius/2), rectY+topRightCornerRadius);
        context.lineTo(rectX+rectWidth-(topRightCornerRadius/2), rectY+(topRightCornerRadius/2));
        context.lineTo(rectX+rectWidth-topRightCornerRadius, rectY+(topRightCornerRadius/2));
        context.stroke();

        /**
         * Bottom right corner
         */
        if (bottomRightCornerRadius !== undefined) {
          context.lineWidth = bottomRightCornerRadius;
          context.lineJoin = "round";
        } else {
          bottomRightCornerRadius = minCornerRadius;
          context.lineWidth = bottomRightCornerRadius;
          context.lineJoin = "miter";
        }
        if (bottomRightCornerRadius < maxCornerRadius) {
          const buffJoin = context.lineJoin;
          const buffWidth = context.lineWidth;
          const w = maxCornerRadius - bottomRightCornerRadius;
          context.lineJoin = "miter";
          context.lineWidth = w;
          context.beginPath();
          context.moveTo(rectX+rectWidth-bottomRightCornerRadius-(w/2), rectY+rectHeight);
          context.lineTo(rectX+rectWidth-bottomRightCornerRadius-(w/2), rectY+rectHeight-bottomRightCornerRadius-(w/2));
          context.lineTo(rectX+rectWidth, rectY+rectHeight-bottomRightCornerRadius-(w/2));
          context.stroke();

          context.lineJoin = buffJoin;
          context.lineWidth = buffWidth
        }
        context.beginPath();
        context.moveTo(rectX+rectWidth-(bottomRightCornerRadius/2), rectY+rectHeight-bottomRightCornerRadius);
        context.lineTo(rectX+rectWidth-(bottomRightCornerRadius/2), rectY+rectHeight-(bottomRightCornerRadius/2));
        context.lineTo(rectX+rectWidth-bottomRightCornerRadius, rectY+rectHeight-(bottomRightCornerRadius/2));
        context.stroke();

        /**
         * Bottom left corner
         */
        if (bottomLeftCornerRadius !== undefined) {
          context.lineWidth = bottomLeftCornerRadius;
          context.lineJoin = "round";
        } else {
          bottomLeftCornerRadius = minCornerRadius;
          context.lineWidth = bottomLeftCornerRadius;
          context.lineJoin = "miter";
        }
        if (bottomLeftCornerRadius < maxCornerRadius) {
          const buffJoin = context.lineJoin;
          const buffWidth = context.lineWidth;
          const w = maxCornerRadius - bottomLeftCornerRadius;
          context.lineJoin = "miter";
          context.lineWidth = w;
          context.beginPath();
          context.moveTo(rectX, rectY+rectHeight-bottomLeftCornerRadius-(w/2));
          context.lineTo(rectX+bottomLeftCornerRadius+(w/2), rectY+rectHeight-bottomLeftCornerRadius-(w/2));
          context.lineTo(rectX+bottomLeftCornerRadius+(w/2), rectY+rectHeight);
          context.stroke();

          context.lineJoin = buffJoin;
          context.lineWidth = buffWidth
        }
        context.beginPath();
        context.moveTo(rectX+(bottomLeftCornerRadius/2), rectY+rectHeight-bottomLeftCornerRadius);
        context.lineTo(rectX+(bottomLeftCornerRadius/2), rectY+rectHeight-(bottomLeftCornerRadius/2));
        context.lineTo(rectX+bottomLeftCornerRadius, rectY+rectHeight-(bottomLeftCornerRadius/2));
        context.stroke();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  canvas {
    float: left;
    margin-left: 10px;
  }
</style>