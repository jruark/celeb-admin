import React from 'react';
import Announcements from './Announcements.jsx';
import Messages from './Messages.jsx';
import Images from './Images.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
const $ = require('jquery');

export const Kiosk = React.createClass({
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
    <div className='row fixed-height'><div className='header col-md-12'><h2>Celebration!<div className='clock'></div></h2></div></div>
    <div className='row fixed-height'><div className='announcements col-md-12'><h3>Announcements</h3><Announcements announcements={this.props.announcements} /></div></div>
    
    <div className='row remainder-height'>
      <div className='messages col-md-6'>
        <h3>Your Messages</h3>
        <p>Go to http://someurl/ to type a message!</p>
        <Messages messages={this.props.Messages} />
      </div>
      <div className='images col-md-6'>
        <h3>Your Pictures</h3>
        <p>Go to http://someurl/ to submit a picture!</p>
        <Images images={this.props.Images} />
      </div>
    </div>
  </div>;
  }
});

function mapStateToProps(state) {
  return state.toJS();
}

export const KioskContainer = connect(mapStateToProps)(Kiosk);
