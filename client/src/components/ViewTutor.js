import React, { Component } from "react";
import { connect } from "react-redux";
import history from "./../services/history";
import ReactStars from 'react-stars';
import Moment from 'react-moment';

import swal from 'sweetalert2';
import $ from 'jquery';

import './ViewTutor.scss';
import { actionGetTutor, actionGetReviews, actionPostReview } from "../actions/actions";

class ViewTutor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            showReviews: 1
        }

        props.getTutor(props.match.params.pid);
        props.getReviews({id: props.match.params.pid, sid: props.user.id});
    };

    handleSubmit(e){
        e.preventDefault();

        this.props.postReview({
            id: this.props.match.params.pid,
            review: {
                student: this.props.user.id,
                message: this.state.message,
                rating: this.state.rating
            }
        })
    }

    render(){
        if(!this.props.tutor){
            return (
                <div>
                    Loading..
                </div>
            )
        }

        return (
            <div className="card shadow tutor-profile">
                <div className="card-body">
                    <div className="card-top">
                        <img src={this.props.tutor.profile} alt=""></img>
                        <div>
                            <h1>{this.props.tutor.firstName + ' ' + this.props.tutor.lastName}</h1>
                            <p style={{
                                fontSize: '1.25rem'
                            }}>${this.props.tutor.fees}</p>
                            <p>{this.props.tutor.about}</p>
                        </div>
                        <div className="ml-auto">
                            <button
                            onClick={(e) => {
                                e.preventDefault();

                                swal.fire({
                                    title: 'Your request',
                                    showCancelButton: true,
                                    html:
                                        `
                                        <div style="max-width: 300px;margin: auto;">
                                            <input id="swal-input1" style="margin: 0.5rem 0" style="margin: 0.5rem 0" placeholder="Subject" class="swal2-input">
                                            <input id="swal-input2" style="margin: 0.5rem 0" placeholder="Course #" class="swal2-input">
                                            <input id="swal-input3" style="margin: 0.5rem 0" placeholder="Meeting location" class="swal2-input">
                                            <input id="swal-input4" style="margin: 0.5rem 0" placeholder="Date/Time" class="swal2-input">
                                            <textarea id="swal-input5" style="margin: 0.5rem 0" placeholder="Message" class="swal2-input"></textarea>
                                        </div>
                                        `,
                                    preConfirm: function () {
                                        return new Promise(function (resolve) {
                                            const subject = $('#swal-input1').val();
                                            const course = $('#swal-input2').val();
                                            const location = $('#swal-input3').val();
                                            const date = $('#swal-input4').val();
                                            const message = $('#swal-input5').val();

                                            resolve(`Hey, I'd like to request tutoring from you. Subject: ${subject}. Course: ${course}. Meeting location: ${location}. Time: ${date}. Message: ${message}`);
                                        })
                                    },
                                    onOpen: function () {
                                        $('#swal-input1').focus()
                                    }
                                }).then(res => {
                                    if(res.value){
                                        history.push('/chat', {
                                            tutorid: this.props.tutor.id,
                                            message: res.value
                                        })
                                    }
                                })
                            }}
                            className="btn btn-outline-secondary">Message tutor</button>
                        </div>
                    </div>

                    <div className="tutor-profile-main">
                        <div>
                            <div className="tutor-profile-courses">
                                <h3>College courses:</h3>
                                <ul>
                                    <li>Math</li>
                                    <li>Math</li>
                                    <li>Math</li>
                                </ul>
                            </div>

                            <div className="tutor-profile-courses">
                                <h3>School courses:</h3>
                                <ul>
                                    <li>Math</li>
                                    <li>Math</li>
                                    <li>Math</li>
                                </ul>
                            </div>
                        </div>
                        <div className="tutor-profile-courses">
                            <h3>Availability:</h3>
                            <ul className="list-unstyled pl-3">
                                <li>M: 10-8</li>
                                <li>T: 10-8</li>
                                <li>W: 10-8</li>
                                <li>Th: 10-8</li>
                                <li>Fr: 10-8</li>
                                <li>Sat: 10-8</li>
                                <li>Sun: 10-8</li>
                            </ul>
                        </div>
                    </div>

                    <hr />

                    <div className="tutor-profile-reviews">
                        <h3>Reviews ({(this.props.reviews && this.props.reviews.reviews && this.props.reviews.reviews.length ? this.props.reviews.reviews.length : '')})</h3>

                        {
                            this.props.errorReviews ? (
                                <div className="text-center">
                                    Oops.. Can't load reviews
                                </div>
                            ) : this.props.reviews && this.props.reviews.reviews && this.props.reviews.reviews.length ? (
                                <div>
                                    {
                                        this.props.reviews.reviews.map((v, i) => (
                                            (i < this.state.showReviews) &&
                                                (
                                                    <div className="card mb-2">
                                                        <div className="card-body">
                                                        <ReactStars
                                                            count={5}
                                                            size={24}
                                                            edit={false}
                                                            value={v.rating}
                                                            half={false}
                                                            color2={'#ffd700'} />
                                                            <h5><Moment format="MMM Do YYYY">{v.date}</Moment></h5>
                                                            <p>{v.message}</p>
                                                        </div>
                                                    </div>
                                                )
                                            ))
                                    }
                                    {
                                        this.state.showReviews < this.props.reviews.reviews.length && (
                                            <div className="text-center mt-3">
                                                <button className="btn btn-outline-secondary"
                                                    onClick={(e) => {
                                                        e.preventDefault();

                                                        this.setState({
                                                            showReviews: this.state.showReviews + 1
                                                        })
                                                    }}
                                                >Load more</button>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    There are no reviews for this tutor yet.
                                </div>
                            )
                        }

                    </div>

                    {
                        this.props.reviews && this.props.reviews.canLeaveReview && (
                            <div className="tutor-profile-reviews">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Leave your review here:</h4>
                                            
                                        <form onSubmit={this.handleSubmit.bind(this)}>
                                            <ReactStars
                                                count={5}
                                                size={48}
                                                value={this.state.rating}
                                                onChange={(rating) => {
                                                    this.setState({
                                                        rating: rating
                                                    })
                                                }}
                                                half={false}
                                                color2={'#ffd700'} />

                                            <div className="form-group">
                                                <textarea style={{height: 100}} value={this.state.message} onChange={(e) => {
                                                    this.setState({
                                                        message: e.target.value
                                                    })
                                                }} className="form-control"></textarea>                            
                                            </div>

                                            {
                                                this.props.errorPostReview && (
                                                    <div className="alert alert-danger">
                                                        Oops... Something went wrong.
                                                    </div>
                                                )
                                            }

                                            <button disabled={!(this.state.rating && this.state.message)} className="btn btn-outline-secondary">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getReviews: data => dispatch(actionGetReviews(data)),
        getTutor: data => dispatch(actionGetTutor(data)),
        postReview: data => dispatch(actionPostReview(data))
    };
};

const mapStateToProps = states => {

    console.log(states);

    if(!states.isAuthenticated){
        history.push('/login');
        return;
    }

    if(states.errorTutor){
        history.push('/find-tutor');
        return;
    }

    return {
        user:states.isAuthenticated,
        tutor: states.tutor,
        reviews: states.reviews,
        errorReviews: states.errorReviews,
        errorPostReview: states.errorPostReview
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewTutor);