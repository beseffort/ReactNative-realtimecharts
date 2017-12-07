import * as types from './actionTypes';

export function loginRequest(name, key) {
    return {
        type: types.LOGIN.REQUEST,
        name,
        key,
    }
}

export function loginSuccess(name, key) {
    return {
        type: types.LOGIN.SUCCESS,
        name,
        key,
    }
}

export function loginFailure(err) {
    return {
        type: types.LOGIN.FAILURE,
        err,
    }
}

export function logout() {
    return {
        type: types.LOGOUT,
    }
}