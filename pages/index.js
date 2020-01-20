import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SVG from 'react-inlinesvg'

import labels from '../constants/labels'

import Layout from '../layouts'

import Home from '../components/Home'
import Nav from '../components/Nav'
import Button from '../components/Button'
import ReactPlayer from 'react-player'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import '../public/css/knacss.min.css'
import '../public/css/fonts.css'
import '../public/css/animations.css'
import '../public/css/main.scss'

import '../styles/App.scss'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    if(localStorage.getItem('isModalOpen') === null) {
      localStorage.setItem('isModalOpen', true);
      this.setState({ isOpen: true });
    }
    this.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
  }

  handleClick() {
    localStorage.setItem('isModalOpen', false);
    this.setState({ isOpen: false });
  }

  render() {
    const { isOpen, post, data } = this.state;
    const { locale } = this.props;

    return (
      <div className="App">
        <Head>
          <title>Capital 8</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel='icon' href='/favicon.ico' />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <meta name="viewport" content="width=device-width, user-scalable=no"></meta>
          <title>Capital8</title>
        </Head>

        <div className={`Modal ${(isOpen ? 'open' : '')} Modal-video desktop`}>
          <div className="Modal-close" onClick={this.handleClick.bind(this)}>
            <SVG
              src="/assets/svgs/close.svg"
              style={{ fill: "#fff" }}
             />
          </div>
          <div className="Modal-content">
          {this.isMobile ? <ReactPlayer url='https://player.vimeo.com/video/383108369?autoplay=0&title=0&byline=0&controls=0&portrait=0?api=1'playing={this.state.isOpen} height="140%" width="140%" />
              :
              <ReactPlayer url='https://player.vimeo.com/video/383108369?autoplay=0&title=0&byline=0&controls=0&portrait=0?api=1' playing={this.state.isOpen} height="100%" width="100%" />}
          {/* style={{position:"absolute", top:0 ,bottom:0, width:"100%",height: "110%", margin: "auto"}} */}
              <Button className="Modal-button-video">
              <div onClick={this.handleClick.bind(this)}>
                <span className="Button-label">{labels[locale].video.button}
                <SVG
                  src="/assets/svgs/arrow-next.svg"
                  style={{ fill: "#fff" }}
                 />
                </span>
                </div>
              </Button>
          </div>
        </div>
        <Home post={post} data={data} locale={locale} />
      </div>
    )
  }
}

export default App

// <video loop muted controls width="auto" height="75%" ref={this.video}>
//   <source src="https://vimeo.com/383108369" type="video/mp4" />
//   Sorry, your browser doesn't support embedded videos.
// </video>
