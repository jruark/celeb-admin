import React from 'react';
import AdminImage from './AdminImage.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const $ = require('jquery');

export default React.createClass({
  getInitialState: function() {
    return { maxWidth: 0, maxHeight: 0 };
  },
  componentDidMount: function() {
    const _ = this;
    window.setTimeout(function() {
      const carousel = $(".image-carousel");
      const totalWidth = carousel.width();
      const totalHeight = carousel.height();
      const maxHeight = totalHeight - 100;
      const maxWidth = totalWidth;
      _.setState({maxWidth: maxWidth, maxHeight: maxHeight});
    }, 100);
  },
  mixins: [PureRenderMixin],
  getImages: function() {
    return this.props.images || [];
  },
  render: function() {
    return <div className="image-carousel">{
          this.getImages().map(a => <div key={a.id} className="carousel-item"><AdminImage maxWidth={this.state.maxWidth} maxHeight={this.state.maxHeight} image={a} /></div>)
      }</div>;
  }
});

