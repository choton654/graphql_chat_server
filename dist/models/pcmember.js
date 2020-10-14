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
    ref: "user",
    required: true
  },
  channelId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "channel",
    required: true
  }
});

var PCMember = _mongoose["default"].model("pcmember", memberSchema);

var _default = PCMember;
exports["default"] = _default;