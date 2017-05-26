import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class TrfsEventFilter extends Component {

  constructor(props) {
    // props set in trfsEventApp.js
    super(props);
    this.state = {
      items: this.props.items,
    };
  }

  render() {
    const location = this.props.items
      .map(({eventAdressName, eventAdressLocation}, i) => <option key={i}>{`${eventAdressName} - ${eventAdressLocation}`}</option>);
    const items = this.props.items
      .filter(({featured}) => featured)
      .map(({name}, i) => <option key={i}>{name}</option>);


    return (
      <div>
      <div className="Search">
        <select>{location}</select>
        <select>{items}</select> 
        <select>
          <option>All</option>
          <option>Only Featured</option>
          <option>Non- Featured</option>
        </select>   
      </div>
      <div className="input-group-btn">
          <button type="button" className="btn btn-primary dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort by: <span className="caret"></span></button>
              <ul className="dropdown-menu dropdown-menu-left">
                  <li><a href="#" id="petName">Featured</a></li>
                  <li><a href="#" id="aptDate">Date</a></li>
                  <li><a href="#" id="ownerName">Location</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#" id="asc">Asc</a></li>
                  <li><a href="#" id="desc">Desc</a></li>
              </ul>
      </div>
      <div className="input-group-btn">
          <button type="button" className="btn btn-primary dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort by: <span className="caret"></span></button>
              <ul className="dropdown-menu dropdown-menu-right">
                  <li><a href="#" id="petName" onClick={ this.handleSort }>Pet Name { (this.props.orderBy === 'petName') ? <span className="glyphicon glyphicon-ok"></span>: null }</a></li>
                  <li><a href="#" id="aptDate" onClick={ this.handleSort }>Date { (this.props.orderBy === 'aptDate') ? <span className="glyphicon glyphicon-ok"></span>: null }</a></li>
                  <li><a href="#" id="ownerName" onClick={ this.handleSort }>Owner { (this.props.orderBy === 'ownerName') ? <span className="glyphicon glyphicon-ok"></span>: null }</a></li>
                  <li role="separator" className="divider"></li>
                  <li><a href="#" id="asc" onClick={ this.handleOrder }>Asc { (this.props.orderDir === 'asc') ? <span className="glyphicon glyphicon-ok"></span>: null }</a></li>
                  <li><a href="#" id="desc" onClick={ this.handleOrder }>Desc { (this.props.orderDir === 'desc') ? <span className="glyphicon glyphicon-ok"></span>: null }</a></li>
              </ul>
      </div>
      </div>
    )
  }

}