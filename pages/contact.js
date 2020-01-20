import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import Button from '../components/Button'
import { useSpring, animated } from 'react-spring'

import '../styles/Contact.scss'
import {
  TweenMax
} from "gsap"

//3D animation card 

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.3]
const trans = (x, y, s) => `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function Card(props) {
  const [animationprops, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 150, friction: 60 } }))
  return (
    <animated.div
      className="cardContact"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: animationprops.xys.interpolate(trans) }}
    >
      {props.children}
    </animated.div>

  )
}


class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  fetchData(locale) {
    const slug = locale === 'en' ? 'contact-2' : 'contact';
    const that = this;

    axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/pages?slug=${slug}`)
      .then(function (response) {
        that.setState({ data: response.data[0] });
      });
  }

  componentDidMount() {
    this.fetchData(this.props.locale);
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  mouseIsEnter()
  {
    TweenMax.to(".contact_background", 1.5, {filter:"blur(1.5px)", scale:0.9});
  }

  mouseIsLeaving()
  {
    TweenMax.to(".contact_background", 1.5, {filter:"blur(0px)", scale:1});
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Contact_wrapper">
        <div className="Contact">
          <h2 className="Contact-title bold">{data.title.rendered}</h2>
          <Card>
            {/* <div className="testtitre">{data.content.title}</div> */}
            <div onMouseEnter={this.mouseIsEnter.bind(this)} onMouseLeave={this.mouseIsLeaving.bind(this)} className="Contact-content" dangerouslySetInnerHTML={{ __html: data.content.rendered }}></div>
          </Card>
        </div>
        <div className="contact_background"></div>
        </div>
      </React.Fragment>
    )
  }
}

export default Contact
