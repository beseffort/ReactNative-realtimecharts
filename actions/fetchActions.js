import * as types from './actionTypes';

export function fetchRequest(name, key, feedName, packetSize) {
    if(feedName==0) {
        feedName = 'flow';
    } else if(feedName==1) {
        feedName = 'fstdev';
    } else if(feedName==2) {
        feedName = 'temperature'
    } else {
        feedName = 'humidity';
    }
    return {
        type: types.FETCH_DATA.REQUEST,
        name,
        key,
        feedName,
        packetSize,
    };
}

export function fetchSuccess(data) {
    return {
        type: types.FETCH_DATA.SUCCESS,
        data,
    }
}

export function fetchFailure(err) {
    return {
        type: types.FETCH_DATA.FAILURE,
        err,
    }
}