/**
 * JSON Deduper
 * Dedupes an array of JSON objects by _id and email.  Takes the record with the most recent timestamp in a set of records that have duplicate _ids or emails.
 *
 * @author eriklharper
 * @param
 * @returns
 */
var fs = require('fs');
var argv = require('optimist').argv;
var path = require('path');
var moment = require('moment');
var is = require('is_js');
var _ = require('lodash');

// Args
var fileName = argv.file;

/**
 * [dedupeLeads description]
 * @param  {[type]} dupes [description]
 * @return {[type]}       [description]
 */
function dedupeLeads(dupes) {
  var dedupedLeads = [];
  Object.keys(dupes).forEach(function(key) {
    dedupedLeads.push(getMostRecentLead(dupes[key][0]));
  });
  return dedupedLeads;
}

/**
 * [getMostRecentLead description]
 * @param  {[type]} leads [description]
 * @return {[type]}       [description]
 */
function getMostRecentLead(leads) {
  var initialLeadEntryDate = moment(leads[0].entryDate),
      mostRecentLead = false;

  leads.forEach(function(lead) {
    var leadEntryDate = moment(lead.entryDate);
    if (leadEntryDate.isAfter(initialLeadEntryDate) || leadEntryDate.isSame(initialLeadEntryDate)) {
      mostRecentLead = lead;
    }
  });

  return mostRecentLead;
}

/**
 * [getDupes description]
 * @param  {[type]} leads [description]
 * @param  {[type]} key   [description]
 * @return {[type]}       [description]
 */
function getDupes(leads, key) {
  var matches = {};
  leads.forEach(function(lead1, lead1Position, leadsArray) {

    leadsArray.forEach(function(lead2, lead2Position) {
      if (lead1 !== lead2) {

        if (lead1[key] === lead2[key]) {
          if (is.not.propertyDefined(matches, lead1[key])) {
            matches[lead1[key]] = [];

            // Setup the Filter object
            var filter = {};
            filter[key] = lead1[key];

            // Filter out the dupes
            var filterResults = _.filter(leadsArray, filter);

            // Save the filter
            matches[lead1[key]].push(filterResults);
          }
        }
      }
    });

  });
  return matches;
}

/**
 * [getResult description]
 * @param  {[type]} originalLeads [description]
 * @param  {[type]} dedupedLeads  [description]
 * @return {[type]}               [description]
 */
function getResult(originalLeads, dedupedLeads) {
  var result = originalLeads,
      removedRecords = [];
  dedupedLeads.forEach(function(dedupedLead) {

    var originalIdMatches = _.filter(originalLeads, { _id: dedupedLead._id });
    originalIdMatches.forEach(function(originalIdMatch) {
      if (originalIdMatch !== dedupedLead) {
        // delete it
        result.splice(result.indexOf(originalIdMatch), 1);
        removedRecords.push(originalIdMatch);
      }
    });

    originalEmailMatches = _.filter(originalLeads, { email: dedupedLead.email });
    originalEmailMatches.forEach(function(originalEmailMatch) {
      if (originalEmailMatch !== dedupedLead) {
        // delete it
        result.splice(result.indexOf(originalEmailMatch), 1);
        removedRecords.push(originalEmailMatch);
      }
    });
  });
  return {
    result: result,
    removedRecords: removedRecords
  }
}

/**
 * Do your shtuff
 * @param  {[type]} fileName [description]
 * @return {[type]}          [description]
 */
if (fileName) {

  var leads = JSON.parse(fs.readFileSync(path.resolve(__dirname, './workspace/' + fileName)).toString()).leads,
      source = JSON.parse(fs.readFileSync(path.resolve(__dirname, './workspace/' + fileName)).toString()).leads,
      idDupes = getDupes(leads, '_id'),
      emailDupes = getDupes(leads, 'email'),
      dedupedIdLeads = dedupeLeads(idDupes),
      dedupedEmailLeads = dedupeLeads(emailDupes)
      dedupedLeads = _.union(dedupedIdLeads, dedupedEmailLeads),
      result = getResult(leads, dedupedLeads);

  console.log("Source: ");
  console.log(JSON.parse(fs.readFileSync(path.resolve(__dirname, './workspace/' + fileName)).toString()).leads);
  console.log("Number of Records: " + source.length);
  console.log("\n");

  console.log("Removed Records:");
  console.log(result.removedRecords);
  console.log("Number of Removed Records: " + result.removedRecords.length);
  console.log("\n");

  console.log("Result: ");
  console.log(result.result);
  console.log("Number of Records: " + result.result.length);
  console.log("\n");

}
