"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireTeamAccess = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _member = _interopRequireDefault(require("../models/member"));

var createResolver = function createResolver(resolver) {
  var baseResolver = resolver;

  baseResolver.createResolver = function (childResolver) {
    var newResolver = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, args, context, info) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return resolver(parent, args, context, info);

              case 2:
                return _context.abrupt("return", childResolver(parent, args, context, info));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function newResolver(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }();

    return createResolver(newResolver);
  };

  return baseResolver;
}; // requiresAuth


var _default = createResolver(function (parent, args, _ref2) {
  var req = _ref2.req;

  if (!req.user || !req.user._id) {
    throw new Error('Not authenticated');
  }
});

exports["default"] = _default;
var requireTeamAccess = createResolver( /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(parent, _ref3, _ref4) {
    var channelId, user, channel, member;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            channelId = _ref3.channelId;
            user = _ref4.req.user;
            console.log('permission user', user);

            if (!(!user || !user._id)) {
              _context2.next = 5;
              break;
            }

            throw new Error('Not authenticated');

          case 5:
            _context2.next = 7;
            return _channel["default"].findOne({
              _id: channelId
            });

          case 7:
            channel = _context2.sent;
            _context2.next = 10;
            return _member["default"].findOne({
              teamId: channel.teamId,
              userId: user._id
            });

          case 10:
            member = _context2.sent;

            if (member) {
              _context2.next = 13;
              break;
            }

            throw new Error("You have to be a member of the team to subcribe to it's messages");

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x5, _x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}());
exports.requireTeamAccess = requireTeamAccess;