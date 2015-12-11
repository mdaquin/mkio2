var ecapi = new ECAPI('https://data.beta.mksmart.org/entity/');
var nbinspectent = 5;
var dimensionList = new Array();
var entities = new Array();
var minNumberofNumbers = 4;

var currenttype = null;
var currentCat = null;
var currentDimensions = new Array();
var currentEntities = new Array();
var removedEntities = new Array();

var chartdata  = new Array();
var charts     = new Array();
var charttypes = new Array();

var map = null;
var markers = null;

var isMap = false;

CanvasJS.addColorSet("mkiocs", ["#8392a2"]);


function setMap(){
   isMap = true;
}

// events

function typeClicked(type){
    if (!isMap){
	jQuery("#resultpanel").html(' ');
	currentDimensions = new Array();
	currentEntities = new Array();
	removedEntities = new Array();
    } else {
	if (!map)
	    map = L.map('mappanel').setView([52.0400, -0.7600], 13);
	var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
				  {minZoom: 8, maxZoom: 16, attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'});
	map.addLayer(osm);
	markers = new L.FeatureGroup();
	map.addLayer(markers);	
    }
    if(currenttype!=null) jQuery('#type'+currenttype).css('color','black');
    currenttype=type;    
    jQuery('#type'+type).css('color','red');
    ecapi.get(type, null, resType, new Array());        
    updateDimensionList(type);
}


function categoryClicked(cat){
    currentCat = cat;
    updateL1Dimensions(currenttype, cat);
}


function l1dimensionClicked(cat, dimension){
    if (!isMap){
	var d = getL1Dimension(currenttype, cat, dimension);
	if (d.subprops){
	    updateL2Dimensions(currenttype, cat, dimension);
	} else {
	    if (contains(currentDimensions, dimension)){
		jQuery('#l1dimension'+pfragment(dimension)).css('color','black');
		removeDimension(dimension);
	    } else {
		jQuery('#l1dimension'+pfragment(dimension)).css('color','red');
		addDimension(dimension);
	    }
	}
    } else {
	var d = getL1Dimension(currenttype, cat, dimension);
	if (d.subprops){
	    updateL2Dimensions(currenttype, cat, dimension);
	} else {
	    displayDimension(currenttype, cat, dimension);	   
	}
    }
}

function l2dimensionClicked(cat, l1dim, l2dimension){
    if (!isMap){
	if (contains(currentDimensions, l1dim+"."+l2dimension)){
	    jQuery('#l2dimension'+pfragment(l2dimension)).css('color','black');
	    removeDimension(l1dim+"."+l2dimension);
	} else {
	    jQuery('#l2dimension'+pfragment(l2dimension)).css('color','red');
	    addDimension(l1dim+"."+l2dimension);
	}
    } else {
	jQuery("#debug").html("This is a map. Displaying dimensions on a map is not yet implemented");
    }
}

function entityClicked(entity){
    console.log("enity clicked "+entity);
    if (contains(currentEntities, entity)){
	jQuery('#entity'+fragment(entity)).css('color','black');
	currentEntities.splice(currentEntities.indexOf(entity), 1);
   } else {
	jQuery('#entity'+fragment(entity)).css('color','red');
	currentEntities.push(entity);
  }
    updateResultPanel();
}

function filterChanged(){
    var ft = jQuery("#filter").val();
    jQuery(".entitybox").each(function(){
	if (!this.id.match("entitybox.*"+ft+".*")) {
	    this.style.display= "none";
	}
	else { 
	    this.style.display= "block";
	}
    });
}

function removeShown(){
    var ft = jQuery("#filter").val();
    updateEntityList();
    updateResultPanel();
    jQuery(".entitybox").each(function(){
	if (this.id.match("entitybox.*"+ft+".*")) {
	    removeEntity(this.attributes["entity"].nodeValue);
	    updateEntityList();
	    updateResultPanel();
	}
    });
}

function removeNotShown(){
    var ft = jQuery("#filter").val();
    updateEntityList();
    updateResultPanel();
    jQuery(".entitybox").each(function(){
	if (!this.id.match("entitybox.*"+ft+".*")) {
	    removeEntity(this.attributes["entity"].nodeValue);
	    updateEntityList();
	    updateResultPanel();
	}
    });
}

function highlightShown(){
    var ft = jQuery("#filter").val();
    updateEntityList();
    updateResultPanel();
    jQuery(".entitybox").each(function(){
	if (this.id.match("entitybox.*"+ft+".*")) {
	    entityClicked(this.attributes["entity"].nodeValue);
	}
    });
}

function highlightNotShown(){
    var ft = jQuery("#filter").val();
    updateEntityList();
    updateResultPanel();
    jQuery(".entitybox").each(function(){
	if (!this.id.match("entitybox.*"+ft+".*")) {
	    entityClicked(this.attributes["entity"].nodeValue);
	}
    });
}

function resetHighlightAndRemove(){
    removedEntities = new Array();
    currentEntities = new Array();
    updateEntityList();
    updateResultPanel();
}


// actions

function removeDimension(dimension){
    currentDimensions.splice(currentDimensions.indexOf(dimension), 1);
    updateResultPanel();
}

function addDimension(dimension){
    currentDimensions.push(dimension);
    generateChartData(dimension);
    updateResultPanel();
}

var xnum = 0;

// chart management

// TODO :
//   - make an entity page

function generateChartData(dimension){
    getChartData(currenttype, dimension);
    // call chartdata service with currenttype and dimension (should be JPATH and further agg function
    // store the chart data
    // filter function depending on selected entities
    // store filtered data
    // update filter panel
}

// TODO: config url
function getChartData(type, dimension){
    var url = 'http://localhost/mkio2_alpha/wordpress/wp-content/themes/optimizer/mkio2/chartdata.php?type='+
	type+'&attr='+dimension;
    jQuery.ajax({
	url: url
    }).done(function(data){
	chartdata[currenttype+"/"+dimension] = eval(data);
	updateResultPanel();
    });
}

function generateChartData_old(dimension){
    chartdata[currenttype+"/"+dimension] = new Array();
    var xnum = 0;
    for(var i in entities){	
	ecapi.get(currenttype, fragment(entities[i]), addToChartData, new Array(dimension, xnum, entities[i]));
	xnum++;
    }
}

function addToChartData(d, p){
    if (d[p[0]])
	if(isNumber(d[p[0]][0])){
	    chartdata[currenttype+"/"+p[0]].push(
		{'x': p[1], 'y': parseFloat(d[p[0]][0]), 
		 'label'  : fragment(p[2]).replace(/_/g, ' '), 
		 'entity' : p[2]
		}
	    );
	} else {
	    sum = 0;
	    count=0;
	    for (i in d[p[0]][0]){
		if (isNumber(d[p[0]][0][i])){
		    sum+=parseFloat(d[p[0]][0][i]);
		    count++;
		}
	    }
	    // how to make choose average or other...
	    chartdata[currenttype+"/"+p[0]].push(	    
		{'x': p[1], 'y': (sum), 
		 'label': fragment(p[2]).replace(/_/g, ' '),
		 'entity': p[2]
		}
	    );
	}
//    charts[currenttype+"/"+p[0]].options.data[0].dataPoints = chartdata[currenttype+"/"+p[0]];
//    charts[currenttype+"/"+p[0]].render();
    updateResultPanel();
    // jQuery("#debug").html(JSON.stringify(chartdata[currenttype+"/"+p[0]]));
    //    if (chartdata.length==entities.length) 
}

function toLineChart(dimension){
    charttypes[currenttype+"/"+dimension]="spline";
    updateResultPanel();
}

function toColumnChart(dimension){
    charttypes[currenttype+"/"+dimension]="column";
    updateResultPanel();
}

function toPieChart(dimension){
    charttypes[currenttype+"/"+dimension]="pie";
    updateResultPanel();
}

function toTable(dimension){
    charttypes[currenttype+"/"+dimension]="table";
    updateResultPanel();
}

// map management

function displayDimension(type, cat, dimension){
    markers.clearLayers();
    var url = 'http://localhost/mkio2_alpha/wordpress/wp-content/themes/optimizer/mkio2/mapdata.php?type='+
	type+'&attr='+dimension;
    jQuery.ajax({
	url: url
    }).done(function(data){
	var vals = eval('['+data+']');
	var min = 10000000;
	var max = -10000000;
	for(var i in vals[0]){	    
	    if (parseFloat(vals[0][i]['value'])<min) min = parseFloat(vals[0][i]['value']);
	    if (parseFloat(vals[0][i]['value'])>max) max = parseFloat(vals[0][i]['value']);
	}
	for(var i in vals[0]){	    
	    var value = parseFloat(vals[0][i]['value']);
	    var red = Math.round(((value-min)/(max-min))*255);
	    var blue = 255-red;
	    var sred = red.toString(16);
	    if (red<16) sred='0'+sred;
	    var sblue = blue.toString(16);
	    if (blue<16) sblue='0'+sblue;
	    var color = '#'+sred+sblue+'00';		
	    var circle = L.circle([parseFloat(vals[0][i]['lat']), parseFloat(vals[0][i]['long'])], 150, {
		color: color,
		fillColor: color,
		fillOpacity: 0.8,
		opacity: 0.8,
		stroke: 0
	    }).addTo(markers);	    
	    circle.bindPopup("<strong>"+fragment(i)+"</strong><br/>"+value);
	}
    });
}


// TODO: make so that it collects all the needed data (this is also what should be done for charts...
//function showMarkers(){
//    for(var i in entities){	
//	getDataForMap(currenttype, fragment(entities[i]));
//    }
//}

var entitydata = new Array();

function getDataForMap(type, ent){
    if (!entitydata[type+"/"+ent]){
//	ecapi.get(type, ent, addToMapData, new Array(type, ent));
    }
}

function addToMapData(data, p){
    entitydata[p[0]+"/"+p[1]] = data;
//    jQuery("#debug").html(JSON.stringify(data));	
    if (data["geo:long"] && data["geo:lat"] && map){
	jQuery("#debug").html(data["geo:long"]+", "+data["geo:lat"]);	
	marker = L.marker([parseFloar(data["geo:lat"]), parseFloat(data["geo:long"])]);
	marker.addToMap(map);
	jQuery("#debug").html(JSON.stringify(marker));	
    }
    if (data["geo:longitude"] && data["geo:latitude"] && map){
	jQuery("#debug").html(data["geo:longitude"]+", "+data["geo:latitude"]);	
    }
}

// result panel...

// TODO: make button to save report
// TODO: remove and highlight in table
// TODO: dimension management as a service too
// TODO: map
function updateResultPanel(){
    jQuery('#resultpanel').html(' ');
    for (var d in currentDimensions){
	jQuery('#resultpanel').append('<div class="chartpanel" id="chart'+currenttype+'-'+pfragment(currentDimensions[d])+'">Loading</div>');
	jQuery('#resultpanel').append('<div class="chartbuttonpanel" id="chartbuttons'+currenttype+'-'+pfragment(currentDimensions[d])+'">'+
				      '<a href="javascript:toColumnChart(\''+currentDimensions[d]+'\');">column chart</a> | '+
				      '<a href="javascript:toLineChart(\''+currentDimensions[d]+'\');">line chart</a> | '+
				      '<a href="javascript:toPieChart(\''+currentDimensions[d]+'\');">pie chart</a> | '+
				      '<a href="javascript:toTable(\''+currentDimensions[d]+'\');">table</a> | '+
//				      '<a href="javascript:createThingDetails(\''+currentDimensions[d]+'\');">thing details</a>'+
				      '</div>');

	if (charttypes[currenttype+"/"+currentDimensions[d]] &&
	    charttypes[currenttype+"/"+currentDimensions[d]]=="table") {	    
	    jQuery("#chart"+currenttype+"-"+pfragment(currentDimensions[d])).css("overflow-y", "scroll");
	    var ht='<table id="table'+currenttype+'-'+
		pfragment(currentDimensions[d])+'" class="display" cellspacing="0" width="100%">'+
		'<thead>'+
		'<tr>'+
		'<th>'+currenttype+'</th>'+
		'<th>'+pfragment(currentDimensions[d])+'</th>'+
		'</tr>'+
		'</thead>'+
		'<tbody>';
	    if (chartdata[currenttype+"/"+currentDimensions[d]]){
		var cd = chartdata[currenttype+"/"+currentDimensions[d]];
		for (var dp in cd){
		    ht+='<tr><td>'+cd[dp].label+'</td><td>'+cd[dp].y+'</td></tr>';
		}
	    }
	    ht+='</tbody>'+
		'</table>';
	    jQuery('#chart'+currenttype+'-'+pfragment(currentDimensions[d])).html(ht);

	    jQuery('#table'+currenttype+'-'+pfragment(currentDimensions[d])).DataTable( {
		dom: 'Bfrtip',
		filter: false, 
//		pagingType: "simple",
		"paging": false,
		buttons: [
		    'copyHtml5',
		    'excelHtml5',
		    'csvHtml5'
		]});	    
	} else {
	    var chart = new CanvasJS.Chart('chart'+currenttype+'-'+pfragment(currentDimensions[d]),
				       {title:{text:generateTitle(currentDimensions[d])}, 
					axisX:{},
					zoomEnabled: true, 
//					animationEnabled: true, 
					exportEnabled: true, 
					exportFileName: currenttype+"-"+pfragment(currentDimensions[d]),
					axisY: {},
					data: [{type: "column",
						click: function(e){
						    entityClicked(e.dataPoint.entity);
						    },
						dataPoints: []}]});
	    if (charttypes[currenttype+"/"+currentDimensions[d]]){
		chart.options.data[0].type=charttypes[currenttype+"/"+currentDimensions[d]];
	    }
	    if (charttypes[currenttype+"/"+currentDimensions[d]]!="pie"){
		chart.options.colorSet = "mkiocs";
	    }	
	    if (chartdata[currenttype+"/"+currentDimensions[d]])
		chart.options.data[0].dataPoints = chartdata[currenttype+"/"+currentDimensions[d]];
	    for (var dp in chart.options.data[0].dataPoints){
		if (chart.options.data[0].dataPoints[dp].color) delete chart.options.data[0].dataPoints[dp].color;
	    }
	    for (var e in currentEntities){
		for (var dp in chart.options.data[0].dataPoints){
		    if (chart.options.data[0].dataPoints[dp].entity == currentEntities[e]){
			chart.options.data[0].dataPoints[dp].color = "#eae02d";
		    }
		}
	    }
	    var currentDP = chart.options.data[0].dataPoints;
	    var cleanDPs = new Array();
	    var rx = 0;	
	    for(var dp in currentDP){
		if (!isInRemoveList(currentDP[dp].entity)){
		    var item = currentDP[dp];
		    item.x = rx;
		    cleanDPs.push(item);
		    rx++;
		}
	    }
	    chart.options.data[0].dataPoints = cleanDPs;
	    chart.render();
	    charts[currenttype+"/"+currentDimensions[d]] = chart;
	}
    }
    jQuery('#resultpanel').append('<div class="savepanel" id="savepanel"><a href="">Save Report</a></div>');
}

function isInRemoveList(id){
    for (var e in removedEntities){
	if (removedEntities[e] == id) return true	
    }
    return false;
}


function removeEntity(entity){
    removedEntities.push(entity);
    updateEntityList();
    updateResultPanel();
}

function resType(data, p){
    entities = data.instances;
    entities.sort();    
    if (!isMap){
	jQuery('#entitylist').html(' ');
    } else {
	// showMarkers();
    }
    updateEntityList();
}

// TODO: make a data table... 
function updateEntityList(){
    var ht = '<ul><li class="tablelabelbox">Things</li>'; 
    ht += '<input type="text" name="filter" id="filter" placeholder="filter" onkeyup="filterChanged()"/><br/>';
    ht += '<li class="filterbutton"><a href="javascript:removeShown()">Remove shown</a></li>';
    ht += '<li class="filterbutton"><a href="javascript:removeNotShown()">Remove all but shown</a></li>';
    ht += '<li class="filterbutton"><a href="javascript:highlightShown()">Highlight shown</a></li>';
//    ht += '<li class="filterbutton"><a href="javascript:highlightNotShown()">Highlight all but shown</a></li>';
    ht += '<li class="filterbutton"><a href="javascript:resetHighlightAndRemove()">Reset</a></li>';
    var count = 0;
    for(var i in entities){
	if (!contains(removedEntities, entities[i])){
            ht+='<li class="entitybox" entity="'+entities[i]+'" id="entitybox'+fragment(entities[i])+'"><a id="entity'+fragment(entities[i])+'" style="color: black;" href="javascript:entityClicked(\''+entities[i]+'\');">'+fragment(entities[i]).replace(/_/g, ' ')+'</a> <a class="entityremove" href="javascript:removeEntity(\''+entities[i]+'\');">(remove)</a></li>';	
            if (count < nbinspectent) ecapi.get(currenttype, fragment(entities[i]), resEntity, new Array());
	    count++;
	}
    }
    ht+='</ul>';
    jQuery('#entitylist').html(ht);
}


function resEntity(data, p){
   for (var i in data){
       if(!contains(dimensionList, i)){
	   if (chartable(data[i])) { 
	       dimensionList.push(i);
	   }
       }
   }
    dimensionList.sort();
}

function updateDimensionList(type){
    var ht='<div class="row">';
    for (var i in dimension_list){
	if (dimension_list[i].type==type){
	    for (var j in dimension_list[i].categories){
		var cat=dimension_list[i].categories[j];
		ht+='<div class="col-md-3 categorybox"><a style="color: black" id="category'+
		    cat.name +
		    '" href="javascript:categoryClicked(\''+cat.name+'\');">'+cat.name+'</a></div>';
	    }
	}
    }
    ht+='</div><div id="l1dimensionlist"></div>';
    jQuery('#dimensionlist').html(ht);
}

function updateL1Dimensions(type, cat){
    var ht='<div class="row">';
    var plist = getL1Dimensions(type, cat);
    for (var i in plist){
	ht+='<div class="col-md-3 dimensionbox"><a style="color: black" id="l1dimension'+
	    pfragment(plist[i].attr) +
	    '" href="javascript:l1dimensionClicked(\''+cat+'\', \''+plist[i].attr+'\');">'+plist[i].name+'</a></div>';
    }
    ht+='</div><div id="l2dimensionlist"></div>';
    jQuery('#l1dimensionlist').html(ht);
}

function updateL2Dimensions(type, cat, l1dim){
    var ht='<div class="row">';
    var plist = getL2Dimensions(type, cat, l1dim);
    for (var i in plist){
	ht+='<div class="col-md-3 l2dimensionbox"><a style="color: black" id="l2dimension'+
	    pfragment(plist[i].attr) +
	    '" href="javascript:l2dimensionClicked(\''+cat+'\', \''+l1dim+'\', \''+plist[i].attr+'\');">'+plist[i].name+'</a></div>';
    }
    ht+='</div>';
    jQuery('#l2dimensionlist').html(ht);
}

function chartable(obj){
    if (isNumber(obj[0])) return true;
    var count = 0
    for (var i in obj[0]){
	if (isNumber(obj[0][i])) count++;		
    }
    if (count >= minNumberofNumbers) return true;
  return false;
}

function pfragment(uri){
   return uri.substring(uri.lastIndexOf(':')+1).replace(/\//g, "-").replace(/\(/,"-_").replace(/\)/,"_-");
}

function fragment(uri){
    if (uri)
	return uri.substring(uri.lastIndexOf('/')+1);
    return uri;
}

function contains(a, i){
    for (var j in a) if (a[j]==i) return true;
    return false;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function supports_storage() {
    try {
	return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
	return false;
    }
}
    
function generateTitle(dim){
    var res = "";
    var dims = dim.split(".");
    var first = true;
    for (var i in dims){
	if (!first){
	    res += ' : ';	    
	}
	res+= pfragment(dims[i]).replace(/_/g, " ").replace(/([a-z])([A-Z])/g, '$1 $2');
	first=false;
    }
    return res;
}
    
