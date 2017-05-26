import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  eventTime: PropTypes.instanceOf(Date).isRequired  
}

export default class TrfsEventCountDown extends Component {
  constructor(props) {
    // props set in trfsEventApp.js
    super(props);
    this.state = {eventTime: this.props.eventTime};
  }

  componentWillReceiveProps(nextProps){
    this.eventCountDown = setInterval(
      () => this.countDown(),
      1000
    ); // end setInterval
  }

  componentWillUnmount() {
    clearInterval(this.eventCountDown);
  }

  countDown() {
    // getting the time difference from the state and the current time
    var now = new Date();
    var time_diff = this.props.eventTime - now;
    this.setState({
      eventTime: time_diff
    }); // end setStae
  }

  render() {
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
    const time = Math.sign(Math.floor(this.state.eventTime));
    let set = (time === -1 || isNaN(time)) ? false : true;
    return(
      <div className="row eventCountDown">
        <div className="col-xs-3 countDownTime">
          <p className="timeCount">{set ? Math.floor(this.state.eventTime / _day) : '-'}</p>
          <p className="timeLabel">Days</p>
        </div>
        <div className="col-xs-3 countDownTime">
          <p className="timeCount">{set ? Math.floor((this.state.eventTime % _day) / _hour) : '-'}</p>
          <p className="timeLabel">Hours</p>
        </div>
        <div className="col-xs-3 countDownTime">
          <p className="timeCount">{set ? Math.floor((this.state.eventTime % _hour) / _minute) : '-'}</p>
          <p className="timeLabel">Minutes</p>
        </div>
        <div className="col-xs-3 countDownTime">
          <p className="timeCount">{set ? Math.floor((this.state.eventTime % _minute) / _second) : '-'}</p>
          <p className="timeLabel">Seconds</p>
        </div>
      </div>
    )
  }
}

TrfsEventCountDown.propTypes = propTypes;
