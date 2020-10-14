"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var directMessageSchema = new _mongoose["default"].Schema({
  text: String,
  receiverId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'user'
  },
  senderId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'user'
  },
  teamId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'team'
  }
}, {
  timestamps: true
});

var Directmessage = _mongoose["default"].model('direct-message', directMessageSchema);

var _default = Directmessage;
exports["default"] = _default;