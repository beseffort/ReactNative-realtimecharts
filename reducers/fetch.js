import * as types from '../actions/actionTypes';

const initialState = {
    failure: false,
    data: [],
    errorMessage: '',
};

export default function fetch(state = initialState, action) {
    switch (action.type) {
        case types.FETCH_DATA.REQUEST:
            return state;
        case types.FETCH_DATA.SUCCESS:
            return Object.assign({}, state, {
                failure: false,
                data: action.data,
            });
        case types.FETCH_DATA.FAILURE:
            return Object.assign({}, state, {
                failure: true,
                errorMessage: action.err,
            });
        default:
            return state;
    }
}