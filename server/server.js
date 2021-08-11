const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");
const request = require("request");
const socketIo = require("socket.io");
const http = require("http");
require('dotenv').config();

const app = express();
let port = process.env.PORT || 3001;
const get = util.promisify(request.get);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server);
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
let timeout = 0;
let isDisconnected = false;
const streamURL = new URL(
  'https://api.twitter.com/2/tweets/sample/stream?expansions=author_id&user.fields=profile_image_url&tweet.fields=created_at'

  // "https://api.twitter.com/2/tweets/sample/stream?tweet.fields=context_annotations&expansions=author_id&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url"
);
const trendsURL = new URL(
  "https://api.twitter.com/1.1/trends/place.json?id=20070458"
);
const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};
const authMessage = {
  title: "Could not authenticate",
  detail: 'Please make sure your bearer token is correct.'
};
const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

// Routes
app.get('/test', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.get("/api/trends", async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }
  const token = BEARER_TOKEN;
  const requestConfig = {
    url: trendsURL,
    auth: {
      bearer: token,
    },
    json: true,
  };

  try {
    const response = await get(requestConfig);
    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});


const streamTweets = (socket, token) => {
  const config = {
    url: streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  };

  try {
    const stream = request.get(config);
    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
          } else {
            if (json.data && !isDisconnected) {
              socket.emit("tweet", json);
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        // Connection timed out
        socket.emit("error", errorMessage);
        reconnect(stream, socket, token);
      });
  } catch (e) {
    socket.emit("authError", authMessage);
  }
};

const reconnect = async (stream, socket, token) => {
  timeout++;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  streamTweets(socket, token);
};

io.on("connection", async (socket) => {
  try {
    const token = BEARER_TOKEN;
    io.emit("connect", "Client connected");
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('resume', () => {
      isDisconnected = false;
    });
    socket.on('pause stream', () => {
      isDisconnected = true;
      socket.disconnect();
    });
    if(!isDisconnected) {
      streamTweets(io, token);
    }
  } catch (e) {
    io.emit("authError", authMessage);
  }
});

server.listen(port, () => console.log(`Listening on port ${port}`));
