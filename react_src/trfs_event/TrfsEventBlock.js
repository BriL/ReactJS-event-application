import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import TrfsEventGoogleMap from './TrfsEventGoogleMap'

const propTypes = {
  clickedEvent: PropTypes.bool.isRequired,
  item: PropTypes.array.isRequired,
  onChangeEvent: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
}

export default class TrfsEventBlock extends Component {
  constructor(props) {
    // props set in trfsEventApp.js
    super(props)
    this.state = {
      item: this.props.item,
      isActive: this.props.clickedEvent,
      itemCount: this.props.itemCount
    }
  }

  // handles the click event for eventBlock
  handleEventTime() {
    this.props.onChangeEvent(this.state.item.time, this.state.item.id)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      isActive: nextProps.clickedEvent, 
    })
  }

  render() {
    const time = this.state.item.time.toLocaleTimeString()
    const date = new Intl.DateTimeFormat("en-US").format(new Date(this.state.item.time))
    let blockClasses = ClassNames({
      'col-md-4': true,
      'col-md-offset-4': this.state.itemCount == 1,
      'col-md-offset-2': this.state.itemCount == 2
    })
    let classes = ClassNames({
      'col-sm-12 eventBlock': true,
      'clickedEventBlock': this.state.isActive,
      // 'btn-over': !this.state.isPressed && this.state.isHovered
    })
    return (
      <div className={blockClasses}>
        <div className={classes} onClick={() => this.handleEventTime()}>
          <h5 className="eventName">{this.state.item.name}</h5>
          {this.state.item.type == '1' ?
            <TrfsEventGoogleMap name={this.state.item.eventAdressName} location={this.state.item.eventAdressLocation} />
          : this.state.item.type == '2' ? 
            <div className="addressSnap">
              {this.state.item.snapCode.map((snap, key)=> 
                <a href={snap.url} target='_blank'><img key={key} className="eventSnapCode" src={snap.code} /></a>
              )}
            </div>
          : <div className="eventLocError"><p>Error occured when pulling in Location Data</p></div>}
          <div className="eventDescDate">
            <p className="eventDate">{`${date} @ ${time}`}</p>
            <p className="eventDesc">{this.state.item.desc}</p>
            {this.state.item.featured ?
              <p className="">FEATURED</p>
            : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

TrfsEventBlock.propTypes = propTypes