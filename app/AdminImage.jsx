import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  acceptImage: function(id) {$.ajax({
    data: {image: id, status: 1},
    method: 'POST',
    url: 'api/image'
  })},
  rejectImage: function(id) {
    $.ajax({
    data: {image: id, status: 2},
    method: 'POST',
    url: 'api/image'
  })},
  rotateImage: function(id, rotation) {
    $.ajax({
      data: {image: id, rotation: rotation},
      method: "POST",
      url: "api/image"
    });
  },
  getDate: function() { return new Date(this.props.image.date); },
  mixins: [PureRenderMixin],
  render: function() {
      this.imageId = this.props.image.id;
      var divStyle = {
        width: this.props.maxWidth,
        textAlign: "center"
      }
      var imgStyle = {
        maxWidth: this.props.maxWidth,
        maxHeight: this.props.maxHeight,
        margin: "0 auto"
      };
      var rotation = this.props.image.rotation || 0;
      
      return <div className="carousel-itemx">
        <div className="subdiv" style={divStyle}>
          <img style={imgStyle} src={"subimage/" + this.props.image.filename + "?" + rotation}></img>
          <div className="image-overlay">
            <button className="button-accept btn-lg btn-success" onClick={(event)=>this.acceptImage(this.props.image.id)}>Accept</button>
            <button className="button-left btn btn-default" onClick={(event)=>this.rotateImage(this.props.image.id, "left")}>CCW</button>
            <button className="button-right btn btn-default" onClick={(event)=>this.rotateImage(this.props.image.id, "right")}>CW</button>
            <button className="button-reject btn btn-danger" onClick={(event)=>this.rejectImage(this.props.image.id)}>Reject</button>
          </div>
        </div>
        <div className="message-date">{this.getDate().toLocaleTimeString()}</div>
      </div>;
  }
});
