var main = function() {

    console.log('Hey!');

}


// Tres arreglos de datos principales: Campos / Datos Totales / Datos Filtrados
var headers = ["especie","price","price_ayer","price_max","variacion_price"]
var allTickersData = [];
var filteredData = [];

var allTickersPricesVariations = [];

function addTickersTable(targetDivId, newTickersTableId){

    var allTickersTable = d3.select(targetDivId)
                            .append("table")
                            .property("id",newTickersTableId);

    var allTickersHeader = allTickersTable.append("thead").append("tr");
    allTickersHeader.selectAll("th")
                    .data(headers)
                    .enter()
                    .append("th")
                    .text(function(d) { return d; });
    
    var allTickersTablebody = allTickersTable.append("tbody");
    return(allTickersTable);
}


function refreshTickersTable(tickersTableBody, dataArray, rowBehaviourOnClick){
    // Vacio la tabla para refrescarla.
    var newTickerRow = tickersTableBody.selectAll("tr").remove();

    // Usamos el arreglo "filteredData" para actualizar la visualización.
    var newTickerRows = tickersTableBody.selectAll("tr")
                                        .data(dataArray)
                                        .enter()
                                        .append("tr")
                                        .on("click", function(d) {rowBehaviourOnClick(d) } );

    var newCols  =  newTickerRows.selectAll("td")
                                 .data(function(d) {
                                     console.log(d);
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
	filteredData.push(selectedRow);
    
	// Le damos a update() de la visualización de la tabla.
	var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
	refreshTickersTable(selectedTickersTableBody,filteredData,deleteFromSelectedList);st(d);
}


function deleteFromSelectedList(selectedRowFromSelectedList){
	// Actualizamos el arreglo de datos, eliminando la row seleccionada
	filteredData = filteredData.filter(tickerSummary => tickerSummary[0]!=selectedRowFromSelectedList[0]);

	// Le damos a update() de la visualización de la tabla.
	var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
	refreshTickersTable(selectedTickersTableBody,filteredData,deleteFromSelectedList);
}


function loadTickerTables(rawDataArray){
    
    //Selecciono la informacion de interes del archivo de data cruda
    var arrayLength = rawDataArray.length;
    for (var i = 0; i < arrayLength; i++) {
        allTickersData.push([   rawDataArray[i].especie, 
                                parseFloat(rawDataArray[i].price).toFixed(3),
                                parseFloat(rawDataArray[i].price_ayer).toFixed(3), 
                                parseFloat(rawDataArray[i].price_max).toFixed(3), 
                                parseFloat(rawDataArray[i].variacion_price).toFixed(3)]);
    }

    //Genero tabla principal de tickers
    var allTickersTable = addTickersTable("#allTickersContainer","allTickersTable");

    //Cargo la tabla con todos los tickers disponibles en el archivo
    refreshTickersTable(allTickersTable,allTickersData,addRowToSelectedList);
/*
    var allTickersTablebody = allTickersTable.select("tbody");
    allTickersRows = allTickersTablebody.selectAll("tr")
                                        .data(allTickersData)
                                        .enter()
                                        .append("tr")
                                        .on("click", function(d){ addRowToSelectedList(d); } ) ;
    
    // We built the rows using the nested array - now each row has its own array.
    cells = allTickersRows.selectAll("td")
        // each row has data associated; we get it and enter it for the cells.
            .data(function(d) {
                console.log(d);
                return d;
            })
            .enter()
            .append("td")
            .text(function(d) {
                return d;
            });
*/
    //Genero tabla de tickers seleccionados
    var selectedTickersContainer = addTickersTable("#selectedTickersContainer","selectedTickersTable");

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

    console.log('Hey!');
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

// Queremos que la función main se ejecute cuando la página (document) esté lista
$(document).ready(loadCSVPrices);
