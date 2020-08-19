import React from 'react';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Search from './pages/Search';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ConfirmEmail from './pages/ConfirmEmail';
import ConfirmPhone from './pages/ConfirmPhone';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/search" component={Search} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/product/:productid" component={ProductDetail} />
          <Route path="/m/:roomID?" component={Messages} />
          <Route path="/profile/:userid" component={Profile} />
          <Route path="/confirm_email" component={ConfirmEmail} />
          <Route path="/confirm_phone" component={ConfirmPhone} />
          <Route path="/profile/:userid" component={Profile} />
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Homepage() {
  return <Home />;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function ProductDetailPage() {
  return <ProductDetail />;
}

export default App;
