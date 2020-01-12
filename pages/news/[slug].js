import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import findIndex from 'lodash.findindex'
import SVG from 'react-inlinesvg'

import '../../styles/Post.scss'

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      posts: null
    }
  }

  static async getInitialProps({ query }) {
    return { query };
  }

  fetchData(locale) {
    const { slug } = this.props.query;
    const that = this;

    axios.all([
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/posts`),
      axios.get(`http://admincapital8.tactile-communication.com/wp-json/wp/v2/posts?slug=${slug}`)
    ])
      .then(axios.spread(function(posts, post) {
        that.setState({
          posts: posts.data,
          post: post.data[0]
        });
      }));
  }

  componentDidMount() {
    this.fetchData(this.props.locale);
  }

  componentDidUpdate(prevProps) {
    if (this.props.query.slug !== prevProps.query.slug || this.props.locale !== prevProps.locale) {
      this.fetchData(this.props.locale);
    }
  }

  render() {
    const { post, posts } = this.state;

    if(!posts && !post) {
      return null;
    }

    const currentPostIndex = findIndex(posts, function(p) { return p.id === post.id; });
    const prevIndex = currentPostIndex - 1 < 0 ? posts.length - 1 : currentPostIndex - 1;
    const nextIndex = currentPostIndex + 1 > (posts.length - 1) ? 0 : currentPostIndex + 1;

    return (
      <React.Fragment>
        <div className="Post">
          <div className="Post-wrapper">
            <div className="Post-content">
              <p className="Post-content-subtitle">{post.acf.subtitle}</p>
              <h3 className="Post-content-title">{post.title.rendered}</h3>
              <div className="Post-content-text" dangerouslySetInnerHTML={{__html: post.content.rendered}}></div>

              <div className="Post-content-arrows">
                <Link href="/news/[slug]" as={`/news/${posts[prevIndex].slug}`}>
                  <SVG
                    src="../../assets/svgs/arrow-prev.svg"
                    className="Post-content-arrows-left"
                    style={{ fill: "#999" }} />
                </Link>
                <Link href="/news/[slug]" as={`/news/${posts[nextIndex].slug}`}>
                  <SVG
                    src="../../assets/svgs/arrow-next.svg"
                    className="Post-content-arrows-right"
                    style={{ fill: "#999" }} />
                </Link>
              </div>
            </div>
          </div>
          <div className="Post-media">
            {post.acf.video ? (
              <div className="Post-media-video" dangerouslySetInnerHTML={{__html: post.acf.video}}></div>
            ) : (
              <div className="Post-media-image" style={{backgroundImage: "url(" + post.acf.image.url + ")"}}></div>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Post
