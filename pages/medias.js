import React from 'react'
import fetch from 'isomorphic-unfetch'
import Slider from 'react-slick'
import SVG from 'react-inlinesvg'

import '../styles/Medias.scss'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <SVG
      src="/assets/svgs/arrow-next.svg"
      className={className}
      style={{ ...style, fill: "#fff", display: "block" }}
      onClick={onClick} />
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <SVG
      src="/assets/svgs/arrow-prev.svg"
      className={className}
      style={{ ...style, fill: "#fff", display: "block" }}
      onClick={onClick} />
  );
}

class Medias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  static async getInitialProps({ req }) {
    const res = await fetch(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/media?mediatags=13&per_page=99`)
    const json = await res.json()
    return { medias: json }
  }

  handleClick(index) {

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // if any scroll is attempted, set this to the previous value 
      window.onscroll = function () {window.scrollTo(scrollLeft, scrollTop)};

        if (index >= 0) {
          this.slider.slickGoTo(index, true);
          const that = this;
          setTimeout(function () {
            that.setState({ isOpen: !that.state.isOpen });
          }, 350);

        } else {
          window.onscroll = function() {}; 
          this.setState({ isOpen: !this.state.isOpen });
        }
    }

    render() {
      const { isOpen } = this.state;
      const { medias } = this.props;

      const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
      };

      return (
        <React.Fragment>
          <div className="Medias">
            {medias.map((media, index) => (
              <div key={index} className="Medias-item"  onClick={this.handleClick.bind(this, index)}>
                                <LazyLoadImage
                alt={media.alt}
                height="100%"
                effect="opacity"
                src={media.source_url} // use normal <img> attributes as props
                width="100%" />
              </div>
            ))}
            <div className="clear"></div>
          </div>

          <div className={`Modal-galery ${(isOpen ? 'open' : '')}`}>
            <div className="Modal-close" onClick={this.handleClick.bind(this)}>
              <SVG
                src="/assets/svgs/close.svg"
                style={{ fill: "#fff" }}
              />
            </div>
            <Slider {...settings} ref={slider => (this.slider = slider)}>
              {medias.map((media, index) => (
                <div key={index} className="Modal-slide">
                  <div style={{ backgroundImage: "url(" + media.source_url + ")" }}>
                    <p>&nbsp;</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </React.Fragment>
      )
    }
  }

  export default Medias
