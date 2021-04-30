import { GET_PAST_RESERVATIONS, PAST_RESERVATIONS_LOADING, UPDATE_PAST_RESERVATIONS } from '../actions/types';

const initialState = {
    pastreservations: [],
    pastreservationsLoading: false
};

export default function(state = initialState, action)
{
    switch(action.type)
    {
        case GET_PAST_RESERVATIONS:
            return {
                ...state,
                pastreservations: action.payload,
                pastreservationsLoading: false
            };

        case UPDATE_PAST_RESERVATIONS:
            let index = state.pastreservations.findIndex(
                reservation => reservation._id === action.payload._id
            );

            state.pastreservations.splice(index, 1);

            return {
                ...state,
                pastreservations: [action.payload, ...state.pastreservations],
                pastreservationsLoading: false
            };

        case PAST_RESERVATIONS_LOADING :
            return {
                ...state,
                pastreservationsLoading: true
            };

        default:
            return state;
    }
}
