import { ApolloServer, PubSub } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { auth } from './middleware/authMiddleware';
import User from './models/user';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('err', (err) => console.log(err));
db.once('open', () => console.log('we are connected'));

const { PORT = 3000, NODE_ENV = 'development' } = process.env;

const IN_PROD = NODE_ENV === 'production';

const app = express();
app.use(cookieParser());

app.use(auth);

app.disable('x-powered-by');

const pubSub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const user = await User.findById(req.userId);
    console.log('user', user);
    req.user = user;
    return { req, res, pubSub };
  },
  playground: !IN_PROD,
});
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
  );
});
