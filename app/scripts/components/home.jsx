var React = require('react');
var ReactMonthCalendar = require('react-month-calendar');


var Home = React.createClass({

  handleDayClick: function(value) {
    // console.log('selected day: ', value);
  },

  render: function() {
    return (
      <div className='body'>
        <ReactMonthCalendar
          firstDayOfWeek={1}
          onDayClick={this.handleDayClick} />
      </div>
    );

  }

});

module.exports = Home;
