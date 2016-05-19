import React from 'react';
import Image from './Image.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const $ = require('jquery');

export default React.createClass({
  getInitialState: function() {
    return { maxWidth: 0, maxHeight: 0, intervalId: 0, currentImgFile: "" };
  },
  componentWillUnmount: function() {
    const iid = this.state.intervalId;
    if(iid) {
      window.clearInterval(iid);
    }
  },
  componentDidMount: function() {
    const _ = this;
    let intervalId = this.state.intervalId;
    if( !intervalId ) {
      intervalId = window.setInterval(function() { _.nextImage(); }, 5000);
    }
    window.setTimeout(function() {
      const carousel = $(".image-carousel");
      const totalWidth = carousel.width();
      const totalHeight = carousel.height();
      const maxHeight = totalHeight - 100;
      const maxWidth = totalWidth;
      _.setState({maxWidth: maxWidth, maxHeight: maxHeight, intervalId: intervalId});
      _.nextImage();
    }, 100);
  },
  mixins: [PureRenderMixin],
  getImages: function() {
    return this.props.images || [];
  },
  nextImage: function() {
    const images = this.getImages();
    const currFile = this.state.currentImgFile;
    let next = 0;
    if(currFile) {
      for(let i=0;i<images.length;++i) {
        if(currFile===images[i].filename) {
          next=i+1;
          break;
        }
      }
    }
    if(next>=images.length) next=0;
    const nextFile = images.length>0 ? images[next].filename : "";
    //console.log("nextImage: images.length=" + images.length + ", current=" + currFile + ", next=" + nextFile + ", time=" + Date.now());
    if(nextFile!==currFile) {
      this.setState({currentImgFile: nextFile});
    }
  },
  render: function() {
    const current = this.state.currentImgFile;
    return <div className="image-carousel">{
          this.getImages().map((a,index) => 
            <div key={a.id} className="carousel-item" style={{ display: a.filename===current ? "block" : "none" }}>
              <Image maxWidth={this.state.maxWidth} maxHeight={this.state.maxHeight} image={a} />
            </div>)
      }</div>;
  }
});