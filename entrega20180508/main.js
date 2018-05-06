// Funcion principal, que se encarga de tomar los elementos en el widget "input" y de 
// insertarlo en la lista. Usamos jQuery para acceder y modificar los componentes de la página.  
var main = function() {

    console.log('Hey!');

    $('form')
}

function addRowHandlers() {
    var table = document.getElementById("tableId");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
      var currentRow = table.rows[i];
      var createClickHandler = function(row) {
        return function() {
          var cell = row.getElementsByTagName("td")[0];
          var id = cell.innerHTML;
          alert("id:" + id);
        };
      };
      currentRow.onclick = createClickHandler(currentRow);
    }
}

function readCSVPrices() {

    console.log('Hey!');
    
    d3.csv("resources/titulos_arg.csv").then(function(data) {
        console.log(data);
      });

    var table = document.getElementById("tableId");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
      var currentRow = table.rows[i];
      var createClickHandler = function(row) {
        return function() {
          var cell = row.getElementsByTagName("td")[0];
          var id = cell.innerHTML;
          alert("id:" + id);
        };
      };
      currentRow.onclick = createClickHandler(currentRow);
    }
}

// Queremos que la función main se ejecute cuando la página (document) esté lista
$(document).ready(readCSVPrices);