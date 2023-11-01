import React from 'react';

class IframeComponent extends React.Component {
  render() {
    return (
      <iframe
        title="myIframe"
        src={this.props.src}
        width="100%"
        height="500px"
        frameBorder="0"
      ></iframe>
    );
  }
}

export default IframeComponent;
