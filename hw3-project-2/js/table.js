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
        this.teamData = null;

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
        this.goalScale = null;

        /** Used for games/wins/losses*/
        this.gameScale = null;

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
         this.goalScaleMargin = {right: 10, left: 10}
         this.goalScaleWidth = 190 - this.goalScaleMargin.left - this.goalScaleMargin.right,
         this.goalScaleHeight = 30

         this.maxGoals = Math.max(...this.tableElements.map(e => e.value["Goals Made"]), ...this.tableElements.map(e => e.value["Goals Conceded"]));

         var goalAxisSvg = d3.select("#goalHeader")
             .append("svg")
             .attr("width", this.goalScaleWidth + this.goalScaleMargin.left + this.goalScaleMargin.right)
             .attr("height", this.goalScaleHeight)

         goalAxisSvg
             .append("line")
             .attr("x1", this.goalScaleMargin.left)
             .attr("y1", 20)
             .attr("x2", this.goalScaleWidth + this.goalScaleMargin.left)
             .attr("y2", 20)
             .attr("stroke", "black")

         for (var i = 0; i <= this.maxGoals / 2; i++) {
             var x = this.goalScaleMargin.left + i * this.goalScaleWidth * 2 / this.maxGoals;
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

        rows.each(function(d) {
            d3.select("#" + d3.select(this).attr("id")).selectAll("td")
                .attr("class", function() { return d.value.type })
        })

        rows.exit().remove();
        table = this;

        let onClick = function (d, i, el) {
            if (!d) {
                return
            }
            let idx = data.findIndex(val => val.key == d.key);

            if (data[idx + 1].value.type == "game" && data[idx].value.type != "game") {
                var j = idx + 1
                while (data[j].value.type == "game" && j < data.length ) {
                    ++j
                }
                data.splice(idx + 1, j - (idx + 1))

                table.updateTable()
                return
            }

            for (var j in d.value.games) {
                var el = Object.assign({}, d.value.games[j])
                el.key = "x" + el.key
                data.splice(++idx, 0, el);
            }

            table.updateTable()
        };


       d3.selectAll("tr")
           .on("click", onClick);

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray


    };


    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


}
