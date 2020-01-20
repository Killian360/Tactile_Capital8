import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import Button from '../components/Button'
import { useSpring, animated } from 'react-spring'

import '../styles/Contact.scss'


//3D animation card 

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function Card(props) {
  const [animationprops, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))
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
        console.log(that.state.data);
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

  render() {
    const { data } = this.state;

    if (!data) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Contact">
          <h2 className="Contact-title bold">{data.title.rendered}</h2>
          <Card>
            {/* <div className="testtitre">{data.content.title}</div> */}
            <div className="Contact-content" dangerouslySetInnerHTML={{ __html: data.content.rendered }}></div>
          </Card>
        </div>
      </React.Fragment>
    )
  }
}

export default Contact
