var React = require('react');
var Router = require('react-router');
var LayoutFooter = require('./layout-footer');
var LayoutHome = require('./home');
var ipc = require('electron-safe-ipc/guest');


var Layout = React.createClass({

  getInitialState: function() {
    return {
      isEditOn: false,
      bgImg: this.generateBackgroundUrl()
    };
  },

  componentWillMount: function() {
    var self = this;
    ipc.on('updateBackground', function() {
      console.log('got it!')
      self.setState({
        bgImg: this.generateBackgroundUrl()
      });
    });
  },

  toggleEdit: function() {
    this.setState({
      isEditOn: !this.state.isEditOn
    });
  },

  generateBackgroundUrl: function() {
    return 'url(../app/img/background.png?' + new Date().getTime() + ')';
  },

  renderChildren: function() {
    return React.Children.map(this.props.children, function(child) {
      if (child.type === LayoutHome.type) {
        return React.cloneElement(child, {
          isEditOn: this.state.isEditOn
        })
      } else {
        return child
      }
    }.bind(this))
  },

  render: function() {
    var divStyle = {
      backgroundImage: this.state.bgImg
    };
    return (
      <div className='app-wrapper'>
        <div className='app-inner'>
          <div className='app-inner-pseudo' style={divStyle}/>
          {this.renderChildren()}
          <LayoutFooter
            isEditOn={this.state.isEditOn}
            onToggle={this.toggleEdit}/>
        </div>
      </div>
    );
  }

});

module.exports = Layout;
