import React from 'react';
import Image from './Image.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const $ = require('jquery');
const Slider = require("react-slick");

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
    var settings = {
      autoplay: true,
      autoplaySpeed: 4000,
      centerMode: true,
      cssEase: 'linear',
      dots: false,
      arrows: false,
      draggable: false,
      fade: true,
      infinite: true,
      speed: 500,
      swipe: false,
      touchMove: false,
      swipeToSlide: false,
      slickGoTo: 0
    };
    
    return <Slider {...settings} className="image-carousel">{
          this.getImages().map(a => <div key={a.id} className="carousel-item"><Image maxWidth={this.state.maxWidth} maxHeight={this.state.maxHeight} image={a} /></div>)
      }</Slider>;
  }
});