import React from 'react';
import Message from './Message.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  getMessages: function() {
    return this.props.messages || [];
  },
  render: function() {
	return <ul className="list-unstyled">{
        this.getMessages().map(a => <Message key={a.id} message={a} />)
    }</ul>;
  }
});