
var ecapi = new ECAPI('https://data.beta.mksmart.org/entity/');
var nbinspectent = 5;
var dimensionList = new Array();
var entities = new Array();
var minNumberofNumbers = 4;

var currenttype = null;
var currentDimensions = new Array();
var currentEntities = new Array();
var removedEntities = new Array();

var chartdata  = new Array();
var charts     = new Array();
var charttypes = new Array();

var map = null;

var isMap = false;

CanvasJS.addColorSet("mkiocs", ["#8392a2"]);


function setMap(){
   isMap = true;
}

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
    }
    if(currenttype!=null) jQuery('#type'+currenttype).css('color','black');
    currenttype=type;    
    jQuery('#type'+type).css('color','red');
    ecapi.get(type, null, resType, new Array());    
}

function dimensionClicked(dimension){
    if (!isMap){
	if (contains(currentDimensions, dimension)){
	    jQuery('#dimensions'+pfragment(dimension)).css('color','black');
	    removeDimension(dimension);
	} else {
	    jQuery('#dimensions'+pfragment(dimension)).css('color','red');
	    addDimension(dimension);
	}
    } else {
	jQuery("#debug").html("This is a map. Displaying dimensions on a map is not yet implemented");
    }
}

function removeDimension(dimension){
    currentDimensions.splice(currentDimensions.indexOf(dimension), 1);
    updateResultPanel();
}

function addDimension(dimension){
    currentDimensions.push(dimension);
    if (supports_storage()){
	var existingcd = localStorage.getItem("mkio_chartdata_"+currenttype+"/"+dimension);
	if (existingcd && existingcd != null) {
	    chartdata[currenttype+"/"+dimension]=JSON.parse(existingcd);
	    // jQuery("#debug").html("from storage = "+JSON.stringify(chartdata[currenttype+"/"+dimension]));
	}
    }
    if(!chartdata[currenttype+"/"+dimension])
	generateChartData(dimension);
    updateResultPanel();
}

var xnum = 0;

function generateChartData(dimension){
    chartdata[currenttype+"/"+dimension] = new Array();
    var xnum = 0;
    for(var i in entities){	
	ecapi.get(currenttype, fragment(entities[i]), addToChartData, new Array(dimension, xnum, entities[i]));
	xnum++;
    }
}

// TODO: make so that it collects all the needed data (this is also what should be done for charts...
function showMarkers(){
    for(var i in entities){	
	getDataForMap(currenttype, fragment(entities[i]));
    }
}

var entitydata = new Array();

function getDataForMap(type, ent){
    if (!entitydata[type+"/"+ent]){
	ecapi.get(type, ent, addToMapData, new Array(type, ent));
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
    localStorage.setItem("mkio_chartdata_"+currenttype+"/"+p[0], JSON.stringify(chartdata[currenttype+"/"+p[0]]));
}

function clearLocalStorage(dimension){
    localStorage.removeItem("mkio_chartdata_"+currenttype+"/"+dimension);
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

// TODO: make button to save report
// TODO: re-sort chartdatapoints in clear (and clear when created...)
// TODO: chart and dimension generation as a service with cache and blacklist
// TODO: remove and highlight in table
function updateResultPanel(){
    jQuery('#resultpanel').html(' ');
    for (var d in currentDimensions){
	jQuery('#resultpanel').append('<div class="chartpanel" id="chart'+currenttype+'-'+pfragment(currentDimensions[d])+'">Loading</div>');
	jQuery('#resultpanel').append('<div class="chartbuttonpanel" id="chartbuttons'+currenttype+'-'+pfragment(currentDimensions[d])+'">'+
				      '<a href="javascript:toColumnChart(\''+currentDimensions[d]+'\');">column chart</a> | '+
				      '<a href="javascript:toLineChart(\''+currentDimensions[d]+'\');">line chart</a> | '+
				      '<a href="javascript:toPieChart(\''+currentDimensions[d]+'\');">pie chart</a> | '+
				      '<a href="javascript:toTable(\''+currentDimensions[d]+'\');">table</a> | '+
				      '<a href="javascript:createThingDetails(\''+currentDimensions[d]+'\');">thing details</a>'+
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
				       {title:{text:pfragment(currentDimensions[d])}, 
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
		    if (chart.options.data[0].dataPoints[dp].label == fragment(currentEntities[e]).replace(/_/g, ' ')){
			chart.options.data[0].dataPoints[dp].color = "#eae02d";
		    }
		}
	    }
	    var currentDP = chart.options.data[0].dataPoints;
	    var cleanDPs = new Array();
	    var rx = 0;	
	    for(var dp in currentDP){
		if (!isInRemoveList(currentDP[dp].label)){
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

function isInRemoveList(label){
    for (var e in removedEntities){
	if (fragment(removedEntities[e]).replace(/_/g, ' ') == label) return true	
    }
    return false;
}

function entityClicked(entity){
    if (contains(currentEntities, entity)){
	jQuery('#entity'+fragment(entity)).css('color','black');
	currentEntities.splice(currentEntities.indexOf(entity), 1);
   } else {
	jQuery('#entity'+fragment(entity)).css('color','red');
	currentEntities.push(entity);
  }
    updateResultPanel();
}

function removeEntity(entity){
    removedEntities.push(entity);
    updateEntityList();
    updateResultPanel();
}

function resType(data, p){
    dimensionList = new Array();
    jQuery('#dimensionlist').html(' ');
    entities = data.instances;
    entities.sort();
    updateDimensionList();
    if (!isMap){
	jQuery('#entitylist').html(' ');
    } else {
	showMarkers();
    }
    updateEntityList();
}

function updateEntityList(){
    var ht = '<ul><li class="tablelabelbox">Things</li>'; 
    var count = 0;
    for(var i in entities){
	if (!contains(removedEntities, entities[i])){
            ht+='<li><a id="entity'+fragment(entities[i])+'" style="color: black;" href="javascript:entityClicked(\''+entities[i]+'\');">'+fragment(entities[i]).replace(/_/g, ' ')+'</a> <a class="entityremove" href="javascript:removeEntity(\''+entities[i]+'\');">(remove)</a></li>';	
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
    updateDimensionList();
}

function updateDimensionList(){
    var ht='<div class="row">';
    for (var i in dimensionList){
	ht+='<div class="col-md-3 dimensionbox"><a style="color: black" id="dimensions'+
	    pfragment(dimensionList[i])+
	    '" href="javascript:dimensionClicked(\''+dimensionList[i]+'\');">'+pfragment(dimensionList[i])+'</a><span class="cleardim"><a href="javascript:clearLocalStorage(\''+dimensionList[i]+'\');">clear</a></span></div>';
    }
    ht+='</div>';
    jQuery('#dimensionlist').html(ht);
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
   return uri.substring(uri.lastIndexOf(':')+1);
}

function fragment(uri){
   return uri.substring(uri.lastIndexOf('/')+1);
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
