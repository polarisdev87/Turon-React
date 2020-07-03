import React, { Component } from "react";
import history from "./../services/history";
import { connect } from "react-redux";

import { actionLogin } from '../actions/actions';

import './styles/Auth.scss';
import { MultiAuth } from "./MultiAuth";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  onSubmit(e){
    e.preventDefault();

    this.props.log(this.state);
  }

  handleMultiAuth(data){
    this.props.log(data);
  }

  render() {
    return (
      <div className="auth">
        <div className="card shadow">
          <div className="card-body text-center">
            <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>Login</h1>
            <form onSubmit={this.onSubmit.bind(this)}>
              {
                  this.props.error && (
                      <div className="alert alert-danger">
                          {this.props.error}
                      </div>
                  )
              }
              <div className="form-group">
                  <input type="text" name="email" onChange={(e) => this.setState({email: e.target.value})} required placeholder="Enter Email" className="form-control" />
              </div>

              <div className="form-group">
                  <input type="password" name="password" onChange={(e) => this.setState({password: e.target.value})} required placeholder="Enter Password" className="form-control" />
              </div>

              <div className="text-center" style={{marginTop: '2rem'}}>
                  <button type="submit" className="btn btn-outline-secondary btn-lg">Login</button>
              </div>

              <hr />

              <div className="auth-brands">
                <h3>Login with:</h3>

                <MultiAuth onSubmit={this.handleMultiAuth.bind(this)} />
                
              </div>

              <hr />

              <a href="#" onClick={() => {
                this.props.history.push('/signup')
              }} className="mt-4 d-block text-secondary">New user? Sign up here!</a>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    log: data => dispatch(actionLogin(data))
  };
};
const mapStateToProps = state => {

  if(state.isNotCompleted && state.isNotCompleted.length){

    history.push('/finish-registration', {fields: state.isNotCompleted, user_id: state.user.id});
}

if(state.isAuthenticated){
    history.push('/');
}

  return {
    error: state.error
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
