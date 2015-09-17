var React = require('react');
var ReactRouter = require('react-router'),
    IndexRoute = ReactRouter.IndexRoute,
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link;

var Layout = require('./components/layout');
var Home = require('./components/home');


React.render((
  <Router>
    <Route path='/' component={Layout}>
      <IndexRoute component={Home} />
    </Route>
  </Router>
), document.getElementById('content'));
