var React = require('react');
var Router = require('react-router');
var LayoutFooter = require('./layout-footer');


var Layout = React.createClass({

  render: function() {
    return (
      <div className='app-wrapper'>
        <div className='app-inner'>
          {this.props.children}
          <LayoutFooter />
        </div>
      </div>
    );
  }

});

module.exports = Layout;
