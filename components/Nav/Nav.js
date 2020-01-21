import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import SVG from 'react-inlinesvg'
import Router from 'next/router'

import labels from '../../constants/labels'

import Button from '../../components/Button'
import ReactPlayer from 'react-player'
import TopButtonUI from "../../components/TopButton";
import LangSelector from "./Lang_selector"
import LangSelectorMobile from "./Lang_selector_mobile"

import './Nav.scss'
import {
  TweenMax,
  Power1,
  TimelineMax,
  Linear
} from "gsap"

let menu = null;

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isModalOpen: false,
      isVideoModalOpen: false
    };

    this.video = React.createRef();
    this.stopWheel = this.stopWheel.bind(this);
    }

  fetchData(locale) {
    axios.all([
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/quartier?pagetags=14&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/immeuble?pagetags=14&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/services?pagetags=14&filter[lang]=${locale}`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/espaces?pagetags=14&filter[lang]=${locale}`)
    ])
      .then(axios.spread((neighbourhood, building, services, spaces) => {
        this.setState({
          menu: [
            ...neighbourhood.data,
            ...building.data,
            ...services.data,
            ...spaces.data
          ]
        });
      }));
  }

  componentDidMount() {
    this.fetchData(this.props.locale);
    this.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  handleClick() {
    this.setState({ isOpen: !this.state.isOpen });
    if (this.state.isOpen === true) {
      TweenMax.to(".Nav-footer", 0.2, { opacity: 0 });
      TweenMax.to(".Layout-content", 0.35, {top:"0", delay:0.2}, Power1.easeOut);
      TweenMax.to(".Menu", 0.35, {top:"0", delay:0.2}, Power1.easeOut);
      window.removeEventListener('wheel', this.stopWheel);
      window.removeEventListener('touchmove', this.stopWheel, true);
    } else {
      window.addEventListener('wheel', this.stopWheel);
      window.addEventListener('touchmove', this.stopWheel, true);

      TweenMax.set(".Menu-link", { opacity: 0, y: -25 });
      TweenMax.set(".Menu-secondary", { opacity: 0 });
      var tl = new TimelineMax({ repeat: 0 });
      tl.staggerTo(".Menu-link", 0.11, { y: 25, opacity: 1 }, 0.1);
      TweenMax.to(".Layout-content", 0.35, {top:"100vh", position:"satic"}, Power1.easeInOut);
      TweenMax.to(".Menu", 0.35, {top:"100vh"}, Power1.easeInOut);
      TweenMax.to(".Menu-secondary", 0.2, { opacity: 1, delay: 0.35 });
      TweenMax.to(".Nav-footer", 0.2, { opacity: 1, delay: 0.35 });
    }
  }

  stopWheel()
  {
    TweenMax.to(".Nav-footer", 0.2, { opacity: 0 });
    TweenMax.to(".Layout-content", 0.35, {top:"0", delay:0.2}, Power1.easeOut);
    TweenMax.to(".Menu", 0.35, {top:"0", delay:0.2}, Power1.easeOut);
    this.setState({ isOpen: false });
    window.removeEventListener('wheel', this.stopWheel);
    window.removeEventListener('touchmove', this.stopWheel, true);
  }

  closePanel() {
    setTimeout(() => {
      this.setState({ isOpen: false });
      var body = document.body;
      TweenMax.to(".Nav-footer", 0.2, { opacity: 0 });
      TweenMax.to(".Layout-content", 0.35, {top:"0", delay:0.3}, Power1.easeOut);
      TweenMax.to(".Menu", 0.35, {top:"0", delay:0.3}, Power1.easeOut);
      body.classList.remove("overflow-none");
    }, 700)
  }

  handleVideoClick() {

    this.setState({ isVideoModalOpen: !this.state.isVideoModalOpen });
  }

  handleClickTop() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isOpen, isModalOpen, isVideoModalOpen, menu } = this.state;
    const { isLogoBlue, isMenuBlue, handleChangeLocale, locale } = this.props;

    if (!menu) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Modal-logo">
          <div onClick={this.closePanel.bind(this)}>
            <Link href="/">
              <SVG
                src="/assets/svgs/logo.svg"
                style={{ fill: `${((isLogoBlue && !isOpen) ? '#0F5F6B' : '#fff')}`, display: "block" }}
              />
            </Link>
          </div>
        </div>
        <div className={`Modal ${(isVideoModalOpen ? 'open' : '')} Modal-video`}>
          <div className="Modal-close" onClick={this.handleVideoClick.bind(this)}>
            <SVG
              src="/assets/svgs/close.svg"
              style={{ fill: "#fff" }}
            />
          </div>
          <div className="Modal-content">
            {this.isMobile ? <ReactPlayer url='https://player.vimeo.com/video/383108369?autoplay=0&title=0&byline=0&controls=1&portrait=0?api=1'  controls={true} playing={this.state.isVideoModalOpen} height="100%" width="100%" />
              :
              <ReactPlayer url='https://player.vimeo.com/video/383108369?autoplay=0&title=0&byline=0&controls=1&portrait=0?api=1' controls={true} playing={this.state.isVideoModalOpen} height="100%" width="100%" />}
          </div>
        </div>

        <div className={`Nav-menu Menu ${(isOpen ? 'open' : '')}`} onClick={this.handleClick.bind(this)}>
            <div className="Menu-content">
              <ul className="Menu-primary bold">
                <li className="Menu-link">
                  <Link href="/news">
                    <a className="bold">News</a>
                  </Link>
                </li>
                <li className="Menu-link">
                  <Link href="/[type]/[slug]" as={`/${menu[0].type}/${menu[0].slug}`}>
                    <a className="bold">{labels[locale].menu[0]}</a>
                  </Link>
                </li>
                <li className="Menu-link">
                  <Link href="/[type]/[slug]" as={`/${menu[1].type}/${menu[1].slug}`}>
                    <a className="bold">{labels[locale].menu[1]}</a>
                  </Link>
                </li>
                <li className="Menu-link">
                  <Link href="/[type]/[slug]" as={`/${menu[2].type}/${menu[2].slug}`}>
                    <a className="bold">{labels[locale].menu[2]}</a>
                  </Link>
                </li>
                <li className="Menu-link">
                  <Link href="/[type]/[slug]" as={`/${menu[3].type}/${menu[3].slug}`}>
                    <a className="bold">{labels[locale].menu[4]}</a>
                  </Link>
                </li>
                <li className="Menu-link" onClick={this.handleVideoClick.bind(this)}>
                  <a className="bold">{labels[locale].menu[3]}</a>
                </li>
              </ul>
              <div className="Menu-secondary">
                <Link href="/contact">
                  <SVG
                    src="../../assets/svgs/contact.svg"
                    style={{ fill: "#fff", display: "block" }}
                  />
                </Link>
                <div className="Menu-separator"></div>
                <Link href="/medias">
                  <SVG
                    src="../../assets/svgs/photo.svg"
                    style={{ fill: "#fff", display: "block" }}
                  />
                </Link>
              </div>
            </div>

            <div className="Nav-footer">
              <p>{labels[locale].footer.copyright} <Link href="/legale"><a>{labels[locale].footer.legale}</a></Link></p>
            </div>
          </div>

        <div className="Nav">
          <div className="Nav-header">
            <div className="Nav-actions">
              <div className="Nav-lang">
                <LangSelector handleChangeLocale={handleChangeLocale} />
                {/* <div onClick={() => handleChangeLocale('fr')}></div>
                <div onClick={() => handleChangeLocale('en')}></div> */}
              </div>
              <div className={`Nav-burger ${(isOpen ? 'open' : '')} ${((isMenuBlue && !isOpen) ? 'blue' : '')}`} onClick={this.handleClick.bind(this)}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="Nav-lang-mobile"><LangSelectorMobile handleChangeLocale={handleChangeLocale} /></div>
        </div>
        <div onClick={() => this.handleClickTop.bind(this)}><TopButtonUI ID="TopBTN" /></div>
      </React.Fragment>
    )
  }
}

export default Nav;

// <video loop muted controls width="auto" height="75%" ref={this.video}>
//   <source src="https://vimeo.com/383108369" type="video/mp4" />
//   Sorry, your browser doesn't support embedded videos.
// </video>
