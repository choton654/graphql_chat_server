"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var memberSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  teamId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'team',
    required: true
  }
});

var Member = _mongoose["default"].model('member', memberSchema);

var _default = Member;
exports["default"] = _default;