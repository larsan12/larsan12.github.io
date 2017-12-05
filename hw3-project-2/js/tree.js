/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        this.margin = {top: 20, right: 90, bottom: 30, left: 90};
        this.width = 500 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300.

        //Create a root for the tree using d3.stratify();

        //Add nodes and links to the tree.

        this.treeData = treeData;
        treeData = treeData.map(game => {
            game["ParentGame"] = treeData[game["ParentGame"]] ? treeData[game["ParentGame"]].id : null;
            return game;
        });

        var treeData1 = d3.stratify()
          .id(function(d) { return d.id; })
          .parentId(function(d) { return d.ParentGame; })
          (treeData);

        // assign the name to each node
        treeData1.each(function(d) {
            d.name = d.Team;
          });

        // set the dimensions and margins of the diagram
        var margin = this.margin;
        var width = this.width;
        var height = this.height;

        // declares a tree layout and assigns the size
        var treemap = d3.tree()
            .size([height, width]);

        //  assigns the data to a hierarchy using parent-child relationships
        var nodes = d3.hierarchy(treeData1, function(d) {
            return d.children;
          });

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#treeSvg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom);
        var g = svg.select("#tree")
            .attr("transform", "translate("
                  + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
          .enter().append("path")
            .attr("class", "link")
            .attr("id", d => d.data.data.Team)
            .attr("d", function(d) {
               return "M" + d.y + "," + d.x
                 + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                 + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                 + " " + d.parent.y + "," + d.parent.x;
               });

        // adds each node as a group
        var node = g.selectAll(".node")
            .data(nodes.descendants())
          .enter().append("g")
            .attr("class", function(d) {
              return "node" +
                (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) {
              return "translate(" + d.y + "," + d.x + ")"; });

        // adds the circle to the node
        node.append("circle")
          .attr("r", 5)
          .attr("class", d => d.data.data.Wins == "1" ? "winner" : "loser")


        // adds the text to the node
        node.append("text")
          .attr("dy", ".35em")
          .attr("x", function(d) { return d.children ? -13 : 13; })
          .attr("id", d => d.data.data.Team)
          .style("text-anchor", function(d) {
            return d.children ? "end" : "start"; })
          .text(function(d) {
              return d.data.data.Team;
          });

    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        if (!row) return;

        d3.selectAll("text#" + row.key).each(function () {
            d3.select(this).attr("class", "selectedLabel")
        })

        d3.selectAll("path#" + row.key).each(function () {
            d3.select(this).attr("class", "selected")
        })

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        d3.selectAll("path.selected")
            .attr("class", "link")
        d3.selectAll("text.selectedLabel")
            .attr("class", "")
        // You only need two lines of code for this! No loops!
    }
}
