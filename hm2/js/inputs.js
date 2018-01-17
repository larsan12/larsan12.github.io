//FILTERS
function drawInputs() {
    var div = d3.select("div.conditions").append("div").attr("class", "inputs").text(() => "Filter by: ");
    inputs.forEach(input => {
        let lable = div.append("label").text(() => input+ ": ")
        lable.append("input")
            .attr("type","checkbox")
            .attr("title",input)
            .attr("value",input)
            .attr("name",input)
            .attr("onchange", "changeInput()");
    })

    changeInput = () => {
        clearRadio();
        let names = [];
        d3.select("div.inputs").selectAll("input").each(function(d) {
            // Current name of the checkbox is d3.select(this).attr("name")
            if (d3.select(this).property("checked")) {
                names.push(d3.select(this).attr("name"))
            }
        })

        if (names.length == 0)
            names = inputs;
        dataSelected = data.filter(row => names.indexOf(row.continent) != -1)
        dropTable()
        drawTable(dataSelected)
    }

}

function clearInputs() {
    dataSelected = data;
    d3.select("div.inputs").selectAll("input").each(function(d) {
        d3.select(this).property("checked", false)
    })
}


//SLIDER
let drawSlider = () =>{
    d3.select("div.conditions")
        .append("div")
        .attr("class", "slider")
        .append("label")
        .text(d => "Time update: 1995 ")
        .attr("class", "slider-label")
        .append("input")
        .attr("type", "range")
        .attr("class", "points")
        .attr("min", 1995)
        .attr("max", 2012)
        .attr("step", 1)
        .attr("value", 2012)
        .attr("oninput", "changeYear()")
    d3.select("label.slider-label")
        .append("span")
        .text(d => " 2012")
}

function changeYear() {
    let value = d3.select("input.points").property("value");
    filteredData = fullData.map(country => ({
        ...country,
        years: undefined,
        ...country.years.find(year => year.year == value),
        top_partners: undefined
    }))
    data = filteredData;
    if (dataSelected.length == 5) {
        dataSelected = agregateData("continent")
    } else {
        dataSelected = data.filter(country => dataSelected.find(d => d.name == country.name));
    }
    dropTable()
    drawTable(dataSelected)
    changeRadio()
}
