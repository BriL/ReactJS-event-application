import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ClassNames from 'classnames';
 
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
    super(props);
    this.state = { pager: {} };
  }

  componentWillMount() {
    this.setPage(this.props.initialPage);
  }

  setPage(page = this.props.initialPage) {
    var items = this.props.items;
    var pager = this.state.pager;   
    if (page < 1 || page > pager.totalPages) {
        return;
    }
    // get new pager object for specified page
    pager = this.getPager(items.length, page);
    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    // update state
    this.setState({ pager: pager });
    // call change page function in parent component
    this.props.onChangePage(pageOfItems); 
  }
 
  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;
    // default page size is 3
    pageSize = pageSize || 3;
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;
    if (totalPages <= 3) {
      // less than 3 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } 
    else {
      // more than 3 total pages so calculate start and end pages
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3;
      } 
      else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } 
      else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);
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
    };
  }
 
  render() {
    var pager = this.state.pager;
    let isFirstDisabled = ClassNames({'disabled': pager.currentPage === 1});
    let isLastDisabled = ClassNames({'disabled': pager.currentPage === pager.totalPages});
    return (
      <ul className="pagination eventPagination">
        <li className={`firstPagination ${isFirstDisabled}`}>
          <a onClick={() => this.setPage(1)}>First</a>
        </li>
        <li className={`previousPagination ${isFirstDisabled}`}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
        </li>
         {pager.pages.map((page, index) =>
          <li key={index} className={`currentPagination ${ClassNames({'active': pager.currentPage === page})}`}>
            <a onClick={() => this.setPage(page)}>{page}</a>
          </li>
        )}
        <li className={`nextPagination ${isLastDisabled}`}>
          <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
        </li>
        <li className={`lastPagination ${isLastDisabled}`}>
          <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
        </li>
      </ul>
    )
  }
}
 
TrfsEventPagination.propTypes = propTypes;
TrfsEventPagination.defaultProps