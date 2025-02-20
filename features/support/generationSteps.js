const fs = require('fs');
const moment = require('moment');
const os = require('os');
const path = require('path');

const {
  Given, When, Then,
} = require('cucumber');
const { expect } = require('chai');

const FILE_ENCODING = 'utf-8';
// eslint-disable-next-line no-unused-vars
const Generator = require('../../src/Generator');

Given('there is a file named {string} with the following contents:', function (fileName, contents) {
  const filePath = path.resolve(__dirname, fileName);
  this.featureFiles.push(filePath);
  fs.writeFileSync(filePath, contents, FILE_ENCODING);
});

Given('the variable {string} contains the path to {string}', function (variableName, fileName) {
  this[variableName] = path.resolve(__dirname, fileName);
});

Given(/^the current date is \{current_date\}$/, function () {
  this.currentDate = moment().format('LL');
});

Given(/^the username of the current user is \{username\}$/, function () {
  this.username = os.userInfo().username;
});

When('a report is generated with the code {string}', function (generationFunction) {
  // eslint-disable-next-line no-eval
  return eval(generationFunction)
    .then(output => this.setOutput(output));
});

Then('the title on the report will be {string}', function (reportTitle) {
  const title = reportTitle.replace('{current_date}', this.currentDate);
  expect(this.outputHTML.title).to.eql(title);
});

Then('the report will inculude CSS styling', function () {
  const styles = this.outputHTML.getElementsByTagName('STYLE');
  expect(styles.length).to.eql(1);
  const style = styles.item(0);
  // eslint-disable-next-line no-unused-expressions
  expect(style.innerHTML).to.be.an('string').that.is.not.empty;
});

Then('the report will include a favicon', function () {
  const link = this.outputHTML.querySelector("link[rel='shortcut icon']");
  expect(link.type).to.eql('image/png');
  expect(link.href).to.have.lengthOf(3214);
});

Then('the report name on the sidebar will be {string}', function (reportName) {
  expect(this.outputHTML.getElementById('sidenavTitle').textContent).to.eql(reportName);
});

Then('the project title on the sidebar will be {string}', function (projectTitle) {
  expect(this.outputHTML.getElementById('headerTitle').textContent).to.eql(projectTitle);
});

Then('the header on the sidebar will be {string}', function (header) {
  let headerText = header.replace('{username}', this.username);
  headerText = headerText.replace('{current_date}', this.currentDate);
  expect(this.outputHTML.getElementById('authorAside').innerHTML).to.eql(headerText);
});

Then('the footer on the sidebar will be {string}', function (footer) {
  expect(this.outputHTML.getElementById('sidenavFooter').textContent).to.eql(footer);
});

Then('the report will contain {int} feature(s)', function (featureCount) {
  const features = this.outputHTML.getElementsByClassName('feature-wrapper');
  expect(features.length).to.eql(featureCount);
});

Then('the report will contain {int} scenario(s)', function (scenarioCount) {
  // There is no divider for the first scenario in a feature.
  const featureCount = this.outputHTML.getElementsByClassName('feature-wrapper').length;
  const scenarioDividers = this.outputHTML.getElementsByClassName('scenario-divider');
  expect(scenarioDividers.length).to.eql(scenarioCount - featureCount);
});

Then('the report will not contain gherkin comments', function () {
  const commentPattern = new RegExp('^#.*');
  const comments = Array.from(this.outputHTML.getElementsByTagName('*'))
    .filter(obj => commentPattern.test(obj.innerHTML));
  expect(comments.length).to.eql(0);
});

Then('the sidebar will contain {int} feature button(s)', function (featureButtonCount) {
  const featureButtons = this.outputHTML.getElementsByClassName('feature-button');
  expect(featureButtons.length).to.eql(featureButtonCount);
});

Then('the sidebar will contain {int} scenario button(s)', function (scenarioButtonCount) {
  const scenarioButtons = this.outputHTML.getElementsByClassName('scenario-button');
  expect(scenarioButtons.length).to.eql(scenarioButtonCount);
});
