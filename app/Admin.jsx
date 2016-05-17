import React from 'react';
import Announcements from './Announcements.jsx';
import AdminMessages from './AdminMessages.jsx';
import AdminImages from './AdminImages.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
const $ = require('jquery');

export const Admin = React.createClass({
  updateHeights: function() {
    let fixedHeight = 0;
    $(".fixed-height").each(function() {
      fixedHeight += $(this).height();
    });
    $(".remainder-height").height(window.innerHeight - fixedHeight);
    
    const dt1 = new Date();
    $(".clock").text(dt1.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
    window.setInterval(function() {
      let dt = new Date();
      var x = dt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      $(".clock").text(x);
     }, 5000);
    
    
  },
  mixins: [PureRenderMixin],
  componentDidMount: function() {
    this.updateHeights();
  },
  componentDidUpdate: function() {
    this.updateHeights();
  },
  render: function() {
	return <div className='container-fluid'>
    <div className='row fixed-height'><div className='admin-header col-md-12'><h2>Celebration Social Administration<div className='clock'></div></h2></div></div>
    
    <div className='row remainder-height'>
      <div className='admin-messages col-md-6'>
        <h3>Pending Messages</h3>
        <AdminMessages messages={this.props.Messages} />
      </div>
      <div className='admin-images col-md-6'>
        <h3>Pending Pictures</h3>
        <AdminImages images={this.props.Images} />
      </div>
    </div>
  </div>;
  }
});

function mapStateToProps(state) {
  return state.toJS();
}

export const AdminContainer = connect(mapStateToProps)(Admin);
