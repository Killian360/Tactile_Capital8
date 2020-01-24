import React from 'react'
import Link from 'next/link'
import SVG from 'react-inlinesvg'

import labels from '../constants/labels'

import Nav from '../components/Nav'
import * as animate from "../components/TopButton/animation";
import * as animateBar from "../components/Nav/animation";

import './Layout.scss';

import {
  TweenMax
} from "gsap"

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show : false,
      conditions: {
        hasFooter: false,
        isLogoBlue: false,
        isMenuBlue: false,
        isNews: false,
        isHome: false,
        indexation: 0,
        listeners: []
      }
    }
    var waitingScroll=1;
    this.updateLayout = this.updateLayout.bind(this);
    this.handleScroll = this.handleScroll.bind(this)
  }

  static async getInitialProps({ query }) {
    return { query };
  }

  updateLayout() {
    const { query, route } = this.props;
    let conditions = {
      hasFooter: this.state.conditions.hasFooter,
      isHome: this.state.conditions.isHome,
      isNews: this.state.conditions.isNews,
      isLogoBlue: this.state.conditions.isLogoBlue,
      isMenuBlue: this.state.conditions.isMenuBlue,
      indexation: 0,
      listeners: this.state.conditions.listeners
    };
    
    var body = document.body;

    if (route === "/news" || query && query.type === undefined)
     {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
      {
        console.log(route);
        conditions.hasFooter = false;
        conditions.isLogoBlue = false;
      } else {
        conditions.isNews = false;
        conditions.isLogoBlue = true;
        conditions.hasFooter = true;
      }
      conditions.isHome = false;
    } else if (query && query.type !== undefined && query.slug !== undefined && route !== "/news") {
      conditions.isNews = false;
      conditions.isHome = false;
      conditions.hasFooter = true;
      conditions.isLogoBlue = false;
    }
    
    if (route === "/news")
    {
      conditions.hasFooter = true;
      conditions.isLogoBlue = false;
    }

    if (route === "/contact")
    {
      conditions.hasFooter = true;
      conditions.isLogoBlue = false;
      conditions.isNews = false;
      conditions.isHome = false;
    }


    if (query && query.type === undefined && query.slug !== undefined) {
      conditions.isNews = true;
      conditions.isHome = false;
    }

    if (route === "/") {
      body.classList.add("overflow-none");
      conditions.hasFooter = false;
      conditions.isHome = true;
      conditions.isLogoBlue = false;
    }

    this.setState({ conditions: conditions });
  }


  componentDidMount() {
    const that = this;
    this.updateLayout();

    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('resize', function () {
      that.updateLayout();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.route !== prevProps.route || this.props.query !== prevProps.query) {
      this.updateLayout();
    }

  }



  handleScroll()
{

  var lastScrollY = window.scrollY;
 
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
  {
    var elementExists = document.getElementById("Scroll_Indicator");

    if (lastScrollY>150)
    {
      animateBar.animation("Show");
      elementExists !== null && TweenMax.to("#Scroll_Indicator",0.25,{opacity:0});  
    } else {
      animateBar.animation("Hide");
      elementExists !== null && TweenMax.to("#Scroll_Indicator",0.25,{opacity:1});  
    }
}

  if (lastScrollY>300 && this.state.show==false)
    {
      animate.animation("Show");
      this.setState((state) => ({ show: !state.show }));
    }

  if (lastScrollY<300 && this.state.show==true)
    {
      animate.animation("Hide");
      this.setState((state) => ({ show: !state.show }));
    }

}

componentWillUnmount()
{
  window.removeEventListener('scroll', this.handleScroll, true);
  window.removeEventListener('resize', function () {that.updateLayout();});
}

  render() {
    const { children, handleChangeLocale, locale } = this.props;
    const { conditions } = this.state;

    return (
      <div className="Layout">
        <Nav locale={locale} handleChangeLocale={handleChangeLocale} isLogoBlue={this.state.conditions.isLogoBlue} />
        <div className="Layout-content">
          {children}
          {conditions.hasFooter &&
          <div className="Layout-footer">
            <div className="Layout-footer-back">
              {conditions.isNews ? (

                <Link href="/news">
                  <div className="allNews_desktop">
               <SVG
                src="/assets/svgs/grid.svg"
                style={{ fill: "#0F5F6B" }}
                   />
                {labels[locale].footer.back.news}</div>
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
      </div>
    )
  }
}

export default Layout;

// <Nav isLogoBlue={conditions.isLogoBlue} isMenuBlue={conditions.isMenuBlue} handleChangeLocale={handleChangeLocale} locale={locale} />
