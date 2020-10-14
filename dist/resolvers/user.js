"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _permission = _interopRequireDefault(require("../middleware/permission"));

var _member = _interopRequireDefault(require("../models/member"));

var _team = _interopRequireDefault(require("../models/team"));

var _require = require("apollo-server-express"),
    UserInputError = _require.UserInputError;

var mongoose = require("mongoose");

var User = require("../models/user");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var _require2 = require("../validation/userValidation"),
    signupSchema = _require2.signupSchema;

var Joi = require("joi");

var _require3 = require("../middleware/authMiddleware"),
    createTokens = _require3.createTokens;

var NEW_USER = "NEW_USER";
var maxAge = 3 * 24 * 60 * 60;
module.exports = {
  User: {
    teams: function () {
      var _teams = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(root, args, _ref, info) {
        var req, _teams2, members, teamIds, memberTeams;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                req = _ref.req;
                _context.prev = 1;
                _teams2 = []; // const userTeams = await Team.find({ owner: req.user._id });

                _context.next = 5;
                return _member["default"].find({
                  userId: req.user._id
                });

              case 5:
                members = _context.sent;
                teamIds = members.map(function (mm) {
                  return mm.teamId;
                });
                _context.next = 9;
                return _team["default"].find({
                  _id: (0, _toConsumableArray2["default"])(teamIds)
                });

              case 9:
                memberTeams = _context.sent;
                _teams2 = (0, _toConsumableArray2["default"])(memberTeams); // console.log(teams);

                return _context.abrupt("return", _teams2);

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](1);
                console.error(_context.t0);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 14]]);
      }));

      function teams(_x, _x2, _x3, _x4) {
        return _teams.apply(this, arguments);
      }

      return teams;
    }()
  },
  Query: {
    allUsers: function allUsers(root, args, _ref2, info) {
      var req = _ref2.req,
          res = _ref2.res,
          pubSub = _ref2.pubSub;
      return User.find({});
    },
    me: _permission["default"].createResolver( /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(root, _ref3, _ref4, info) {
        var id, req, pubsub;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = _ref3.id;
                req = _ref4.req, pubsub = _ref4.pubsub;
                _context2.next = 4;
                return User.findOne({
                  _id: req.user._id
                });

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x5, _x6, _x7, _x8) {
        return _ref5.apply(this, arguments);
      };
    }()),
    getUser: function getUser(_, _ref6, _ref7) {
      var userId = _ref6.userId;
      var req = _ref7.req;
      return User.findById(userId);
    }
  },
  Mutation: {
    createUser: function () {
      var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(root, args, _ref8, info) {
        var res, user;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                res = _ref8.res;
                _context3.next = 3;
                return signupSchema.validateAsync(args, {
                  abortEarly: false
                });

              case 3:
                _context3.next = 5;
                return User.create(args);

              case 5:
                user = _context3.sent;
                return _context3.abrupt("return", user);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createUser(_x9, _x10, _x11, _x12) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }(),
    loginUser: function () {
      var _loginUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(root, _ref9, _ref10, info) {
        var email, password, req, res, errors, user, isMatch, refreshSecret, _yield$createTokens, _yield$createTokens2, newToken, newRefreshtoken;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                email = _ref9.email, password = _ref9.password;
                req = _ref10.req, res = _ref10.res;
                errors = [];
                _context4.next = 5;
                return User.findOne({
                  email: email
                });

              case 5:
                user = _context4.sent;

                if (user) {
                  _context4.next = 10;
                  break;
                }

                errors.push({
                  error: "wrong email"
                });
                console.log(errors);
                return _context4.abrupt("return", {
                  errors: errors
                });

              case 10:
                _context4.next = 12;
                return bcrypt.compare(password, user.password);

              case 12:
                isMatch = _context4.sent;

                if (isMatch) {
                  _context4.next = 17;
                  break;
                }

                errors.push({
                  error: "wrong password"
                });
                console.log(errors);
                return _context4.abrupt("return", {
                  errors: errors
                });

              case 17:
                refreshSecret = user.password + process.env.SECRET2;
                _context4.next = 20;
                return createTokens(user, refreshSecret);

              case 20:
                _yield$createTokens = _context4.sent;
                _yield$createTokens2 = (0, _slicedToArray2["default"])(_yield$createTokens, 2);
                newToken = _yield$createTokens2[0];
                newRefreshtoken = _yield$createTokens2[1];
                return _context4.abrupt("return", {
                  token: newToken,
                  refreshToken: newRefreshtoken
                });

              case 25:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function loginUser(_x13, _x14, _x15, _x16) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  },
  Subscription: {
    newUser: {
      subscribe: function subscribe(root, args, _ref11, info) {
        var pubSub = _ref11.pubSub;
        return pubSub.asyncIterator(NEW_USER);
      }
    }
  }
};