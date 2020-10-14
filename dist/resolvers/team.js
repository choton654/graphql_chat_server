"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _permission = _interopRequireDefault(require("../middleware/permission"));

var _channel = _interopRequireDefault(require("../models/channel"));

var _directMessage = _interopRequireDefault(require("../models/directMessage"));

var _member = _interopRequireDefault(require("../models/member"));

var _pcmember = _interopRequireDefault(require("../models/pcmember"));

var _team = _interopRequireDefault(require("../models/team"));

var _user = _interopRequireDefault(require("../models/user"));

var NEW_TEAM = "NEW TEAM";
module.exports = {
  Query: {
    getTeamMembers: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(parent, _ref, _ref2) {
        var teamId, user, members, userIds, uteams, usersInTeam;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                teamId = _ref.teamId;
                user = _ref2.req.user;
                _context.prev = 2;
                _context.next = 5;
                return _member["default"].find({
                  teamId: teamId
                });

              case 5:
                members = _context.sent;
                userIds = members.map(function (mm) {
                  return mm.userId;
                });
                uteams = userIds.filter(function (ut) {
                  return ut.toString() !== user._id.toString();
                });
                _context.next = 10;
                return _user["default"].find({
                  _id: uteams
                });

              case 10:
                usersInTeam = _context.sent;
                return _context.abrupt("return", usersInTeam);

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 14]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    addTeamMember: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(root, _ref4, _ref5, info) {
        var email, teamId, req, pubSub, userToAddPromise, memberToPromise, teamPromise, _yield$Promise$all, _yield$Promise$all2, team, userToAdd;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                email = _ref4.email, teamId = _ref4.teamId;
                req = _ref5.req, pubSub = _ref5.pubSub;
                _context2.prev = 2;
                userToAddPromise = _user["default"].findOne({
                  email: email
                });
                memberToPromise = _member["default"].findOne({
                  teamId: teamId,
                  userId: req.user._id
                });
                teamPromise = _team["default"].findOne({
                  _id: teamId,
                  owner: req.user._id
                });
                _context2.next = 8;
                return Promise.all([teamPromise, // memberToPromise,
                userToAddPromise]);

              case 8:
                _yield$Promise$all = _context2.sent;
                _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
                team = _yield$Promise$all2[0];
                userToAdd = _yield$Promise$all2[1];

                if (team.admin) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", {
                  ok: false,
                  error: {
                    error: "You cannot add members to the team"
                  }
                });

              case 14:
                if (userToAdd) {
                  _context2.next = 16;
                  break;
                }

                return _context2.abrupt("return", {
                  ok: false,
                  error: {
                    error: "Could not find user with this email"
                  }
                });

              case 16:
                _context2.next = 18;
                return _member["default"].create({
                  userId: userToAdd._id,
                  teamId: teamId
                });

              case 18:
                return _context2.abrupt("return", {
                  ok: true
                });

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](2);
                console.error(_context2.t0);
                return _context2.abrupt("return", {
                  ok: false,
                  error: {
                    error: _context2.t0.message
                  }
                });

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 21]]);
      }));

      return function (_x4, _x5, _x6, _x7) {
        return _ref6.apply(this, arguments);
      };
    }()),
    createTeam: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(root, args, _ref7, info) {
        var req, pubSub, team;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                req = _ref7.req, pubSub = _ref7.pubSub;
                _context3.prev = 1;
                _context3.next = 4;
                return _team["default"].create({
                  name: args.name,
                  owner: req.user._id,
                  admin: true
                });

              case 4:
                team = _context3.sent;
                _context3.next = 7;
                return _member["default"].create({
                  userId: req.user._id,
                  teamId: team._id
                });

              case 7:
                _context3.next = 9;
                return _channel["default"].create({
                  name: "general",
                  teamId: team._id,
                  "public": true
                });

              case 9:
                return _context3.abrupt("return", {
                  ok: true,
                  team: team
                });

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](1);
                console.error(_context3.t0);

                if (!(_context3.t0.code === 11000)) {
                  _context3.next = 17;
                  break;
                }

                return _context3.abrupt("return", {
                  ok: false,
                  error: {
                    error: "Team already exists"
                  }
                });

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 12]]);
      }));

      return function (_x8, _x9, _x10, _x11) {
        return _ref8.apply(this, arguments);
      };
    }())
  },
  Team: {
    channels: function () {
      var _channels = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref9, args, _ref10, info) {
        var id, user, pcMembers, pChannelIds, channels;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                id = _ref9.id;
                user = _ref10.req.user;
                _context4.next = 4;
                return _pcmember["default"].find({
                  userId: user._id
                });

              case 4:
                pcMembers = _context4.sent;
                pChannelIds = pcMembers.map(function (pcm) {
                  return pcm.channelId;
                });
                _context4.next = 8;
                return _channel["default"].find({
                  $and: [{
                    teamId: id
                  }, {
                    $or: [{
                      "public": true
                    }, {
                      _id: pChannelIds
                    }]
                  }]
                });

              case 8:
                channels = _context4.sent;
                return _context4.abrupt("return", channels);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function channels(_x12, _x13, _x14, _x15) {
        return _channels.apply(this, arguments);
      }

      return channels;
    }(),
    directMessageMembers: function () {
      var _directMessageMembers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref11, args, _ref12) {
        var id, user, directmessages, receiverIds, senderIds, users, musers;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                id = _ref11.id;
                user = _ref12.req.user;
                _context5.next = 4;
                return _directMessage["default"].find({
                  $and: [{
                    teamId: id
                  }, {
                    $or: [{
                      receiverId: user._id
                    }, {
                      senderId: user._id
                    }]
                  }]
                });

              case 4:
                directmessages = _context5.sent;
                receiverIds = directmessages.map(function (dm) {
                  return dm.receiverId;
                });
                senderIds = directmessages.map(function (dm) {
                  return dm.senderId;
                });
                _context5.next = 9;
                return _user["default"].find({
                  $or: [{
                    _id: (0, _toConsumableArray2["default"])(receiverIds)
                  }, {
                    _id: (0, _toConsumableArray2["default"])(senderIds)
                  }]
                });

              case 9:
                users = _context5.sent;
                musers = users.filter(function (u) {
                  return u._id.toString() !== user._id.toString();
                });
                return _context5.abrupt("return", musers);

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function directMessageMembers(_x16, _x17, _x18) {
        return _directMessageMembers.apply(this, arguments);
      }

      return directMessageMembers;
    }()
  },
  Subscription: {
    newTeam: {
      subscribe: function subscribe(root, args, _ref13, info) {
        var pubSub = _ref13.pubSub;
        return pubSub.asyncIterator(NEW_TEAM);
      }
    }
  }
};