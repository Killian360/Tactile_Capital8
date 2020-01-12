import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'
import Slider from 'react-slick'
import SVG from 'react-inlinesvg'
import chunk from 'lodash.chunk'

import Layout from '../../layouts'

import Plan3D from '../../components/Plan3D'

import '../../styles/Page.scss'

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blocksToCompleteLine: 0
    };
  }

  static async getInitialProps({ query }) {
    const { type, slug } = query;

    const res = await fetch(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/${type}?slug=${slug}`);
    const page = await res.json();

    return { query, page: page[0] };
  }

  fetchData(locale) {
    const { page, query: { type } } = this.props;
    const that = this;

    axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/${type}?exclude=${page.id}&filter[lang]=${locale}`)
      .then((function (pages) {
        that.setState({
          pages: pages.data,
          blocksToCompleteLine: chunk([1, 2], pages.data.length % 3)
        });
      }));
  }

  calculateBlockToCompleteLine() {
    if(window.innerWidth < 768) {
      this.setState({blocksToCompleteLine: chunk([1], this.state.pages.length % 2)});
    } else {
      this.setState({blocksToCompleteLine: chunk([1, 2], this.state.pages.length % 3)});
    }
  }

  componentDidMount() {
    const that = this;

    this.fetchData(this.props.locale);

    window.addEventListener('resize', function() {
      that.calculateBlockToCompleteLine();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.query.slug !== prevProps.query.slug || this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  render() {
    const { blocksToCompleteLine, pages } = this.state;
    const { page } = this.props;

    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      autoplay: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <React.Fragment>
        <div id="trigger" />
        <div className="Page">
          <div className="Page-header">
            <div className="Page-header-slider-wrapper">
              <Slider {...settings} className="Page-header-slider">
                {page.acf.slider.map((image, index) => (
                  <div key={index} className="Page-header-slide">
                    <div style={{backgroundImage: "url(" + image.image.url + ")"}}>
                      <p>&nbsp;</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="Page-header-content">
              <div className="Page-intro fadeout">
                <h2 className="Page-intro-title bold">{page.title.rendered}</h2>
              </div>

              <div className="Page-header-text fadein">
                <h2 className="Page-header-title bold">{page.title.rendered}</h2>
                <div className="Page-header-description" dangerouslySetInnerHTML={{__html: page.content.rendered}}></div>
              </div>
            </div>

            <SVG
              src="/assets/svgs/mouse.svg"
              className="Page-header-icon"
              style={{ fill: "#fff" }}
             />
          </div>

          {page.acf['block_image'] &&
            <React.Fragment>
              {page.acf['block_image'].map((image, index) => (
                <div className="Page-image" key={index}>
                  <img src={image.image.url} alt={image.image.alt} />
                </div>
              ))}
            </React.Fragment>
          }

          {page.acf['block_image_text'].length &&
            <React.Fragment>
              {page.acf['block_image_text'].map((item, key) => (
                <div className="Page-header no-animation" key={key}>
                  <Slider {...settings} className="Page-header-slider">
                    {item.slider.map((image, index) => (
                      <div key={index} className="Page-header-slide">
                        <div style={{backgroundImage: "url(" + image.image.url + ")"}}>
                          <p>&nbsp;</p>
                        </div>
                      </div>
                    ))}
                  </Slider>

                  <div className="Page-header-content">
                    <div className="Page-header-text">
                      {page.acf.isNumbered &&
                        <div>
                          <p className="Page-header-number thin">{("0" + (key+1)).slice(-2)}</p>
                        </div>
                      }
                      <h2 className="Page-header-title bold">{item.title}</h2>
                      <div className="Page-header-description" dangerouslySetInnerHTML={{__html: item.description}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          }

          {page.acf['block_text_title'] &&
            <div className="Page-blockText">
              <div className="Page-blockText-wrapper">
                <div className="Page-blockText-title">
                  <img src={page.acf['block_text_icon'].url} className="Page-blockText-icon" alt="" />
                  <h3 className="Page-blockText-titleText bold">{page.acf['block_text_title']}</h3>
                </div>
                <div className="Page-blockText-timing">
                  {page.acf['block_text_labels'].map((label, index) => (
                    <p className="Page-blockText-time bold" key={index}>{label.label}</p>
                  ))}
                </div>
              </div>
            </div>
          }

          {page.acf['3D_images'] &&
            <Plan3D title={page.acf['3D_title']} images={page.acf['3D_images']} />
          }

          {pages &&
            <div className="Page-otherSections">
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.acf.slider[0].image &&
                    <Link href="/[type]/[slug]" as={`/${page.type}/${page.slug}`}>
                      <div className="Page-otherSection" style={{backgroundImage: "url(" + page.acf.slider[0].image.url + ")", backgroundSize: "cover"}}>
                        <div className="Page-otherSection-overlay">
                          <SVG
                            src="/assets/svgs/arrow-next.svg"
                            style={{ fill: "#fff" }}
                           />
                        </div>
                        <div className="Page-otherSection-content">
                          <p className="Page-otherSection-subtitle">{page.acf.subtitle}</p>
                          <h2 className="Page-otherSection-title bold">{page.title.rendered}</h2>
                        </div>
                      </div>
                    </Link>
                  }
                </React.Fragment>
              ))}
              {blocksToCompleteLine.map((page, index) => (
                <div className={`Page-otherSection empty-${index+1}`} key={pages.length + index}></div>
              ))}
              <div className="clear"></div>
            </div>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default Page
