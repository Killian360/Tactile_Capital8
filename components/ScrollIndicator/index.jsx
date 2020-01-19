import React from "react";
import "./indicator.css";
import * as animate from "./animation";


class ScrollIndicatorComponent extends React.Component {

  componentDidMount()
  {
    animate.animation("ArrowAnim");
  }

  render() {
    return (
      <React.Fragment>
        <div id="Scroll_Indicator" onClick={this.props.click}>
          <div className="indicator_txt">
<svg width="100%" viewBox="0 0 22 32">
<g className="Mouse_svg">
	<path fill="none" stroke="#fff" strokeWidth="1" d="M11.1,1L11.1,1c5.5,0,10,4.5,10,10v10c0,5.5-4.5,10-10,10l0,0c-5.5,0-10-4.5-10-10V11C1.2,5.5,5.6,1,11.1,1z"
		/>
</g>
<g id="Calque_2_1_" className="indicator_arrow_svg">
	<g id="Groupe_450">
		<line id="Ligne_32" stroke="#fff" strokeWidth="1" x1="11.1" y1="9.4" x2="11.1" y2="20.4"/>
		<path id="Tracé_15"  stroke="#fff" fill="none" d="M13.4,18.2l-2.2,2.2L9,18.2"/>
	</g>
</g>
</svg>
          </div>
        </div>
        </React.Fragment>
    );
  }
}

export default ScrollIndicatorComponent;
