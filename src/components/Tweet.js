import React from "react";
import styles from './Tweet.module.css';

//TODO: add a key!!!!
const Tweet = ({ json }) => {
  const { data: {author_id, text}, includes: {users:[user]} } = json || {};
  const {created_at, name, profile_image_url, username} = user || {};
  console.log(json);

  return (
    <div className={styles.tweet}>
      <div>
        <img alt={username} src={profile_image_url} className={styles.profileImage}/>
      </div>
      <p className={styles.tweetText}>{text}</p>
      <div className={styles.tweetDetails}>
        <span>Tweeted by: {name}</span>
        <span className={styles.tweetedAt}>Tweeted at: {created_at}</span>
      </div>
    </div>
  )
};

export default Tweet;
