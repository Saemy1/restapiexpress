/**
 * Created by samschmid on 28.03.14.
 */
var TestApiDescriptionWriter = require('./description/test-api-description-writer.js');
var TestApiRouteWriter = require('./route/test-api-route-writer.js');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
    this.testApiDescWriter = new TestApiDescriptionWriter(grunt, rootdir);
    this.testApiRouteWriter = new TestApiRouteWriter(grunt, rootdir);
}

TestWriter.prototype.write = function(docs)  {

    var grunt = this.grunt;
    for(var i=0;i<docs.docs.length;i++) {
        var doc = docs.docs[i];

        if(doc.json.type.endsWith('.apidescription')) {

            this.testApiDescWriter.write(doc);
        } else if(doc.json.type.endsWith('.abstract')) {
            //Dont write anything
        } else {

            grunt.log.debug("start createing test doc");
            this.testApiRouteWriter.write(doc);

        }

    }

    this.writeVersionsTest();

}

TestWriter.prototype.writeVersionsTest = function()  {
    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http200 = grunt.file.read('./grunt/templates/tests/http200.template');
    test = test + '\n' + http200;

    var modifiedContent =  test.replace('{{{METHOD}}}',"GET");
    modifiedContent =  modifiedContent.replace('{{{method}}}',"get");
    var path = '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',"public");
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',this.rootdir + '/app.js');
    grunt.file.write(this.rootdir + '/test/versions.js', modifiedContent);

}
module.exports = TestWriter;