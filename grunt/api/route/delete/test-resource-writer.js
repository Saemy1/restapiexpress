/**
 * Created by samschmid on 30.03.14.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function TestDeleteResourceWriter(grunt, rootdir) {
    this.grunt = grunt;
    this.rootdir = rootdir;
}

TestDeleteResourceWriter.prototype.write = function(doc, permission, method)  {

    this.writeInstance(doc,permission,method);
    this.writeCollection(doc,permission,method);

}

TestDeleteResourceWriter.prototype.writeInstance = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http400 = grunt.file.read('./grunt/templates/tests/http400.template');
    test = test + '\n' + http400;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',"del");
    var path = '/v'+doc.version + '/' + doc.filetitle + '/123.json';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/instance.js', modifiedContent);

}

TestDeleteResourceWriter.prototype.writeCollection = function(doc,permission,method) {

    var grunt = this.grunt;
    var test = grunt.file.read('./grunt/templates/test.template');
    var http405 = grunt.file.read('./grunt/templates/tests/http405.template');
    test = test + '\n' + http405;

    var modifiedContent =  test.replace('{{{METHOD}}}',method.toUpperCase());
    modifiedContent =  modifiedContent.replace('{{{method}}}',"del");
    var path = '/v'+doc.version + '/' + doc.filetitle + '/';
    modifiedContent =  modifiedContent.replaceAll('{{{path}}}',path);
    modifiedContent =  modifiedContent.replaceAll('{{{role}}}',permission.role.toLowerCase());
    modifiedContent =  modifiedContent.replace('{{{appjs}}}',doc.pathToAppJsFromFolder(doc.testfolder));
    grunt.file.write(doc.testfolder + '/' + method.toLowerCase()+'/'+permission.role.toLowerCase() + '/collection.js', modifiedContent);

}

module.exports = TestDeleteResourceWriter;