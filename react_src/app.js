import React from 'react'
import ReactDOM from 'react-dom'
import TrfsEventApp from './trfs_event/TrfsEventApp'

// Renders the event block application if the element is on the page
if (document.getElementById('events-app') !== null) {
  ReactDOM.render(
    <TrfsEventApp />,
    document.getElementById('events-app')
  )
}