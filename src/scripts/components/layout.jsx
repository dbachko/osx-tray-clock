var React = require('react');
var Router = require('react-router');
var LayoutFooter = require('./layout-footer');
var LayoutHome = require('./home');


var Layout = React.createClass({

  getInitialState: function() {
    return {
      isEditOn: false
    };
  },

  toggleEdit: function() {
    console.log('toggleEdit');
    this.setState({
      isEditOn: !this.state.isEditOn
    });
  },

  renderChildren: function() {
    return React.Children.map(this.props.children, function(child) {
      console.log('child === LayoutHome', child === LayoutHome)
      console.log('LayoutHome', LayoutHome)
      console.log('child', child)
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
    return (
      <div className='app-wrapper'>
        <div className='app-inner'>
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
