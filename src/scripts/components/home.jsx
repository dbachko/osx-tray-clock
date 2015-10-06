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
          firstDayOfWeek={0}
          onDayClick={this.handleDayClick}/>
        <WorldTime
          className='container-flex worldtime'
          cities={[{
            name: 'New York City',
            tz: 'America/New_York',
            geopoint: {
              lat: 40.71427,
              lon: -74.00597
            }
          }]}
          isEditOn={this.props.isEditOn}/>
      </div>
    );

  }

});

module.exports = Home;
