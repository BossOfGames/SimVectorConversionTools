var fs = require("fs");

let ext = {
  airports: {
    type: "FeatureCollection",
    features: []
  }
};

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

fs.readFile("airports.json", function(err, data) {
  let airports = JSON.parse(data);
  airports.forEach(e => {
    ext.airports.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [e.longitude_deg, e.latitude_deg]
      },
      properties: {
        kind: e.type,
        icao: e.gps_code,
        name: e.name,
        iata: e.iata_code,
        atc: e.controlled
      }
    });
  });

  fs.writeFileSync("air.json", JSON.stringify(ext));
  console.log("Done");
});
