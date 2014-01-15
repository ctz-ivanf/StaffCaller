function handleFileSelect(type) {
    //var file = this.files[0]; // FileList object
    var file = $("#selLocalFile input:first").val();
    
    window.webkitRequestFileSystem (LocalFileSystem.PERSISTENT, 
    								0, 
    								function(fs) { gotFS(fs,file,type);},
    								fail);  
}

function gotFS(fileSystem, file, type) 
{
	console.log(fileSystem.name);
	console.log(fileSystem.root.name);
	
   // var flags = {create: true};
    //fileSystem.root.getFile("sample.xml", flags, function(fe) {gotFileEntry(fe, file, type);}, fail);
}

function gotFileEntry(fileEntry, file, type) {
	console.log("EN FILE ENTRY");
    //fileEntry.createWriter(function(w){gotFileWriter(w, file, type);}, fail);
}

function gotFileWriter(fileWriter, file, type) {
    fileWriter.onwriteend = function(evt){setSoundByUri(type, path + file.name);};
    var reader = new FileReader();
    reader.onload = function(event) {
        var rawData = event.target.result;
        fileWriter.write(rawData);
    };
    reader.onerror = function(event){
        alert("error, file could not be read" + event.target.error.code);
    };
    reader.readAsArrayBuffer(file);
}

function fail(error) {
    alert("error " + error.code);
    if (error.code == FileError.PATH_EXISTS_ERR){
        alert("The file already exists.");
    }
}