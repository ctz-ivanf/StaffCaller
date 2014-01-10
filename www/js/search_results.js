/******************************************************************
 *  search_results.js
 *  logica de la pantalla con los resultados de la busqueda
 * ****************************************************************
 */
 
//para pintar la pestania que proceda segun la pagina de la que vengamos
$(document).on("pagebeforeshow","#searchResults",function(event,data)
{
	$.mobile.defaultPageTransition="none";
	buildNavBarWithActiveTab("searchTab");
});
 
//inicializacion de la pagina
$(document).on("pageinit","#searchResults",function()
{	
	db = openDb();
    db.transaction(loadResultsList, dbTxError);
});

//carga de los resultados
function loadResultsList(tx) 
{	
	var dep = decodeURI(getUrlVars().dep).replace(/_/g," ");
	var charge = decodeURI(getUrlVars().charge).replace(/_/g," ");
	
	$("#dep_name").append(dep);
	$("#charge_name").append(charge);
	
	var dep_selection = "";
	if(dep != "Todos")	dep_selection = "AND department = '" + dep + "'";
	
	sql = "SELECT id, name, telephone, department, fav FROM members WHERE charge = '" + charge + "' " + dep_selection;
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		var fav_marker = "";
	  		for (var i = 0; i < result.rows.length; i++) 
		        {
		        	fav_marker = result.rows.item(i).fav?"<img class=\"fav\"/>":"<img class=\"nofav\"/>";
		        	
					$("#resultsList").append("<li><a href=\"mem_details.html?mem_id=" + result.rows.item(i).id + "\">"
									+ fav_marker
									+ "<h4>" + result.rows.item(i).name + "</h4>"
        							+ "<p>" + result.rows.item(i).telephone + "</p>"
        							+ "<p>Departamento: " + result.rows.item(i).department + "</p></a></li>");
				}
				$("#resultsList").listview().listview("refresh");	     
	    }, 
	    dbTxError);
}