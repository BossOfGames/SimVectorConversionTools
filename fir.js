var fs = require("fs");

let ext = {
  firs: {
    type: "FeatureCollection",
    features: []
  }
};

function fixFloat(arr) {
  let out = [];
  arr.forEach(e => {
    out.push(parseFloat(e));
  });
  let real = []
  real[0] = out[1]
  real[1] = out[0]
  return real;
}

function nested_loop_join(a, b, keys, select) {
  output = [];

  second = [];
  while ((row_b = b())) {
    second[second.length] = row_b;
  }

  var idx = 0;
  while ((row_a = a())) {
    second.forEach(function(i, row_b) {
      if (row_a[keys[0]] === row_b[keys[1]]) {
        var new_row = {};

        select.forEach(function(k, col) {
          // cheat here for simplicity - should handle aliasing
          new_row[col] = row_a[col] ? row_a[col] : row_b[col];
        });

        output[idx++] = new_row;
      }
    });
  }

  return s({ from: output });
}

fs.readFile("fir-boundaries-v2.json", function(err, data) {
  let firs = JSON.parse(data);
  firs.forEach(e => {
    let w = [];
    e.points.forEach(a => {
      w.push(fixFloat(a));
    });
    ext.firs.features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: w
      },
      properties: {
        name: e.region,
        icao: e.icao
      }
    });
  });

  fs.writeFileSync("firs.json", JSON.stringify(ext));
  console.log("Done");
});
