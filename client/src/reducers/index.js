import {HUMID, LOGIN, TABLE,FIND,TUTOR} from '../actions/actions';
import {SIGNUP} from '../actions/actions';
import {TEMP} from '../actions/actions';
import _ from 'lodash';
import Socket from '../components/Chat/socket';

const stores = (state = {}, action) => {
    const user = JSON.parse(localStorage.getItem('uuid') || '{}')
    state.isAuthenticated = _.size(user) ? user : false;

    if(state.isAuthenticated && !state.socket){
        state.socket = new Socket();
    }

    switch (action.type) {

        case 'LOGIN':       
            if(action.error){
                return {
                    ...state,
                    error: action.error
                }
            }

            return {
                ...state,
                error: null,
                isNotCompleted: [action.data.university ? undefined : 'university', action.data.email ? undefined : 'email', action.data.zipcode ? undefined : 'zipcode'],
                user: action.data
            };
        case 'LOGOUT': {
            if(action.error){
                return {
                    ...state,
                    error: action.error
                }
            }

            return {
                ...state,
                error: null,
                isNotCompleted: null,
                user: null
            };
        }
        case 'SIGNUP':
            if(action.error){
                return {
                    ...state,
                    error: action.error
                }
            }

            return {
                ...state,
                error: null,
                isNotCompleted: [action.data.university ? undefined : 'university', action.data.email ? undefined : 'email', action.data.zipcode ? undefined : 'zipcode'],
                user: action.data
            }
        case 'UPDATE':
            if(action.error){
                return {
                    ...state,
                    error: action.error
                }
            }

            return {
                ...state,
                error: null,
                isNotCompleted: [action.data.university ? undefined : 'university', action.data.email ? undefined : 'email', action.data.zipcode ? undefined : 'zipcode'],
                user: action.data
            }
        case 'GET_TUTORS': {
            if(action.error){
                return {
                    ...state,
                    error: action.error
                }
            }

            return {
                ...state,
                error: null,
                tutors: action.data
            }
        }

        case 'GET_TUTOR': {
            if(action.error){
                return {
                    ...state,
                    errorTutor: action.error
                }
            }

            return {
                ...state,
                error: null,
                tutor: action.data
            }
        }

        case 'BECOME_TUTOR': {
            if(action.error){
                return {
                    ...state,
                    errorTutor: action.error
                }
            }

            return {
                ...state,
                error: null,
                tutor_id: action.data
            }
        }

        case 'GET_REVIEWS': {
            if(action.error){
                return {
                    ...state,
                    errorReviews: action.error
                }
            }

            return {
                ...state,
                error: null,
                reviews: action.data
            }
        }

        case 'POST_REVIEW': {
            if(action.error){
                return {
                    ...state,
                    errorPostReview: action.error
                }
            }

            return {
                ...state,
                error: null,
                errorPostReview: null,
                reviews: action.data
            }
        }
            
        case TEMP:
            console.log("im here in Temp store");
            console.log(localStorage.setItem("temperature",action.data.temperature));
            console.log(stores);
            return {
                ...state,
                "stores":{
                    "tempval": action.data.temperature
                }
            };
        case HUMID:
            console.log("im here in humival store");
            console.log(localStorage.setItem("humid",action.data.humidity));
            console.log(stores);
            return {
                ...state,
                "stores":{
                    "humival": action.data.humidity
                }
            };

        case TABLE:
            console.log("im here in TABLE store");
            console.log(action.data.deviceData);
            console.log(stores);
            return {
                ...state,
                "stores":{
                    "tableData": action.data.deviceData
                }
            };

        case FIND:
        console.log("im here in FIND store");
        console.log(action.data.value);
        // console.log(stores);
        return {
            ...state,
            "stores":{
                "FindData": action.data.value
            }
        };

        case TUTOR:
            console.log("im here in TUTOR store");
            console.log(action.data.deviceData);
            console.log(stores);
            return {
                ...state,
                "stores":{
                    "tableData": action.data.deviceData
                }
            };
        default :
            return state;

    }
};

export default stores;