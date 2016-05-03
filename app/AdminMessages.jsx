import React from 'react';
import AdminMessage from './AdminMessage.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  getMessages: function() {
    return this.props.messages || [];
  },
  render: function() {
	return <ul className="list-unstyled">{
        this.getMessages().map(a => <AdminMessage key={a.id} message={a} />)
    }</ul>;
  }
});