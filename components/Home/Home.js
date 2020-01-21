import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import orderBy from 'lodash.orderby'
import { PageTransition } from 'next-page-transitions'
import Slider from 'react-slick'
import SVG from 'react-inlinesvg'
import WheelReact from 'wheel-react';
// import * as animate from "./animation.js";

import {
  TweenMax,
  Power1,
  TimelineMax,
  Linear
} from "gsap"

import labels from '../../constants/labels'

import Button from '../../components/Button'

import './Home.scss'

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


function incrementIndexation(delta) {
  var ChildrenNbr = document.getElementById('Slider').children.length;
   
  return (previousState) => {
    if (previousState.indexation == ChildrenNbr-1) {
      return { ...previousState, indexation: ChildrenNbr-1 };
      } else 
      {
      return { ...previousState, indexation: previousState.indexation + delta };
      }
  };
}

function decrementIndexation(delta) {
  return (previousState) => {
  if (previousState.indexation == 0) {
    return { ...previousState, indexation: 0 };
    } else 
  {
      return { ...previousState, indexation: previousState.indexation - delta };
  };
  }
}

function SetIndexation(index)
{
  return (previousState) => {
      return { ...previousState, indexation: previousState.indexation=index };
  };
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
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.scrollHorizontally = this.scrollHorizontally.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.ismobile = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  }

  handleClick(index, url, as, event) {

    var SliderWidth = document.getElementById('Slider').offsetWidth;
    var element = document.getElementById('Slider').childNodes[index];
    var position = element.getBoundingClientRect();

    let update = this.state.data.map(() => false);
    update[index] = true;

    //Recenter element before expand
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var ChildrenNbr = document.getElementById('Slider').children.length;

    var positionLeft = SliderWidth / ChildrenNbr * (index - 1);

    // Animate slider & title
    var slideTitle = document.getElementsByClassName('Slide-content-title bold');
    this.ismobile && TweenMax.set(SliderWrapper, { x: -positionLeft });

    setTimeout(() => {
      this.ismobile && TweenMax.set(SliderWrapper, { x: 0 });
      TweenMax.to(slideTitle, 0.25, { opacity: 0, y: 15, delay: 0.85 });
      this.setState({ slideAnimated: update, isClicked: true });;
    }, 450)

    setTimeout(function () {
      Router.push(url, as, { shallow: true });
    }, 1400);
  }


  handleClickNews(index, url, as)
  {
      Router.push(url, as, { shallow: true });
  }

  followAnimation(update, element) {
    this.ismobile && TweenMax.set(SliderWrapper, { x: 0 });
    this.setState({ slideAnimated: update, isClicked: true });
  }

  fetchData(locale) {
    axios.all([
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/posts?pagetags=5&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/quartier?pagetags=5&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/immeuble?pagetags=5&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/services?pagetags=5&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/espaces?pagetags=5&filter[lang]=${locale}`)
    ])
      .then(axios.spread((posts, neighbourhood, building, services, spaces) => {
        const that = this;
        const data = orderBy([...neighbourhood.data, ...building.data, ...services.data, ...spaces.data], ['date'], ['desc']);
        const innerWidth = window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 3;
        const totalWidth = innerWidth * (data.length + 1);

        if (that._isMounted) {
           this.setState({
          post: posts.data[0],
          data: data,
          slideAnimated: data.map(() => false),
          widthSlider: totalWidth,
          widthSlide: innerWidth,
        });
        var tl = new TimelineMax({ repeat: 0 });
        tl.staggerTo(".Slide", 0.1, {opacity: 1 }, 0.1);
      }

        if (!this.ismobile) {
          window.addEventListener('touchstart', this.handleTouchStart, true);
          window.addEventListener('touchmove', this.handleTouchMove, true);
        } else if (window.addEventListener) {
          window.addEventListener('wheel', this.scrollHorizontally, true);
        } else {
          window.attachEvent("onmousewheel", this.scrollHorizontally, true);
        }
      }));
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
        this.handleNext();
      } else {
        this.handlePrev();
      }
    }
    /* reset values */
    this.xDown = null;
    this.yDown = null;
  };

  scrollDown() {
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var scrollSpeed = 150;
    TweenMax.to(SliderWrapper, 0.01, { x: "+=" + scrollSpeed, ease: Power4.easeOut });
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchData(this.props.locale);
    
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


  scrollHorizontally(e) {
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var Slideroffsets = document.getElementById('Slider').getBoundingClientRect();
    var SliderWidth = document.getElementById('Slider').offsetWidth;

    var SlideroffsetsLeft = Slideroffsets.left;
    var SlideroffsetsRight = Slideroffsets.right;

    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
    var scrollSpeed = delta * 70; // Janky jank <<<<<<<<<<<<<<

    //Wheel down

    if (SlideroffsetsRight <= window.innerWidth && delta < 1) {
      TweenMax.set(SliderWrapper, { x: -SliderWidth + window.innerWidth });

      this.ismobile && document.querySelector('.Slider-arrow-next').classList.add('disabled');

    } else if (SlideroffsetsLeft <= 0 && delta < 1) {

      TweenMax.set(SliderWrapper, { x: "+=" + scrollSpeed });

      this.ismobile && document.querySelector('.Slider-arrow-next').classList.remove('disabled');
      this.ismobile && document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
      this.upadteIndexation();
    }

    //Wheel up

    if (SlideroffsetsRight >= SliderWidth && delta >= 1) {

      TweenMax.set(SliderWrapper, { x: 0 });
      this.ismobile && document.querySelector('.Slider-arrow-prev').classList.add('disabled');
    } else if (SlideroffsetsRight < SliderWidth && delta >= 1) {

      TweenMax.set(SliderWrapper, { x: "+=" + scrollSpeed });

      this.ismobile && document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
      this.ismobile && document.querySelector('.Slider-arrow-next').classList.remove('disabled');
      this.upadteIndexation();
    }
  }

  upadteIndexation() {
    var Slideroffsets = document.getElementById('Slider').getBoundingClientRect();
    var SlideroffsetsLeft = Slideroffsets.left;
    var SliderWidth = document.getElementById('Slider').offsetWidth;
    var ChildrenNbr = document.getElementById('Slider').children.length;

    if (!this.ismobile) {
      for (var i = 0; i < ChildrenNbr-1; i++) {
        if (SlideroffsetsLeft <= -SliderWidth / ChildrenNbr * i) {
          this.setState(SetIndexation(i));
        }
      };
    } else {
      for (var i = 0; i < ChildrenNbr - 3; i++) {
        if (SlideroffsetsLeft <= -SliderWidth / ChildrenNbr - 200 * i) {
          this.setState((state) => ({ indexation: i }));
        }
      };
    }
  }


  handlePrev() {
    this.setState(decrementIndexation(1));
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var SliderWidth = document.getElementById('Slider').offsetWidth;

    //Scroll value
    var ChildrenNbr = document.getElementById('Slider').children.length;
    var scrollValue = -SliderWidth / ChildrenNbr;

    if (this.state.indexation >= 0) {
      TweenMax.set(SliderWrapper, { x: scrollValue *  this.state.indexation });
    }

    setTimeout(() => { this.updateArrow(); }, 0.3);

  }

  rightClick()
  {
    this.handleNext();
  }

  leftClick()
  {
    this.handlePrev();
  }

  handleNext() {
    this.setState(incrementIndexation(1));
    var SliderWrapper = document.getElementsByClassName("Slider ");
    var ChildrenNbr = document.getElementById('Slider').children.length;

    //Scroll value
    var SliderWidth = document.getElementById('Slider').offsetWidth;
    var scrollValue = -SliderWidth / ChildrenNbr;

    var maxIndex = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? ChildrenNbr-1 : ChildrenNbr-3;

    if ( this.state.indexation < maxIndex+1) {
      TweenMax.set(SliderWrapper, { x: scrollValue * this.state.indexation });
    } else if (this.state.indexation > maxIndex) {
      this.setState(SetIndexation(maxIndex));
    }
    this.setState({swipeIcon:false})

    setTimeout(() => { this.updateArrow(); }, 0.3);
  }

  updateArrow() {
    var ChildrenNbr = document.getElementById('Slider').children.length;

    if (this.state.indexation > 0) {
      this.ismobile && document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
    } else {
      this.ismobile &&  document.querySelector('.Slider-arrow-prev').classList.add('disabled');
    }

    if (this.state.indexation < ChildrenNbr - 2) {
      this.ismobile &&  document.querySelector('.Slider-arrow-next').classList.remove('disabled');
    } else {
      this.ismobile &&  document.querySelector('.Slider-arrow-next').classList.add('disabled');
    }
  }

  componentWillUnmount() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.removeEventListener('touchstart', this.handleTouchStart, true);
      window.removeEventListener('touchmove', this.handleTouchMove, true);
    } 

    if (window.removeEventListener) {
      window.removeEventListener("wheel", this.scrollHorizontally, true);
    } else {
      // IE 6/7/8
      window.detachEvent("onmousewheel", this.scrollHorizontally, true);
    }
    this._isMounted = false;
  }

  render() {
    const { post, data, slideAnimated, isClicked,swipeIcon, widthSlider, widthSlide } = this.state;
    const { locale } = this.props;

    if (!data) {
      return null;
    }
    return (
      <div className="Home">
        {this.ismobile &&
        <div><PrevArrow className="Slider-arrow Slider-arrow-prev disabled" onClick={this.leftClick.bind(this)} />
        <NextArrow className="Slider-arrow Slider-arrow-next" onClick={this.rightClick.bind(this)} />
        </div>
        }
        {(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) &&
          <div className={`SwipeIcon ${(swipeIcon ? '' : 'invisible')}`}>
         <SVG
                        src="/assets/svgs/swipe.svg"
                        style={{ fill: "#fff" }}
                      />
        </div>
        }
        <div id="Slider" className={`Slider ${(isClicked ? 'clicked' : '')}`} style={{ width: widthSlider }}>
          <div className="Slide" id="SlideInit" style={{ flexBasis: widthSlide }}>
            <div onClick={this.handleClickNews.bind(this,0, '/news/[slug]', `/news/${post.slug}`)}>
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
              style={{ flexBasis: widthSlide }}>
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
    )
  }
}

export default Home
