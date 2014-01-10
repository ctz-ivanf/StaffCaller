/******************************************************************
 *  dep_details_xml_parsing.js
 *  alternativa a dep_details.js para el caso de que no se use la base de
 *  datos y se parsee directamente el xml 
 * ****************************************************************
 */

//utilizamos la creacion de la pagina
//para realizar las inicializaciones necesarias
$(document).on("pagecreate","#depDetails",function(){

	$.mobile.defaultPageTransition="none";
	buildNavBar();	//cargamos la navbar comun
 });
 
//inicializacion de la pagina
$(document).on("pageinit","#depDetails",function(){
	
	loadMembersSetForDep();
});

//carga de la relacion de cargos
function loadMembersSetForDep() {
	
    $.ajax("res/raw/staff.xml").done(function(data) {
    	
    	var depInfo = $(data).find("department[name=\""+decodeURI(getUrlVars().dep)+"\"]");	//info del departamento seleccionado
    	
    	//generamos un acordeon con cada uno de los cargos del departamento
    	$(depInfo).find("charge").each(function(){
    		
    		$("#membersSet").append("<div data-role=\"collapsible\">"
    									+ "<h2>" + $(this).attr("name") + "<span class=\"ui-li-count\">" + $(this).find("member").length + "</span></h2>"
    									+ "<ul class=\"membersList\" data-role=\"listview\"></ul></div>");
    	});
    	$("#membersSet").collapsibleset("refresh");		
    });
}

//carga de la lista de miembros al expandir un determinado cargo
$(document).on("expand","div[data-role=collapsible]",function(){
	
	$(".membersList").empty();
	
	//devuelve el texto insertado en el boton de que se compone el elemento colapsador,
	//ahorrando el tener que incluir en este un attributo id
    var charge = $(this).find(".ui-btn-text").contents().filter(function(){
                           											return this.nodeType == 3;
                       											}).text();                  											
    //var charge = $(this).attr("id");                  											
                       											
	 $.ajax("res/raw/staff.xml").done(function(data) {
	 	
    	var chargeInfo = $(data).find("charge[name=\""+decodeURI(charge)+"\"]");	//info del cargo seleccionado
    	
    	//generamos una lista con cada uno de los miembros con ese cargo
    	$(chargeInfo).find("member").each(function(){
    		
    		//cargamos la entrada de cada departamento con su nombre y el numero de personas 
    		$(".membersList").append("<li><a href=\"member_details.html?member=" + $(this).find("name").text() + "\">"
    									+ "<h4>" + $(this).find("name").text() + "</h4>"
            							+ "<p>" + $(this).find("telephone").text() + "</p></a></li>");
    	});	
    	$(".membersList").listview().listview("refresh");
    });
    	
});