import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'

const propTypes = {
  name: PropTypes.string.isRequired,
  location: PropTypes.objectOf(PropTypes.number).isRequired
}

export default class TrfsEventGoogleMap extends Component {
  constructor(props) {
    // props set in trfsEventApp.js
    super(props)
    this.state = {
      name: this.props.name,
      location: this.props.location 
    }
  }

  componentDidMount() {
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.infoWindow = this.createInfoWindow()
  }

  createMarker() {
    return new google.maps.Marker({
      position: this.state.location,
      map: this.map
    })
  }

  createInfoWindow() {
    let contentString = `<div class='InfoWindow'>${this.state.name}</div>`
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
  }

  createMap() {
    let mapOptions = {
      zoom: 14,
      center: this.state.location,
      gestureHandling: "none",
      backgroundColor: "#999",
      zoomControl: false,
      scaleControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
    }
    return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  handleMapClick() {
    // open the link in google maps or browser depending on device
    window.open(`http://maps.apple.com/?q=${this.state.location.lat},${this.state.location.lng}`,"_self")
  }

  render(){
    return(
      <div className="eventMapContainer" onClick={() => this.handleMapClick()}>
        <div className="eventAddress" ref="mapCanvas"></div>
      </div>
    )
  }
}

TrfsEventGoogleMap.propTypes = propTypes