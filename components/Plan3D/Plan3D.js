import React from 'react'
import Link from 'next/link'
import SVG from 'react-inlinesvg'

import './Plan3D.scss'

class Plan3D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: 0
    };
  }

  handleClick(direction, maxLength, event) {
    const currentIndex = this.state.isActive;
    let index = currentIndex;

    if(direction === "next") {
      index = (index === maxLength - 1) ? 0 : index + 1;
    }

    if(direction === "prev") {
      index = index === 0 ? maxLength - 1 : index - 1;
    }

    this.setState({isActive: index});
  }

  render() {
    const { isActive } = this.state;
    const { title, images } = this.props;

    return (
      <div className="Plan3D">
        <div className="Plan3D-wrapper">
          <h3 className="Plan3D-title bold">{title}</h3>
          <div className="Plan3D-images">
            <div onClick={this.handleClick.bind(this, 'prev', images.length)} className="Plan3D-arrow-wrapper">
              <SVG
                src="../../assets/svgs/arrow-prev.svg"
                className="Plan3D-arrow Plan3D-arrow-prev"
                style={{ fill: "#fff" }} />
            </div>
            {images.map((image, index) => (
              <img src={image.image.url} alt={image.image.alt} key={index} className={`Plan3D-image ${(index === isActive) ? 'active' : ''}`}/>
            ))}
            <div onClick={this.handleClick.bind(this, 'next', images.length)} className="Plan3D-arrow-wrapper">
              <SVG
                src="../../assets/svgs/arrow-next.svg"
                className="Plan3D-arrow Plan3D-arrow-next"
                style={{ fill: "#fff" }} />
            </div>
          </div>
          <SVG
            src="../../assets/svgs/360.svg"
            className="Plan3D-caption"
            style={{ fill: "#fff" }}
            />
        </div>
      </div>
    )
  }
}

export default Plan3D;
