import { DISPLAY_LOCATION_TRACK, DISPLAY_LOCATION, DISPLAY_LOCATION_MAP, DISPLAY_LOCATION_LIST, GET_LOCATIONDETAILS, SAVE_LOCATION_OFFLINE, SAVE_LOCATION_ONLINE, DISPLAY_PLACES,GET_PLACE_ALERT } from './types';
import Moment from 'moment';
import { ToastAndroid,AsyncStorage } from 'react-native';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');




export const saveLocation = () => async dispatch => {
    try {

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
                    .then(function (res) {
                        if (res.data.status == "OK") {
                            dispatch({
                                type: SAVE_LOCATION_ONLINE,
                                payload: res.data.results[0].formatted_address
                            });
                        }
                    }).catch(function (error) {
                        dispatch({
                            type: SAVE_LOCATION_ONLINE,
                            payload: "",
                        });
                    });

                await axios.post(settings.baseURL + 'place/saveloginlocation', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    useruid: userdetails.userid,
                    dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                }).then(async function (res) {
                }).catch(function (error) {
                })


            },
            (err) => {
            },
            { enableHighAccuracy: true, timeout: 20000 }
        );


        

        
       

        


    } catch (e) {
    }
};



export const getAddress = (coords) => async dispatch => {
    try {
        await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords.latitude + "," + coords.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
            .then(function (res) {
                if (res.data.status == "OK") {
                    dispatch({
                        type: SAVE_LOCATION_ONLINE,
                        payload: res.data.results[0].formatted_address
                    });
                }
            }).catch(function (error) {
            });

    } catch (e) {
    }
};


export const deletePlace = (id) => dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'place/deleteplace', {
                placeid: id,
                owneruid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    ToastAndroid.showWithGravityAndOffset("Place successfully deleted", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })
   
};


export const displayPlaces = () => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getplaces/' + userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_PLACES,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_PLACES,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                   
                    dispatch({
                        type: DISPLAY_PLACES,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
           
            dispatch({
                type: DISPLAY_PLACES,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });




};


export const savePlace = (place, address, region) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/saveplace', {
                place: place,
                latitude: region.latitude,
                longitude: region.longitude,
                latitudedelta: region.latitudeDelta,
                longitudedelta: region.longitudeDelta,

                address: address,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    if (res.data.isexist == "true") {
                        ToastAndroid.showWithGravityAndOffset("Place already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    } else {
                        ToastAndroid.showWithGravityAndOffset("Place successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                    }
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};


export const updatePlace = (id, place,address, coordinate) => dispatch => {


    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/updateplace', {
                id: id,
                place: place,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudedelta: coordinate.latitudeDelta,
                longitudedelta: coordinate.longitudeDelta,
                address: address,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    if (res.data.isexist == "true") {
                        ToastAndroid.showWithGravityAndOffset("Place already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    } else {
                        ToastAndroid.showWithGravityAndOffset("Place successfully updated", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                    }
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })

};


export const savePlaceNotification = (data) => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/savenotification', {
                useruid: data.useruid,
                placeid: data.placeid,
                arrives: data.arrives,
                leaves: data.leaves,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                        ToastAndroid.showWithGravityAndOffset("Notification successfully saved.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};





export const getPlaceNotification = (placeid, userid) => async dispatch => {
    let arrives = false;
    let leaves = false;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getPlaceNotification/' + userdetails.userid + '/' + placeid + '/' + userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        if (res.data.results.length > 0) {
                            if (res.data.results[0].arrives == '1') {
                                arrives = true;
                            }
                            if (res.data.results[0].leaves == '1') {
                                leaves= true;
                            }
                        }
                        dispatch({
                            type: GET_PLACE_ALERT,
                            payload: {
                                arrives: arrives,
                                leaves: leaves
                                }
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_PLACE_ALERT,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {

                    dispatch({
                        type: GET_PLACE_ALERT,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: GET_PLACE_ALERT,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};



export const displayLocationsList = (useruid,date) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryMap/' + useruid +'/'+date)
                .then(function (res) {
                                dispatch({
                                    type: DISPLAY_LOCATION_LIST,
                                    payload: res.data.results
                                });
                    resolve(true)

                    if (res.data.results.length <=0) {
                        ToastAndroid.showWithGravityAndOffset("No location history found", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                    
                        
                }).catch(function (error) {

                    dispatch({
                        type: DISPLAY_LOCATION_LIST,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_LOCATION_LIST,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};

export const displayLocationsMap = (useruid, date) => dispatch => {
    let locations = [];
    let count = 0;
    let cnt = 0;
    let x = 1;
    let label = 0;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryMap/' + useruid + '/' + date)
                .then(function (res) {
                    count = res.data.results.length;
                    label = res.data.results.length;
                    if (count > 0) {
                        res.data.results.forEach(data => {
                            
                            locations.push({
                                id: x,
                                label: label,
                                address: data.address,
                                datemovement: data.datemovement,
                                activitytype: data.activitytype,
                                coordinates: {
                                    longitude: data.longitude,
                                    latitude: data.latitude
                                },
                            });

                            cnt++;
                            x++;
                            label--;
                            if (cnt >= count) {
                                dispatch({
                                    type: DISPLAY_LOCATION_MAP,
                                    payload: locations
                                });
                                resolve(true)
                            }
                        })
                    } else {
                        dispatch({
                            type: DISPLAY_LOCATION_MAP,
                            payload: []
                        });
                        resolve(true)
                    }

                    if (res.data.results.length <= 0) {
                        ToastAndroid.showWithGravityAndOffset("No location history found", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }

                }).catch(function (error) {

                    dispatch({
                        type: DISPLAY_LOCATION_MAP,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_LOCATION_MAP,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};


export const displayLocationsTrack = (useruid, date) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryTrack/' + useruid + '/' + date)
                .then(function (res) {
                        res.data.results.forEach(data => {
                                dispatch({
                                    type: DISPLAY_LOCATION_TRACK,
                                    payload: res.data.results
                                });
                                resolve(true)
                    })

                    if (res.data.results.length <= 0) {
                        ToastAndroid.showWithGravityAndOffset("No location history found", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                   
                }).catch(function (error) {

                    dispatch({
                        type: DISPLAY_LOCATION_TRACK,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_LOCATION_TRACK,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};


export const getLocationDetails = (id) => async dispatch => {



    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryDetails/' + id)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_LOCATIONDETAILS,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_LOCATIONDETAILS,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {

                    dispatch({
                        type: GET_LOCATIONDETAILS,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: GET_LOCATIONDETAILS,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });


};