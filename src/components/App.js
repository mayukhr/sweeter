import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import TweetFeed from './TweetFeed';
import TrendsList from './TrendsList'

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path='/' exact component={TweetFeed} />
        <Route path='/trends' component={TrendsList} />
      </Switch>
    </Router>
  );
}

export default App;
