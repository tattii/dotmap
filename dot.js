//-------------------------------------
// dots
//-------------------------------------
var width = 780;
var height = 900;

//make field
var svg = d3.select("#map")
	.append("svg")
	.attr({ width: width, height: height })
	.style({background: "azure"});


function drawDot(field, coord, dot_radius, color) {

	if(!color){
		color = "#bdc3c7";
	}

	var dot = field.selectAll("circle")
		.data(coord)
		.enter()
		.append("circle")
		.attr({ r: dot_radius })
		.attr("cx", function(d) {
			return ( 2*d[0] + 1 ) * dot_radius;
		})
		.attr("cy", function(d) {
			return ( 2*d[1] + 1 ) * dot_radius;
		})
		.attr("id", function(d,i) {
			return i;
		})
		.style({ fill: color })
		.on("click", function(){
			changeColor( d3.select(this) );
		});
}

function changeColor(d) {
	d.style("fill", selectedColor() );
}

function clear(){
	svg.selectAll("circle")
		.style({ fill: "#bdc3c7" });
}

function save() {
	var data = [];

	svg.selectAll("circle")
		.attr("id", function (d,i){
			data[i] = d3.select(this).style("fill");
			return i;
		});

	return data;
}

function paint(data) {
	svg.selectAll("circle")
		.style("fill", function(d,i) {
			return data[i];
		});
}


//-------------------------------------
// color palette
//-------------------------------------
var color_field = d3.select("#color-palette")
	.append("svg")
	.attr({ width: 140, height: 110 });

var color_palette_x = 5;
var color_palette_y = 5;
var color_palette_square = 30;
var color_palette_margin = 3;
var color_now = null;

var colors = [
	[0, 0, "#e74c3c"],
	[1, 0, "#3498db"],
	[2, 0, "#16a085"],
	[3, 0, "#bdc3c7"],
	[0, 1, "#f1c40f"],
	[1, 1, "#d35400"],
	[2, 1, "#2ecc71"],
	[3, 1, "#7f8c8d"],
	[0, 2, "#2980b9"],
	[1, 2, "#c0392b"],
	[2, 2, "#f39c12"],
	[3, 2, "#2c3e50"],
];

var color_palette = color_field.append("g");
color_palette.selectAll("rect")
	.data(colors)
	.enter()
	.append("rect")
	.attr({ width: color_palette_square, height: color_palette_square })
	.attr("x", function(d){
		return color_palette_x + d[0] * ( color_palette_square + color_palette_margin );
	})
	.attr("y", function(d){
		return color_palette_y + d[1] * ( color_palette_square + color_palette_margin );
	})
	.style("fill", function(d){
		return d[2];
	})
	.on("click", function(d){
		selectColor( d3.select(this) );
	});

// initialize
selectColor( color_palette.select("rect").style({ fill: "#e74c3c" }) );

function selectColor(d) {
	if (d.style("stroke") == "none"){
		d.style({ "stroke-width": 4, stroke: "orange" });
		if (color_now){
			color_now.style({ "stroke-width": 0, stroke: null });
		}
	}
	color_now = d;
}

function selectedColor() {
	return color_now.style("fill");
}
//-------------------------------------


//dot title----------------------------
var title_dot = d3.select("#title-dot")
	.append("svg")
	.attr({ width: 130, height: 100 });


var dot_map = [
	[0,4],[0,5],
	[2,3],[2,6],
	[1,3],[1,6],
	[3,1],[3,2],[3,3],[3,4],[3,5],	

	[5,4],[5,5],
	[6,3],[6,6],
	[7,3],[7,6],
	[8,4],[8,5],

	[10,3],
	[11,2],[11,3],[11,4],[11,5],[11,6],
	[12,3],
];


//-------------------------------------
// jquery
//-------------------------------------

$(function(){
	$.getJSON("coord.json", function(data){
		drawDot(title_dot, dot_map, 5, "#2980b9");
		drawDot(svg, data.coord, 4);
		if ( store.get('dotmap') ){
			paint( store.get('dotmap') );
		}
	});

	$("#save").click(function(){
		store.set('dotmap', save() );
	});

	$("#clear").click(function(){
		clear();
	});

	$("#save-png").click(function(){
		$("#map").hide();
		$("#map-container").append(
			'<canvas id="canvas" width="' + width + 'px" height="' + height + 'px"></canvas>'
		);
		canvg('canvas', $("#map").html() );

		var png = $('#canvas')[0].toDataURL('image/png');
		png = png.replace("image/png", "application/octet-stream");

		$("#map-container").append(
			'<a id="png" type="application/octet-stream" href="" download="dotmap.png">saving...</a>'
		);
		$('#png').attr('href', png);
		$("#png")[0].click();

		$("#map").show();
		$("#canvas").remove();
		$("#png").remove();
	});
});
