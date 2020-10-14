"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerExpress = require("apollo-server-express");

var _fs = require("fs");

var _path = _interopRequireDefault(require("path"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _permission = _interopRequireWildcard(require("../middleware/permission"));

var _message = _interopRequireDefault(require("../models/message"));

var _user3 = _interopRequireDefault(require("../models/user"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _pcmember = _interopRequireDefault(require("../models/pcmember"));

var pubSub = new _apolloServerExpress.PubSub();
var NEW_MESSAGE = "NEW POST";
module.exports = {
  Subscription: {
    newMessage: {
      subscribe: (0, _apolloServerExpress.withFilter)(function () {
        return pubSub.asyncIterator(NEW_MESSAGE);
      }, function (payload, args, ctx) {
        return payload.channelId === args.channelId;
      })
    }
  },
  Message: {
    user: function () {
      var _user2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref, _, _ref2) {
        var _user, userId, req;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _user = _ref.user, userId = _ref.userId;
                req = _ref2.req;
                _context.prev = 2;

                if (!_user) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", _user);

              case 7:
                _context.next = 9;
                return _user3["default"].findOne({
                  _id: userId
                });

              case 9:
                return _context.abrupt("return", _context.sent);

              case 10:
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 12]]);
      }));

      function user(_x, _x2, _x3) {
        return _user2.apply(this, arguments);
      }

      return user;
    }()
  },
  Query: {
    messages: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_, _ref3, _ref4, ___) {
        var offset, channelId, user, channel, member;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                offset = _ref3.offset, channelId = _ref3.channelId;
                user = _ref4.req.user;
                _context2.next = 4;
                return _channel["default"].findOne({
                  _id: channelId
                });

              case 4:
                channel = _context2.sent;

                if (channel["public"]) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 8;
                return _pcmember["default"].findOne({
                  channelId: channelId,
                  userId: user._id
                });

              case 8:
                member = _context2.sent;

                if (member) {
                  _context2.next = 11;
                  break;
                }

                throw new Error("Not Authorized");

              case 11:
                return _context2.abrupt("return", _message["default"].find({
                  channelId: channelId
                }).limit(10).skip(offset).sort({
                  createdAt: -1
                }));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x4, _x5, _x6, _x7) {
        return _ref5.apply(this, arguments);
      };
    }()),
    message: function message(root, _ref6, context, info) {
      var id = _ref6.id;

      if (!_mongoose["default"].Types.ObjectId.isValid(id)) {
        throw new Error("can't find post");
      }

      return _message["default"].findById(id);
    }
  },
  Mutation: {
    createMessage: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(root, args, _ref7, info) {
        var req, message, user;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                req = _ref7.req;
                _context3.prev = 1;
                _context3.next = 4;
                return _message["default"].create({
                  // ...messageData,
                  text: args.text,
                  channelId: args.channelId,
                  userId: req.user._id
                });

              case 4:
                message = _context3.sent;
                _context3.next = 7;
                return _user3["default"].findOne({
                  _id: req.user._id
                });

              case 7:
                user = _context3.sent;
                pubSub.publish(NEW_MESSAGE, {
                  channelId: args.channelId,
                  newMessage: {
                    id: message._id,
                    text: message.text,
                    createdAt: message.createdAt,
                    user: user
                  }
                });
                return _context3.abrupt("return", true);

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](1);
                console.error(_context3.t0);
                return _context3.abrupt("return", false);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 12]]);
      }));

      return function (_x8, _x9, _x10, _x11) {
        return _ref8.apply(this, arguments);
      };
    }()),
    singleUpload: function singleUpload(parent, args) {
      return args.file.then( /*#__PURE__*/function () {
        var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(file) {
          var _yield$file, createReadStream, filename, files;

          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return file;

                case 2:
                  _yield$file = _context4.sent;
                  createReadStream = _yield$file.createReadStream;
                  filename = _yield$file.filename;
                  console.log(filename);
                  files = [];
                  _context4.next = 9;
                  return new Promise(function (res) {
                    return createReadStream().pipe((0, _fs.createWriteStream)(_path["default"].join(__dirname, "../images", filename))).on("close", res);
                  });

                case 9:
                  files.push(filename);
                  console.log(files);
                  return _context4.abrupt("return", {
                    url: "http://localhost:3000/".concat(filename)
                  });

                case 12:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x12) {
          return _ref9.apply(this, arguments);
        };
      }());
    }
  }
};