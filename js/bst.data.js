(function(){

	bst.data = {};
	
	bst.data.archive = function(d, p) {
		
		var arch = {}
		console.log(d.length)
		for (var o in d) {
			
			if(d[o][p].toLowerCase().search("cor") !== -1)
				arch["Electronic Enlightment"] ? arch["Electronic Enlightment"]++ : arch["Electronic Enlightment"] = 1;
			else arch["The Papers of Benjamin Franklin"] ? arch["The Papers of Benjamin Franklin"]++ : arch["The Papers of Benjamin Franklin"] = 1
			
		}
		
		return arch;
		
		
	}
	
	bst.data.matchNationality = function(v) {
		
		var values = []
		
		//console.log(v)
		
		$.ajax({
			type: "GET",
			url: "./data/voltaire/letters.json",
			success: function(result){
				
				people = result;
				
				for (var i in people) {
					var found = false;
					
					for (var j in v) {
					
						if(people[i].id === v[j]) {
							found = true
							break;
							}
						
						}
						
							if(found)
							 nationalities[people[i].nationality] ? nationalities[people[i].nationality]++ : nationalities[people[i].nationality] = 1;
						}
				}
				
			
		});
		nationalities["unknown"] += nationalities[""]	
		return nationalities;
		
	}
	
	bst.data.getNationality = function(d) {
		
		var peoples = {}
		var nationalities = {}
		
		$.ajax({
			type: "GET",
			url: "./data/voltaire/letters.json",
			success: function(result){
				
				people = result;
				
				nationalities = bst.data.countValues(people,"nationality")
			nationalities["unknown"] += nationalities[""]				
			console.log(nationalities)
				
			}
		});

		return nationalities;
	}

	bst.data.getPosition = function(a, e, p) {
		
		for ( var i=0; i<a.length; i++ ) {
			
			if( bst.data.walkTo(a[i],p) == e )
				return i
		}
		
		return "";
		
	}

	bst.data.countValues = function(o, p) {

		var values = {},
		 	unique = [],
			counter = [];

		for (var i in o) {

			var found = false;

			for (var u in unique) {
				if ( unique[u][p] === o[i][p] ) {
					found = true;
					break;
				}
			}

			if (!found) {
				unique.push(o[i])				
				counter[o[i][p]]=1;
			} else {
				counter[o[i][p]]++;
			}
		}
		
		for (i in unique) {
		//	n[unique[i][p]] = counter[unique[i][p]];
			values[unique[i][p]]= counter[unique[i][p]];
		}
	
		
		return values;

	}


	bst.data.net = function(d, s, t, sc, tc) {

		var net = {},
 			sources = bst.data.countValues(d,s),
			targets = bst.data.countValues(d,t),
			links = [],//bst.data.countValues(d,t)
			nodes = {},	
			data = {},
			letters = {}
			
			
			for(var i in sources)
				sources[i] = {}
			
			for (var o in d) {
				if(!letters[d[o][t]]) letters[d[o][t]] = {}
				if(!letters[d[o][s]]) letters[d[o][s]] = {}
				
				if(d[o][t] !== "" && d[o][tc] !== "") {
					
					if( sources[d[o][t]] && sources[d[o][t]][d[o][s]] ) {
						sources[d[o][t]][d[o][s]]++;
						
						letters[d[o][t]][d[o][s]] ? letters[d[o][t]][d[o][s]].push(d[o]) : letters[d[o][t]][d[o][s]] = [d[o]]
						
						}
					else {
						sources[d[o][s]][d[o][t]] ? sources[d[o][s]][d[o][t]]++ : sources[d[o][s]][d[o][t]] = 1;
						letters[d[o][s]][d[o][t]] ? letters[d[o][s]][d[o][t]].push(d[o]) : letters[d[o][s]][d[o][t]] = [d[o]]
						}
					
					nodes[ d[o][s] ] = d[o][sc] ? d[o][sc] : nodes[ d[o][s] ];
					nodes[ d[o][t] ] = d[o][tc] ? d[o][tc] : nodes[ d[o][t] ];
					
					data[ d[o][s] ] ? data[d[o][s]].push(d[o]) : data[d[o][s]] = [d[o]]
					data[ d[o][t] ] ? data[d[o][t]].push(d[o]) : data[d[o][t]] = [d[o]]
				}
			}
			
		//	console.log("mah",data)
			
			var nodesClear = []

			//trying to find coordinates...
			for (i in nodes)
				if (i && nodes[i] && nodes[i] !== "" && i !== "") nodesClear.push({"name":i,"coordinates":nodes[i],"data":data[i]});
			
			for (i in sources) {
				for ( var j in sources[i]) {
					var link = { 
						"source" : bst.data.getPosition(nodesClear,i,"name"),
						"target" : bst.data.getPosition(nodesClear,j,"name"),
						"value" : sources[i][j],
						"data" : letters[i][j]
						
						}
											
					if(link["source"] !== "" && link["target"] !== "" && link["value"] !== "") links.push(link);
				}
			}
			
		
			
			net["nodes"] = nodesClear;
			net["links"] = links
			
			return net;

	}


	bst.data.geo = function(d, p, p2) {

		var geo2 = []

		if (!p2) p2 = p;

		for (var i in d) {

			var o = { 
				geometry : {

					coordinates : [ parseFloat(d[i][p].split(",")[1]), parseFloat(d[i][p].split(",")[0]) ],
					type: "Point"
				},
				properties : {
					"name":d[i][p2],
					"data" : d[i].data? d[i].data : ""
				}
			}

			geo2.push(o);
		}

		//console.log(geo);

		return geo2;

	}

	bst.data.geoCount = function(d, p, p2) {

		var geo2 = [],
		unique = [],
		counter = {},
		all = {}

		if (!p2) p2 = p;

		for (var i in d) {

			var found = false;

			for (var u in unique) {
				if (unique[u][p2] === d[i][p2]) {
					found = true;
					break;
				}
			}

			if (!found) {
				unique.push(d[i])				
				counter[d[i][p2]]=1;
				all[d[i][p2]] = []
				all[d[i][p2]].push(d[i])
				
			} else {
				counter[d[i][p2]]++;
				
				all[d[i][p2]].push(d[i])
				
			}
			
			

		}


		for (i in unique) {
			var o = { 
				geometry : {

					coordinates : [ parseFloat(unique[i][p].split(",")[1]), parseFloat(unique[i][p].split(",")[0]) ],
					type: "Point"
				},
				properties : {
					"name" : unique[i][p2],
					"count" : counter[unique[i][p2]],
					"data" : all[unique[i][p2]]
				}
			}

			geo2.push(o)
		}


		return geo2;

	}

	bst.data.table = function(d) {

		var t = [];

		for (var i in d) {

			var p = [];

			for (var j in d[i])
			p.push(d[i][j]);

			t.push(p);
		}

		return t;


	}

	bst.data.time = function(d, p) {

		var time = {},
		min = 0,
		max = 0;

		bst.data.sortOn(d, p)

		min = d[0][p].split("-")[0];
		max = d[d.length-1][p].split("-")[0];

		var now = min;

		while (now <= max) {
			time[now] = {x: now, y: 0};
			now++;
		}

		for (var i in d) {
			var year = d[i][p].split("-")[0];
			time[year].y++;	
		}

		var time2 = [];

		for (var i in time) {
			time2.push(time[i]);	
		}

		max = time2[0].y;

		for (var i in time2)
		if(time2[i].y > max) max = time2[i].y;

		for (var i in time2)
		time2[i].y = time2[i].y/max;

		return time2;

	}

	bst.data.sortOn = function(d, p, s) {
		
		if(s == undefined)
			s = 1
		
		return d.sort(compare);				

		function compare(a,b) {
			return( s * ((a[p] < b[p]) ? -1 : ((a[p] > b[p]) ? 1 : 0)))	
		}
	}

	bst.data.minOf = function(d, p) {

		var min;

		for (var o in d) {
			min = bst.data.walkTo(d[o],p);
			break;
		}

		for (var o in d) {
			if(bst.data.walkTo(d[o],p) < min)
			min = bst.data.walkTo(d[o],p);
		}
		return min;
	}

	bst.data.maxOf = function(d, p) {

		var max;

		for (var o in d) {
			max = bst.data.walkTo(d[o],p);
			break;
		}

		for (var o in d) {
			if(bst.data.walkTo(d[o],p) > max)
			max = bst.data.walkTo(d[o],p);
		}

		return max;	
	}

	/** Given an object and a path (as a string), follows the path and returns the value */
	bst.data.walkTo = function(object, path) {

		var steps = path.split(".");
		var r = object;

		for (var i=0; i<steps.length; i++)
		r = r[steps[i]]
		return r;
	}


	})();