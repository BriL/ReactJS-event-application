import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ClassNames from 'classnames'
 
const propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number   
}
 
const defaultProps = {
  initialPage: 1
}
 
export default class TrfsEventPagination extends Component {
  constructor(props) {
    super(props)
    this.state = { pager: {}, isMobile: this.getDimensions() }

    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    // set the width and height to the state.
    this.setState({ isMobile: this.getDimensions() })
    let page = (this.state.pager.currentPage == undefined) ? this.props.initialPage : this.state.pager.currentPage
    // sets the initial page to the state.
    this.setPage(page)
  }

  getDimensions(){
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth
    // return whether the screen is mobile width.
    return (width <= 991) ? true : false
  }

  componentWillMount() {
    // update the screen dimensions
    this.updateDimensions()
  }

  componentDidMount() {
    // event listner to check the screens size
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillUnmount() {
    // remove event listener
    window.removeEventListener("resize", this.updateDimensions)
  }

  shouldComponentUpdate(nextProps, nextState) {
    // check to see if the mobile flag has changed or the pager current page changes
    if ((this.state.isMobile !== nextState.isMobile) || (this.state.pager.currentPage !== nextState.pager.currentPage)) {
      return true
    }
    // return false otherwise
    return false
  }

  setPage(page = this.props.initialPage) {
    // set the var from the prop and state.
    var items = this.props.items
    var pager = this.state.pager   
    if (page < 1 || page > pager.totalPages) {
      return
    }
    // get new pager object for specified page
    pager = this.getPager(items.length, page)
    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1)
    // update state
    this.setState({ pager: pager })
    // call change page function in parent component
    this.props.onChangePage(pageOfItems) 
  }
 
  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    const initialStartPage = 1
    currentPage = currentPage || initialStartPage
    // checks the size of the screen to dynamically set the count of items per page.
    const initialPageSize = (this.state.isMobile) ? 1 : 3
    pageSize = pageSize || initialPageSize
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize)
    let startPage, endPage
    if (totalPages <= initialPageSize) {
      // less than 3 total pages so show all
      startPage = initialStartPage
      endPage = totalPages
    }
    else {
      // more than 3 total pages so calculate start and end pages
      if (currentPage <= (initialPageSize - initialStartPage)) {
        startPage = initialStartPage
        endPage = initialPageSize
      } 
      else if (currentPage + (initialPageSize + initialStartPage) >= totalPages) {
        startPage = totalPages - (initialPageSize - initialStartPage)
        endPage = totalPages
      } 
      else {
        startPage = currentPage - (initialPageSize + (initialStartPage + initialStartPage))
        endPage = currentPage + (initialPageSize + initialStartPage)
      }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - initialStartPage) * pageSize
    const endIndex = Math.min(startIndex + pageSize - initialStartPage, totalItems - initialStartPage)
    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + initialStartPage)
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    }
  }
 
  render() {
    var pager = this.state.pager
    let isFirstDisabled = ClassNames({'disabled': pager.currentPage === 1})
    let isLastDisabled = ClassNames({'disabled': pager.currentPage === pager.totalPages})
    return (
      <div>
      <ul className="pagination eventPagination">
        <li className={`firstPagination ${isFirstDisabled}`}>
          <a onClick={() => this.setPage(1)}><i className="fa fa-angle-double-left" aria-hidden="true"></i></a>
        </li>
        <li className={`previousPagination ${isFirstDisabled}`}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
        </li>
        { !this.state.isMobile && 
          pager.pages.map((page, index) => {
            let pageActiveClass = ClassNames({'active': pager.currentPage === page})
            return (
              <li key={index} className={`currentPagination ${pageActiveClass}`}>
                <a onClick={() => this.setPage(page)}>{page}</a>
              </li>
            )
          })
        }
        <li className={`nextPagination ${isLastDisabled}`}>
          <a onClick={() => this.setPage(pager.currentPage + 1)}><i className="fa fa-angle-right" aria-hidden="true"></i></a>
        </li>
        <li className={`lastPagination ${isLastDisabled}`}>
          <a onClick={() => this.setPage(pager.totalPages)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></a>
        </li>
      </ul>
      </div>
    )
  }
}
 
TrfsEventPagination.propTypes = propTypes
TrfsEventPagination.defaultProps