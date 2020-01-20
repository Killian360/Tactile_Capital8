import {
  TweenMax,
  Bounce,
  Power4
} from "gsap";

export const animation = (animName) => {

  var Nav = document.getElementsByClassName("Menu");

    switch (animName) {
    case 'Show':
      var calc = window.innerHeight-80;
      TweenMax.to(".Nav-footer",0.2, { opacity: 0}); 
      TweenMax.to(".Menu-secondary", 0.2, { opacity: 0});
      TweenMax.to(Nav,0.4,{top:80});
    break;
    case 'Hide':
      TweenMax.to(Nav,0.4,{top:0});
    break;
      default:
    }
}
