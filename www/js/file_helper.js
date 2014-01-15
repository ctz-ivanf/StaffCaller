
$(document).on("pageinit","#splashPage",function()
{
	var local_file = document.getElementById('local_file');
    local_file.addEventListener('change', function(){handleFileSelect("xml");}, false);
    local_file.click();
});

function handleFileSelect(type) {
    //var file = this.files[0]; // FileList object
    var file = $("#selLocalFile input:first").val();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        gotFS(fs,file,type);
    }, fail);
}

function gotFS(fileSystem, file, type) {
    var flags = {create: true, exclusive: false};
    fileSystem.root.getFile(file.name, flags, function(fe) {gotFileEntry(fe, file, type);}, fail);
}

function gotFileEntry(fileEntry, file, type) {
    fileEntry.createWriter(function(w){gotFileWriter(w, file, type);}, fail);
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