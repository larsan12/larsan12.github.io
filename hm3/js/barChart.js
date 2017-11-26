/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        // ******* TODO: PART I *******

        let svgHeight = d3.select("#barChart").attr("height");
        let svgWidth = d3.select("#barChart").attr("width");
        let margin = {top: 0, right: 0, bottom: 100, left: 60};

        let maxHeight = svgHeight - margin.bottom;

        let years = this.allData.map(row => row["YEAR"])

        let maxValue = d3.max(this.allData.map(row => row[selectedDimension]))

        // Create colorScale
        function getBarHeight(row) {
            return row[selectedDimension] * maxHeight / maxValue
        }

        let minLight = 30
        let maxLight = 60
        let colorScale = d3.scaleLinear()
            .domain([0, maxHeight])
            .range([maxLight, minLight])

        let getColor = (row) => "hsl(209,99%," + colorScale(getBarHeight(row)) + "%)";

        // Create the axes (hint: use #xAxis and #yAxis)
        let rowWidth = 20
        let barWidth = 17
        let width = rowWidth * this.allData.length; //svgWidth - margin.left - margin.right,
        let height = svgHeight - margin.top - margin.bottom;

        let x = d3.scaleBand()
            .rangeRound([0, width])
            .domain(this.allData.map(function(d) { return d["YEAR"]; }))

        let y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

        d3.select("#barChart").select("#xAxis").append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.4em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        d3.select("#barChart").select("#yAxis").append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(d3.axisLeft(y));

        // Create the bars (hint: use #bars)

        let bars = d3.select("#barChart").select("#bars")
            .selectAll("g.barGroup")
            .data(this.allData).enter()
            .append("g")
            .classed("barGroup", true);

        bars.append("rect")
            .attr("width", barWidth)
            .style("fill", getColor)
            .attr('stroke', '#2378ae')

        bars.attr("transform", function (d, i) {
            return "translate(" + (i * rowWidth) + ", " + (svgHeight - margin.bottom - getBarHeight(d)) + ")";
        })

        bars.selectAll("rect")
            .attr("height", function (d) { return getBarHeight(d); })
            .attr("x", 60)


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}
