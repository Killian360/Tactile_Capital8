import React from 'react'
import Link from 'next/link'
import SVG from 'react-inlinesvg'

import labels from '../constants/labels'

import Nav from '../components/Nav'

import './Layout.scss';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditions: {
        hasFooter: false,
        isLogoBlue: false,
        isMenuBlue: false,
        isNews: false
      }
    }
  }

  static async getInitialProps({ query }) {
    return { query };
  }

  updateLayout() {
    const { query, route } = this.props;
    let conditions = {
      hasFooter: this.state.conditions.hasFooter,
      isNews: this.state.conditions.isNews,
      isLogoBlue: this.state.conditions.isLogoBlue,
      isMenuBlue: this.state.conditions.isMenuBlue
    };

    if((query && query.slug !== undefined) || route === "/medias" || route === "/contact" || route === "/news") {
      conditions.hasFooter = true;
    }

    if(query && query.type === undefined && query.slug !== undefined) {
      conditions.isNews = true;
    }

    if(route === "/") {
      conditions.hasFooter = false;
    }

    if(window.innerWidth < 768) {
      conditions.isLogoBlue = true;
      conditions.isMenuBlue = true;
    } else {
      if(route === "/contact" || route === "/legale" || (query && !query.type && query.slug)) {
        conditions.isLogoBlue = true;
        conditions.isMenuBlue = true;
      } else {
        conditions.isLogoBlue = false;
        conditions.isMenuBlue = false;
      }
    }

    this.setState({conditions: conditions});
  }

  componentDidMount() {
    const that = this;
    this.updateLayout();

    window.addEventListener('resize', function() {
      that.updateLayout();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.route !== prevProps.route || this.props.query !== prevProps.query) {
      this.updateLayout();
    }
  }

  render() {
    const { children, handleChangeLocale, locale } = this.props;
    const { conditions } = this.state;

    return (
      <div className="Layout">

        <div className="Layout-content">
          { children }
        </div>

        {conditions.hasFooter &&
          <div className="Layout-footer">
            <div className="Layout-footer-back">
              {conditions.isNews ? (
                <Link href="/news">
                  <p className="Layout-footer-back-news">
                    <SVG
                      src="/assets/svgs/arrow-prev.svg"
                      style={{ fill: "#fff" }}
                      />
                    {labels[locale].footer.back.news}
                  </p>
                </Link>
              ) : (
                <Link href="/">
                  <p className="Layout-footer-back-home">
                    <SVG
                      src="/assets/svgs/arrow-prev.svg"
                      style={{ fill: "#fff" }}
                      />
                    {labels[locale].footer.back.home}
                  </p>
                </Link>
              )}
            </div>
            <div className="Layout-footer-logo">
              <Link href="/">
                <SVG
                  src="/assets/svgs/capital8.svg"
                  style={{ fill: "#fff" }}
                  />
              </Link>
            </div>
            <div className="Layout-footer-copyright">
              <p>{labels[locale].footer.copyright}</p>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Layout;

// <Nav isLogoBlue={conditions.isLogoBlue} isMenuBlue={conditions.isMenuBlue} handleChangeLocale={handleChangeLocale} locale={locale} />
