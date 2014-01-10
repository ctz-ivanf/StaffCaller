////////////////////////////////////////////
//CONJUNTO DE FUNCIONES DE PROPOSITO GENERAL
////////////////////////////////////////////

//***************************************
//relacionadas con la barra de navegacion

//carga de la navbar generica en el header de las paginas
function buildNavBar(){
	
	$(document).find("[data-role=header]").load("navbar.html", function(){
		$(document).find("[data-role=navbar]").navbar();
	});
}

//para carga de la barra de navegacion en paginas que no 
//se correspondan directamente con una pestania
function buildNavBarWithActiveTab(pageId){
	
	$(document).find("[data-role=header]").load("navbar.html", function(){
		$(document).find("[data-role=navbar]").navbar();
		
		$(document).find("[data-role=navbar]").find("a").each(function(){
			if($(this).attr("href").indexOf(pageId) > 0)	$(this).addClass("ui-btn-active"); 
			else $(this).removeClass("ui-btn-active");
		});
	});
}

//activacion de la pestania correspondiente a la pagina actual
function activateNavBarTab(page)
{	
	var navbar = $(page).find("[data-role=navbar]");
	
	$(navbar).find("a").each(function(){
		if($(this).attr("href").indexOf(page.id) > 0)	$(this).addClass("ui-btn-active"); 
		else $(this).removeClass("ui-btn-active");
	});
}

//*********************************
//relacionadas con la base de datos

//apertura de BD
function openDb()
{	
	return window.openDatabase("dirDB","0.1","BD Corporative Directory", 100);	
}


//traceo de errores al interaccionar con la BD
function dbTxError(error) 
{
    console.log("Database error: " + error.code + " --> " + error.message);
    sleep(3000);
}

//*********************************
//utilidades varias

//obtencion de las variables pasadas en la url
function getUrlVars() 
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//simulacion de la funcion sleep()
function sleep(milliSeconds)
{
    // Obtenemos la fecha en milisegundos desde 1/1/1970
    var startTime = new Date().getTime();
    // Hacemos un bucle hasta que la fecha actual sea superior a la
    // fecha inicial mas los milisegundos indicados
    while (new Date().getTime() < startTime + milliSeconds);
}




	