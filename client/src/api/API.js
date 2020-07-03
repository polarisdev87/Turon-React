import axios from 'axios';
import qs from 'qs';

const api = process.env.REACT_APP_CONTACTS_API_URL;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export const doLogin = (payload) => {
  return axios({
    url: `${api}/login`,
    method: 'POST',
    headers: headers,
    data: JSON.stringify(payload)
  });
}

export const doSignUp = (payload) => {
  return axios({
    url: `${api}/signup`,
    method: 'POST',
    headers: headers,
    data: JSON.stringify(payload)
  })
}

export const doUpdate = (id, payload) => {
  return axios({
    url: `${api}/update/${id}`,
    method: 'PUT',
    headers: headers,
    data: JSON.stringify(payload)
  })
}

export const getTutors = (searchOptions) => {
  return axios({
    url: `${api}/tutors?${qs.stringify(searchOptions)}`,
    method: 'GET',
    headers: headers
  })
}

export const getTutor = (id) => {
  return axios({
    url: `${api}/tutors/${id}`,
    method: 'GET',
    headers: headers
  })
}

export const getReviews = (id, sid) => {
  return axios({
    url: `${api}/reviews/${id}/?sid=${sid}`,
    method: 'GET',
    headers: headers
  })
}

export const postReview = (id, review) => {
  return axios({
    url: `${api}/reviews/${id}`,
    method: 'POST',
    headers: headers,
    data: JSON.stringify(review)
  })
}

export const becomeTutor = (data) => {
  return axios({
    url: `${api}/tutors/${data.id}`,
    method: 'POST',
    headers: headers,
    data: JSON.stringify(data)
  })
}