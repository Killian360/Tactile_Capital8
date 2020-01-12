import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import SVG from 'react-inlinesvg'

import labels from '../../constants/labels'

import Button from '../../components/Button'

import './Nav.scss'

let menu = null;

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isModalOpen: false
    };

    this.video = React.createRef();
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
      ]});
    }));
  }

  componentDidMount() {
    this.fetchData(this.props.locale);
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  handleClick() {
    this.setState({ isOpen: !this.state.isOpen });
    this.video.current.pause();
    this.video.current.currentTime = 0;
  }

  handleVideoClick() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  render() {
    const { isOpen, isModalOpen, menu } = this.state;
    const { isLogoBlue, isMenuBlue, handleChangeLocale, locale } = this.props;

    if(!menu) {
      return null;
    }

    return (
      <React.Fragment>
        <div className={`Modal ${(isModalOpen ? 'open' : '')} Modal-video`}>
          <div className="Modal-logo">
            <Link href="/">
              <SVG
                src="/assets/svgs/logo.svg"
                style={{ fill: '#fff' }}
                />
            </Link>
          </div>

          <div className="Modal-close" onClick={this.handleVideoClick.bind(this)}>
            <SVG
              src="/assets/svgs/close.svg"
              style={{ fill: "#fff" }}
             />
          </div>
          <div className="Modal-content">
            <iframe src="https://player.vimeo.com/video/383108369" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen ref={this.video}></iframe>
          </div>
        </div>

        <div className="Nav">
          <div className="Nav-header">
            <div className="Nav-logo">
              <Link href="/">
                <SVG
                  src="/assets/svgs/logo.svg"
                  style={{ fill: `${((isLogoBlue && !isOpen) ? '#0F5F6B' : '#fff')}`, display: "block" }}
                  />
              </Link>
            </div>
            <div className="Nav-actions">
              <div className="Nav-lang">
                <div onClick={() => handleChangeLocale('fr')}></div>
                <div onClick={() => handleChangeLocale('en')}></div>
              </div>
              <div className={`Nav-burger ${(isOpen ? 'open' : '')} ${((isMenuBlue && !isOpen) ? 'blue' : '')}`} onClick={this.handleClick.bind(this)}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
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
                    src="../../assets/svgs/envelop.svg"
                    style={{ fill: "#fff", display: "block" }}
                    />
                </Link>
                <div className="Menu-separator"></div>
                <Link href="/medias">
                  <SVG
                    src="../../assets/svgs/camera.svg"
                    style={{ fill: "#fff", display: "block" }}
                    />
                </Link>
              </div>
            </div>

            <div className="Nav-footer">
              <p>{labels[locale].footer.copyright} <Link href="/legale"><a>{labels[locale].footer.legale}</a></Link></p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Nav;

// <video loop muted controls width="auto" height="75%" ref={this.video}>
//   <source src="https://vimeo.com/383108369" type="video/mp4" />
//   Sorry, your browser doesn't support embedded videos.
// </video>
