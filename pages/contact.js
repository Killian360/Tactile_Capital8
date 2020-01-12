import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import Button from '../components/Button'

import '../styles/Contact.scss'

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
      .then(function(response) {
        that.setState({data: response.data[0]});
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

    if(!data) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Contact">
          <h2 className="Contact-title bold">{data.title.rendered}</h2>
          <div className="Contact-content" dangerouslySetInnerHTML={{__html: data.content.rendered}}></div>
        </div>
      </React.Fragment>
    )
  }
}

export default Contact
