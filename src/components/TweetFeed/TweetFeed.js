import React, { useState, useEffect, useReducer } from "react";
import Tweet from "../Tweet/Tweet";
import socketIOClient from "socket.io-client";
import ErrorMessage from "../ErrorMessage";
import styles from './TweetFeed.module.css';

const reducer = (state, action) => {
  switch (action.type) {
    case "add_tweet":
      return {
        ...state,
        tweets: [action.payload, ...state.tweets],
        error: null,
        isWaiting: false,
        errors: [],
      };
    case "show_error":
      return { ...state, error: action.payload, isWaiting: false };
    case "add_errors":
      return { ...state, errors: action.payload, isWaiting: false };
    case "update_waiting":
      return { ...state, error: null, isWaiting: true };
    default:
      return state;
  }
};

const TweetFeed = () => {
  const [isPaused, setIsPaused] = useState(false);
  const initialState = {
    tweets: [],
    error: {},
    isWaiting: true,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tweets, error, isWaiting } = state;

  const reconnectMessage = () => {
    const message = {
      title: "Reconnecting",
      detail: "Please wait while we reconnect to the stream.",
    };

    if (error && error.detail && !isPaused) {
      return (
        <div>
          <ErrorMessage key={error.title} error={error} styleType="warning" />
          <ErrorMessage key={message.title} error={message} styleType="success"/>
        </div>
      );
    }
  };

  const errorMessage = () => {
    const { errors } = state;

    if (errors && errors.length > 0  && !isPaused) {
      return errors.map((error) => (
        error.title?<ErrorMessage key={error.title} error={error} styleType="negative" />:''
      ));
    }
  };

  const waitingMessage = () => {
    const message = {
      title: "Loading.",
      detail: "Waiting for new Tweets to be posted..",
    };

    if (isWaiting && !isPaused) {
      return (
        <ErrorMessage
          key={message.title}
          error={message}
          styleType="success"
        />
      );
    }
  };

  useEffect(() => {
    console.log('Use EFFECT !!!!!!');
    const socket = socketIOClient("http://localhost:3001/");
    if(!isPaused) {
      socket.emit("resume");
      socket.on("tweet", (json) => {
        if (json.data) {
          dispatch({ type: "add_tweet", payload: json });
        }
      });
      socket.on("heartbeat", (data) => {
        dispatch({ type: "update_waiting" });
      });
      socket.on("error", (data) => {
        dispatch({ type: "show_error", payload: data });
      });
      socket.on("authError", (data) => {
        console.log("data =>", data);
        dispatch({ type: "add_errors", payload: [data] });
      });
    } else {
      socket.emit('pause stream');
    }
  }, [isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const showTweets = () => {
    if (tweets.length > 0) {
      return (
        <>
          <button className={styles.pauseBtn} type="button" onClick={handlePause}> {isPaused ? 'Play' : 'Pause'} </button>
          {tweets.map((tweet) => (
            <Tweet key={tweet.data.id} json={tweet} />
          ))}
        </>
      );
    }
  };

  return (
    <div className={styles.tweetFeed}>
      {reconnectMessage()}
      {errorMessage()}
      {waitingMessage()}
      {showTweets()}
    </div>
  );
};

export default TweetFeed;
