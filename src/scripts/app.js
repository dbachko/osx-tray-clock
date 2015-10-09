const React = require('react');
const ReactRouter = require('react-router'),
    IndexRoute = ReactRouter.IndexRoute,
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link;

const Layout = require('./components/layout');
const Home = require('./components/home');


React.render((
  <Router>
    <Route path='/' component={Layout}>
      <IndexRoute component={Home} />
    </Route>
  </Router>
), document.getElementById('content'));
