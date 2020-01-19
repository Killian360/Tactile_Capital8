import React from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import axios from 'axios'
import Slider from 'react-slick'
import SVG from 'react-inlinesvg'
import chunk from 'lodash.chunk'
import ScrollIndicatorComponent from '../../components/ScrollIndicator'
import Layout from '../../layouts'
import Router from 'next/router'

import Plan3D from '../../components/Plan3D'

import '../../styles/Page.scss'

import {
  TweenMax,
  Power1,
  TimelineMax,
  Linear
} from "gsap"

class Page extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      blocksToCompleteLine: 0,
      url: "undefined",
      as: "undefined",
      isLoading:true
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.Reroute = this.Reroute.bind(this);
  }
  
  static async getInitialProps({ query }) {
    const { type, slug } = query;

      const res = await fetch(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/${type}?slug=${slug}`);
      const page = await res.json();
    //   axios({
    //     method: 'get',
    //     responseType: 'json',
    //     url: `http://admincapital8.tactile-communication.com/wp-json/wp/v2/${type}?slug=${slug}`,
    // })
    //     .then(response => {
    //         self.setState({
    //             items2: response ,
    //             isLoading: false
    //         });
    //         console.log("Asmaa Almadhoun *** : " + self.state.items2);
    //         return { query, page: self.state.items2[0] };

    //     })
    //     .catch(error => {
    //         console.log("Error *** : " + error);
    //     });
        return { query, page: page[0]};
}

  calculateBlockToCompleteLine() {
    if(window.innerWidth < 768) {
      this.setState({blocksToCompleteLine: chunk([1], this.state.pages.length % 2)});
    } else {
      this.setState({blocksToCompleteLine: chunk([1, 2], this.state.pages.length % 3)});
    }
  }

componentDidMount(){

     // prevent state error on unmounted component
    this._isMounted = true;
   
    this.fetchData(this.props.locale);

    //Anim
    TweenMax.set(".Page-header-description",{opacity:0,y:-25});
      TweenMax.set(".Page-header .Page-header-title span",{opacity:0, bottom:-100});
      TweenMax.to(".Page-header .Page-header-title span",{opacity:1, bottom:0, delay:0.35});
      TweenMax.to(".Page-header-description",0.15,{opacity:1,y:0, delay:0.45});
  }

  fetchData(locale) {
    const { page, query: { type, slug } } = this.props;
    const that = this;
    var indexID = [];

    //Index of each categories to exclude

    indexID = 
    (this.props.query.type == "quartier") ? [93,181] : 
    (this.props.query.type == "immeuble") ? [206,348] : 
    (this.props.query.type == "services") ? [243,369] : 
    (this.props.query.type == "espaces") ? [245,396] : 
    [0,0];

      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/${type}?exclude=${page.id},${indexID[0]},${indexID[1]}&filter[lang]=${locale}`)
      .then((function (pages) {    
        if (that._isMounted) {
          that.setState({
          pages: pages.data,
        });
      }
      }));
    }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.query.slug !== prevProps.query.slug) { 
  
      this.fetchData(this.props.locale);
     
      TweenMax.set(".Page-header-description",{opacity:0,y:-25});
      TweenMax.set(".Page-header .Page-header-title span",{opacity:0, bottom:-100});
      TweenMax.to(".Page-header .Page-header-title span",{opacity:1, bottom:0, delay:0.35});
      TweenMax.to(".Page-header-description",0.15,{opacity:1,y:0, delay:0.45});
    }
  }

  clickToScroll()
  {
    var body = document.body;  
    var header = document.getElementById("Page-header");
    var pos = header.clientHeight;
      var pos = header.clientHeight;

    window.scrollTo({
      top: pos,
      behavior: 'smooth',
  });
}

handleRef(url, as)
{
var lastScrollY = window.scrollY;
if (lastScrollY <= 0 && url !== "undefined")
{
}
}

goToTop(url, as)
{
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth',
// });
var transitionWrapper = document.getElementById('transitionWrapper');

TweenMax.set(transitionWrapper,{css:{bottom:"-100vh"}});
TweenMax.to(transitionWrapper,0.25,{bottom:0, onComplete:this.Reroute(url, as)});
}

Reroute(url, as)
{
setTimeout(() => {
  window.scrollTo({
    top: 0,
});
var transitionWrapper = document.getElementById('transitionWrapper');
    Router.push(url, as, { shallow: false });
    TweenMax.to(transitionWrapper,0.25,{bottom:"100vh", delay:0.2});
}, 250)
}

// handleScrollCallBack(url, as)
// {
//   var lastScrollY = window.scrollY;
//   console.log(scrollY);
//   if (lastScrollY <= 0)
//   {
//     Router.push(url, as, { shallow: false });
//     window.removeEventListener('scroll', this.handleScrollCallBack(url, as), true);
//   }
// }

componentWillUnmount()
{
  // component is unmounted*
  // prevent state error on unmounted component
  this._isMounted = false;
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
          <div className="Page-header" id="Page-header" >
            <div className="Page-header-slider-wrapper">
            <div className="darkEdge"></div>
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
              <ScrollIndicatorComponent click={this.clickToScroll.bind(this)}/>
              <div className="Page-header-text fadeinDown">
                <h2 className="Page-header-title bold">
                  <span>{page.title.rendered}</span></h2>
                <div className="Page-header-description" dangerouslySetInnerHTML={{__html: page.content.rendered}}></div>
              </div>
            </div>
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
                              <div className="darkEdge"></div>
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
                      <h2 className="Page-header-title bold">
                       <span>{item.title}</span>
                        </h2>
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
                    // <Link href="/[type]/[slug]" as={`/${page.type}/${page.slug}`}>
                      <div onClick={this.goToTop.bind(this, '/[type]/[slug]', `/${page.type}/${page.slug}`)}  className="Page-otherSection">
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
                        <div className="Page-otherSection-background" style={{backgroundImage: "url(" + page.acf.slider[0].image.url + ")", backgroundSize: "cover"}}></div>
                      </div>
                    // </Link>
                  }
                </React.Fragment>
              ))}
              {/* {blocksToCompleteLine.map((page, index) => (
                <div className={`Page-otherSection empty-${index+1}`} key={pages.length + index}></div>
              ))} */}
               <div id="transitionWrapper">
               <SVG
                            src="/assets/svgs/logo-transition.svg"
                            style={{ fill: "#fff" }}
                           />  
               </div>
              <div className="clear"></div>
            </div>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default Page
