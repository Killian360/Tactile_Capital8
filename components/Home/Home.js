import React from 'react'
import Router from 'next/router'
import axios from 'axios'
import orderBy from 'lodash.orderby'
import SVG from 'react-inlinesvg'
import { connect } from "react-redux";
import { store } from './combinereducers.js';
import HorizontalScroll from '../scroll/'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import {
  TweenMax,
  TimelineMax,
  Power4,
  Power3,
  Linear
} from "gsap"

import labels from '../../constants/labels'

import Button from '../../components/Button'

import './Home.scss'


const mapStateToProps = state => {
  return {
    SLIDER_INDEXATION: state.SLIDER_INDEXATION,
  };
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <SVG
      src="../../assets/svgs/arrow-next.svg"
      className={className}
      style={{ ...style, fill: "#fff", display: "block" }}
      onClick={onClick} />
  );
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <SVG
      src="../../assets/svgs/arrow-prev.svg"
      className={className}
      style={{ ...style, fill: "#fff", display: "block" }}
      onClick={onClick} />
  );
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slideAnimated: [],
      isClicked: false,
      widthSlider: 0,
      widthSlide: 0,
      animationAllowed: true,
      indexation: 0,
      swipeIcon: true
    }
    this.tl = new TimelineMax();
    this.slider = React.createRef();
    // this.handleNext = this.handleNext.bind(this);
    // this.handlePrev = this.handlePrev.bind(this);
    this.handleNextMobile = this.handleNextMobile.bind(this);
    this.handlePrevMobile = this.handlePrevMobile.bind(this);
    // this.scrollHorizontally = this.scrollHorizontally.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.ismobile = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  }

  handleClick(index, url, as, event) {

    // var position = element.getBoundingClientRect();

    let update = this.state.data.map(() => false);
    update[index] = true;

    //Recenter element before expand
    var SliderWrapper = document.getElementsByClassName('scroll-horizontal-wrapper');
    var Slider = document.getElementById('Slider');
    var ChildrenNbr = document.querySelector('.Slider').children.length;
    var OffsetWidth = document.querySelector('.scroll-horizontal-wrapper').getBoundingClientRect().left;
    var SliderWidth = document.getElementById('Slider').offsetWidth;


    var positionLeft = SliderWidth / ChildrenNbr * (index - 1) + OffsetWidth;

    var indexCenter;

    this.ismobile ? (index < ChildrenNbr - 2) ? indexCenter = index - 1 : indexCenter = ChildrenNbr - 3 : indexCenter = index;

    //Dispatch center index for Redux store
    store.dispatch({ type: 'setIndex', index: indexCenter });

    // Animate slider & title
    var slideTitle = document.getElementsByClassName('Slide-content-title bold');
   
    this.ismobile && TweenMax.to(Slider,0.4,{ x:-positionLeft ,y:0,z:0, force3D:true});
    // this.ismobile && TweenMax.to(Slider,0.4, { x: -positionLeft - window.innerWidth/3 ,y:0,z:0, force3D:true}, Power3.easeOut);

    this.updateArrow();
    this.deactivateArrow();

    setTimeout(() => {
      this.ismobile && TweenMax.set(Slider,{ x: "-=" + window.innerWidth/3});
      this.setState({ slideAnimated: update, isClicked:true});
      TweenMax.to(slideTitle, 0.35, { opacity: 0, y: 15, delay: 0.85 });
    }, 450)

    setTimeout(function () {
      Router.push(url, as, { shallow: true });
    }, 1400);
  }


  deactivateArrow() {
    TweenMax.set(".Slider-arrow", { pointerEvents: "none" });
    TweenMax.set(".Slider", { pointerEvents: "none" });
  }

  handleClickNews(index, url, as) {
    Router.push(url, as, { shallow: true });
  }

  followAnimation(update) {
    this.ismobile && TweenMax.set(SliderWrapper, { x: 0 });
    this.setState({ slideAnimated: update, isClicked: true });
  }

  fetchData(locale) {
    axios.all([
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/posts?pagetags=5&filter[lang]=${locale}`),
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/quartier?pagetags=5&filter[lang]=${locale}`),
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/immeuble?pagetags=5&filter[lang]=${locale}`),
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/services?pagetags=5&filter[lang]=${locale}`),
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/espaces?pagetags=5&filter[lang]=${locale}`)
    ])
      .then(axios.spread((posts, neighbourhood, building, services, spaces) => {
        const that = this;
        const data = orderBy([...neighbourhood.data, ...building.data, ...services.data, ...spaces.data], ['date'], ['desc']);
        const innerWidth = window.innerWidth;
        const totalWidth = innerWidth * (data.length + 1);

        if (that._isMounted) {
          this.setState({
            post: posts.data[0],
            data: data,
            slideAnimated: data.map(() => false),
            widthSlider: totalWidth,
            widthSlide: innerWidth,
          }

          );
          var tl = new TimelineMax({ repeat: 0 });
          tl.staggerTo(".Slide", 0.1, { opacity: 1 }, 0.1);
          // var SliderWrapper = document.getElementsByClassName("scroll-horizontal-wrapper ");
          // var ChildrenNbr = document.querySelector('.scroll-horizontal-wrapper').children.length;
          // var SliderWidth = ChildrenNbr * window.innerWidth/3;

          // var scrollValue = -SliderWidth / ChildrenNbr;
          // TweenMax.set(SliderWrapper, { x: scrollValue * store.getState().SLIDER_INDEXATION });
          setTimeout(() => { this.updateArrow(); }, 350);
          store.dispatch({ type: 'setIndex', index: 0 });
        }
        if (!this.ismobile) {
          window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
          window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        }
        //  else if (window.addEventListener) {
        //   window.addEventListener('wheel', this.scrollHorizontally, { passive: false });
        // } else {
        //   window.attachEvent("onmousewheel", this.scrollHorizontally, { passive: false });
        // }
      })
      )
  }

  handleTouchStart(e) {
    var firstTouch = e.changedTouches[0];
    this.xDown = parseInt(firstTouch.clientX);
    this.yDown = parseInt(firstTouch.clientY);
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = this.xDown - xUp;
    var yDiff = this.yDown - yUp;

    var speed = 30;

    var SliderWrapper = document.getElementsByClassName("Slider ");

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
      if (xDiff > 4) {
        this.handleNextMobile();
      } else {
        this.handlePrevMobile();
      }
    }
    /* reset values */
    this.xDown = null;
    this.yDown = null;
  };

  scrollDown() {
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var scrollSpeed = 250;
    TweenMax.to(SliderWrapper, 0.01, { x: "+=" + scrollSpeed, ease: Power4.easeOut });
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData(this.props.locale);
    this.targetElement = document.querySelector('body');
    disableBodyScroll(this.targetElement);
    //Animate Swipe icon
    // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    // {
    //   TweenMax.fromTo(".SwipeIcon",{ opacity:0 },{ opacity:1 , duration: 2.5, yoyo:true, repeat:-1});
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

//   scrollHorizontally = (e) => {
//     e.preventDefault()
//     console.log("gogogo")
//     var container = document.getElementById('Slider')
//     var containerScrollPosition = document.getElementById('Slider').scrollLeft
//     container.scrollTo({
//         top: 0,
//         left: containerScrollPosition + e.deltaY,
//         behaviour: 'smooth' //if you want smooth scrolling
//     })
// }


  // scrollHorizontally(event) {
  //   console.log("scroll");
  //   var e = window.event || event;

  //   var SliderWrapper = document.getElementsByClassName("Slider ");
  //   var SliderWrapperId = document.getElementById("Slider");

  //   var Slideroffsets = document.getElementById('Slider').getBoundingClientRect();
  //   var SliderWidth = document.getElementById('Slider').offsetWidth;

  //   var SlideroffsetsLeft = Slideroffsets.left;
  //   var SlideroffsetsRight = Slideroffsets.right;
  //   var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
  //   var scrollSpeed = delta * 100; // Janky jank <<<<<<<<<<<<<<

  //  TweenMax.set(SliderWrapper, {
  //     rotation: 0.01,
  //     force3D: true
  //   });

  //   //Wheel down

  //   if (SlideroffsetsRight <= window.innerWidth + 300 && delta < 1) {

  //     TweenMax.to(SliderWrapper, 0.75, { x: -SliderWidth + window.innerWidth, ease:Power4.easeOut });
  //     this.ismobile && document.querySelector('.Slider-arrow-next').classList.add('disabled');

  //   } else if (SlideroffsetsLeft <= 0 && delta < 1) {

      
  //     // TweenMax.to(SliderWrapper, {duration: 2, scrollTo: {x: 200}});
  //     // TweenMax.to(SliderWrapper, 0.75, { transform: "translateX(" + -position + "px)", ease: Power4.easeOut });

  //     TweenMax.to(SliderWrapper,0.25, { x: "+=" + scrollSpeed }, Power1.easeOut);

  //     this.ismobile && document.querySelector('.Slider-arrow-next').classList.remove('disabled');
  //     this.ismobile && document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
  //     this.upadteIndexation();
  //   }

  //   // Wheel up

  //   if (SlideroffsetsRight >= SliderWidth - 300 && delta >= 1) {

  //     TweenMax.to(SliderWrapper, 0.75, { x: 0 ,  ease:Power4.easeOut});
  //     this.ismobile && document.querySelector('.Slider-arrow-prev').classList.add('disabled');
  //   } else if (SlideroffsetsRight < SliderWidth && delta >= 1) {

  //     TweenMax.to(SliderWrapper,0.35, { x: "+=" + scrollSpeed });

  //     this.ismobile && document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
  //     this.ismobile && document.querySelector('.Slider-arrow-next').classList.remove('disabled');
  //     this.upadteIndexation();
  //   }

  //   e.preventDefault();
  // }

  // upadteIndexation() {
  //   var Slideroffsets = document.getElementById('Slider').getBoundingClientRect();
  //   var SlideroffsetsLeft = Slideroffsets.left;
  //   var SliderWidth = document.getElementById('Slider').offsetWidth;
  //   var ChildrenNbr = document.getElementById('Slider').children.length;

  //   if (!this.ismobile) {
  //     // for (var i = 0; i < ChildrenNbr-1; i++) {
  //     //   if (SlideroffsetsLeft <= -SliderWidth / ChildrenNbr * store.getState().SLIDER_INDEXATION) {
  //     //     store.dispatch({type: 'IncrementIndexation'});
  //     //   }
  //     // };
  //   } else {
  //     if (SlideroffsetsLeft <= (-SliderWidth / ChildrenNbr - 100) * store.getState().SLIDER_INDEXATION) {
  //       store.dispatch({ type: 'IncrementIndexation' });
  //     } else if (SlideroffsetsLeft > -SliderWidth / ChildrenNbr * store.getState().SLIDER_INDEXATION) {
  //       store.dispatch({ type: 'DecrementIndexation' });
  //     }
  //   }
  // }


handlePrevMobile() {
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var ChildrenNbr = document.getElementById('Slider').children.length;
  
    store.dispatch({type: 'DecrementIndexation'});
    //Scroll value
    var SliderWidth = document.getElementById('Slider').offsetWidth;
  
    var scrollValue = -SliderWidth / ChildrenNbr;
  
    var maxIndex = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? ChildrenNbr-1 : ChildrenNbr-3;
  
    if ( store.getState().SLIDER_INDEXATION >= 0) {
      TweenMax.to(SliderWrapper,0.35,  { x: scrollValue * store.getState().SLIDER_INDEXATION});
    } else if (store.getState().SLIDER_INDEXATION < 0) {
      store.dispatch({type: 'setIndex', index:0});
      TweenMax.to(SliderWrapper,0.35,  { x: 0});
    }
    this.setState({swipeIcon:false})
}

handleNextMobile() {
  var SliderWrapper = document.getElementsByClassName("Slider ");
  var ChildrenNbr = document.getElementById('Slider').children.length;

  store.dispatch({type: 'IncrementIndexation'});

  //Scroll value
  var SliderWidth = document.getElementById('Slider').offsetWidth;

  var scrollValue = -SliderWidth / ChildrenNbr;

  var maxIndex = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? ChildrenNbr-1 : ChildrenNbr-3;

  if ( store.getState().SLIDER_INDEXATION < maxIndex) {
    TweenMax.to(SliderWrapper,0.35, { x: scrollValue * store.getState().SLIDER_INDEXATION});
  } else if (store.getState().SLIDER_INDEXATION >= maxIndex) {
    store.dispatch({type: 'setIndex', index:maxIndex});
    TweenMax.to(SliderWrapper, 0.35, { x: scrollValue * store.getState().SLIDER_INDEXATION});
  }
  this.setState({swipeIcon:false})
}

  // handlePrev() {
  //   store.dispatch({ type: 'DecrementIndexation' });
  //   var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  //   var SliderWrapper = document.getElementsByClassName("Slider ");


  //   //Scroll value
  //   var ChildrenNbr = document.querySelector('.Slider ').children.length;
  //   var SliderWidth = isMobile ? ChildrenNbr * window.innerWidth : ChildrenNbr * window.innerWidth/3;

  //   var scrollValue = -SliderWidth / ChildrenNbr;
     
  //   if (store.getState().SLIDER_INDEXATION >= 0) {
  //     TweenMax.to(SliderWrapper,0.75, { x: scrollValue * store.getState().SLIDER_INDEXATION, ease : Power3.easeOut });
  //   } else {
  //     TweenMax.to(SliderWrapper,0.75, { x: 0 , ease : Power3.easeOut });
  //     store.dispatch({ type: 'setIndex', index: 0 });
  //   }
  //   this.setState({ swipeIcon: false })
  //   setTimeout(() => { this.updateArrow(); }, 350);

  // }

  // handleNext() {
  //   store.dispatch({ type: 'IncrementIndexation' });
  //   var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  //   var SliderWrapper = document.getElementsByClassName("Slider ");
  //   var ChildrenNbr = document.querySelector('.Slider ').children.length;

  //   //Scroll value
  //   var SliderWidth = isMobile ? ChildrenNbr * window.innerWidth : ChildrenNbr * window.innerWidth/3;

  //   var scrollValue = -SliderWidth / ChildrenNbr;

  //   var maxIndex = isMobile ? ChildrenNbr - 1 : ChildrenNbr - 3;
  //   console.log(scrollValue);

  //   if (store.getState().SLIDER_INDEXATION < maxIndex + 1) {
  //     TweenMax.to(SliderWrapper,0.75, { x: scrollValue * store.getState().SLIDER_INDEXATION, ease : Power3.easeOut });
  //     console.log("anim bordel");
  //   } else if (store.getState().SLIDER_INDEXATION > maxIndex) {
  //     store.dispatch({ type: 'setIndex', index: maxIndex });
  //     TweenMax.to(SliderWrapper,0.75, { x: scrollValue * store.getState().SLIDER_INDEXATION, ease : Power3.easeOut });
  //   }
  //   this.setState({ swipeIcon: false })
  //   setTimeout(() => { this.updateArrow(); }, 350);
  // }

  
  rightClick() {
    this.handleNext();
  }

  leftClick() {
    this.handlePrev();
  }


  updateArrow() {
    var ChildrenNbr = document.getElementById('Slider').children.length;
    var elemPrev = document.querySelector('.Slider-arrow-prev');
    var elemNext = document.querySelector('.Slider-arrow-next');
    TweenMax.set(".Slider-arrow", { pointerEvents: "auto" });
    TweenMax.set(".Slider", { pointerEvents: "auto" });

    if (store.getState().SLIDER_INDEXATION > 0 && store.getState().SLIDER_INDEXATION < ChildrenNbr - 3) {
      (this.ismobile && elemPrev) && elemPrev.classList.remove('disabled');
      (this.ismobile && elemNext) && elemNext.classList.remove('disabled');
    } else if (store.getState().SLIDER_INDEXATION >= ChildrenNbr - 3) {
      (this.ismobile && elemNext) && elemNext.classList.add('disabled');
    }
    else if (store.getState().SLIDER_INDEXATION == 0) {
      (this.ismobile && elemPrev) && elemPrev.classList.add('disabled');
    }
  }

  componentWillUnmount() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.removeEventListener('touchstart', this.handleTouchStart, false);
      window.removeEventListener('touchmove', this.handleTouchMove, false);
    }

    // if (window.removeEventListener) {
    //   window.removeEventListener("wheel", this.scrollHorizontally, { passive: false });
    // } else {
    //   // IE 6/7/8
    //   window.detachEvent("onmousewheel", this.scrollHorizontally, { passive: false });
    // }
    this._isMounted = false;
    clearAllBodyScrollLocks();
  }

  render() {
    const { post, data, slideAnimated, isClicked, swipeIcon, widthSlider, widthSlide } = this.state;
    const { locale } = this.props;

    if (!data) {
      return null;
    }
    return (
      <div className="Home">
        {/* {this.ismobile &&
          <div><PrevArrow className="Slider-arrow Slider-arrow-prev" onClick={this.leftClick.bind(this)} />
            <NextArrow className="Slider-arrow Slider-arrow-next" onClick={this.rightClick.bind(this)} />
          </div>
        } */}
        {(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) &&
          <div className={`SwipeIcon ${(swipeIcon ? '' : 'invisible')}`}>
            <SVG
              src="/assets/svgs/swipe.svg"
              style={{ fill: "#fff" }}
            />
          </div>
        }
        {this.ismobile ? (
        <HorizontalScroll 
        reverseScroll = { true }
        className     = "Slider_wrapper"
        config        = {{ stiffness: 400, damping: 50 }}
    >
    <div id="Slider" className={`Slider ${(isClicked ? 'clicked' : '')}`}>
      <div className="Slide" id="SlideInit">
        <div onClick={this.handleClickNews.bind(this, 0, '/news/[slug]', `/news/${post.slug}`)}>
          <div className="Slide-content">
            <p className="Slide-content-subtitle post">News</p>
            <h3 className="Slide-content-title bold">{post.title.rendered}</h3>
            <Button className="Slide-content-button Button-initslide">{labels[locale].home.news.button}</Button>
            {/* <p className="Slide-content-number thin">NEWS</p> */}
            <div className={`Slide-content-img ${(isClicked ? 'clicked' : '')}`} style={{ backgroundImage: `url(${post.acf.image.url})` }} ></div>
            <div className="SlideInit_bg"></div>
          </div>
        </div>
      </div>
      {data.map((page, index) => (
        <div className={`Slide ${(slideAnimated[index + 1] ? 'animate' : '')}`}
          key={index}
          onClick={this.handleClick.bind(this, (index + 1), '/[type]/[slug]', `/${page.type}/${page.slug}`)}
          >
          <div className={`Slider-wrapper ${(slideAnimated[index + 1] ? 'animate' : '')}`}>
            <div className="Slide-content">
              <p className="Slide-content-subtitle">{page.acf.subtitle}</p>
              <h3 className="Slide-content-title bold">{page.title.rendered}</h3>
              <Button className="Slide-content-button">{labels[locale].home.pages.button}</Button>
              <p className="Slide-content-number thin">{("0" + (index + 1)).slice(-2)}</p>
              <div className={`Slide-content-img ${(isClicked ? 'clicked' : '')}`} style={{ backgroundImage: `url(${page.acf.slider[0].image.url})` }} ></div>
              <div className="SlideOther_bg"></div>
            </div>
          </div>
          
        </div>
        
      ))}
      </div>
              </HorizontalScroll>

        ): (
          <React.Fragment
      >
          <div className="scroll-horizontal-wrapper">
        <div id="Slider" className={`Slider ${(isClicked ? 'clicked' : '')}`} style={{ width: widthSlider }}>
        <div className="Slide" id="SlideInit">
          <div onClick={this.handleClickNews.bind(this, 0, '/news/[slug]', `/news/${post.slug}`)}>
            <div className="Slide-content">
              <p className="Slide-content-subtitle post">News</p>
              <h3 className="Slide-content-title bold">{post.title.rendered}</h3>
              <Button className="Slide-content-button Button-initslide">{labels[locale].home.news.button}</Button>
              {/* <p className="Slide-content-number thin">NEWS</p> */}
              <div className={`Slide-content-img ${(isClicked ? 'clicked' : '')}`} style={{ backgroundImage: `url(${post.acf.image.url})` }} ></div>
              <div className="SlideInit_bg"></div>
            </div>
          </div>
        </div>
        {data.map((page, index) => (
          <div className={`Slide ${(slideAnimated[index + 1] ? 'animate' : '')}`}
            key={index}
            onClick={this.handleClick.bind(this, (index + 1), '/[type]/[slug]', `/${page.type}/${page.slug}`)}
            >
            <div className="Slide-wrapper">
              <div className="Slide-content">
                <p className="Slide-content-subtitle">{page.acf.subtitle}</p>
                <h3 className="Slide-content-title bold">{page.title.rendered}</h3>
                <Button className="Slide-content-button">{labels[locale].home.pages.button}</Button>
                <p className="Slide-content-number thin">{("0" + (index + 1)).slice(-2)}</p>
                <div className={`Slide-content-img ${(isClicked ? 'clicked' : '')}`} style={{ backgroundImage: `url(${page.acf.slider[0].image.url})` }} ></div>
                <div className="SlideOther_bg"></div>
              </div>
            </div>
          </div>
          
        ))}
        </div>
        </div>
                </React.Fragment>
        )
        
        }
        </div>
    )
  }
}

export default connect(mapStateToProps)(Home)
