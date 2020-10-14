"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  type Query {\n    _: String\n  }\n  type Mutation {\n    _: String\n  }\n  type Subscription {\n    _: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var _require = require('apollo-server-express'),
    gql = _require.gql;

module.exports = gql(_templateObject());