import React from 'react'
import Link from 'next/link'
import SVG from 'react-inlinesvg'
import Viewer from "./viewer";

import './Plan3D.scss'

class Plan3D extends React.Component {
  constructor(props) {
    super(props);
    this.images = [
      "/assets/images/3D/compress/R-1-min.png",
      "/assets/images/3D/compress/R-2-min.png",
      "/assets/images/3D/compress/R-3-min.png",
      "/assets/images/3D/compress/R-4-min.png",
      "/assets/images/3D/compress/R-5-min.png",
      "/assets/images/3D/compress/R-6-min.png",
      "/assets/images/3D/compress/R-7-min.png",
      "/assets/images/3D/compress/R-8-min.png",
      "/assets/images/3D/compress/R-9-min.png",
      "/assets/images/3D/compress/R-10-min.png",
      "/assets/images/3D/compress/R-11-min.png",
      "/assets/images/3D/compress/R-12-min.png",
      "/assets/images/3D/compress/R-13-min.png",
      "/assets/images/3D/compress/R-14-min.png",
      "/assets/images/3D/compress/R-15-min.png",
      "/assets/images/3D/compress/R-16-min.png",
      "/assets/images/3D/compress/R-17-min.png",
      "/assets/images/3D/compress/R-18-min.png",
      "/assets/images/3D/compress/R-19-min.png",
      "/assets/images/3D/compress/R-20-min.png",
      "/assets/images/3D/compress/R-21-min.png",
      "/assets/images/3D/compress/R-22-min.png",
      "/assets/images/3D/compress/R-23-min.png",
      "/assets/images/3D/compress/R-24-min.png",
      "/assets/images/3D/compress/R-25-min.png",
];

    this.state = { images: this.images };
  }

  // handleClick(direction, maxLength, event) {
  //   const currentIndex = this.state.isActive;
  //   let index = currentIndex;

  //   if(direction === "next") {
  //     index = (index === maxLength - 1) ? 0 : index + 1;
  //   }

  //   if(direction === "prev") {
  //     index = index === 0 ? maxLength - 1 : index - 1;
  //   }

  //   this.setState({isActive: index});
  // }

  render() {
    const { isActive } = this.state;
    const { title, images } = this.props;
    return (
      <div className="Plan3D">
        <div className="Plan3D-wrapper">
          <h3 className="Plan3D-title bold">{title}</h3>
          <div className="Plan3D-images">
          <SVG
            src="../../assets/svgs/swipe.svg"
            className="Plan3D-swipe-icon"
            style={{ fill: "#fff" }}
            />
          <Viewer images={this.state.images} />
          </div>
          <SVG
            src="../../assets/svgs/360.svg"
            className="Plan3D-caption"
            style={{ fill: "#fff" }}
            />
        </div>
        <div className="Plan3D_gradient"></div>
      </div>
    )
  }
}

export default Plan3D;
