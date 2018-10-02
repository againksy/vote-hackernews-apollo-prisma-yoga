import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'
const header__item_Class = 'header__item'

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {header__item_Class}
  }
  render() {
    let { header__item_Class } = this.state
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <header className="header">
        <nav className={`${header__item_Class} header__item_left`}>
          <Link to="/" className="header__item_link">
            new
          </Link>
          <span className="header__item_sep">|</span>
          <Link to="/top" className="header__item_link">
            top
          </Link>
          <span className="header__item_sep">|</span>
          <Link to="/search" className="header__item_link">
            search
          </Link>
          {authToken && (<div>
              <span className="header__item_sep">|</span>
              <Link to="/create" className="header__item_link">
                submit
              </Link>
            </div>)}
        </nav>
        <div className={`${header__item_Class} header__item_right`}>
          {authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                this.props.history.push(`/`)
              }}
            >
              Sign out
            </div>
          ) : (
              <Link to="/login" className="header__item_link">
                Sign in
            </Link>
            )}
        </div>
          <a className="header__mobile_icon" onClick={e => {
              e.preventDefault()
              if (header__item_Class === "header__item") {
              } else {
                header__item_Class = "header__item";
              }
              this.setState({header__item_Class})
            }} >
            <i className="fa fa-bars"></i>
          </a>
      </header>
    )
  }
}

export default withRouter(Header)
