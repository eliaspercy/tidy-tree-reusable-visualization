/** Class representing my altered version of the Tidy Tree visualization */
export class Tree{

  /** Constructor containing information regarding the json file used as data 
   * @param {file} json   The location of a json file containing the relevent data. For the visualization to work, the arrangement of the files information must be hierarchically nested.  
  */
  constructor(json) {
    this._json = json;
  }

  /** function for generating the tree 
   * @param {float} width   Determines the width of the tree, should correspond to the amount of children that exist in the data (how "long" the tree will be).
   * @param {float} height   Determines the height of the tree, should be inputted by the user such that it's the tree is a relevant size based on the amount of data it contains (as it affects the distance between the text connected to each node).
   * @param {string} linkColour   Determines the colour of the links between the nodes.
  */
  newTree(width, height, linkColour) {

    /** Essential variables. The width and height are inputted by the user.  */
    var svg = d3.select('#tidyTreeVis'),
    margin = {top: 10, right: 130, bottom: 10, left: 200},
    inWidth = (width - margin.left - margin.right),
    inHeight = (height - margin.top - margin.bottom),
    /** creates a new tree with its size based on the size of the margin */
    tree = d3.tree().size([inHeight, inWidth]);

    /** using variables, this creates the ability to drag and zoom the tree for improved accessibility. */
    var zoom = svg
        .attr('width', width)
        .attr('height', height)
      .append('g'),
      /** new group */
    g = zoom.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.call(d3.zoom().on('zoom', () => {
      zoom.attr('transform', d3.event.transform);
    }));

    /** grabs the json file for use with the following variables */
    d3.json(this._json).then(function(data) {

        var root = d3.hierarchy(data)

        /** variable for the links between the nodes, setting the width, colour, and opacity. The fill is set to "none" so that the lines are lines and not big blocks of colour.*/
        var link = g.selectAll(".link")
          .data(tree(root).links())
          .enter().append("path")
          .attr("class", "link")
          .attr("d", d3.linkHorizontal()
              .x(function(d) { return d.y; })
              .y(function(d) { return d.x; }))
          .style("fill", "none")
          .style("stroke", d3.color(linkColour))
          .style("stroke-opacity", "0.4")
          .style("stroke-width", "1.5px");

          /** variable to represent the nodes of the tree */
          var node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
              .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

              /** creates a circle at each node with the colour of the circle depending on whether it's an internal node or a leaf node */
              node.append("circle")
              .attr("r", function(d) { return d.children ? 3 : 1.2; })
              .style("fill", function(d) { return d.children ?  "#555" : "#999" })

              /** applies text to each node based on data */
              node.append("text")
              .attr("dy", 3)
              .attr("x", function(d) { return d.children ? -5 : 2.5; })
              .attr("y", function(d) { return d.children ? 2 : -2; })
              .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .style('font-size', function(d) { return d.children ? 4/(d.depth+2) + 'em' : 6.1 + 'px' })
              .style("pointer-events", "none")
              .text(d => d.data.name);

      });

  }

}