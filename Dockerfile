FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY dist .
EXPOSE 3000
ENV MONGO_URI=mongodb+srv://admin-choton:Toton_688@cluster0.j7z2c.mongodb.net/graphql_chat?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true
CMD node index.js