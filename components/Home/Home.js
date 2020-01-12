import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import orderBy from 'lodash.orderby'
import { PageTransition } from 'next-page-transitions'
import Slider from 'react-slick'
import SVG from 'react-inlinesvg'

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

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slideAnimated: [],
      isClicked: false,
      widthSlider: 0,
      widthSlide: 0
    }

    this.slider = React.createRef();
  }

  handleClick(index, url, as, event) {
    let update = this.state.data.map(() => false);
    update[index] = true;

    this.setState({slideAnimated: update, isClicked: true});
    setTimeout(function() {
      Router.push(url, as, { shallow: true });
    }, 1500);
  }

  handlePrev() {
    const html = document.querySelector('.Home');
    html.scrollLeft -= window.innerWidth/3;
    this.updateArrowStatus();
  }

  handleNext() {
    const html = document.querySelector('.Home');
    html.scrollLeft += window.innerWidth/3;
    this.updateArrowStatus();
  }

  updateArrowStatus() {
    const html = document.querySelector('.Home');

    if(html.scrollLeft < this.state.widthSlide) {
      document.querySelector('.Slider-arrow-prev').classList.add('disabled');
    } else {
      document.querySelector('.Slider-arrow-prev').classList.remove('disabled');
    }

    if(html.scrollLeft > (this.state.widthSlider - (this.state.widthSlide * 4))) {
      document.querySelector('.Slider-arrow-next').classList.add('disabled');
    } else {
      document.querySelector('.Slider-arrow-next').classList.remove('disabled');
    }
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
      const innerWidth = window.innerWidth < 768 ? window.innerWidth : window.innerWidth/3;
      const totalWidth = innerWidth * (data.length + 1);

      this.setState({
        post: posts.data[0],
        data: data,
        slideAnimated: data.map(() => false),
        widthSlider: totalWidth,
        widthSlide: innerWidth
      });

      setTimeout(function(){
        if (window.addEventListener) {
          // IE9, Chrome, Safari, Opera
          window.addEventListener("mousewheel", that.scrollHorizontally, false);
          // Firefox
          window.addEventListener("DOMMouseScroll", that.scrollHorizontally, false);
        } else {
          // IE 6/7/8
          window.attachEvent("onmousewheel", that.scrollHorizontally);
        }

        // const html = document.querySelector('.Home');
        // if(html) {
        //   html.addEventListener("wheel", event => {
        //     const delta = Math.sign(event.deltaY);
        //     html.scrollLeft += (delta * 30);
        //     that.updateArrowStatus();
        //   }, { passive: true });
        // }
      }, 100);
    }));
  }

  scrollHorizontally(e) {
    e = window.event || e;
    console.log(window);
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    var scrollSpeed = 60; // Janky jank <<<<<<<<<<<<<<
    document.documentElement.scrollLeft -= (delta * scrollSpeed);
    document.body.scrollLeft -= (delta * scrollSpeed);
    // e.preventDefault();
  }

  componentDidMount() {
    const that = this;

    this.fetchData(this.props.locale);

    window.addEventListener('resize', function() {
      const innerWidth = window.innerWidth < 768 ? window.innerWidth : window.innerWidth/3;

      that.setState({
        widthSlider: innerWidth * (that.state.data.length + 1),
        widthSlide: innerWidth
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  render() {
    const { post, data, slideAnimated, isClicked, widthSlider, widthSlide } = this.state;
    const { locale } = this.props;

    if(!data) {
      return null;
    }

    return (
      <div className="Home">
        <div className={`Slider ${(isClicked ? 'clicked' : '')}`} style={{width: widthSlider}}>
          <PrevArrow className="Slider-arrow Slider-arrow-prev disabled" onClick={this.handlePrev.bind(this)} />

          <div className="Slide" style={{flexBasis: widthSlide}}>
            <Link href="/news/[slug]" as={`/news/${post.slug}`}>
              <div className="Slide-content" style={{backgroundImage: `url(${post.acf.image.url})`}}>
                <p className="Slide-content-subtitle post">News</p>
                <h3 className="Slide-content-title bold">{post.title.rendered}</h3>
                <Button className="Slide-content-button">{labels[locale].home.news.button}</Button>
              </div>
            </Link>
          </div>

          {data.map((page, index) => (
            <div className={`Slide ${(slideAnimated[index+1] ? 'animate' : '')}`}
                 key={index}
                 onClick={this.handleClick.bind(this, (index+1), '/[type]/[slug]', `/${page.type}/${page.slug}`)}
                 style={{flexBasis: widthSlide}}>
              <div className="Slide-wrapper">
                <div className="Slide-content" style={{backgroundImage: `url(${page.acf.slider[0].image.url})`}}>
                  <p className="Slide-content-subtitle">{page.acf.subtitle}</p>
                  <h3 className="Slide-content-title bold">{page.title.rendered}</h3>
                  <Button className="Slide-content-button">{labels[locale].home.pages.button}</Button>
                  <p className="Slide-content-number thin">{("0" + (index+1)).slice(-2)}</p>
                </div>
              </div>
            </div>
          ))}

          <NextArrow className="Slider-arrow Slider-arrow-next" onClick={this.handleNext.bind(this)} />
        </div>
      </div>
    )
  }
}

export default Home
