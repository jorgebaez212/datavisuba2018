var main = function() {

    console.log('Hey!');

}


// Tres arreglos de datos principales: Campos / Datos Totales / Datos Filtrados
var headers = ["especie","price","price_ayer","price_max","variacion_price"]
var allTickersData = [];
var filteredData = [];

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

function addRowToTickersTable(tickersTableBody, rowArray, rowBehaviourOnClick){

    // Usamos el arreglo "filteredData" para actualizar la visualización.
    var newTickerRow = tickersTableBody.selectAll("tr")
                                        .data(filteredData)
                                        .enter()
                                        .append("tr")
                                        .on("click", function(d) {rowBehaviourOnClick(d) } );
    //debugger;
    var newCells =  newTickerRow.selectAll("td")
                                .data(function(d) {
                                    console.log(d);
                                    return d;
                                })
                                .enter()
                                .append("td")
                                .text(function(d) {
                                    return d;
                                });
    return(newTickerRow);
}

function addRowToSelectedList(selectedRow){
    // Actualizamos el arreglo de datos, la visualización se acomoda sola!
    filteredData.push(selectedRow);
    
    // Le damos a update() de la visualización de la tabla.
    var selectedTickersTableBody = d3.select("#selectedTickersTable").select("tbody");
    addRowToTickersTable(selectedTickersTableBody, selectedRow, function(d) {  alert(d); });
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

    //Genero tabla de tickers seleccionados
    var selectedTickersContainer = addTickersTable("#selectedTickersContainer","selectedTickersTable");

}

function loadCSVPrices() {

    console.log('Hey!');

    d3.dsv(";","https://github.com/jorgebaez212/datavisuba2018/blob/master/cotizaciones/resources/ticker_summary.csv")
        .then(function(data) {
                loadTickerTables(data);
            });

}

// Queremos que la función main se ejecute cuando la página (document) esté lista
$(document).ready(loadCSVPrices);
