import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styles from './App.module.css';
import NavBar from './NavBar';
import TweetFeed from './TweetFeed';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path='/' exact component={TweetFeed} />
        <Route path='/trends' component={TweetFeed} />
      </Switch>
    </Router>
  );
  // return (
  //   <div className={styles.app}>
  //     <NavBar />
  //     <TweetFeed />
  //   </div>
  // );
}

export default App;
