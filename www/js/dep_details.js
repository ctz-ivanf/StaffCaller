/******************************************************************
 *  dep_details.js
 *  logica de la pantalla con el listado de departamentos
 * ****************************************************************
 */
 
//para pintar la pestania que proceda segun la pagina de la que vengamos
$(document).on("pagebeforeshow","#depDetails",function(event,data)
{
	$.mobile.defaultPageTransition="none";
	buildNavBarWithActiveTab("depsTab");
});
 
//inicializacion de la pagina
$(document).on("pageinit","#depDetails",function()
{	
	db = openDb();
    db.transaction(loadChargeSetForDep, dbTxError);
});

//carga de la relacion de cargos
function loadChargeSetForDep(tx) 
{	
	var department = decodeURI(getUrlVars().dep).replace(/_/g," ");
	
	//insertamos el nombre del departamento
	$("#dep_name").append(department);
	
	sql = "SELECT charge, COUNT(*) AS count FROM members WHERE department = '" + department + "' GROUP BY charge";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		for (var i = 0; i < result.rows.length; i++) 
	        {
				$("#membersSet").append("<div data-role=\"collapsible\" data-theme=\"b\" data-content-theme=\"a\">"
    									+ "<h2>" + result.rows.item(i).charge + "<span class=\"ui-li-count\">" 
    									+ result.rows.item(i).count + "</span></h2>"
    									+ "<ul class=\"membersList\" data-role=\"listview\"></ul></div>");
			}
			$("#membersSet").collapsibleset("refresh");	     
	    }, 
	    dbTxError);
}

//carga de la lista de miembros al expandir un determinado cargo
$(document).on("collapsibleexpand","div[data-role=collapsible]",function() //version para jqMobile 1.4.0
//$(document).on("expand","div[data-role=collapsible]",function()
{	
	$(".membersList").empty();
	
	//devuelve el texto insertado en el boton de que se compone el elemento colapsador,
	//ahorrando el tener que incluir en este un attributo id
	var charge = $(this).find(".ui-btn").contents().filter(function(){return this.nodeType == 3;}).text(); //version para jqMobile 1.4.0
    //var charge = $(this).find(".ui-btn-text").contents().filter(function(){return this.nodeType == 3;}).text();                  											
    //var charge = $(this).attr("id"); 
    
    db.transaction
    (
    	function(tx)
    	{
    		sql = "SELECT id, name, telephone, fav FROM members WHERE charge = '" + charge + "'";
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
			        	
						$(".membersList").append("<li><a href=\"mem_details.html?mem_id=" + result.rows.item(i).id + "\">"
										+ fav_marker 
    									+ "<h4>" + result.rows.item(i).name + "</h4>"
            							+ "<p>" + result.rows.item(i).telephone + "</p></a></li>");
					}
					$(".membersList").listview().listview("refresh");     
			    }, 
			    dbTxError);	
    	}, 
    	dbTxError);                 											                    											
});