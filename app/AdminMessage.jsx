import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  acceptMessage: function(id) {$.ajax({
    data: {message: id, status: 1},
    method: 'POST',
    url: 'api/message'
  })},
  rejectMessage: function(id) {
    $.ajax({
    data: {message: id, status: 2},
    method: 'POST',
    url: 'api/message'
  })},
  getDate: function() { return new Date(this.props.message.date); },
  mixins: [PureRenderMixin],
  render: function() {
      return <li className="message">
        <div>{this.props.message.msg}</div>
        <div className="message-date">
   <button className="msgbtn btn btn-danger" onClick={(event)=>this.rejectMessage(this.props.message.id)}>Reject</button>
          <button className="msgbtn btn btn-success" onClick={(event)=>this.acceptMessage(this.props.message.id)}>Accept</button>
                    {this.getDate().toLocaleTimeString()}</div>
      </li>;
  }
});
