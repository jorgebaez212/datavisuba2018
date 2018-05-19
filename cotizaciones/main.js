// Tres arreglos de datos principales: Campos / Datos Totales / Datos Filtrados
var headersInfo = [ {propertyName:"especie",tableName:"Especie"},
                    {propertyName:"price",tableName:"Precio"},
                    {propertyName:"price_ayer",tableName:"Precio Anterior"},
                    {propertyName:"price_max",tableName:"Precio Máximo"},
                    {propertyName:"variacion_price",tableName:"Última Variación"} ]

var allPricesVariationsColumnMapping = { }
var tickersSummaryColumnMapping = { }

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
    
    if(selectedTickersLatestStatus.length>0){
        //Por cada item en la lista selectedTickersLatestStatus, busco las entradas existentes en allTickersPricesVariations.
        for (var i=0, len= selectedTickersLatestStatus.length ; i<len; i++) {

            var index = tickersSummaryColumnMapping.especie;

            var allVariationsOfTicker = allTickersPricesVariations.filter(tickerVariation => tickerVariation[index]==selectedTickersLatestStatus[i][index]);

            // Genero una linea de variacion de precio y una de variacion de tir.
            var newPriceTrace = {
                x: [],
                y: [],
                text: [],
                mode: 'lines',
                name: selectedTickersLatestStatus[i][index],
                line: {shape: 'linear'},
                type: 'scatter'
            };

            var newTirTrace = {
                x: [],
                y: [],
                mode: 'lines',
                name: selectedTickersLatestStatus[i][index],
                line: {shape: 'linear'},
                type: 'scatter'
            };

            for (var j=0, headLen=allVariationsOfTicker.length ; j<headLen; j++) {
                newPriceTrace.x.push(allVariationsOfTicker[j][allPricesVariationsColumnMapping.d_proc]);
                newPriceTrace.y.push(allVariationsOfTicker[j][allPricesVariationsColumnMapping.price]);
                
                var dailyPriceVariationRaw = parseFloat(allVariationsOfTicker[j][allPricesVariationsColumnMapping.variacion_price]).toFixed(4);
                var dailyPriceVariation = dailyPriceVariationRaw*100;
                dailyPriceVariationRaw = dailyPriceVariationRaw.toString();
                dailyPriceVariation = dailyPriceVariation.toString();

                var yearlyPriceVariationRaw = parseFloat(allVariationsOfTicker[j][allPricesVariationsColumnMapping.variacion_price_anio_ant]).toFixed(4);
                var yearlyPriceVariation = yearlyPriceVariationRaw*100;
                yearlyPriceVariationRaw = yearlyPriceVariationRaw.toString();
                yearlyPriceVariation = yearlyPriceVariation.toString();

                newPriceTrace.text.push("Variacion: dia previo (raw data): " + dailyPriceVariationRaw + "<br>" + 
                                        "Variacion: dia previo: %" + dailyPriceVariation + "<br>" /* + 
                                        "Variacion: año previo (raw data): " + yearlyPriceVariationRaw + "<br>" + 
                                        "Variacion: año previo: %" + yearlyPriceVariation  */
                                    );

                newTirTrace.x.push(allVariationsOfTicker[j][allPricesVariationsColumnMapping.d_proc]);
                newTirTrace.y.push(parseFloat(allVariationsOfTicker[j][allPricesVariationsColumnMapping.tea_tir]).toFixed(4));
            }

            priceVariationTarces.push(newPriceTrace);
            tirVariationTarces.push(newTirTrace);
        }

        var layoutPrecio = {
            showlegend: true,
            title:"Variación de Precio",
            legend: {
                y: 0.5,
                font: {size: 16}
            }};
        Plotly.newPlot('priceVariationsPlot', priceVariationTarces, layoutPrecio);

        var layoutTIR = {
            showlegend: true,
            title:"Variación de TIR",
            legend: {
                y: 0.5,
                font: {size: 16}
            }};
        Plotly.newPlot('tirVariationsPlot', tirVariationTarces, layoutTIR);
    }
    else{
    	d3.select("#priceVariationsPlot").selectAll("*").remove();
    	d3.select("#tirVariationsPlot").selectAll("*").remove();
    }
    

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
    
    // Actualizamos el arreglo de datos.
    var index = tickersSummaryColumnMapping.especie;
    testItemExists = selectedTickersLatestStatus.filter(tickerSummary => tickerSummary[index]==selectedRow[index]);

    if(testItemExists.length==0){
        selectedTickersLatestStatus.push(selectedRow);

        // Refresco tabla de tickers seleccionados.
        var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
        refreshTickersTable(selectedTickersTableBody,selectedTickersLatestStatus,deleteFromSelectedList);

        // Refresco plots de variaciones.
        refreshTickersPlots();
    }
}


function deleteFromSelectedList(selectedRowFromSelectedList){
    // Actualizamos el arreglo de datos.
    var index = tickersSummaryColumnMapping.especie;
	selectedTickersLatestStatus = selectedTickersLatestStatus.filter(tickerSummary => tickerSummary[index]!=selectedRowFromSelectedList[index]);

	// Refresco tabla de tickers seleccionados.
	var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
    refreshTickersTable(selectedTickersTableBody,selectedTickersLatestStatus,deleteFromSelectedList);
    
    // Refresco plots de variaciones.
    refreshTickersPlots();
}


function loadTickerTables(rawDataArray){
    
    //Selecciono la informacion de interes del archivo de data cruda
    for (var i=0, len= rawDataArray.length ; i<len; i++) {

        var newRow = [];
        for (var j=0, headLen=headersInfo.length ; j<headLen; j++) {
            var columnToLoad = headersInfo[j].propertyName;
            if(columnToLoad.includes("variacion")){
                newRow.push( "%"+(((parseFloat(rawDataArray[i][columnToLoad])*100).toFixed(2)).toString()) );
            }
            else if(columnToLoad.includes("price")){
                newRow.push( parseFloat(rawDataArray[i][columnToLoad]).toFixed(3) );
            }
            else{
                newRow.push(rawDataArray[i][columnToLoad]);
            }
            //Cargo column mapping para referenciar columnas por nombre
            tickersSummaryColumnMapping[columnToLoad]=i;
        }
        allTickersLatestStatus.push(newRow);

    }

    //Genero tabla principal de tickers
    var allTickersTablebody = createTickersTable("#allTickersContainer","allTickersTable");

    //Cargo la tabla con todos los tickers disponibles en el archivo
    refreshTickersTable(allTickersTablebody, allTickersLatestStatus, addRowToSelectedList);

    //Genero tabla de tickers seleccionados
    var selectedTickersContainer = createTickersTable("#selectedTickersContainer","selectedTickersTable");

    //Cargo column mapping para referenciar columnas por nombre
    tickersSummaryColumnMapping =   {
                                        "especie" : 0,
                                        "d_proc" : 1,
                                        "price" : 2,
                                        "tea_tir" : 3,
                                        "price_ayer" : 4,
                                        "variacion_price" : 5
                                    }

}


function loadTickersPricesVariations(rawDataArray){
    
    //Selecciono la informacion de interes del archivo de data cruda
    var arrayLength = rawDataArray.length;

    for (var i = 0; i < arrayLength; i++) {
        allTickersPricesVariations.push([	rawDataArray[i].especie, 
                                            rawDataArray[i].d_proc,
                                            parseFloat(rawDataArray[i].price).toFixed(3), 
                                            parseFloat(rawDataArray[i].tea_tir).toFixed(3),
                                            parseFloat(rawDataArray[i].price_ayer).toFixed(3), 
                                            parseFloat(rawDataArray[i].variacion_price_anio_ant).toFixed(4),
                                            parseFloat(rawDataArray[i].variacion_price).toFixed(4),
                                            parseFloat(rawDataArray[i].price_anio_ant).toFixed(3)
                                        ]);
    }

    //Cargo column mapping para referenciar columnas por nombre
    allPricesVariationsColumnMapping =  {
                                            "especie" : 0,
                                            "d_proc" : 1,
                                            "price" : 2,
                                            "tea_tir" : 3,
                                            "price_ayer" : 4,
                                            "variacion_price_anio_ant" : 5,
                                            "variacion_price" : 6,
                                            "price_anio_ant" : 7
                                        }

}


function loadCSVPrices() {

    //Cargo datos para visulizacion
	d3.dsv(";","https://raw.githubusercontent.com/jorgebaez212/datavisuba2018/master/cotizaciones/resources/all_ticker_prices.csv")
    .then(function(data) {
            loadTickersPricesVariations(data);

            console.log('Pagina lista!');

/*            document
                .getElementById("mainPage")
                .style
                .display = "bock";
            document
                .getElementById("loaderWheel")
                .style
                .display = "none";*/
        });

    //Cargo datos para tabla resumen
	d3.dsv(";","https://raw.githubusercontent.com/jorgebaez212/datavisuba2018/master/cotizaciones/resources/ticker_summary.csv")
		.then(function(data) {
			loadTickerTables(data);
            });

}

var main = function() {

    loadCSVPrices();

    //Agrego comportamiento al buscador de tickers.
    $("#tickerSearchBox").keyup( function() {
        var allTickersTableBody = d3.select("#allTickersTable").select("tbody");
        var searchText = $("#tickerSearchBox").val();

        var index = tickersSummaryColumnMapping.especie;

        if(searchText.length!=0){
            var filteredTickersLatestStatus = allTickersLatestStatus.filter(tickerSummary => tickerSummary[index].includes(searchText));

            // Refresco tabla resumen de tickers utilizando el texto para filtrar especies.
            refreshTickersTable(allTickersTableBody, filteredTickersLatestStatus, addRowToSelectedList);
        }
        else{
            // Refresco tabla resumen de tickers mostrando todos los tickers disponibles.
            refreshTickersTable(allTickersTableBody, allTickersLatestStatus, addRowToSelectedList);
        }

    });

}

// Queremos que la función main se ejecute cuando la página (document) esté lista
$(document).ready(main);
