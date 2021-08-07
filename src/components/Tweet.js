// import React from "react";
import styles from './Tweet.module.css';

//TODO: add a key!!!!
const Tweet = ({ json }) => {
  const { data: {author_id, text}, includes: {users:[user]} } = json || {};
  const {created_at, name, profile_image_url, username} = user || {};
  console.log(json);
  
  return (
    <div className={styles.tweet}>
      Author: {author_id}
      Text: {text}
      URL: {profile_image_url}
      Created at: {created_at}
      name: {name}
      Username: {username}
    </div>
  )
};

export default Tweet;
