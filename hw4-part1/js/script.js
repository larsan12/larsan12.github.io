d3.json("data/countries_1995_2012.json", function(error, data) {
    let countriesByIds = {}
    for (let i in data) {
        countriesByIds[data[i].country_id] = i
    }

    let graph = {nodes: [], links: []};

    graph.nodes = data

    graph.nodes.forEach(function(d, i) {
        let years = d.years[0]
        for (let i in years.top_partners) {
            let sourceId = countriesByIds[d.country_id]
            let targetId = countriesByIds[years.top_partners[i].country_id]
            graph.links.push({"source": graph.nodes[sourceId], "target": graph.nodes[targetId]})
        }
    })

    draw(graph, data);
})
