import React from 'react';
import { connect } from 'react-redux';
import history from './../services/history';
import { actionUpdate } from '../actions/actions';

class PartialUpdate extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userid: '',
            email: '',
            university: '',
            zipcode: ''
        }
    }

    onSubmit(e){
        e.preventDefault();

        console.log(this.props.history);

        if(!this.props.history.location || !this.props.history.location.state){
            return
        }

        const {user_id} = this.props.history.location.state;

        if(!user_id){
            return;
        }

        this.props.update({
            user_id,
            ...this.state
        })
    }

    render(){

        if(!this.props.history.location || !this.props.history.location.state){
            this.props.history.push('/');
            return <div></div>;

        }

        const {fields} = this.props.history.location.state;

        if(!fields || !fields.length){
            this.props.history.push('/');
            return <div></div>;
        }

        return (
            <div className="auth">
              <div className="card shadow">
                <div className="card-body text-center">
                  <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>Finish up</h1>
                  <form onSubmit={this.onSubmit.bind(this)}>
                    {
                        this.props.error && (
                            <div className="alert alert-danger">
                                {this.props.error}
                            </div>
                        )
                    }

                    {
                        fields.indexOf('email') !== -1 &&
                            (
                                <div className="form-group">
                                    <input type="email" onChange={(e) => this.setState({email: e.target.value})} required placeholder="Enter Email" className="form-control" />
                                </div>
                            )
                    }

                    {
                        fields.indexOf('university') !== -1 &&
                            (
                                <div className="form-group">
                                    <select 
                                        className="form-control"
                                        required
                                        onChange={(e) => {
                                            this.setState({
                                                university: e.target.value
                                            });
                                        }}>
                                        <option value="" selected disabled>Select University</option>
                                        <option value="San Jose State University">San Jose State University</option>
                                        <option value="San Deigo State University">San Diego State University</option>
                                    </select>
                                </div>
                            )
                    }

                    {
                        fields.indexOf('zipcode') !== -1 &&
                            (
                                <div className="form-group">
                                    <input type="text" onChange={(e) => this.setState({zipcode: e.target.value})} required placeholder="Enter Zip Code" className="form-control" />
                                </div>
                            )
                    }
                    
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

const mapDispatchToProps =(dispatch)=> {
    return {
        update : (data) => dispatch(actionUpdate(data)),
    };
}

const mapStateToProps = (state)=> {

    console.log(state);


    if(state.isAuthenticated){
        history.push('/');
    }

    return {
        error: state.error,
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PartialUpdate);