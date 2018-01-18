var width = window.innerWidth;
var height = window.innerHeight;
var uniforms = {
  smoke: {
    resolution: {
      type: "v2",
      value: {
        x: width,
        y: height
      }
    },
    alpha: {
      type: "1f",
      value: 1.0
    },
    shift: {
      type: "1f",
      value: 1.6
    },
    time: {
      type: "1f",
      value: 0
    },
    speed: {
      type: "v2",
      value: {
        x: 0.7,
        y: 0.4
      }
    }
  }
};

module.exports = uniforms;
