import './App.scss';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Login from './screens/Login';
import Register from './screens/Register/Register';
import { homePath, loginPath, registerPath } from './global/paths';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={homePath} >
          <Home />
        </Route>
        <Route path={loginPath} >
          <Login />
        </Route>
        <Route path={registerPath} >
          <Register />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
