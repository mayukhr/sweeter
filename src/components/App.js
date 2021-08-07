import styles from './App.module.css'
import TweetFeed from './TweetFeed';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <TweetFeed />
      </header>
    </div>
  );
}

export default App;
