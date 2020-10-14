"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var messageSchema = new _mongoose["default"].Schema({
  text: String,
  url: String,
  filetype: String,
  channelId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "channel"
  },
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
});

var Message = _mongoose["default"].model("message", messageSchema);

var _default = Message;
exports["default"] = _default;