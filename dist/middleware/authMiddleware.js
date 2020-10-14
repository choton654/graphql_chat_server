"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = exports.refreshtokens = exports.createTokens = exports.SECRET2 = exports.SECRET = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _user2 = _interopRequireDefault(require("../models/user"));

var SECRET = "fdfsdfsd";
exports.SECRET = SECRET;
var SECRET2 = "sdfsdfsdffsdfasgsdf";
exports.SECRET2 = SECRET2;

var createTokens = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user, refreshSecret) {
    var createToken, createRefreshtoken;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            createToken = _jsonwebtoken["default"].sign({
              user: user
            }, SECRET, {
              expiresIn: "1h"
            });
            createRefreshtoken = _jsonwebtoken["default"].sign({
              user: user
            }, refreshSecret, {
              expiresIn: "7d"
            });
            return _context.abrupt("return", [createToken, createRefreshtoken]);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createTokens(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.createTokens = createTokens;

var refreshtokens = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, refreshtoken) {
    var userId, _jwt$decode, _user, user, refreshSecret, _yield$createTokens, _yield$createTokens2, newToken, newRefreshtoken;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _jwt$decode = _jsonwebtoken["default"].decode(refreshtoken), _user = _jwt$decode.user;
            userId = _user._id;
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", {});

          case 8:
            if (userId) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", {});

          case 10:
            _context2.next = 12;
            return _user2["default"].findById(userId);

          case 12:
            user = _context2.sent;

            if (user) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("return", {});

          case 15:
            refreshSecret = user.password + SECRET2;
            _context2.prev = 16;

            _jsonwebtoken["default"].verify(refreshtoken, refreshSecret);

            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t1 = _context2["catch"](16);
            return _context2.abrupt("return", {});

          case 23:
            _context2.next = 25;
            return createTokens(user, refreshSecret);

          case 25:
            _yield$createTokens = _context2.sent;
            _yield$createTokens2 = (0, _slicedToArray2["default"])(_yield$createTokens, 2);
            newToken = _yield$createTokens2[0];
            newRefreshtoken = _yield$createTokens2[1];
            return _context2.abrupt("return", {
              token: newToken,
              refreshtoken: newRefreshtoken,
              user: user
            });

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 5], [16, 20]]);
  }));

  return function refreshtokens(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.refreshtokens = refreshtokens;

var auth = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var token, _jwt$verify, user, refreshtoken, newTokens;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            token = req.headers["x-token"];

            if (!token) {
              _context3.next = 16;
              break;
            }

            _context3.prev = 2;
            _jwt$verify = _jsonwebtoken["default"].verify(token, SECRET), user = _jwt$verify.user;
            req.user = user;
            _context3.next = 16;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](2);
            console.log(_context3.t0);
            refreshtoken = req.headers["x-refresh-token"];
            _context3.next = 13;
            return refreshtokens(token, refreshtoken);

          case 13:
            newTokens = _context3.sent;

            if (newTokens.token && newTokens.refreshToken) {
              res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
              res.set("x-token", newTokens.token);
              res.set("x-refresh-token", newTokens.refreshToken);
            }

            req.user = newTokens.user;

          case 16:
            next();

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 7]]);
  }));

  return function auth(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.auth = auth;