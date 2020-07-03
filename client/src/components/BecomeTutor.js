import React, { Component } from "react";
import history from "./../services/history";
import { connect } from "react-redux";

import { actionLogin, actionBecomeTutor } from '../actions/actions';

import './styles/Auth.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: '',
      fees: '',
      subject: '',
      phone: '',
      profile: ''
    };
  }

  onSubmit(e){
    e.preventDefault();

    this.props.becomeTutor({id: this.props.user.id, ...this.state});
  }

  render() {
    return (
      <div className="auth">
        <div className="card shadow">
          <div className="card-body text-center">
            <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>Become tutor</h1>
            <form onSubmit={this.onSubmit.bind(this)}>
              {
                  this.props.error && (
                      <div className="alert alert-danger">
                          {this.props.error}
                      </div>
                  )
              }

              <div className="form-group">
                  <textarea style={{height: 100}} name="about" onChange={(e) => this.setState({about: e.target.value})} required placeholder="Something about yourself.." className="form-control" />
              </div>

              <div className="form-group">
                  <input type="text" name="fees" onChange={(e) => this.setState({fees: e.target.value})} required placeholder="Enter fees" className="form-control" />
              </div>

              <div className="form-group">
                  <input type="text" name="subject" onChange={(e) => this.setState({subject: e.target.value})} required placeholder="Enter subject" className="form-control" />
              </div>

              <div className="form-group">
                  <input type="tel" name="phone" onChange={(e) => this.setState({phone: e.target.value})} required placeholder="Enter phone" className="form-control" />
              </div>

              <div className="form-group">
                  <input type="text" name="profile" onChange={(e) => this.setState({profile: e.target.value})} required placeholder="Enter profile" className="form-control" />
              </div>

              <div className="text-center" style={{marginTop: '2rem'}}>
                  <button type="submit" className="btn btn-outline-secondary btn-lg">Submit</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    becomeTutor: data => dispatch(actionBecomeTutor(data))
  };
};
const mapStateToProps = state => {

    if(!state.isAuthenticated){
        history.push('/');
        return {};
    }

    if(state.tutor_id){
        history.push(`/view-tutor/69e66210-4b25-11e9-a101-17a8e8de63c6`);
        return {};
    }

    return {
        user: state.isAuthenticated,
        error: state.errorTutor
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
