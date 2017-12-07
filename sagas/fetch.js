import React from 'react';
import { take, takeLatest, put, call, fork, select } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { fetchSuccess, fetchFailure } from '../actions/fetchActions';

const fetchUrl = 'https://io.adafruit.com/api/v2';

function fetchCall({ name, key, feedName, packetSize }) {
    return new Promise((resolve, reject) => {
        console.log(name, '--', key, '--', feedName, '--', packetSize);
        fetch(`${fetchUrl}/${name}/feeds/${feedName}/data?x-aio-key=${key}&limit=${packetSize}`, { method: "GET" })
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

function* watchFetchRequest(action) {
    //while (true) {
        const { name, key, feedName, packetSize } = action;//yield take(types.FETCH_DATA.REQUEST);

        try {
            const payload = {
                name,
                key,
                feedName,
                packetSize
            }
            const response = yield call(fetchCall, payload);

            yield put(fetchSuccess(response));
            console.log('SAGA DATA FETCH SUCCESS: ', response);
        } catch (err) {
            console.log('SAGA DATA FETCH ERR: ', err);
            yield put(fetchFailure(err.status));
        }
    //}
}


export default function* root() {
    //yield fork(watchFetchRequest);
    yield takeLatest(types.FETCH_DATA.REQUEST, watchFetchRequest);
}