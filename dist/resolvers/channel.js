"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _permission = _interopRequireDefault(require("../middleware/permission"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _member = _interopRequireDefault(require("../models/member"));

var _pcmember = _interopRequireDefault(require("../models/pcmember"));

var _team = _interopRequireDefault(require("../models/team"));

var _user = _interopRequireDefault(require("../models/user"));

module.exports = {
  Query: {
    channels: function channels() {
      return _channel["default"].find({});
    },
    channel: function channel(_, __, _ref) {
      var id = _ref.id;
      return _channel["default"].findById(id);
    }
  },
  Mutation: {
    getOrCreateChannel: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, _ref2, _ref3) {
        var teamId, members, user, member, allMembers, users, name, channels, channel, cId, pcmembers;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                teamId = _ref2.teamId, members = _ref2.members;
                user = _ref3.req.user;
                _context.next = 4;
                return _member["default"].findOne({
                  teamId: teamId,
                  userId: user._id
                });

              case 4:
                member = _context.sent;

                if (member) {
                  _context.next = 7;
                  break;
                }

                throw new Error("Not Authorized");

              case 7:
                allMembers = [].concat((0, _toConsumableArray2["default"])(members), [user._id]); // check if dm channel already exists with these members

                _context.next = 10;
                return _user["default"].find({
                  _id: members
                });

              case 10:
                users = _context.sent;
                name = users.map(function (u) {
                  return u.username;
                }).join(", ");
                _context.next = 14;
                return _channel["default"].find({
                  $and: [{
                    teamId: teamId
                  }, {
                    dm: true
                  }, {
                    "public": false
                  }, {
                    name: name
                  }]
                });

              case 14:
                channels = _context.sent;
                console.log(channels);

                if (!channels.length) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return", {
                  id: channels._id,
                  name: channels.name
                });

              case 18:
                _context.next = 20;
                return _channel["default"].create({
                  name: name,
                  "public": false,
                  dm: true,
                  teamId: teamId
                });

              case 20:
                channel = _context.sent;
                cId = channel._id;
                pcmembers = allMembers.map(function (m) {
                  return {
                    userId: m,
                    channelId: cId
                  };
                });
                _context.next = 25;
                return _pcmember["default"].create(pcmembers);

              case 25:
                return _context.abrupt("return", {
                  id: cId,
                  name: name
                });

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }()),
    createChannel: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(root, args, _ref5, info) {
        var user, team, channel, members, pcmembers;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                user = _ref5.req.user;
                _context2.prev = 1;
                _context2.next = 4;
                return _team["default"].findOne({
                  _id: args.teamId
                });

              case 4:
                team = _context2.sent;

                if (team.admin) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", {
                  ok: false,
                  error: {
                    error: "You are not owner of the team"
                  }
                });

              case 7:
                _context2.next = 9;
                return _channel["default"].create(args);

              case 9:
                channel = _context2.sent;

                if (args["public"]) {
                  _context2.next = 16;
                  break;
                }

                members = args.members.filter(function (m) {
                  return m !== user._id;
                });
                members.push(user._id);
                pcmembers = members.map(function (m) {
                  return {
                    userId: m,
                    channelId: channel._id
                  };
                });
                _context2.next = 16;
                return _pcmember["default"].create(pcmembers);

              case 16:
                return _context2.abrupt("return", {
                  ok: true,
                  channel: channel
                });

              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2["catch"](1);
                console.error(_context2.t0);
                return _context2.abrupt("return", {
                  ok: false,
                  error: _context2.t0.message
                });

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 19]]);
      }));

      return function (_x4, _x5, _x6, _x7) {
        return _ref6.apply(this, arguments);
      };
    }())
  }
};