import axios from 'axios';

import { FIND_CONFLICTS, GET_UPCOMING_RESERVATIONS, RESERVATIONS_LOADING, DELETE_RESERVATION, NEW_RESERVATION, SEND_MAIL, GET_ERRORS } from './types';

export const createReservation = newReservation => dispatch => {
  //
        axios.all([axios.post("/api/reservations/newReservation", newReservation),
                   axios.post("/api/reservations/sendMail", newReservation)
        ])
        // axios.post("/api/reservations/newReservation", newReservation)
        .then(res =>
            dispatch({
                type: NEW_RESERVATION,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: NEW_RESERVATION,
                payload: null
            })
        );


};

export const findConflicts = newReservation => dispatch => {
    axios
        .post("/api/reservations/findConflicts", newReservation)
        .then(res =>
            dispatch({
                type: FIND_CONFLICTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }));
}

export const getUpcomingReservations = () => dispatch => {
    dispatch(setReservationsLoading());
    axios
        .get('/api/reservations/getUpcomingRes')
        .then(res =>
            dispatch({
                type: GET_UPCOMING_RESERVATIONS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_UPCOMING_RESERVATIONS,
                payload: null
            })
        );
};

export const getUpcomingResID = id => dispatch => {
    dispatch(setReservationsLoading());
    axios
        .get(`/api/reservations/upcoming/${id}`)
        .then(res =>
            dispatch({
                type: GET_UPCOMING_RESERVATIONS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_UPCOMING_RESERVATIONS,
                payload: null
            })
        );
};

export const deleteReservation = id => dispatch => {
    axios
        .delete(`api/reservations/delete/${id}`)
        .then(res =>
            dispatch({
                type: DELETE_RESERVATION,
                payload: id
            })
        )
        .catch(err => console.log(err));
};

export const setReservationsLoading = () => {
    return {
        type: RESERVATIONS_LOADING
    };
};
