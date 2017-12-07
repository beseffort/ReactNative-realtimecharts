import React from 'react';
import { take, put, call, fork, select } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { loginSuccess, loginFailure } from '../actions/loginActions';

const fetchUrl = 'https://io.adafruit.com/api/v2';

function loginCall({ name, key }) {
    return new Promise((resolve, reject) => {
        fetch(`${fetchUrl}/${name}/feeds/flow/data?x-aio-key=${key}&limit=1`, { method: "GET" })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.error) {
                    return reject({ status: responseData.error });
                }
                resolve(responseData)
            })
            .catch((error) => {
                reject({ status: 'Something went wrong!' })
            });
    })
}

function* watchLoginRequest() {
    while (true) {
        const { name, key } = yield take(types.LOGIN.REQUEST);

        try {
            const payload = {
                name,
                key,
            }
            const response = yield call(loginCall, payload);
            yield put(loginSuccess(name, key));
            console.log('SAGA LOGIN SUCCESS: ', response);
        } catch (err) {
            console.log('SAGA LOGIN ERR: ', err);
            yield put(loginFailure(err.status));
        }
    }
}


export default function* root() {
    yield fork(watchLoginRequest);
}