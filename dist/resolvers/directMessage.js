"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerExpress = require("apollo-server-express");

var _permission = _interopRequireDefault(require("../middleware/permission"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _directMessage = _interopRequireDefault(require("../models/directMessage"));

var _member = _interopRequireDefault(require("../models/member"));

var _user = _interopRequireDefault(require("../models/user"));

var NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE ";
var pubsub = new _apolloServerExpress.PubSub();
module.exports = {
  Subscription: {
    newDirectMessage: {
      subscribe: (0, _apolloServerExpress.withFilter)(function () {
        return pubsub.asyncIterator(NEW_DIRECT_MESSAGE);
      }, function (payload, args, _ref) {
        var user = _ref.user;
        return true; // return (
        //   payload.teamId === args.teamId &&
        //   ((payload.senderId === user._id &&
        //     payload.receiverId === args.userId) ||
        //     (payload.senderId === args.userId &&
        //       payload.receiverId === user._id))
        // );
      })
    }
  },
  DirectMessage: {
    sender: function sender(_ref2, args, req) {
      var _sender = _ref2.sender,
          senderId = _ref2.senderId;

      if (_sender) {
        return _sender;
      }

      return _user["default"].findOne({
        _id: senderId
      });
    }
  },
  Query: {
    directMessages: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, _ref3, _ref4) {
        var teamId, receiverId, user, msgs;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                teamId = _ref3.teamId, receiverId = _ref3.receiverId;
                user = _ref4.req.user;
                _context.prev = 2;
                _context.next = 5;
                return _directMessage["default"].find({
                  $and: [{
                    teamId: teamId
                  }, {
                    $or: [{
                      $and: [{
                        receiverId: receiverId
                      }, {
                        senderId: user._id
                      }]
                    }, {
                      $and: [{
                        receiverId: user._id
                      }, {
                        senderId: receiverId
                      }]
                    }]
                  }]
                });

              case 5:
                msgs = _context.sent;
                return _context.abrupt("return", msgs);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);
                return _context.abrupt("return", []);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref5.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createDirectMessage: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(parent, _ref6, _ref7) {
        var receiverId, text, teamId, user, directMessage;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                receiverId = _ref6.receiverId, text = _ref6.text, teamId = _ref6.teamId;
                user = _ref7.req.user;
                _context2.prev = 2;
                _context2.next = 5;
                return _directMessage["default"].create({
                  receiverId: receiverId,
                  text: text,
                  teamId: teamId,
                  senderId: user._id
                });

              case 5:
                directMessage = _context2.sent;
                // console.log(directMessage);
                pubsub.publish(NEW_DIRECT_MESSAGE, {
                  teamId: teamId,
                  senderId: user._id,
                  receiverId: receiverId,
                  newDirectMessage: {
                    id: directMessage._id,
                    text: directMessage.text,
                    receiverId: directMessage.receiverId,
                    teamId: directMessage.teamId,
                    createdAt: directMessage.createdAt,
                    sender: {
                      username: user.username
                    }
                  }
                });
                return _context2.abrupt("return", true);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](2);
                console.log(_context2.t0);
                return _context2.abrupt("return", false);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 10]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref8.apply(this, arguments);
      };
    }())
  }
};