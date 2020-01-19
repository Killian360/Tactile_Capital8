import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import SVG from 'react-inlinesvg'

import Button from '../components/Button'
import labels from '../constants/labels'

import '../styles/Posts.scss'

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    }
  }

  fetchData(locale) {
    const that = this;

    axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/posts?filter[lang]=${locale}`)
      .then(function(response) {
        that.setState({posts: response.data});
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
    const { posts } = this.state;

    if(!posts) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Posts">
          {posts.map((post, index) => (
            <Link href="/news/[slug]" as={`/news/${post.slug}`} key={index}>
              <div className="Posts-item" style={{backgroundImage: "url(" + post.acf.image.url + ")", backgroundSize: "cover"}}>
                <div className="Posts-item-overlay"></div>
                <div className="Posts-item-content">
                  <h2 className="Posts-item-title bold">{post.title.rendered}</h2>
                  <Button className="Posts-item-button">
                  <span>
                    {labels[this.props.locale].news.button}
                    <SVG
                      src="/assets/svgs/arrow-next.svg"
                      style={{ fill: "#fff" }}
                     />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
          <div className="clear"></div>
        </div>
      </React.Fragment>
    )
  }
}

export default Posts
