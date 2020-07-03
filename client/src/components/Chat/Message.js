import React from 'react';
import Moment from 'react-moment';

import _ from 'lodash';

export default class Message extends React.Component{
    render(){
        const {message} = this.props;

        return (
            <li className={message.type}>
                {
                    message.showProfile && (
                        <div className={`img-letters ${message.type == 'sent' ? 'float-left mr-2' : 'float-right ml-2'}`}>
                            {_.first(message.firstName) + _.first(message.lastName)}
                        </div>
                    )
                }
                <p className={message.showProfile ? '' : 'message-margin'}>{message.message}</p>
                {
                    message.showTimeStamps && (
                        <small style={{clear: 'both', marginTop: '2px'}} className={message.type == 'sent' ? 'd-block ml-5' : 'float-right mr-5'}><Moment fromNow ago>{message.ts}</Moment> ago</small>
                    )
                }
            </li>
        )
    }
}