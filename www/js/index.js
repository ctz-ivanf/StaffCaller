/******************************************************************
 *  index.js
 *  inicializaciones a realizar a la entrada a la app
 *  pantalla principal de las tres secciones de la app
 * ****************************************************************
 */

var db;		//base de datos para almacenar el directorio
var sql;	//para almacenar las sentencias a ejecutar sobre la BD

/*****************************
 *  JS de la splash de entrada
 *  y la carga de la BD
 */

$(document).on("pagecreate","#splashPage",function()
{	
	//inicializacion del almacenaje local
	storage=$.localStorage;
});

$(document).on("pageinit","#splashPage",function()
{	
	//comprobacion de la existencia de datos
	//para redirigir  a donde corresponda
	if(storage.get("data_src"))
		$.mobile.changePage("#depsTab");
	else
		setTimeout(function () {
	     	$.mobile.changePage("#uploadContentsDialog",{ 'role':'dialog'}); }, 100);
});

//gestion del boton menu del dispositivo
$(document).on("menubutton",function()
{	
    if (navigator.notification)
		navigator.notification.confirm("¿Salir de la aplicación?", closeApp,"StaffCaller",["Si","No"]); 
});

/***************************
 *  JS comun a las pestanias
 */

//inicializaciones de caracter general para la creacion de cualquier pagina
$(document).on("pagecreate","#depsTab",function()
{	
	$.mobile.defaultPageTransition="none";
	buildNavBar();
});

//al mostrarse cada pagina activaremos el correspondiente tab
$(document).on("pageshow","#depsTab, #favsTab, #searchTab",function()
{
	activateNavBarTab(this);
});


/*****************************
 *  JS seccion "Departamentos"
 */

//inicializacion de la pagina
$(document).on("pageinit","#depsTab",function()
{		
	db = openDb();
    db.transaction(loadDepsList, dbTxError);
});

//carga de la relacion de departamentos
function loadDepsList(tx) 
{	
	sql = "SELECT department, COUNT(*) AS count FROM members GROUP BY department";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		$("#depsList").empty();
	  		for (var i = 0; i < result.rows.length; i++) 
	        {
	  			$("#depsList").append("<li><a href=\"dep_details.html?dep=" + result.rows.item(i).department.replace(/\s+/g,"_") + "\">"
										+ "<h4>" + result.rows.item(i).department + "</h4>"
            							+ "<p>" + result.rows.item(i).count + " personas</p></a></li>");
			}
			$("#depsList").listview().listview("refresh");      
	    }, 
	    dbTxError);
}

/*****************************
 *  JS seccion "Favoritos"
 */

//inicializacion de la pagina
$(document).on("pageshow","#favsTab",function()
{
    db.transaction(loadFavsList, dbTxError);
});

//carga de la relacion de departamentos
function loadFavsList(tx) 
{	
	sql = "SELECT id, department, name, telephone FROM members WHERE fav = '1'";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{	
	  		if(result.rows.length != "0")
	  		{
		  		$("#favsList").empty();
		  		for (var i = 0; i < result.rows.length; i++) 
		        {
		  			$("#favsList").append("<li><a href=\"mem_details.html?mem_id=" + result.rows.item(i).id + "\">"
	    									+ "<h4>" + result.rows.item(i).name + "</h4>"
	            							+ "<p>" + result.rows.item(i).telephone + "</p>"
	            							+ "<p>Departamento: " + result.rows.item(i).department + "</p></a></li>");
				}
				$("#favsList").listview().listview("refresh");
			}
			else {
		   		showAlert("Aún no has marcado ningún favorito", alertDismissed);
			}      
	    }, 
	    dbTxError);
}

/*****************************
 *  JS seccion "Buscar"
 */

//inicializacion de la pagina
$(document).on("pageinit","#searchTab",function()
{	
	$("#search").bind("click", showResults);
	
    db.transaction(loadDepsSelector, dbTxError);
});

//carga del selector de departamentos
function loadDepsSelector(tx) 
{	
	sql = "SELECT department, COUNT(*) AS count FROM members GROUP BY department";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		for (var i = 0; i < result.rows.length; i++) 
	        {
	  			$("#select-department").append("<option value=" + result.rows.item(i).department.replace(/\s+/g,"_")  
	  											+ ">" + result.rows.item(i).department + "</option>");
			}
			$("#select-department").selectmenu().selectmenu("refresh");      
	    }, 
	    dbTxError);
	   
	db.transaction(loadChargesSelector, dbTxError);
}

function updateCharge()
{
	db.transaction(loadChargesSelector, dbTxError);
}

//carga del selector de cargos
function loadChargesSelector(tx) 
{	
	var dep = $("#select-department option:selected").val();
	var dep_selection = "";
	if(dep != "Todos")	dep_selection = "WHERE department = '" + dep + "'";
	
	sql = "SELECT charge, COUNT(*) AS count FROM members " + dep_selection + " GROUP BY charge";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		$("#select-charge").empty();
	  		for (var i = 0; i < result.rows.length; i++) 
	        {
	  			$("#select-charge").append("<option value=" + result.rows.item(i).charge.replace(/\s+/g,"_") 
	  											+ ">" + result.rows.item(i).charge + "</option>");
			}
			$("#select-charge").selectmenu().selectmenu("refresh");      
	    }, 
	    dbTxError);
}

function showResults()
{
	var dep = $("#select-department option:selected").val();
	var charge = $("#select-charge option:selected").val();
	
	//redirigimos a la pagina principal de la app
    $.mobile.changePage("search_results.html?dep=" + dep + "&charge=" + charge);
}

/****************
 *  Redirecciones
 */

function alertDismissed() 
{
    $.mobile.changePage("#depsTab");
}

function closeApp(buttonIndex) 
{
	if(buttonIndex == 1)	navigator.app.exitApp();
}
