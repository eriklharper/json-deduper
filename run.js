/**
 * JSON Deduper
 *
 * @param
 * @returns
 */
var Baby = require('babyparse');
var fs = require('fs');
var argv = require('optimist').argv;
var path = require('path');
var moment = require('moment');
var is = require('is_js');

// Args
var fileName = argv.file;
var all = argv.all || false;

if (fileName) {

  var fileContents = fs.readFileSync(path.resolve(__dirname, './workspace/' + fileName)).toString();
  var results = [];
  var leads = JSON.parse(fileContents).leads;

  // Parse the Leads
  leads.forEach(function(lead, i, leadsArray) {

    // ID is unique?
    leadsArray.forEach(function(e, i) {
      console.log(lead._id);
    });

    // Dedupe Emails

    //
  });

  // if (results) {
  //
  //   // Put parsed contents into the parsed/ dir
  //   var parsedDir = __dirname + '/workspace/parsed',
  //       fullPath = parsedDir + '/' + fileName;
  //
  //   console.log("\n\nProcessed leads output to: \n\n" + fullPath);
  //   console.log("\n\nComplete records: " + validRecordCount);
  //   console.log("Incomplete records: " + invalidRecordCount);
  //   console.log("Total records: " + (invalidRecordCount + validRecordCount));
  //
  //   if (!fs.existsSync(parsedDir)){
  //     fs.mkdirSync(parsedDir, '0777');
  //   }
  //
  //   fs.writeFileSync(path.resolve(fullPath), results.join('\n'));
  // }
}
