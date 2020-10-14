"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var teamSchema = new _mongoose["default"].Schema({
  admin: {
    type: Boolean,
    "default": false
  },
  name: {
    type: String,
    unique: true
  },
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

var Team = _mongoose["default"].model('team', teamSchema);

var _default = Team;
exports["default"] = _default;