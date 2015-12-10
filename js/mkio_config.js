dimension_list = [
{name: "Estate", type:"place", categories: [
   {name: "Census", properties: [
       {name:"Population 2011", attr:"demographics:population-2011"},
       {name:"Female Population 2011", attr:"demographics:female-population-2011"},
       {name:"Male Population 2011", attr:"demographics:male-population-2011"},
       {name:"Ethnicity", attr:"global:ethnicity", subprops:[
	   {name:"White: Gypsy or Irish Traveller", attr:"global:white:_gypsy_or_irish_traveller"},
	   {name:"White: Irish", attr:"global:white:_irish"},
	   {name:"Black and Minotiry Ethnic Group: Total", attr:"global:black_and_minority_ethnic_group:_total"},
	   {name:"Multiple Ethnic Group: Other Mixed", attr:"global:multiple_ethnic_group:_other_mixed"},
	   {name:"Multiple Ethnic Group: White and Black African", attr:"global:multiple_ethnic_group:_white_and_black_african"},
	   {name:"Multiple Ethnic Group: White and Asian", attr:"global:multiple_ethnic_group:_white_and_asian"},
	   {name:"Other Ethnic Group: Arab", attr:"global:other_ethnic_group:_arab"},
	   {name:"Asian British: Chinese", attr:"global:asian_british:_chinese"},
	   {name:"Black British: Other Asian", attr:"global:asian_british:_other_asian"},
	   {name:"Black British: Caribbean", attr:"global:black_british:_caribbean"},
	   {name:"All Usual Residents", attr:"global:all_usual_residents"},
	   {name:"Asian British: Bangladeshi", attr:"global:asian_british:_bangladeshi"},
	   {name:"Asian British: Pakistani", attr:"global:asian_british:_pakistani"},
	   {name:"Assian British: Indian", attr:"global:asian_british:_indian"},
	   {name:"Multiple Ethnic Group: White and Black Caribbean", attr:"global:multiple_ethnic_group:_white_and_black_caribbean"},
	   {name:"Black British: Other Black", attr:"global:black_british:_other_black"},
	   {name:"British", attr:"global:british"},
	   {name:"Other Ethnic Group: Any Other Ethnic Group", attr:"global:other_ethnic_group:_any_other_ethnic_group"},
	   {name:"White: Other White", attr:"global:white:_other_white"},
	   {name:"Black British: African", attr:"global:black_british:_african"}
       ]},
   ]},
   {name: "Crime", properties: [
       {attr: "global:nbCrimes", name: "Total", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]},
       {attr: "global:numberOfCriminalDamages", name: "Criminal Damages", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]},
       {attr: "global:numberOfRobberies", name: "Robberies", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]},
       {attr: "global:numberOfViolencesAgainstThePerson", name: "Violence Against The Person", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]},
       {attr: "global:numberOfBurglaries", name: "Burglaries", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]},
       {attr: "global:numberOfArsonFires", name: "Arson Fires", subprops:[
            {name:"2006-2007", attr:"year:2006/7"},
            {name:"2007-2008", attr:"year:2007/8"},
            {name:"2008-2009", attr:"year:2008/9"},
            {name:"2009-2010", attr:"year:2009/10"},
            {name:"2010-2011", attr:"year:2010/11"},
            {name:"2011-2012", attr:"year:2011/12"},
            {name:"2012-2013", attr:"year:2012/13"},
            {name:"2013-2014", attr:"year:2013/14"}
       ]}
    ]},
   {name: "Deprivation", properties: [
       {name:"IMD 2004", attr:"imd:imd-2004"},
       {name:"IMD 2007", attr:"imd:imd-2007"},
       {name:"IMD 2010", attr:"imd:imd-2010"}
   ]}
// global:tenure three levels
]}, 
{name: "Ward", type:"ward", categories: [
]}, 
{name: "LSOA", type:"lsoa", categories: [
   {name: "Population", properties: [
       {name:"Residents", attr:"global:TotalResidents"},
       {name:"Income Score", attr:"global:IncomeScore"},
       {name:"IMD Rank", attr:"global:ImdRank"},
       {name:"IMD", attr:"global:Imd"}
   ]},
    {name: "Energy", properties: [
	{name:"Number of Dom. El. Meters", attr:"global:TotalNumberOfDomesticElectricityMeters"},
	{name:"Number of Gas Meters", attr:"global:NumberOfGasMeters"},
	{name:"Total Dom. El. Consumption (KWh)", attr:"global:TotalDomesticElectricityConsumption-kwh"},
	{name:"Gas Consumption (kWh)", attr:"global:GasConsumption-kwh"},
	{name:"Mean Dom. El. Consumption (KWh/m)", attr:"global:MeanDomesticElectricityConsumption-kwhPerMeter"}, 
	{name:"Median Dom. El. Consumption (KWh/m)", attr:"global:MedianDomesticElectricityConsumption-kwhPerMeter"},     
	{name:"Mean Gas Consumption (KWh/m)", attr:"global:MeanGasConsumption-kwhPerMeter"},
	{name:"Median Gas Consumption (kWh/m)", attr:"global:MedianGasConsumption-kwhPerMeter"}
   ]},    
    {name: "2011-2012 Survey", properties: [
	{name:"Mean Life Satisfaction Rating", attr:"global:meanLifeSatisfactionRating-2011-2012"},
	{name:"Mean Worthwhile Rating", attr:"global:meanWorthwhileRate-2011-2012"},
	{name:"Mean Happy Yesterday Rating", attr:"global:meanHappyYesterdayAnswer-2011-2012"}
    ]}
]}, 
{name: "OA", type:"lsoa", categories: [
]}, 
];


function getCategories(type){
    for(var i in dimension_list){
	if (dimension_list[i].type==type) return dimension_list[i];
    }
    return null;
}

function getL1Dimensions(type, cat){
    var cats = getCategories(type);
    if(cats){
	for(var i in cats.categories){
	    if (cats.categories[i].name==cat) return cats.categories[i].properties;
	}
    }
    return null;
}

function getL1Dimension(type, cat, dim){
    var dlist = getL1Dimensions(type, cat);
    if (dlist){
	for(var i in dlist){
	    if (dlist[i].attr==dim) return dlist[i];
	}
    }
    return null;
}

function getL2Dimensions(type, cat, l1dim){
    var lds = getL1Dimension(type, cat, l1dim);
    if(lds && lds.subprops){
	return lds.subprops;
    }
    return null;
}

