const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
    const res = {};
    [REQUEST, SUCCESS, FAILURE].forEach(type => res[type] = `${base}_${type}`);
    return res;
}

// Login events
export const LOGIN = createRequestTypes('LOGIN');
export const LOGOUT = 'LOGOUT'; // logout is always success

// Data Fetch events
export const FETCH_DATA = createRequestTypes('FETCH_DATA');