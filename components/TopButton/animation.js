import {
  TweenMax,
  Bounce,
  Power4
} from "gsap";

export const animation = (animName) => {

  function HoverCallback()
  {
    TweenMax.set(TopArrow,{top:"100%"});
    TweenMax.to(TopArrow,0.55,{top:"50%", ease:Power4.easeOut});
  }

  var TopBtn = document.getElementById("TopButton");
  var TopArrow = document.getElementById("Top_arrow");

    switch (animName) {
    case 'Show':
      TweenMax.set(TopBtn,{y:100, opacity:0,delay:0.15, display:"block",});
      TweenMax.to(TopBtn,0.55,{y:-190, opacity:1,delay:0.15, ease:Power4.easeOut});
    break;
    case 'Hide':
      TweenMax.to(TopBtn,0.55,{opacity:0, display:"none", ease:Power4.easeOut});
    break;
    case 'Hover':
      TweenMax.to(TopBtn,0.55,{scale:1.3, backgroundPosition:"0% 100%"});
      TweenMax.to(TopArrow,0.35,{top:"-100%", ease:Power4.easeOut, onComplete:HoverCallback});
    break;
    case 'Out':
      TweenMax.to(TopBtn,0.55,{scale:1, backgroundPosition:"0% 0%", ease:Power4.easeOut});
      TweenMax.to(TopArrow,0.55,{top:"50%", ease:Power4.easeOut});
      break;
    case 'Pressed':
      TweenMax.to(TopBtn,0.55,{scale:0.9, ease:Power4.easeOut});
    break;
    case 'Released':
      TweenMax.to(TopBtn,0.3,{scale:1.3});
      TweenMax.to(TopBtn,0.55,{scale:1, delay:0.3, ease:Bounce.easeOut});
    break;
      default:
    }
}
