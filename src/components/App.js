import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
}

export default App;
