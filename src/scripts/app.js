const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router'),
    IndexRoute = ReactRouter.IndexRoute,
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link;

const Layout = require('./components/layout');
const Home = require('./components/home');


ReactDOM.render((
  <Router>
    <Route path='/' component={Layout}>
      <IndexRoute component={Home} />
    </Route>
  </Router>
), document.getElementById('content'));
