import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import axios from 'axios';

import {Provider} from 'react-redux';
import {store} from '../components/Home/combinereducers.js';

import Layout from '../layouts';

import { gsap } from 'gsap'
import { CSSPlugin } from 'gsap'

// Force CSSPlugin to not get dropped during build
gsap.registerPlugin(CSSPlugin)

import {
  TweenMax
} from "gsap"

class Capital8 extends App {
  constructor(props) {
    super(props);
    this.state = {
      locale: null,
      isIe: false
    };
  }

  handleChangeLocale(locale) {
    const { pageProps } = this.props;

    this.setState({locale: locale});
    localStorage.setItem('locale', locale);

    if(pageProps.query && pageProps.query.type !== undefined && pageProps.query.slug !== undefined) {
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/${pageProps.query.type}?slug=${pageProps.query.slug}`)
        .then(function(page){
          axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/${pageProps.query.type}/${page.data[0].acf.trad_id}`)
            .then(function(translatedPage){
              Router.push(`/[type]/[slug]`, `/${translatedPage.data.type}/${translatedPage.data.slug}`)
            });
        });
    }

    if(pageProps.query && pageProps.query.type === undefined && pageProps.query.slug !== undefined) {
      axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/posts?slug=${pageProps.query.slug}`)
        .then(function(post){
          if(!post.data[0].acf.trad_id) {
            Router.push(`/news`);
          } else {
            axios.get(`https://admincapital8.tactile-communication.com/wp-json/wp/v2/posts/${post.data[0].acf.trad_id}`)
              .then(function(translatedPost){
                Router.push(`/news/[slug]`, `/news/${translatedPost.data.slug}`)
              });
          }
        });
    }
  }

  componentDidMount() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if(localStorage.getItem('locale') === null) {
      localStorage.setItem('locale', 'fr');
    }
  
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
      {
        this.setState({isIe:true})
      }

    this.setState({locale: localStorage.getItem('locale')});
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const { locale, isIe } = this.state;

    if(!locale) {
      return null;
    }

    return (
      <Provider store={store}>
      <div className={`ie_error ${(isIe ? 'ie_visible' : '')}`}><span>Votre navigateur ne supporte pas cette application</span></div>
      <Layout {...pageProps} route={router.pathname} handleChangeLocale={this.handleChangeLocale.bind(this)} locale={locale}>
        <div className="content-wrapper">
        <Component {...pageProps} locale={locale} />
        </div>
      </Layout>
      </Provider>
    );
  }
}

export default Capital8;
