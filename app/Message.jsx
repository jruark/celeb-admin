import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  getDate: function() { return new Date(this.props.message.date); },
  mixins: [PureRenderMixin],
  render: function() {
      return <li className="message">
        <div>{this.props.message.msg}</div>
        <div className="message-date">{this.getDate().toLocaleTimeString()}</div>
      </li>;
  }
});
