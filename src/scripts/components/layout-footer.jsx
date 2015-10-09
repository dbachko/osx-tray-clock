const React = require('react');
const ipc = require('electron-safe-ipc/guest');

var LayoutFooter = React.createClass({

  exitAppHandler: function() {
    ipc.send('exit-app');
  },

  render: function() {
    return (
      <div className='container-flex footer'>
        <div className='col-xs-2'>
          <span className='icon icon-s' onClick={this.props.onToggle}/>
        </div>
        <div className='col-xs-2'>
          <span className='icon icon-power' onClick={this.exitAppHandler} />
        </div>
      </div>
    );
  }

});

module.exports = LayoutFooter;
