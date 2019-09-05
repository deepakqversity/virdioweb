import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//import { BrowserRouter as Router, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";
//import jwt_decode from "jwt-decode";
//import setAuthToken from "./utils/setAuthToken";
//import './App.css';

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Host from "./components/home/Host";
import Guest from "./components/home/Guest";
import Verification from "./components/auth/Verification";
import RegisterForm from './components/auth/RegisterForm';
import VerifyUserRegister from "./components/auth/VerifyUserRegister"

// Check for token to keep user logged in
if (localStorage.userData) {
  // Set auth token header auth
  const token = JSON.parse(localStorage.userData).token;

  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/verification" component={Verification} />
          <Route exact path="/registerationform" component={RegisterForm} />
          <Route exact path="/verifyuser" component={VerifyUserRegister} />
          <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/home" component={Home} />
              <PrivateRoute exact path="/host" component={Host} />
              <PrivateRoute exact path="/guest" component={Guest} />
              
            </Switch>
      </div>
      </Router>
      </Provider>
        

    );
  }
}
export default App;