//AGGREGATOR

function drawRadio() {
    var div = d3.select("div.conditions").append("div").attr("class", "radio").text(() => "Aggregation: ");

    agregation.forEach(agr => {
        let lable = div.append("label").text(() => agr+ ": ")
        lable.append("input")
            .attr("type","radio")
            .attr("value", agr)
            .attr("name", "Aggregation")
            .attr("onchange", "changeRadio()");
    })

    changeRadio = () => {
        let property = "";

        d3.select("div.radio").selectAll("input").each(function(d) {
            if (d3.select(this).property("checked")) {
                property = d3.select(this).attr("value")
            }
        })

        if (property == "none" || !property) {
            dropTable()
            drawTable(dataSelected)
        } else {
            clearInputs();
            dataSelected = agregateData(property);
            dropTable()
            drawTable(dataSelected)
      }
    }
}

function agregateData(property) {
    return d3.nest()
      .key(d => d[property])
      .rollup(rows => {
          let group = {}
          Object.keys(rows[0]).forEach(prop => {
              if (folded_fields.indexOf(prop) != -1) {
                  group[prop] = d3.mean(rows, r => r[prop])
              } else if (average_fields.indexOf(prop) != -1) {
                  group[prop] = d3.mean(rows, r => r[prop] * r["population"])/d3.mean(rows, r => r["population"])
              } else if (constant_fields.indexOf(prop) != -1) {
                  group[prop] = rows[0][prop]
              } else {
                  group[prop] = rows[0][property]
              }
          })
          return group
      })
      .entries(data)
      .map(obj => obj.values)
}

function clearRadio() {
    d3.select("div.radio").selectAll("input").each(function(d) {
        d3.select(this).property("checked", false)
    })
}
