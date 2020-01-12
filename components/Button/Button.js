import React from 'react'
import Link from 'next/link'

import './Button.scss'

class Button extends React.Component {
  render() {
    const { children, href, className } = this.props;

    return (
      <div className={`${className} Button regular`}>
        {href ? (
          <Link href={href}>
            <a>{ children }</a>
          </Link>
        ) : (
          <React.Fragment>
            { children }
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Button;
