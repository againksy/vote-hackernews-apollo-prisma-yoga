import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    return (
      <div className="auth">
        <h4 className="auth__title">{login ? 'Sign in' : 'Sign Up'}</h4>
        <div className="auth__form">
          <Mutation
              mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
              variables={{ email, password, name }}
              onCompleted={data => this._confirm(data)}
            >
              {loginMutation => (
                <form onSubmit={e=>{
                    e.preventDefault();
                    loginMutation()
                  }} className="auth__form_inputs">
                {!login && (
                  <input
                    className="auth__form_input"
                    value={name}
                    onChange={e => this.setState({ name: e.target.value })}
                    type="text"
                    placeholder="Your name"
                    required={true}
                  />
                )}
                <input
                  className="auth__form_input"
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
                  type="email"
                  placeholder="Your email address"
                  required={true}
                />
                <input
                  className="auth__form_input"
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type="password"
                  placeholder="Choose a safe password"
                  required={true}
                />
                <div className="auth__form_controls">
                  <button type="submit" className="af__controls_button">
                    {login ? 'Login' : 'Register an Account'}
                  </button>
                  <button
                    className="af__controls_button"
                    onClick={() => this.setState({ login: !login })}
                  >
                    {login ? 'Need to create an account?' : 'Already have an account?'}
                  </button>
                </div>
              </form>
            )}
          </Mutation>
        </div>
      </div>
    )
  }

  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

export default Login
