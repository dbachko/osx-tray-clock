var React = require('react');
var ipc = require('electron-safe-ipc/guest');

var LayoutFooter = React.createClass({

  exitAppHandler: function() {
    ipc.send('exit-app');
  },

  render: function() {
    return (
      <div className='container-flex footer'>
        <div className='col-xs-2'>
          <span className='app-exit icon-power' onClick={this.exitAppHandler} />
        </div>
      </div>
    );
  }

});

module.exports = LayoutFooter;
