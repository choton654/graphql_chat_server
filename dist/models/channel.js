"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var channelSchema = new _mongoose["default"].Schema({
  name: {
    type: String
  },
  "public": {
    type: Boolean,
    "default": false
  },
  teamId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "team"
  },
  dm: {
    type: Boolean,
    "default": false
  }
});

var Channel = _mongoose["default"].model("channel", channelSchema);

var _default = Channel;
exports["default"] = _default;