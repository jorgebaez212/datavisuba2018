// Tres arreglos de datos principales: Campos / Datos Totales / Datos Filtrados
var headersInfo = [ {propertyName:"especie",tableName:"Especie"},
                    {propertyName:"price",tableName:"Precio"},
                    {propertyName:"price_ayer",tableName:"Precio Anterior"},
                    {propertyName:"price_max",tableName:"Precio Máximo"},
                    {propertyName:"variacion_price",tableName:"Variación"} ]
var allTickersLatestStatus = [];
var selectedTickersLatestStatus = [];

var allTickersPricesVariations = [];

function createTickersTable(targetDivId, newTickersTableId){

    var allTickersTable = d3.select(targetDivId)
                            .append("table")
                            .property("id",newTickersTableId);

    var allTickersHeader = allTickersTable.append("thead").append("tr");
    allTickersHeader.selectAll("th")
                    .data(headersInfo)
                    .enter()
                    .append("th")
                    .text(function(d) { return d.tableName; });

    var allTickersTablebody = allTickersTable.append("tbody");
    return(allTickersTablebody);
}

function refreshTickersPlots(){
    var priceVariationTarces = [];
    var tirVariationTarces = [];
    
    //Selecciono la informacion de interes del archivo de data cruda
    for (var i=0, len= selectedTickersLatestStatus.length ; i<len; i++) {
        var allVariationsOfTicker = allTickersPricesVariations.filter(tickerVariation => tickerVariation[0]==selectedTickersLatestStatus[i][0]);

        var newTrace = {};
        for (var j=0, headLen=headersInfo.length ; j<headLen; j++) {
            var columnToLoad = headersInfo[j].propertyName;
            if(columnToLoad.includes("price")){
                newRow.push( parseFloat(rawDataArray[i][columnToLoad]).toFixed(3) );
            }
            else{
                newRow.push(rawDataArray[i][columnToLoad]);
            }
        }
        allTickersLatestStatus.push(newRow);

    }
    
    var trace1 = {
        x: [1, 2, 3, 4], 
        y: [10, 15, 13, 17], 
        type: 'scatter'
      };
      var trace2 = {
        x: [1, 2, 3, 4], 
        y: [16, 5, 11, 9], 
        type: 'scatter'
      };
      var data = [trace1, trace2];
      Plotly.newPlot('myDiv', data);
}

function refreshTickersTable(tickersTableBody, dataArray, rowBehaviourOnClick){
    // Vacio la tabla para refrescarla.
    var newTickerRow = tickersTableBody.selectAll("tr").remove();

    // Asociamos dataArray con nuevos tr dentro de tickersTableBody.
    var newTickerRows = tickersTableBody.selectAll("tr")
                                        .data(dataArray)
                                        .enter()
                                        .append("tr")
                                        .on("click", function(d) {rowBehaviourOnClick(d) } );

    var newColumns  =  newTickerRows.selectAll("td")
                                    .data(function(d) {
                                        return d;
                                    })
                                    .enter()
                                    .append("td")
                                    .text(function(d) {
                                        return d;
                                    });
    return(newTickerRows);
}




function addRowToSelectedList(selectedRow){
    // Actualizamos el arreglo de datos, la visualización se acomoda sola!
    testItemExists = selectedTickersLatestStatus.filter(tickerSummary => tickerSummary[0]==selectedRow[0]);

    if(testItemExists.length==0){
        selectedTickersLatestStatus.push(selectedRow);

        // Le damos update() a la visualización de la tabla.
        var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
        refreshTickersTable(selectedTickersTableBody,selectedTickersLatestStatus,deleteFromSelectedList);
    }
}


function deleteFromSelectedList(selectedRowFromSelectedList){
	// Actualizamos el arreglo de datos, eliminando la row seleccionada
	selectedTickersLatestStatus = selectedTickersLatestStatus.filter(tickerSummary => tickerSummary[0]!=selectedRowFromSelectedList[0]);

	// Le damos update() a la visualización de la tabla.
	var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
	refreshTickersTable(selectedTickersTableBody,selectedTickersLatestStatus,deleteFromSelectedList);
}


function loadTickerTables(rawDataArray){
    
    //Selecciono la informacion de interes del archivo de data cruda
    for (var i=0, len= rawDataArray.length ; i<len; i++) {

        var newRow = [];
        for (var j=0, headLen=headersInfo.length ; j<headLen; j++) {
            var columnToLoad = headersInfo[j].propertyName;
            if(columnToLoad.includes("price")){
                newRow.push( parseFloat(rawDataArray[i][columnToLoad]).toFixed(3) );
            }
            else{
                newRow.push(rawDataArray[i][columnToLoad]);
            }
        }
        allTickersLatestStatus.push(newRow);

    }

    //Genero tabla principal de tickers
    var allTickersTablebody = createTickersTable("#allTickersContainer","allTickersTable");

    //Cargo la tabla con todos los tickers disponibles en el archivo
    refreshTickersTable(allTickersTablebody, allTickersLatestStatus, addRowToSelectedList);

    //Genero tabla de tickers seleccionados
    var selectedTickersContainer = createTickersTable("#selectedTickersContainer","selectedTickersTable");

}


function loadTickersPricesVariations(rawDataArray){
    
    //Selecciono la informacion de interes del archivo de data cruda
    var arrayLength = rawDataArray.length;
    for (var i = 0; i < arrayLength; i++) {
        allTickersPricesVariations.push([	rawDataArray[i].especie, 
					        parseInt(rawDataArray[i].d_proc).toFixed(3),
					        parseFloat(rawDataArray[i].price).toFixed(3), 
					        parseFloat(rawDataArray[i].tea_tir).toFixed(3),
					        parseFloat(rawDataArray[i].price_ayer).toFixed(3), 
					        parseFloat(rawDataArray[i].variacion_price).toFixed(3) ]);
    }

}


function loadCSVPrices() {

	//Cargo datos para tabla resumen
	d3.dsv(";","https://raw.githubusercontent.com/jorgebaez212/datavisuba2018/master/cotizaciones/resources/ticker_summary.csv")
		.then(function(data) {
			loadTickerTables(data);
            });
            
	//Cargo datos para visulizacion
	d3.dsv(";","https://raw.githubusercontent.com/jorgebaez212/datavisuba2018/master/cotizaciones/resources/all_ticker_prices.csv")
		.then(function(data) {
		        loadTickersPricesVariations(data);
		    });

}

var main = function() {

    console.log('Hey!');
    loadCSVPrices();

}

// Queremos que la función main se ejecute cuando la página (document) esté lista
$(document).ready(main);
