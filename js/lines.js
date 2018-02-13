
var horizont = 350,
rectWidth = 10;

var bubbles = [];


d3.json("./data/result.json", function(result){	

	d3.json("./data/names.json", function(names) {


		for (var name in names) {

			var found = false;
				
				for (var r in result) {

					if ( names[name].forename == result[r].forename && names[name].surname == result[r].surname ) {

						found = true;

					if(result[r].li)
					result[r].li_first = parseInt(result[r].li[0]);	
					else result[r].li_first = [0];

				}

			}
			
			
			if (!found) {
				
				
				result.push({
					
					link : "",
					li: "[0]",
					readers : names[name].readers,
					forename: names[name].forename,
					surname: names[name].surname,
					li_first: [0]
				})
				
			}

		}
		

		var re = d3.scale.linear().domain([bst.data.minOf(result,"readers"),bst.data.maxOf(result,"readers")]).range([0,200]);	
		var li = d3.scale.linear().domain([bst.data.minOf(result,"li_first"),bst.data.maxOf(result,"li_first")]).range([0,200]);	

		for (var r in result) {
			result[r].liNorm = li(result[r].li_first);
			result[r].reNorm = re(result[r].readers);
		}


		var lastX = 0;
		
		result = bst.data.sortOn(result,"readers",-1);

		for (var r in result) {

			if (!isNaN(result[r].reNorm) && !isNaN(result[r].liNorm)) {

			bubbles.push( 
				{ name : result[r].forename + " " + result[r].surname,
				value : result[r].liNorm+result[r].reNorm,
				offset : result[r].liNorm-result[r].reNorm,
				linkedin : result[r].liNorm,
				readers : result[r].reNorm,
				link : result[r].link,
				li : result[r].li,
				actual : result[r].li_first,
				actualReaders : result[r].readers,
				x : lastX,
				y : 0 })

				lastX += 1+rectWidth//result[r].liNorm+result[r].reNorm;
			}
			}

			drawBubbles();
		})


	})
	


	function drawBubbles() {

		var r = 13000;

		var vis = d3.select("#chart").append("svg:svg")
		.attr("width", r)
		.attr("height", 600)


		vis.selectAll("rect")
		.data(bubbles)
		.enter().append("svg:rect")
		.attr("x", function(d) { return d.x })
		.attr("y", function(d) { return horizont - d.value/2 - d.offset/2})

		.attr("height", 0)
		.attr("width", rectWidth)
		.attr("fill","#8cc3d5")

		.attr("stroke-width", 1)
		.attr("fill-opacity", .8)
		.on("mouseover",function(d) { 
			
			
			d3.select(this).style("fill", "#4a8295")
			
			var lio;
			d.actual != 0 && d.li.length > 1 ?  lio = "BUT! There are <b>"+ d.li.length +"</b>"+" matching results from LinkedIn..." : lio = "";
			
			d3.select("#infowindow").html(
				"<b>"+d.name+"</b>"+"<br/>"
				+ "Readers: <b>" + d.actualReaders + "</b><br/>"
				+ "LinkedIn connections: <b>" + d.actual + "</b><br/>"
				+ "<a href='"+ d.link +"'>"+d.link+"</a><br/>"
				+ lio
				
				)
			})
			
			
		.on("mouseout",function() {
			
			d3.select(this).style("fill", "#8cc3d5") 
		//	d3.select("#infowindow").html("")
		
		})
		.transition()
	    .delay(function(d, i) { return i * 10; })
	    .attr("height", function(d) { return d.value })
		

	
//	function(d) { return d.value }
	
//	y1 = function(d) { return h - (d.y + d.y0) * h / my; },
//    y2 = function(d) { return d.y * h / mz; };

		vis.append("svg:line")
		.attr("x1", 0)
		.attr("y1", horizont)
		.attr("x2", r)
		.attr("y2", horizont)
		.attr("stroke", "#ffffff")
	}






	