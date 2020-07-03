import React, {Component} from 'react';
import history from "./../services/history";
import {connect} from 'react-redux';
import { actionGetTutors } from '../actions/actions';
import Moment from 'react-moment';
import Profile from './Profile';


class FindTutor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'college',
            university: '',
            subject: '',
            course: ''
        };
    }

    handleSubmit(e){
        e.preventDefault();

        const request = {
            subject: this.state.subject,
            course: this.state.course
        }

        if(this.state.type === 'college'){
            Object.defineProperty(request, 'school', {
                value: this.state.university,
                enumerable: true,
                writable: true
            })
        }

        this.props.getTutors(request);
    }

    render(){
        if(this.props.tutors && this.props.tutors.length){
            return (
                <div className="card shadow">
                    <div className="card-body">
                        <h1 className="card-title text-secondary">Out tutors</h1>
                        {
                            this.props.tutors.map((v, i) => (
                                <Profile userinfo={v} />
                            ))
                        }
                        <div className="text-center">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        type: 'college',
                                        university: '',
                                        subject: '',
                                        course: ''
                                    })
                                    this.props.getTutors(null);
                                }}
                                >Search again</button>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="tutor">
                <div className="card shadow text-center form-width">
                    <div className="card-body">
                        {
                            this.props.error && (
                                <div className="alert alert-danger">
                                    {
                                        this.props.error
                                    }
                                </div>
                            )
                        }
                        <div className="button-group">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => this.setState({type: 'college', subject: '', course: ''})}
                                style={{
                                    backgroundColor: this.state.type === 'college' ? '#6a00b1' : '',
                                    color: this.state.type === 'college' ? 'white' : '#6a00b1',
                                }}
                                >College tutoring</button>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => this.setState({type: 'school', subject: '', course: ''})}
                                style={{
                                    backgroundColor: this.state.type === 'school' ? '#6a00b1' : '',
                                    color: this.state.type === 'school' ? 'white' : '#6a00b1'
                                }}
                                >School tutoring</button>
                        </div>

                        <h1 className="text-secondary mt-3 mb-4">{this.state.type === 'college' ? 'College Tutoring' : 'School Tutoring'}</h1>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            {
                                this.state.type === 'college' &&
                                    (
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
                                    )
                            }
                            
                            <div className="form-group">
                                <input type="text" name="subject" value={this.state.subject} placeholder="Select a subject" onChange={(e) => this.setState({subject: e.target.value})} className="form-control" />
                            </div>

                            <div className="form-group">
                                <input type="text" name="course" value={this.state.course} placeholder="Select a course" onChange={(e) => this.setState({course: e.target.value})} className="form-control" />
                            </div>

                            <button className="btn btn-block btn-secondary btn-lg">Search</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


const mapDispatchToProps =(dispatch)=> {
    return {
        getTutors : (data) => dispatch(actionGetTutors(data))
    };
};

const mapStateToProps =(states)=> {
    console.log(states)

    return {
        error: states.error,
        tutors: states.tutors
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(FindTutor);
