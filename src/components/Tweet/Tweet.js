import styles from './Tweet.module.css';
import moment from 'moment';

const Tweet = ({ json }) => {
  const { data: {text}, includes: {users:[user]} } = json || {};
  const {created_at, name, profile_image_url, username} = user || {};
  const tweeted_at = moment(created_at).format('MM/DD/yyyy HH:mm:ss');

  return (
    <div className={styles.tweet}>
      <div>
        <img alt={username} src={profile_image_url} className={styles.profileImage}/>
      </div>
      <p className={styles.tweetText}>{text}</p>
      <div className={styles.tweetDetails}>
        <span>Tweeted by: {name}</span>
        <span className={styles.tweetedAt}>Tweeted at: {tweeted_at}</span>
      </div>
    </div>
  )
};

export default Tweet;
