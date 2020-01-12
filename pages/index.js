import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SVG from 'react-inlinesvg'

import labels from '../constants/labels'

import Layout from '../layouts'

import Home from '../components/Home'
import Button from '../components/Button'

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
      isOpen: false
    };

    this.video = React.createRef();
  }

  componentDidMount() {
    if(localStorage.getItem('isModalOpen') === null) {
      localStorage.setItem('isModalOpen', true);
      this.setState({ isOpen: true });
    }
  }

  handleClick() {
    localStorage.setItem('isModalOpen', false);
    this.setState({isOpen: false});
    this.video.current.pause();
    this.video.current.currentTime = 0;
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
        </Head>

        <div className={`Modal ${(isOpen ? 'open' : '')} Modal-video desktop`}>
          <div className="Modal-logo">
            <Link href="/">
              <SVG
                src="/assets/svgs/logo.svg"
                style={{ fill: '#fff' }}
                />
            </Link>
          </div>

          <div className="Modal-close" onClick={this.handleClick.bind(this)}>
            <SVG
              src="/assets/svgs/close.svg"
              style={{ fill: "#fff" }}
             />
          </div>
          <div className="Modal-content">
            <iframe src="https://player.vimeo.com/video/383108369" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen ref={this.video}></iframe>

            <div onClick={this.handleClick.bind(this)}>
              <Button className="Modal-button">
                {labels[locale].video.button}
                <SVG
                  src="/assets/svgs/arrow-next.svg"
                  style={{ fill: "#fff" }}
                 />
              </Button>
            </div>
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
