var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, '/')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './index.html'));
});

app.post('/upload', function(req, res){

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('done');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});


function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
fs.readdir('./uploads', function (err, files) {
    console.log(files)
});

app.get('/getfiles', function(req, res) {
    fs.readdir('./uploads', function (err, files) {
        res.status(200).send(files)
    });
})
