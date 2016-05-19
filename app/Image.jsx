import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  getDate: function() { return new Date(this.props.image.date); },
  mixins: [PureRenderMixin],
  render: function() {
      this.imageId = this.props.image.id;
      const divStyle = {
        width: this.props.maxWidth,
        textAlign: "center"
      }
      const imgStyle = {
        maxWidth: this.props.maxWidth,
        maxHeight: this.props.maxHeight,
        margin: "0 auto"
      };
      const rotation = this.props.image.rotation || 0;
      return <div className="carousel-itemx">
        <div className="subdiv" style={divStyle}><img style={imgStyle} className={"subimage c"+this.props.image.id} src={"subimage/" + this.props.image.filename + "?" + rotation}></img></div>
        <div className="message-date">{this.getDate().toLocaleTimeString()}</div>
      </div>;
  }
});
