/**
 * Created by samschmid on 24.02.14.
 */

var Docs = require('./grunt/docs.js');
var Setup = require('./grunt/setup.js');
var Database = require('./grunt/database/database.js');
var ApiWriter = require('./grunt/api/api-writer.js');
var TestWriter = require('./grunt/api/test-writer.js');
module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: grunt.file.readJSON('config.json')
    });

    grunt.registerTask('default', 'searchDocs', function() {

        var allDocuments = new Docs(grunt);

        var apiWriter = new ApiWriter(grunt, __dirname);
        apiWriter.write(allDocuments);

        var testWriter = new TestWriter(grunt, __dirname);
        testWriter.write(allDocuments);

        var db = new Database(grunt);
        db.createSchemes(allDocuments);

    });

    grunt.registerTask('test', 'test with mocha', function() {

        var done = this.async();
        require('child_process').exec('make test', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    grunt.registerTask('setup', 'install extensions', function() {

        var setup = new Setup(grunt);
        setup.downloadDependencies(this);
    });

    grunt.registerTask('database', 'install database features', function() {

        var db = new Database(grunt);
        var docs = new Docs(grunt);
        db.createSchemes(docs);
    });

};