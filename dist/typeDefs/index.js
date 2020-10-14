"use strict";

var root = require('./root');

var user = require('./user');

var channel = require('./team');

var mesasage = require('./message');

var directMessage = require('./directMessage');

var team = require('./channel');

module.exports = [root, user, mesasage, team, channel, directMessage];