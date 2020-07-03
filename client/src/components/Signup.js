import React, {Component} from 'react';
import {actionSign} from '../actions/actions';
import {connect} from 'react-redux';
import { MultiAuth } from './MultiAuth';

import history from './../services/history';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            university: 'San Jose State University',
            firstName:'',
            lastName:'',
            email:'',
            password: '',
            confirmPassword:'',
            zipcode:''
        };
    }

    onSubmit(e){
        e.preventDefault();

        this.props.signup(this.state);
    }

    handleMultiAuth(data){
        this.props.signup(data);
    }

    render() {     
        return (
        <div className="auth signup">
            <div className="card shadow">
            <div className="card-body text-center">
                <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>Sign Up</h1>
                <form onSubmit={this.onSubmit.bind(this)}>
                {
                    this.props.error && (
                        <div className="alert alert-danger">
                            {this.props.error}
                        </div>
                    )
                }

                    <div className="form-group">
                        <select 
                            className="form-control"
                            onChange={(e) => {
                                this.setState({
                                    university: e.target.value
                                });
                            }}>
                            <option defaultValue value="San Jose State University">San Jose State University</option>
                            <option value="San Deigo State University">San Diego State University</option>
                        </select>              
                    </div>


                <div className="form-group">
                    <input type="text" name="firstName" onChange={(e) => this.setState({firstName: e.target.value})} required placeholder="Enter first name" className="form-control" />
                </div>

                <div className="form-group">
                    <input type="text" name="lastName" onChange={(e) => this.setState({lastName: e.target.value})} required placeholder="Enter last name" className="form-control" />
                </div>

                <div className="form-group">
                    <input type="text" name="email" onChange={(e) => this.setState({email: e.target.value})} required placeholder="Enter Email" className="form-control" />
                </div>

                <div className="form-group">
                    <input type="password" name="password" onChange={(e) => this.setState({password: e.target.value})} required placeholder="Enter Password" className="form-control" />
                </div>

                <div className="form-group">
                    <input type="password" name="confirmPassword" onChange={(e) => this.setState({confirmPassword: e.target.value})} required placeholder="Confirm your password" className="form-control" />
                </div>

                <div className="form-group">
                    <input type="text" name="zipcode" onChange={(e) => this.setState({zipcode: e.target.value})} required placeholder="Enter zip code" className="form-control" />
                </div>

                <div className="text-center" style={{marginTop: '2rem'}}>
                    <button type="submit" className="btn btn-outline-secondary btn-lg">Sign Up</button>
                </div>

                <hr />

                <div className="auth-brands">
                    <h3>Sign up with:</h3>

                   <MultiAuth onSubmit={this.handleMultiAuth.bind(this)} />
                </div>

                <hr />

                <a href="#" onClick={() => {
                    this.props.history.push('/login');
                }} className="mt-4 d-block text-secondary">Have an account? Login here!</a>

                </form>
            </div>
            </div>
        </div>
        );
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        signup : (data) => dispatch(actionSign(data)),
    };
}

const mapStateToProps = (state)=> {

    if(state.isNotCompleted && state.isNotCompleted.length){

        history.push('/finish-registration', {fields: state.isNotCompleted, user_id: state.user.id});
    }

    if(state.isAuthenticated){
        history.push('/');
    }

    return {
        error: state.error,
        isAuthenticated: state.isAuthenticated
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);