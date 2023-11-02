import React, { Component, createRef } from "react";

class IframeComponent extends Component {
  iframeRef = createRef();

  componentDidMount() {
    this.addClickEventListener();
  }

  componentWillUnmount() {
    this.removeClickEventListener();
  }

  addClickEventListener = () => {
    const iframeDocument = this.iframeRef.current?.contentDocument;
    if (iframeDocument) {
      console.log("Agregando event listener para click");
      iframeDocument.addEventListener('click', this.recordClick);
    }
  };
  
  removeClickEventListener = () => {
    const iframeDocument = this.iframeRef.current?.contentDocument;
    if (iframeDocument) {
      console.log("Eliminando event listener para click");
      iframeDocument.removeEventListener('click', this.recordClick);
    }
  };
  

  handleIframeLoad = () => {
    this.addClickEventListener();
  };

  render() {
    return (
      <iframe
        src={this.props.src}
        ref={this.iframeRef}
        onLoad={this.handleIframeLoad}
        title="Iframe Component"
      />
    );
  }
}

export default IframeComponent;
