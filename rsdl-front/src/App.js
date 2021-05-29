import './App.scss';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import Login from './screens/Login';
import Register from './screens/Register/Register';
import { homePath, loginPath, registerPath, dashboardPath } from './global/paths';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './screens/dashboard';


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
        <ProtectedRoute path={dashboardPath}>
          <Dashboard />
        </ProtectedRoute>
      </Switch>
    </Router>
  );
}

export default App;
