/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object;
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice();; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = {
            height: 25,
            marginRight: 10,
            marginLeft: 10,
            width: 130
        };

        /** Used for games/wins/losses*/
        this.gameScale = {
            height: this.goalScale.height,
            marginRight: 10,
            marginLeft: 0,
            width: 50
        };

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null;

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
     createTable() {

         // ******* TODO: PART II *******

         //Update Scale Domains

         // Create the x axes for the goalScale.

         //add GoalAxis to header of col 1.

         this.maxGoals = Math.max(...this.tableElements.map(e => e.value["Goals Made"]), ...this.tableElements.map(e => e.value["Goals Conceded"]));

         var goalAxisSvg = d3.select("#goalHeader")
             .append("svg")
             .attr("width", this.goalScale.width + this.goalScale.marginLeft + this.goalScale.marginRight)
             .attr("height", this.goalScale.height)

         goalAxisSvg
             .append("line")
             .attr("x1", this.goalScale.marginLeft)
             .attr("y1", 20)
             .attr("x2", this.goalScale.width + this.goalScale.marginLeft)
             .attr("y2", 20)
             .attr("stroke", "black")

         for (var i = 0; i <= this.maxGoals / 2; i++) {
             var x = this.goalScale.marginLeft + i * this.goalScale.width * 2 / this.maxGoals;
             goalAxisSvg
                 .append("line")
                 .attr("x1", x)
                 .attr("y1", 20)
                 .attr("x2", x)
                 .attr("y2", 15)
                 .attr("stroke", "black")

             goalAxisSvg
                 .append("text")
                 .text(d => 2 * i)
                 .attr("font-size", "10px")
                 .attr("fill", "black")
                 .attr("x", function(d) {
                     var width = this.getComputedTextLength()
                     return x - width / 2; })
                .attr("y", 13)
             }


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable().


        d3.selectAll("th").each(function (d) {
            d3.select(this)
                .on("click", function(d, i, a) {
                    let table = window.table;
                    table.collapseList()
                    let header = d3.select(this).text().trim();
                    let sortAsc = table.sortAsc || false;
                    let sortedField = table.sortedField || "Team";

                    if (sortedField == header) {
                        sortAsc = !sortAsc;
                    }

                    let getValue = (row, key) => {
                        let val = "";
                        switch (key) {
                            case "Team":
                                val = row.key;
                                break;
                            case "Wins":
                            case "Losses":
                                val = row.value[key];
                                break;
                            case "Total Games":
                                val = row.value["TotalGames"];
                                break;
                            case "Goals":
                                val = row.value["Delta Goals"];
                                break;
                            case "Round/Result":
                                val = row.value["Result"]["ranking"];
                                break;
                        }
                        return val;
                    }
                    table.tableElements.sort(function(a, b) {
                        let v1 = getValue(a, header);
                        let v2 = getValue(b, header);
                        switch (typeof v1) {
                            case "string":
                                return sortAsc ? v1.localeCompare(v2) : v2.localeCompare(v1);
                                break;
                            default:
                                return sortAsc ? v1 - v2 : v2 - v1;
                        }
                    })

                    table.sortedField = header;
                    table.sortAsc = sortAsc;

                    table.updateTable()
                })
            })

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        //Append th elements for the Team Names

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let tree = this.tree;
        let data = this.tableElements;
        let table = d3.select("#matchTable").select("tbody");
        if (!table) {
            table = d3.select("#matchTable").append("tbody");
        }


        table.selectAll("tr").remove();
        let rows = table.selectAll("tr")
            .data(this.tableElements)
            .enter()
            .append("tr")
            .attr("class", d => d.value.type)
            .attr("id", (d, i) => "row" + i );

        let cells = rows.selectAll("td")
            .data(function(row) {
                return [
                    {key: "Team", value:row.key},
                    {key:"Goals", value: {"Made": row.value["Goals Made"], "Conceded": row.value["Goals Conceded"], "Delta": row.value["Delta Goals"]}},
                    {key:"Result", value:row.value["Result"]["label"]},
                    {key:"Wins", value:row.value["Wins"]},
                    {key:"Losses", value:row.value["Losses"]},
                    {key:"TotalGames", value:row.value["TotalGames"]}
                ]
            })
            .enter()
            .append("td")
            .text(function(d, i) {
                if (d.key != "Team" && d.key != "Result") { return "" }
                return d.value;
            })
            .attr("align", "right")
            .attr("nowrap", true)
            .attr("id", d => d.key)
            .style("width", this.gameScale.width + this.gameScale.marginLeft + this.gameScale.marginRight + "px")

        rows.each(function(d) {
            d3.select("#" + d3.select(this).attr("id")).selectAll("td")
                .attr("class", function() { return d.value.type })
        })

        rows.exit().remove();


        table = this;

       d3.selectAll("tr")
           .on("click", this.onClick);

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

        let goals = d3.selectAll("#Goals")
            .append("svg")
            .attr("id", 1)
            .attr("width", this.goalScale.width + this.goalScale.marginLeft + this.goalScale.marginRight)
            .attr("height", 20)

        let scaleLength = value => this.goalScale.marginLeft + value * this.goalScale.width / this.maxGoals;

        goals.append("line")
            .attr("x1", d => scaleLength(d.value["Made"]))
            .attr("y1", 10)
            .attr("x2", d => scaleLength(d.value["Conceded"]))
            .attr("y2", 10)
            .attr("stroke", function (d) {
                let parent = d3.select(this.parentNode)
                let cellClass = d3.select(parent.node().parentNode).attr("class")
                if (cellClass == "game") {
                    return "red"
                }
                return d.value["Made"] > d.value["Conceded"] ? "blue" : "red"
            })
            .attr("stroke-width", function(d) {
                let parent = d3.select(this.parentNode);
                let cellClass = d3.select(parent.node().parentNode).attr("class");
                if (cellClass == "aggregate") {
                    return 10;
                }
                return 5;
            })
            .attr("opacity", 0.6);

        //opened circle
        goals.append("circle")
            .attr("cx", d => scaleLength(d.value["Conceded"]))
            .attr("cy", 10)
            .attr("class", function (d, i, el) {
                let parent = d3.select(this.parentNode);
                let cellClass = d3.select(parent.node().parentNode).attr("class");

                if (cellClass == "game") {
                    if (d.value["Made"] != d.value["Conceded"]) {
                        return "bagelRed"
                    }
                    return "bagelGray"
                };

                if (d.value["Made"] != d.value["Conceded"]) {
                    return "circleRed"
                };

                return "circleGray";
            });

        //closed circle
        goals.append("circle")
            .attr("cx", d => scaleLength(d.value["Made"]))
            .attr("cy", 10)
            .attr("r", 5)
            .attr("class", function (d, i, el) {
                let parent = d3.select(this.parentNode)
                let cellClass = d3.select(parent.node().parentNode).attr("class")

                if (cellClass == "game") {
                    if (d.value["Made"] != d.value["Conceded"]) {
                        return "circleBlue"
                    }
                    return "bagelGray"
                };

                if (d.value["Made"] != d.value["Conceded"]) {
                    return "circleBlue"
                };

                return "circleGray"
            });

        ["Wins", "Losses", "TotalGames"].forEach(key => {
            let maxValue = Math.max(...this.tableElements.filter(val => val.value[key] && val.value[key] != []).map(val => val.value[key]));

            let getLength = value => {
                if (!value || value == []) {
                    return 0;
                }
                return this.gameScale.marginLeft + value * this.gameScale.width / maxValue;
            };

            let barsSvg = d3.selectAll("#" + key)
                .append("svg")
                .attr("width", this.gameScale.width + this.gameScale.marginLeft + this.gameScale.marginRight)
                .attr("height", 20);

            barsSvg
                .append("line")
                .attr("x1", this.gameScale.marginLefts)
                .attr("y1", 10)
                .attr("x2", d => {
                    if (d.value == []) {
                        return 0
                    }
                    return getLength(d.value)
                })
                .attr("y2", 10)
                .attr("stroke","#006666")
                .attr("stroke-width", 20)
                .attr("opacity", d => d.value / maxValue);

            barsSvg
                .append("text")
                .text( d => d.value)
                .attr("fill", "white")
                .attr("x", function(d) {
                    var width = this.getComputedTextLength();
                    return getLength(d.value) - 5 - width / 2;
                })
                .attr("y", 16);
        })

        d3.select("tbody")
          .selectAll("tr")
          .on("mouseover", window.tree.updateTree)
          .on("mouseout", window.tree.clearTree)

    };

    onClick(d, i, el) {
        if (!d) {
            return
        }
        let data = window.table.tableElements;
        let index = data.findIndex(val => val.key == d.key);

        if (data[index + 1].value.type == "game" && data[index].value.type != "game") {
            var j = index + 1
            while (data[j].value.type == "game" && j < data.length ) {
                ++j
            }
            data.splice(index + 1, j - (index + 1))

            window.table.updateTable()
            return
        }

        for (var j in d.value.games) {
            var el = Object.assign({}, d.value.games[j])
            el.key = "x" + el.key
            data.splice(++index, 0, el);
        }

        window.table.updateTable()
    };


    collapseList() {

        // ******* TODO: PART IV *******
        let i = 0
        while (i < this.tableElements.length) {
            if (this.tableElements[i].value.type == "game") {
                let j = i
                while (this.tableElements[j].value.type == "game" && j < this.tableElements.length ) {
                    ++j
                }
                this.tableElements.splice(i, j - i)
            }
            ++i
        }
        this.updateTable()

    }

}
