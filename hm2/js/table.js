var dropTable, drawTable;

let d = window.location.href.split("/");
d = d[d.length - 1]
window.mode = d;

if (d === "table.html") {
    //TABLE
    //FIRST VERSION
    dropTable = function() {
        d3.select("table").remove()
    }

    drawTable = function(data) {
        data.map(row => {
            ignoredFields.forEach(w => delete row[w])
        })
        var columns = Object.keys(data[0]);

        var table = d3.select("body").append("table"),
        thead = table.append("thead")
        .attr("class", "thead");
        tbody = table.append("tbody");

        table.append("caption")
        .html("World Countries Ranking");

        var lastHeader = "";
        var sortOrder = true;


        thead.append("tr").selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(d) { return d; })
        .on("click", function(header, i) {
            if (lastHeader == header) {
                sortOrder = !sortOrder;
            } else {
                sortOrder = true;
            }

            tbody.selectAll("tr").sort(function(a, b) {
                if (a[header] == b[header]) {
                    if (sortOrder) {
                        return d3.descending(a["name"], b["name"]);
                    } else {
                        return d3.ascending(a["name"], b["name"]);
                    }
                } else {
                    if (sortOrder) {
                        return d3.descending(a[header], b[header]);
                    } else {
                        return d3.ascending(a[header], b[header]);
                    }
                }
            });
            lastHeader = header;
            acceptZebra()
        });

        let currentValue = "white";

        //formatt
        var lifeFormat = d3.format(",.1f");
        var defaultFormat = d3.format(",")
        var gdpFormat = d3.format(",.")

        var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr").attr("class", "row")

        var cells = rows.selectAll("td")
        .data(function(row) {
            return d3.range(Object.keys(row).length).map(function(column, i) {
                if (Object.keys(row)[i] == "life_expectancy") {
                    return lifeFormat(row[Object.keys(row)[i]])
                } else if (Object.keys(row)[i] == "gdp") {
                    return gdpFormat(Math.ceil(row[Object.keys(row)[i]]))
                } else  if (Object.keys(row)[i] == "population") {
                    return defaultFormat(row[Object.keys(row)[i]])
                } else {
                    return row[Object.keys(row)[i]];
                }
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d; })
        .on("mouseover", function(d, i) {

            let row = d3.select(this.parentNode)
            currentValue = row.style("background-color")
            row.style("background-color", "#F3ED86");

        }).on("mouseout", function() {

            d3.select(this.parentNode).style("background-color", currentValue);

        });

        //zebra pattern accept
        function acceptZebra() {
            tbody.selectAll("tr")
            .each(function(d, i) {
                if (i % 2 == 0) {
                    d3.select(this).style("background-color", "#99ccff")
                } else {
                    d3.select(this).style("background-color", "white")
                }
            })
        }

        acceptZebra()

    }
} else {
    //SECOND VERSION


    //BAR CHART
    //Draw bar chart
    dropTable = function() {
        d3.select("svg").remove()
    }

    drawTable = function(data) {
        data.map(row => {
            ignoredFields.forEach(w => delete row[w])
        })

        var margin = {top: 0, bottom: 10, left:300, right: 40};
        var width = 900 - margin.left - margin.right;
        var height = data.length > 8 ? data.length * 20 : data.length * 40 - margin.top - margin.bottom;

        var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d[encodeProp];
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d[encodeProp]);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d[encodeProp]) + 3;
            })
            .text(function (d) {
                return d[encodeProp];
            });
    }
}


function drawChooseProp() {
    if (window.mode == "table.html") {
        return
    }
    let encodeProps = ["population", "gdp"];
    let div = d3.select("body").append("div")
        .attr("class", "prop")
        .text(() => "Encode bars by:");

    encodeProps.forEach(prop =>{
        let labl = div.append("label").text(() => prop + ": ")
            .append("input")
            .attr("type","radio")
            .attr("value", prop)
            .attr("name", "prop")
            .attr("onchange", "changeProp()");
        if (prop == encodeProp) {
            d3.select(labl).property("checked")
        }
    })

    changeProp = () => {

        let property = "";

        d3.select("div.prop").selectAll("input").each(function(d) {
            if (d3.select(this).property("checked")) {
                property = d3.select(this).attr("value")
            }
        })

        if (property) {
            encodeProp = property
            //clearRadio();
            //clearInputs();
            dropTable();
            drawTable(dataSelected)
      }
    }

}
