import React from 'react';
import Announcement from './Announcement.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  getAnnouncements: function() {
    return this.props.announcements || [];
  },
  render: function() {
	return <ul>{
        this.getAnnouncements().map(a => <Announcement key={a.id} announcement={a} />)
    }</ul>;
  }
});