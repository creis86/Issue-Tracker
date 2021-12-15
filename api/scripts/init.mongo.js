/*
 * Run using the mongo shell.
 * Enter the command with the following Atlas connection string:
 *
 * mongosh "mongodb+srv://<user>:<pwd>@cluster0.hpr0d.mongodb.net/issuetracker" scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

const issuesDB = [
  {
    id: 1,
    status: 'New',
    owner: 'Ravan',
    effort: 5,
    created: new Date('2021/11/04'),
    due: undefined,
    title: 'Error in console when clicking Add.',
    description: 'Steps to recreate the problem:'
      + '\n1. Refresh the browser.'
      + '\n2. Select "New" in the filter.'
      + '\n3. Refresh the browser again. Note the warning in the console:'
      + '\n   Warning: Hash history cannot PUSH the same path; a new entry'
      + '\n   will not be added to the history stack.'
      + '\n4. Click on Add.'
      + '\n5. There is an error in console, and Add doesn\'t work.',
  },
  {
    id: 2,
    status: 'Assigned',
    owner: 'Eddie',
    effort: 14,
    created: new Date('2021/10/29'),
    due: new Date('2021/11/12'),
    title: 'Missing bottom border on panel.',
    description: 'There needs to be a border in the bottom in the panel'
      + ' that appears when clicking on Add.',
  },
];

db.issues.deleteMany({});
db.issues.insertMany(issuesDB);
const count = db.issues.countDocuments();
print('Inserted', count, 'issues');

db.counters.deleteOne({ _id: 'issues' });
db.counters.insertOne({ _id: 'issues', current: count });

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });
