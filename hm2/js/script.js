var data, fullData, changeInput, dataSelected, changeRadio, changeProp;

var inputs = ["Americas", "Africa", "Asia", "Europe", "Oceania"];
var ignoredFields = ["alpha2_code", "latitude", "longitude", "total_export_value", "total_import_value", "years", "top_partners"]

// for Aggregations
var agregation = ["none", "continent"];
var folded_fields = ["population", "gdp"];
var average_fields = ["life_expectancy"];
var constant_fields = ["year"];

// property for display char diagram
var encodeProp = "population";


function draw(data) {
    d3.select("body").append("div").attr("class", "conditions")
    drawInputs()
    drawRadio()
    drawChooseProp();
    drawTable(data)
}


//DATA HANDLER
loadData = (str) => new Promise ((resolve, reject) => {
    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();
    xhr.open('GET', str, true);

    xhr.onload = function() {
        resolve(JSON.parse(this.responseText))
    }
    xhr.onerror = function() {
      reject(this.status)
    }
    xhr.send();
})

loadData("https://larsan12.github.io/hm2/countries_1995_2012.json").then(d => {
    fullData = d
    data = fullData.map(country => ({
        ...country,
        years: undefined,
        ...country.years.find(year => year.year == 2012),
        top_partners: undefined
    }))
    dataSelected = data;
    draw(data)
    drawSlider()
})
