import { ApolloServer, PubSub } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";
// import { existsSync, mkdirSync } from "fs";
// import { graphqlUploadExpress } from "g-upload";
// import path from "path";
import http from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { auth, refreshtokens, SECRET } from "./middleware/authMiddleware";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

require("dotenv").config();
// "mongodb://mongo:27017/docker-chat-mongo"
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("err", (err) => console.log(err));
db.once("open", () => console.log("we are connected"));

// const { PORT = 3000, NODE_ENV = "development" } = process.env;
const PORT = process.env.PORT || 3000;
// const HOST = "127.0.0.1";

// const IN_PROD = NODE_ENV === "production";

const app = express();
app.use(cookieParser());

app.use(auth);

app.disable("x-powered-by");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => ({ req, res }),
  subscriptions: {
    onConnect: async ({ token, refreshToken }, webSocket) => {
      if (token && refreshToken) {
        let user;
        try {
          const payload = jwt.verify(token, SECRET);
          return { user: payload.user };
        } catch (error) {
          const newTokens = await refreshtokens(token, refreshToken);
          console.log(newTokens);
          return { user: newTokens.user };
        }
      }
      throw new Error("Missing auth tokens");
    },
  },
  // playground: !IN_PROD,
});
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
// httpServer.listen(PORT, HOST() => {
// });
