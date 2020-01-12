import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import '../styles/Legale.scss'

class Legale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  fetchData(locale) {
    const slug = locale === 'en' ? 'legal-notices' : 'mentions-legales';
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
        <div className="Legale">
          <h2 className="Legale-title bold">{data.title.rendered}</h2>
          <div className="Legale-content" dangerouslySetInnerHTML={{__html: data.content.rendered}}></div>
        </div>
      </React.Fragment>
    )
  }
}

export default Legale
