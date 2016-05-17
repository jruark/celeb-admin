import React from 'react';
import Announcements from './Announcements.jsx';
import Messages from './Messages.jsx';
import Images from './Images.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
const $ = require('jquery');

export const Kiosk = React.createClass({
  getInitialState: function() {
    return {clockset:false};
  },
  updateHeights: function() {
    function formatTimeHHMMA(d) {
      function z(n){return (n<10?'0':'')+n}
      var h = d.getHours();
      return (h%12 || 12) + ':' + z(d.getMinutes()) + ' ' + (h<12? 'AM' :'PM');
    } 
   
    let fixedHeight = 0;
    $(".fixed-height").each(function() {
      fixedHeight += $(this).height();
    });
    $(".remainder-height").height(window.innerHeight - fixedHeight);
   
    if(!this.state.clockset) { 
      const dt1 = new Date();
      $(".clock").text(formatTimeHHMMA(dt1));
      window.setInterval(function() {
        let dt = new Date();
        var x = formatTimeHHMMA(dt);
        $(".clock").text(x);
      }, 5000);
      this.setState({clockset:true});
    }
    
    
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
    <div className='row fixed-height'><div className='header col-md-12'>
      <h2><img src="images/logo.png" width="30" height="30" />Celebration!<div className='clock'></div></h2>
    </div></div>
    <div className='row remainder-height'>
      <div className='messages col-md-6'>
        <h3>Your Messages</h3>
        <Messages messages={this.props.Messages} />
      </div>
      <div className='images col-md-6'>
        <h3>Your Pictures</h3>
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
