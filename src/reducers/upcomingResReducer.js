import { FIND_CONFLICTS, GET_UPCOMING_RESERVATIONS, RESERVATIONS_LOADING, DELETE_RESERVATION, NEW_RESERVATION } from '../actions/types';

const initialState = {
    upcomingreservations: [],
    upcomingreservationsLoading: false,
    noconflicts: false
};

export default function(state = initialState, action)
{
    switch(action.type)
    {
        case NEW_RESERVATION:
            return {
                ...state,
                upcomingreservations: [action.payload, ...state.upcomingreservations]
            };

        case FIND_CONFLICTS:
            return {
                ...state,
                upcomingreservations: action.payload,
                noconflicts: true
            };

        case GET_UPCOMING_RESERVATIONS:
            return {
                ...state,
                upcomingreservations: action.payload,
                upcomingreservationsLoading: false
            };

        case RESERVATIONS_LOADING:
            return {
                ...state,
                upcomingreservationsLoading: true
            };

        case DELETE_RESERVATION:
            return {
                ...state,
                upcomingreservations: state.upcomingreservations.filter(
                    upcomingreservations => upcomingreservations._id !== action.payload
                )
            };

        default:
            return state;
    }
}
