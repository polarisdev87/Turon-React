import React from 'react'
import { connect } from 'react-redux'
import history from "./../services/history";
import './styles/Profile.scss';

class Profile extends React.Component {
    constructor(props) {
        super(props)
        console.log('user information -- ', props)
        this.state = {
            id: 1,
            username: 'Irina A.',
            subjects: 'Wordpress/WooCommerce',
            fee: '95',
            zip_code: '44000',
            bio: '76',
            avatar: '',
            description: 'Client is my king! I am a senior web developer with more than 10 years experiences in creating responsive websites and e-commerce applications using XHTML, CSS3, JS, jQuery, PHP and MySQL.',
            // id: props.id,
            // avatar: props.avatar
            // username: props.firstName + ' ' + props.lastName,
            // subjects: props.subject,
            // fee: props.fee,
            // description: props.description,
            // zip_code: props.zip_code
        }
    }

    render() {
        return(
            <div className="profile-container">
                <div className="row">
                    <div className="avatar">
                        <img src={require("../images/Tutor.jpg")} ></img>
                    </div>
                    <div className="detail-header">
                        <div className="header-left">
                            <div className="name">{this.state.username}</div>
                            <div className="subjects">{this.state.subjects}</div>
                        </div>
                        <div className="header-right">
                            <div className="like"><i className="far fa-heart"></i></div>
                            <div className="view-tutor" onClick={(e) => {
                                e.preventDefault();
                                history.pushState(`/view-tutor/${this.state.id}`)
                            }}>View Tutor</div>
                            <div className="post-job">Post Job</div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="detail-center">
                        <div className="description">{this.state.description}</div>
                    </div>
                    <div className="detail-bottom">
                        <div className="rate"><b>${this.state.fee} </b>/ hr</div>
                        <div className="bio">
                            <div className="bio-percent"><b>76%</b>  Job Success</div>
                            <div className="bio-bar"></div>
                        </div>
                        <div className="zip-code">
                            <b>{this.state.zip_code}</b>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Profile)