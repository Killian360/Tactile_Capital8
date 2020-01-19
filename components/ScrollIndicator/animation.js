import {
  TweenMax,
} from "gsap";

export const animation = (animName) => {

  var triangleId = document.getElementById("Scroll_Indicator");

    switch (animName) {
    case 'Show':
        TweenMax.to(triangleId,0.25,{opacity:1, transformOrigin:"center bottom"});  
    break;
    case 'Hide':
        TweenMax.to(triangleId,0.25,{opacity:0, transformOrigin:"center bottom"});  
    break;
    case 'ArrowAnim':
    break;
      default:
    }
}
