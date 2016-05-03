import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  getDate: function() { return new Date(this.props.image.date); },
  mixins: [PureRenderMixin],
  componentDidMount() {
    let imageId = this.imageId;
  },
  componentWillUnmount() {
  },
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
      return <div className="carousel-itemx">
        <div className="subdiv" style={divStyle}><img style={imgStyle} className={"subimage c"+this.props.image.id} src={"subimage/" + this.props.image.filename}></img></div>
        <div className="message-date">{this.getDate().toLocaleTimeString()}</div>
      </div>;
  }
});
