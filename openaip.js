var fs = require("fs"),
  xml2js = require("xml2js");

var parser = new xml2js.Parser();
let ext = {
  airspace: {
    features: [],
    type: "FeatureCollection"
  }
};

function splitCoords(string) {
  let arr = string.split(",");
  let out = [];
  arr.forEach(e => {
    out.push(e.split(" "));
  });
  out.forEach(e => {
    if (e[0] === "") {
      e.shift();
    }
  });
  return out;
}
function convertToFL(alt) {
  let altrnd = Math.round(alt);
  let full = pad(altrnd, 5);
  let front = full.slice(0, 3);
  let back = full.slice(2, 5);
  return front;
}
fs.readFile("openaip_airspace_united_states_us.aip", function(err, data) {
  parser.parseString(data, function(err, result) {
    result["OPENAIP"]["AIRSPACES"][0]["ASP"].forEach(element => {
      let geo = splitCoords(element["GEOMETRY"][0]["POLYGON"][0]);
      ext.airspace.features.push({
        geometry: {
          coordinates: geo,
          type: "LineString"
        },
        properties: {
          kind: element.$.CATEGORY.toLowerCase(),
          name: element.NAME[0],
          upper: convertToFL(element.ALTLIMIT_TOP[0].ALT[0]),
          lower: convertToFL(element.ALTLIMIT_BOTTOM[0].ALT[0])
        }
      });
    });
  });
  fs.writeFileSync("output.json", JSON.stringify(ext));
  console.log("Done");
});
