/******************************************************************
 *  tabs_xml_parsing.js
 *  alternativa a tabs.js para el caso de que no se use la base de
 *  datos y se parsee directamente el xml 
 * ****************************************************************
 */

/*************************
 *  JS comun a las paginas
 */

//utilizamos la creacion de la pagina inicial (depsTab)
//para realizar las inicializaciones necesarias
$(document).on("pagecreate","#depsTab",function(){

	$.mobile.defaultPageTransition="none";
	buildNavBar();	//cargamos la navbar comun para todas las paginas
 });

//al mostrarse cada pagina activaremos el correspondiente tab
$(document).on("pageshow","#depsTab, #favsTab, #searchTab",function(){

	activateNavBarTab(this);
});

/*****************************
 *  JS seccion "Departamentos"
 */

//inicializacion de la pagina
$(document).on("pageinit","#depsTab",function(){

	loadDepsList();
	//db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    //db.transaction(createDb, txError, txSuccess);
});

//carga de la relacion de departamentos
function loadDepsList() {

    $.ajax("res/raw/staff.xml").done(function(data) {
    	
    	$(data).find("department").each(function(){
    		//cargamos la entrada de cada departamento con su nombre y el numero de personas 
    		$("#depsList").append("<li><a href=\"dep_details.html?dep=" + $(this).attr("name") + "\">"
    		+ "<h4>" + $(this).attr("name") + "</h4>"
            + "<p>" + $(this).find("member").length + " personas</p></a></li>");	
    	});
    	
    	$("#depsList").listview("refresh");		
    });
}