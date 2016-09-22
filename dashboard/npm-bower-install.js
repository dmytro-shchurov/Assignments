/**
 * Created by dmytroshchurov on 22/09/16.
 */
var bower = require('bower');

bower.commands
    .install(null, null, {cwd: '.'})
    .on('end', function (installed) {
        console.log(installed);
    });