import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Axios from 'axios'
import TrfsEventCountDown from './TrfsEventCountDown'
import TrfsEventBlock from './TrfsEventBlock'
import TrfsEventFilter from './TrfsEventFilter'
import TrfsEventPagination from './TrfsEventPagination'

export default class TrfsEventApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      clickedEventTime: new Date(16, 1), // date in the past
      activeKey: 0,
      pageOfItems: []
    }

    // bind this to the event handler
    this.onChangePage = this.onChangePage.bind(this)
    this.changeEventTime = this.changeEventTime.bind(this)
  }

  componentDidMount() {
    // fetching json event data from drupal api endpint
    Axios.get(`/api/v1.0/events`)
      .then(result=> {
        // normalize the data and get the latitude and longitude for the addresses
        const normalizedData = this.normalizeData(result.data)
        this.createLatLng(normalizedData)
      }) // end fetch
      .catch(function (error) {
        // just log the error for now.
        console.log(error)
      }) // end catch
  }

  normalizeData(result) {
    const normalizedData = []
    result.data
      // sort to show the featured events first by time.
      .sort((x,y)=> {
        const n = y.featured - x.featured
        if (n !== 0) { return n }
        return x.time - y.time
      })
      // looping through the json data to save the relavant information
      .forEach((data, key) => {
        if (!normalizedData[key]) {
          // intializing arrays to be inremented below
          normalizedData[key] = []
          if (!normalizedData[key]['snapCode']) {
            normalizedData[key]['snapCode'] = []
          }
        }
        normalizedData[key]['id'] = data.id
        normalizedData[key]['name'] = data.name
        normalizedData[key]['desc'] = data.desc
        normalizedData[key]['time'] = new Date(data.time*1000)
        normalizedData[key]['featured'] = data.featured
        normalizedData[key]['type'] = data.type
        // return either address location or social media info depending on the type of event the item is.
        if(normalizedData[key]['type'] == '1'){
          normalizedData[key]['eventAdressName'] = data.eventAdress.field_trfs_event_address_name.und[0].safe_value
          normalizedData[key]['eventAdressLocation'] =  data.eventAdress.field_trfs_event_address_loc.und[0].safe_value
        }
        else if(normalizedData[key]['type'] == '2'){
          data.eventSocialMedia.map(item=> {
            normalizedData[key]['snapCode'].push({
              code: item.field_event_snapcode.und[0].full_url
            })
          }) // end map
        }
      }) // end fetch
    // return normalized data
    return normalizedData
  }

  createLatLng(data) {
    let promises = []
    // loop through each data object and pull out the address
    data.forEach(singleElement => {
      if (singleElement.type == 1) {
        // format the address for the URL
        const jsonAddress = singleElement.eventAdressLocation.split(' ').join('+')
        // get a list of promises for the address 
        promises.push(Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${jsonAddress}&key=AIzaSyC2qlk1yCmaham5zCSFcsWpV7twj04tFWU`))
      }
    })
    // retrieve all the data from the promises
    Axios.all(promises)
      .then(results => {
        // loop through the promise results and data
        let i = 0
        data.forEach((item, key) => {
          if (item.type == 1) {
            // add the updated location data to the items
            data[key].eventAdressLocation = results[i].data.results[0].geometry.location
            i++
          }
        })
        // set the state of the items
        this.setState({ items: data })
      })
  }

  // handler for when the event block is clicked
  changeEventTime(time, key) {
    this.setState({ 
      clickedEventTime: time,
      activeKey: key
    })
  }

  // handler for when the pagination is changed
  onChangePage(pageOfItems) {
    // update state with new page of items
    // bind the first item time to the first event time state
    this.setState({ 
      pageOfItems: pageOfItems,
      clickedEventTime: pageOfItems[0].time,
      activeKey: pageOfItems[0].id
    })
  }

  render(){
    return (
      <div className="events-interface">
        <h1>Upcoming Events</h1>
        <TrfsEventCountDown eventTime={this.state.clickedEventTime} />
        <div className="row">
          {
            this.state.pageOfItems.map((item, key)=> {
              let clicked = (this.state.activeKey == item.id) ? true : false
              return <TrfsEventBlock 
                        clickedEvent={clicked} 
                        item={item} 
                        key={item.id} 
                        onChangeEvent={this.changeEventTime} />
            }) // end map
          }
        </div>
        <div className="row">
          <div className="eventPaginationWrapper">
             {this.state.items.length ? (
                <TrfsEventPagination items={this.state.items} onChangePage={this.onChangePage} />
              ) : (
                <div className="eventLoad"><h2>Loading Events.......</h2></div>
              )}
          </div>
        </div>
      </div>
    )
  }
}