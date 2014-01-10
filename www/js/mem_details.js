/******************************************************************
 *  mem_details.js
 *  logica de la pantalla con el detalle de miembro
 * ****************************************************************
 */
 
 //para pintar la pestania que proceda segun la pagina de la que vengamos
$(document).on("pagebeforeshow","#memDetails",function(event,data)
{
	$.mobile.defaultPageTransition="none";
	//utilizamos las tres primeras letras ('dep' o 'sea') para pintar la pestania correspondiente
	buildNavBarWithActiveTab(data.prevPage.attr('id').substring(0,2));
});
 
//inicializacion de la pagina
$(document).on("pageinit","#memDetails",function()
{	
	$("#switchFav").bind("click", switchFav);
	
	db = openDb();
    db.transaction(loadDetailsForMember, dbTxError);
});

//carga de los detalles del miembro
function loadDetailsForMember(tx) 
{
	sql = "SELECT department,name,charge,telephone,extension,image_url,fav FROM members WHERE id = '" + getUrlVars().mem_id + "'";
    tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		$("#mem_photo").attr("src",result.rows.item(0).image_url);
	  		$("#dep_name").append(result.rows.item(0).department); 
	  		$("#mem_name").append(result.rows.item(0).name); 
	  		$("#mem_charge").append(result.rows.item(0).charge);    
	  		$("#mem_telephone").append(result.rows.item(0).telephone); 
	  		$("#mem_extension").append(result.rows.item(0).extension);
	  		if (result.rows.item(0).fav == 1)
	  		{
	  			$("#switchFav").addClass("fav").removeClass("nofav");
    		}
    		$("#callExt").attr("href","tel:"+result.rows.item(0).extension);
    		$("#callTel").attr("href","tel:"+result.rows.item(0).telephone);
	    }, 
	    dbTxError);
}

//Gestion del boton que marca el miembro como favorito
function switchFav() 
{
	db.transaction(switchFavDb, dbTxError);
}

function switchFavDb(tx) 
{	
	var f = 1;
	if($("#switchFav").hasClass("fav"))	f = 0;
	
	sql = "UPDATE members SET fav = '"+ f +"' WHERE id = '" + getUrlVars().mem_id + "'";
	tx.executeSql
    (
    	sql, 
   		undefined, 
	  	function (tx, result)
	  	{
	  		if(f==0)	$("#switchFav").addClass("nofav").removeClass("fav");	
	  		else 		$("#switchFav").addClass("fav").removeClass("nofav");
	    }, 
	    dbTxError);
}