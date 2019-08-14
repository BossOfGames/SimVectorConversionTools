var fs = require("fs"),
    xml2js = require("xml2js");

var parser = new xml2js.Parser();
let ext = [];

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
fs.readFile("d-TPP_Metafile.xml", function(err, data) {
    parser.parseString(data, function(err, result) {
        let root_arr = result.digital_tpp.state_code;
        root_arr.forEach(state => {
            state.city_name.forEach(city => {
                city.airport_name.forEach(airport => {
                    let charts = [];
                    airport.record.forEach(chart => {
                        charts.push({
                            amdtdate: chart.amdtdate[0],
                            amdtnum: chart.amdtnum[0],
                            bvpage: chart.bvpage[0],
                            bvsection: chart.bvsection[0],
                            chartseq: chart.chartseq[0],
                            chart_code: chart.chart_code[0],
                            chart_name: chart.chart_name[0],
                            pdf_name: chart.pdf_name[0],
                            two_colored: chart.two_colored[0]
                        });
                    });
                    ext.push({
                        name: airport.$.ID,
                        icao: airport.$.icao_ident,
                        al_id: airport.$.alnum,
                        charts: charts
                    })
                })
            })
        });
        console.log(result);
    });
    fs.writeFileSync("faa_charts.json", JSON.stringify(ext));
    console.log("Done");
});
