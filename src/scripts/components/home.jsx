const React = require('react');
const Calendar = require('react-month-calendar');
const WorldTime = require('react-world-time');


var Home = React.createClass({

  handleDayClick: function(value) {
    // console.log('selected day: ', value);
  },

  render: function() {
    return (
      <div className='main-content'>
        <Calendar
          className='container-flex calendar'
          firstDayOfWeek={1}
          onDayClick={this.handleDayClick}
          headerDateFormat={'MMM YYYY'} />
        <WorldTime
          className='container-flex worldtime'
          cities={[{name: 'NYC', tz: 'America/New_York'}]}
          isEditOn={this.props.isEditOn}/>
      </div>
    );

  }

});

module.exports = Home;
