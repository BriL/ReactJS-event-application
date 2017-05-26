import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

const propTypes = {
  clickedEvent: PropTypes.bool.isRequired,
  item: PropTypes.array.isRequired,
  onChangeEvent: PropTypes.func.isRequired
}

export default class TrfsEventBlock extends Component {
  constructor(props) {
    // props set in trfsEventApp.js
    super(props);
    this.state = {
      item: this.props.item,
      active: this.props.clickedEvent, 
    };

  }

  // handles the click event for eventBlock
  handleEventTime() {
    this.props.onChangeEvent(this.state.item.time, this.state.item.id);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      active: nextProps.clickedEvent, 
    });
  }

  render() {
    const time = this.state.item.time.toLocaleTimeString();
    const date = new Intl.DateTimeFormat("en-US").format(new Date(this.state.item.time));
    let classes = ClassNames({
      'col-md-12 eventBlock': true,
      'clickedEventBlock': this.state.active,
      // 'btn-over': !this.state.isPressed && this.state.isHovered
    });
    return (
      <div className="col-md-4">
        <div className={classes} onClick={() => this.handleEventTime()}>
          <h5 className="eventName">{this.state.item.name}</h5>
          <p className="eventDesc">{this.state.item.desc}</p>
          <p className="eventDate">{`${date} @ ${time}`}</p>
          <p className="eventAddressName">{this.state.item.eventAdressName}</p>
          <p className="eventAddressLoc">{this.state.item.eventAdressLocation}</p>
          {this.state.item.snapCode.map((snap, key)=> 
            <img key={key} className="eventSnapCode" src ={snap.code} />
          )}
        </div>
      </div>
    )
  }
}

TrfsEventBlock.propTypes = propTypes;