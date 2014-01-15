/******************************************************************
 *  data_loader.js
 *  funciones encargadas de la carga de datos
 * ****************************************************************
 */


var db;		//base de datos para almacenamiento de datos
var sql;	//para almacenar las sentencias a ejecutar sobre la BD
var data_url;


function getRemoteData()
{
	//OJO: el acceso a datos en urls remotas desde los navegadores
	//comunes no funciona debido a las restricciones de Same Origin Policy
	//En las aplicaciones (y el emulador Ripple) deberia funcionar
	data_url = $("#selRemoteData input:first").val();
   
   	db = openDb();
	db.transaction(createDb, dbTxError);
}

function readLocalFile()
{
	console.log($("#selLocalFile input:first").val());
	data_url = $("#selLocalFile input:first").val();
   
   	db = openDb();
	db.transaction(createDb, dbTxError);
}

function loadDefaultData()
{
	data_url = "res/raw/staff.xml";
	
	db = openDb();
	db.transaction(createDb, dbTxError);
}

//creacion de la base de datos
function createDb(tx)
{	
	console.log("Creando base de datos...");
	
	tx.executeSql("DROP TABLE IF EXISTS members");
	
	sql = "CREATE TABLE members " 
				+ "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " 
				+ "name VARCHAR(100) NOT NULL, " 
				+ "company VARCHAR(100) NOT NULL, " 
				+ "department VARCHAR(100) NOT NULL, " 
				+ "charge VARCHAR(100) NOT NULL, " 
				+ "telephone VARCHAR(20) NOT NULL, "
				+ "extension VARCHAR(20) NOT NULL, "
				+ "image_url VARCHAR(100) NOT NULL, "
				+ "fav TINYINT unsigned NOT NULL DEFAULT '0')"; 
	
	//la sentencia solo tendra exito si la tabla no existia previamente,
	//por lo tanto habra que cargarla			
	tx.executeSql (sql, undefined, loadDb, dbTxError);
}

//carga de los datos de xml en la tabla
function loadDb(tx)
{
	console.log("Cargando base de datos...");
	
	$.ajax({
	  	type: "POST",
	  	url: data_url,
		dataType: "xml",
		async: false,	//para esperar a cargar los datos antes de seguir
	  	beforeSend:function(){
	  	},
	  	success: function(data)
	  	{	
		    var company_name = $(data).find("staff").attr("company_name");
	    	$(data).find("department").each(function()
	    	{	
	    		var department_name = $(this).attr("name");
	    		$(this).find("charge").each(function()
	    		{		
	    			var charge_name = $(this).attr("name");
	    			$(this).find("member").each(function()
	    			{
	    				sql = "INSERT INTO members (name,company,department,charge,telephone,extension,image_url) "
	    						+ "VALUES ('"+ $(this).find("name").text() + "','" 
	    									+ company_name + "','" 
	    									+ department_name + "','" 
	    									+ charge_name + "','" 
	    									+ $(this).find("telephone").text() + "','" 
	    									+ $(this).find("extension").text() + "','" 
	    									+ $(this).find("image_url").text() + "')";
	    									
	    				tx.executeSql (sql, undefined, undefined, dbTxError);   		
	    			});
	    		});
	    		
	    	});
	    	storage.set("data_src","demo");
	    	$.mobile.changePage("#depsTab");
	  	},
	  	error: function()
	  	{
	  		//fallara tanto si la url es incorrecta como si el fichero no esta bien formado
		    showAlert("Falló la carga de datos remotos. Compruebe que el enlace al archivo "
		    			+ "remoto es correcto y que el xml está bien formado");
	  	}
	});
}
