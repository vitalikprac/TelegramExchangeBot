import D3Node from "d3-node";

export const line = (data) =>{
    const selector = '#chart';
    const container =`
        <div id="container">
          <h2>Line Chart</h2>
          <div id="chart"></div>
        </div>
    `;
    const style = '';
    const _width =960;
    const _height = 500;
    const margin = { top: 20, right: 20, bottom: 60, left: 30 };

    const d3n = new D3Node({
        selector: selector,
        svgStyles: style,
        container: container,
    });
    const svg = d3n.createSVG(_width, _height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const width = _width - margin.left - margin.right;
    const height = _height - margin.top - margin.bottom;
    const d3 = d3n.d3;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) {
        return d.date;
    }));
    const values = data.map(({value})=>value);
    const average = values.reduce((prev,current)=>prev+current,0)/data.length;
    const d3Max = Math.max(...values);
    const d3Min = Math.min(...values);
    const min = average > d3Min ? average-0.01 : d3Min;
    const max = average < d3Max ? average+0.01 : d3Max;
    y.domain([min,max]);
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return height - y(d.value);
        });
    return d3n;
}
