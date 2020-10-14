"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerExpress = require("apollo-server-express");

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _authMiddleware = require("./middleware/authMiddleware");

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _typeDefs = _interopRequireDefault(require("./typeDefs"));

// import { existsSync, mkdirSync } from "fs";
// import { graphqlUploadExpress } from "graphql-upload";
// import path from "path";
require("dotenv").config(); // "mongodb://mongo:27017/docker-chat-mongo"


_mongoose["default"].connect(process.env.MONGO_URI || "mongodb://mongo:27017/docker-chat-mongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = _mongoose["default"].connection;
db.on("err", function (err) {
  return console.log(err);
});
db.once("open", function () {
  return console.log("we are connected");
}); // const { PORT = 3000, NODE_ENV = "development" } = process.env;

var PORT = process.env.PORT || 3000; // const HOST = "127.0.0.1";
// const IN_PROD = NODE_ENV === "production";

var app = (0, _express["default"])();
app.use((0, _cookieParser["default"])());
app.use(_authMiddleware.auth);
app.disable("x-powered-by"); // app.use(express.static("public"));
// existsSync(path.join(__dirname, "../images")) ||
//   mkdirSync(path.join(__dirname, "../images"));

var pubSub = new _apolloServerExpress.PubSub(); // app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

var server = new _apolloServerExpress.ApolloServer({
  typeDefs: _typeDefs["default"],
  resolvers: _resolvers["default"],
  // uploads: true,
  context: function () {
    var _context = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
      var req, res;
      return _regenerator["default"].wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              req = _ref.req, res = _ref.res;
              return _context2.abrupt("return", {
                req: req,
                res: res
              });

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee);
    }));

    function context(_x) {
      return _context.apply(this, arguments);
    }

    return context;
  }(),
  subscriptions: {
    onConnect: function () {
      var _onConnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2, webSocket) {
        var token, refreshToken, user, payload, newTokens;
        return _regenerator["default"].wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                token = _ref2.token, refreshToken = _ref2.refreshToken;

                if (!(token && refreshToken)) {
                  _context3.next = 13;
                  break;
                }

                _context3.prev = 2;
                payload = _jsonwebtoken["default"].verify(token, _authMiddleware.SECRET);
                return _context3.abrupt("return", {
                  user: payload.user
                });

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](2);
                _context3.next = 11;
                return (0, _authMiddleware.refreshtokens)(token, refreshToken);

              case 11:
                newTokens = _context3.sent;
                return _context3.abrupt("return", {
                  user: newTokens.user
                });

              case 13:
                throw new Error("Missing auth tokens");

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, null, [[2, 7]]);
      }));

      function onConnect(_x2, _x3) {
        return _onConnect.apply(this, arguments);
      }

      return onConnect;
    }()
  } // playground: !IN_PROD,

});
server.applyMiddleware({
  app: app
});

var httpServer = _http["default"].createServer(app);

server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, function () {
  console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT).concat(server.graphqlPath));
  console.log("\uD83D\uDE80 Subscriptions ready at ws://localhost:".concat(PORT).concat(server.subscriptionsPath));
}); // httpServer.listen(PORT, HOST() => {
// });