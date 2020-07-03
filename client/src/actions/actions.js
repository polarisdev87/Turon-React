import * as API from './../api/API';
import { dispatch } from 'rxjs/internal/observable/pairs';

export const LOGIN ="LOGIN";
export const SIGNUP ="SIGNUP";
export const POST ="POST";
export const TEMP ="TEMP";
export const HUMID ="HUMID";
export const TABLE ="TABLE";
export const FIND ="FIND";
export const TUTOR ="TUTOR";
export const UPDATE = "UPDATE";

const saveLocal = (user) => {
    localStorage.setItem('uuid', JSON.stringify(user));
}

export const actionLogin = (userdata) => {
    return async (dispatch) => {
        try{
            const response = await API.doLogin(userdata);

            if(response.data.email && response.data.university && response.data.zipcode){
                saveLocal(response.data);
            }

            dispatch({
                type: 'LOGIN',
                data: response.data
            });
        }catch(e){
            dispatch({
                type: 'LOGIN',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
        
    }
}

export const actionSign = (userdata) => {
    return async (dispatch) => {
        try{
            const response = await API.doSignUp(userdata);

            if(response.data.email && response.data.university && response.data.zipcode){
                saveLocal(response.data);
            }

            dispatch({
                type: 'SIGNUP',
                data: response.data
            });
        }catch(e){
            dispatch({
                type: 'SIGNUP',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
    }
}

export const actionUpdate = (userdata) => {
    return async (dispatch) => {
        try{
            const { user_id } = userdata;

            delete userdata.user_id;

            const response = await API.doUpdate(user_id, userdata);

            if(response.data.email && response.data.university && response.data.zipcode){
                saveLocal(response.data);
            }

            dispatch({
                type: 'UPDATE',
                data: response.data,
            });
        }catch(e){
            dispatch({
                type: 'UPDATE',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
    }
}

export const actionLogOut = () => {
    return async (dispatch) => {
        localStorage.clear();

        dispatch({
            type: 'LOGOUT'
        })
    }
}

export const actionGetTutors = (searchData) => {
    return async (dispatch) => {
        try{
            if(searchData === null){
                return dispatch({
                    type: 'GET_TUTORS',
                    data: [],
                });
            }

            const response = await API.getTutors(searchData);

            dispatch({
                type: 'GET_TUTORS',
                data: response.data,
            });

        }catch(e){
            dispatch({
                type: 'GET_TUTORS',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }        
    }
}

export const actionGetTutor = (data) => {
    return async (dispatch) => {
        try{
            const response = await API.getTutor(data);

            dispatch({
                type: 'GET_TUTOR',
                data: response.data,
            });

        }catch(e){
            dispatch({
                type: 'GET_TUTOR',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
    }
}

export const actionGetReviews = (data) => {
    return async (dispatch) => {
        try{
            const response = await API.getReviews(data.id, data.sid);

            dispatch({
                type: 'GET_REVIEWS',
                data: response.data
            });

        }catch(e){
            console.log(e);

            dispatch({
                type: 'GET_REVIEWS',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
    }
}

export const actionPostReview = (data) => {
    return async (dispatch) => {
        try{
            const response = await API.postReview(data.id, data.review);

            dispatch({
                type: 'POST_REVIEW',
                data: response.data
            });

        }catch(e){
            console.log(e);

            dispatch({
                type: 'POST_REVIEW',
                data: null,
                error: e.response && e.response.data && e.response.data.message || e.message
            })
        }
    }
}

export const actionBecomeTutor = (data) => {
    return async (dispatch) => {
        try{
            const response = await API.becomeTutor(data);

            dispatch({
                type: 'BECOME_TUTOR',
                data: response.data
            })

        }catch(e){
            dispatch({
                error: e.message,
                type: 'BECOME_TUTOR'
            })
        }
    }
}
