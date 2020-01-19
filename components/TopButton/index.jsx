import React from "react";
import "./button.css";
import * as animate from "./animation";

class TopButtonUI extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };

  }

    componentDidMount()
  {
  this.isNotMobile = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;  
  window.addEventListener('scroll', this.handleScroll, true);
  }

  hover() {
    this.isNotMobile && animate.animation("Hover", this.props.ID);
  }

  out() {
    this.isNotMobile && animate.animation("Out", this.props.ID);
  }
  
  press()
  {
    this.isNotMobile && animate.animation("Pressed", this.props.ID);
  }

  release()
  {
    this.isNotMobile && animate.animation("Released", this.props.ID);
  }

  shouldComponentUpdate(prevProps)
  {
    if (prevProps.Show !== this.props.show)
    {
      return true;
    } else 
    {
      return false;
    }
  }

  componentDidUpdate()
  {
  }


handleClickTop()
    {
        window.scrollTo({
      top: 0,
      behavior: 'smooth',
  });
} 

  render() {
    return (
      <React.Fragment>
        <div
          id="TopButton"
          onMouseEnter={this.hover.bind(this)}
          onMouseLeave={this.out.bind(this)}
          onMouseDown={this.press.bind(this)}
          onMouseUp={this.release.bind(this)}
          key={this.props.ID}
          onClick={() => this.handleClickTop()}
        >
<svg id="Top_arrow" x="0px" y="0px" viewBox="0 0 31.49 31.49">
<path fill="#FFF" d="M26.477,10.274c0.444,0.444,0.444,1.143,0,1.587c-0.429,0.429-1.143,0.429-1.571,0l-8.047-8.047
	v26.555c0,0.619-0.492,1.111-1.111,1.111c-0.619,0-1.127-0.492-1.127-1.111V3.813l-8.031,8.047c-0.444,0.429-1.159,0.429-1.587,0
	c-0.444-0.444-0.444-1.143,0-1.587l9.952-9.952c0.429-0.429,1.143-0.429,1.571,0L26.477,10.274z"/>
</svg>
        </div>
        </React.Fragment>
    );
  }
}

export default TopButtonUI;
