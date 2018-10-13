import { SIGNIN_USER, REGISTRATION_USER, NO_CONNECTION, GET_PROFILE, SAVE_LOCATION_ONLINE, GET_COUNTRIES } from './types';
import { ToastAndroid, AsyncStorage } from 'react-native';
import axios from 'axios';
import firebase from 'react-native-firebase';
import Moment from 'moment';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');











export const userLogin = (email, password) => async dispatch => {
    
    return new Promise(async (resolve) => {
        try {
                firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
                    .then(async function (res) {
                        
                        //if(res.user.emailVerified){
                        await axios.get(settings.baseURL + 'member/getmemberinfo/' + res.user.uid)
                            .then(function (response) {
                                if (response.data.status == "202") {
                                    userdetails.userid = res.user.uid;
                                    userdetails.email = response.data.results.email;
                                    userdetails.firstname = response.data.results.firstname;
                                    userdetails.lastname = response.data.results.lastname;
                                    userdetails.emptyphoto = response.data.results.emptyphoto;
                                    userdetails.avatar = response.data.results.avatar;
                                    AsyncStorage.setItem("emptyphoto", userdetails.emptyphoto);
                                    AsyncStorage.setItem("avatar", userdetails.avatar);
                                    AsyncStorage.setItem("userid", userdetails.userid);
                                    AsyncStorage.setItem("email", userdetails.email);
                                    AsyncStorage.setItem("firstname", userdetails.firstname);
                                    AsyncStorage.setItem("lastname", userdetails.lastname);
                                    AsyncStorage.setItem("offlineLocation", "");
                                    try {
                                        navigator.geolocation.getCurrentPosition(
                                            async (position) => {

                                                await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
                                                    .then(function (res) {
                                                        if (res.data.status == "OK") {
                                                            dispatch({
                                                                type: SAVE_LOCATION_ONLINE,
                                                                payload: res.data.results[0].formatted_address
                                                            });
                                                        }
                                                    }).catch(function (error) {
                                                    });

                                                



                                            },
                                            (err) => {
                                            },
                                            { enableHighAccuracy: true, timeout: 10000 }
                                        );
                                    } catch (e) {
                                    }

                                    resolve(true);

                                }
                                else {
                                    resolve(false);
                                }

                            }).catch(function (error) {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            });


                        



                        /*}else{
                          resolve("Invalid username or bad password")
                        }*/

                    })
                    .catch(function (e) {
                        resolve(false);
                       
                        ToastAndroid.showWithGravityAndOffset("Invalid email address or bad password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });
        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }
      
    })

};
//Update code


export const updateProfile = (profile) => async dispatch => {
    let avatar = "";
    return new Promise(async (resolve) => {
        try {
            let avatar = "";
            
            if (profile.isPhotoChange == true && profile.emptyphoto=="0") {
                let avatarlink = profile.email + '.jpg';

                const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                const unsubscribe = ref.putFile(profile.avatarsource.uri.replace("file:/", "")).on(
                    firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {

                    },
                    (error) => {
                        unsubscribe();
                    },
                    async (resUrl) => {
                        avatar = resUrl.downloadURL;
                        await axios.post(settings.baseURL + 'member/updateprofile', {
                            email: profile.email,
                            uid: userdetails.userid,
                            avatar: avatar,
                            firstname: profile.firstname,
                            lastname: profile.lastname,
                            gender:profile.gender,
                            country:profile.country,
                            birthdate:profile.birthdate,
                            emptyphoto: profile.emptyphoto,
                            middlename: profile.middlename,
                            mobileno: profile.mobileno,
                        }).then(function (res) {
                            
                            if (res.data.status == "202") {
                                resolve(true)
                                userdetails.avatar=avatar;
                                userdetails.emptyphoto="0";
                                userdetails.firstname = profile.firstname;
                                userdetails.lastname = profile.lastname;
                                AsyncStorage.setItem("emptyphoto", userdetails.emptyphoto);
                                AsyncStorage.setItem("avatar", userdetails.avatar);
                                AsyncStorage.setItem("firstname", userdetails.firstname);
                                AsyncStorage.setItem("lastname", userdetails.lastname);
                                ToastAndroid.showWithGravityAndOffset("Profile successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            } else {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            }
                        }).catch(function (error) {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        });
                    })
            } else {
                await axios.post(settings.baseURL + 'member/updateprofile', {
                    email: profile.email,
                    uid: userdetails.userid,
                    avatar: profile.avatarsource.uri,
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    middlename: profile.middlename,
                    gender:profile.gender,
                    country:profile.country,
                    birthdate:profile.birthdate,
                    emptyphoto: profile.emptyphoto,
                    mobileno: profile.mobileno,
                }).then(function (res) {
                    
                    if (res.data.status == "202") {
                        resolve(true)
                        ToastAndroid.showWithGravityAndOffset("Profile successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        userdetails.avatar=res.data.emptyphoto;
                        userdetails.emptyphoto="1";
                        userdetails.firstname = profile.firstname;
                        userdetails.lastname = profile.lastname;
                        AsyncStorage.setItem("emptyphoto", userdetails.emptyphoto);
                        AsyncStorage.setItem("avatar", userdetails.avatar);
                        AsyncStorage.setItem("firstname", userdetails.firstname);
                        AsyncStorage.setItem("lastname", userdetails.lastname);
                    } else {
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });
            }


        } catch (e) {
            
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};


export const getProfile = () => async dispatch => {
        return new Promise(async (resolve) => {
            try {
                await axios.get(settings.baseURL + 'member/getmemberinfo/' + userdetails.userid)
                    .then(function (res) {
                        if (res.data.status == "202") {
                            dispatch({
                                type: GET_PROFILE,
                                payload: res.data.results
                            });
                            resolve(true)
                        } else {
                            dispatch({
                                type: GET_PROFILE,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        dispatch({
                            type: GET_PROFILE,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {

                dispatch({
                    type: GET_PROFILE,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });

};


export const getcountry = () => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'utility/getcountry')
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_COUNTRIES,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_COUNTRIES,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: GET_COUNTRIES,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: GET_COUNTRIES,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};


export const registerUser = (profile) => async dispatch => {
    
    return new Promise(async (resolve) => {
        try {

            let avatar = "";



            await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(profile.email, profile.password).then(async (res) => {
                let uid = res.user.uid;
                res.user.sendEmailVerification();
                if (profile.avatarsource !== "") {
                    let avatarlink = profile.email + '.jpg';

                    const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                    const unsubscribe = ref.putFile(profile.avatarsource.uri.replace("file:/", "")).on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                        },
                        (error) => {
                            unsubscribe();
                        },
                        async (resUrl) => {
                            avatar = resUrl.downloadURL;
                            await axios.post(settings.baseURL + 'member/register', {
                                email: profile.email,
                                uid: uid,
                                firstname: profile.firstname,
                                lastname: profile.lastname,
                                middlename: profile.middlename,
                                mobileno: profile.mobileno,
                                password: profile.password,
                                gender: profile.gender,
                                address: profile.address,
                                latitude: profile.latitude,
                                longitude: profile.longitude,
                                country:profile.country,
                                birthdate:profile.birthdate,
                                dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                                avatar: avatar,
                            }).then(function (res) {
                                if (res.data.status == "202") {
                                    resolve(true)
                                    ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                } else {
                                    resolve(false)
                                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                }
                            }).catch(function (error) {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            });
                        });
                } else {
                    await axios.post(settings.baseURL + 'member/register', {
                        email: profile.email,
                        uid: uid,
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        middlename: profile.middlename,
                        mobileno: profile.mobileno,
                        gender:profile.gender,
                        country: profile.country,
                        address: profile.address,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                        birthdate:profile.birthdate,
                        dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                        avatar: avatar,
                    }).then(function (res) {
                        if (res.data.status == "202") {
                            resolve(true)
                            ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                        
                    }).catch(function (error) {
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });
                }



               


            }).catch(function (e) {
               
                if (e.code === 'auth/email-already-in-use') {
                    ToastAndroid.showWithGravityAndOffset("The email address is already in use by another account", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }else if (e.code === 'auth/invalid-email') {
                        ToastAndroid.showWithGravityAndOffset("Invalid email address", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }else if (e.code === 'auth/weak-password') {
                        ToastAndroid.showWithGravityAndOffset("Please provide strong password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                } else {
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                resolve(false)
            })
        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        };

    })

};