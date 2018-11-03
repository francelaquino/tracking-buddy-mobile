import {
    SIGNIN_USER,
    REGISTRATION_USER,
    NO_CONNECTION,
    GET_PROFILE,
    SAVE_LOCATION_ONLINE,
    GET_COUNTRIES
} from './types';
import {
    ToastAndroid,
    AsyncStorage
} from 'react-native';
import axios from 'axios';
import firebase from 'react-native-firebase';
import Moment from 'moment';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');











export const userLogin = (email, password) => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            


                    await axios.post(settings.baseURL + 'member/userlogin',{
                        email: email,
                        password: password,
                        }).then(function (response) {
                            if (response.data.status == "202") {
                                if(response.data.message==""){
                                    userdetails.email = response.data.results.email;
                                    userdetails.userid = response.data.results.uid;
                                    userdetails.firstname = response.data.results.firstname;
                                    userdetails.lastname = response.data.results.lastname;
                                    userdetails.emptyphoto = response.data.results.emptyphoto;
                                    userdetails.avatar = response.data.results.avatar;
                                    userdetails.firstletter = response.data.results.firstletter;
                                    AsyncStorage.setItem("emptyphoto", userdetails.emptyphoto);
                                    AsyncStorage.setItem("avatar", userdetails.avatar);
                                    AsyncStorage.setItem("userid", userdetails.userid);
                                    AsyncStorage.setItem("email", userdetails.email);
                                    AsyncStorage.setItem("firstname", userdetails.firstname);
                                    AsyncStorage.setItem("lastname", userdetails.lastname);
                                    AsyncStorage.setItem("firstletter", userdetails.firstletter);
                                    resolve(true);
                                }else{
                                    resolve(false);
                                    ToastAndroid.showWithGravityAndOffset(response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                }

                            } else {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            }

                        }).catch(function (error) {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        });
               
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })

};

export const changePassword = (data) => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            


                    await axios.post(settings.baseURL + 'member/changepassword',{
                        email: data.email,
                        userid:data.userid,
                        currentpassword: data.currentpassword,
                        newpassword: data.newpassword
                        }).then(function (response) {
                            if (response.data.status == "202") {
                                if(response.data.message==""){
                                    ToastAndroid.showWithGravityAndOffset("Password successfully changed", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                    resolve(true);
                                }else{
                                    resolve(false);
                                    ToastAndroid.showWithGravityAndOffset(response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                }

                            } else {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            }

                        }).catch(function (error) {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        });
               
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })

};

export const updateProfile = (profile) => async dispatch => {
    let avatar = "";
    return new Promise(async (resolve) => {
        try {
            let avatar = "";

            if (profile.isPhotoChange == true && profile.emptyphoto == "0") {
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
                            gender: profile.gender,
                            country: profile.country,
                            birthdate: profile.birthdate,
                            emptyphoto: profile.emptyphoto,
                            middlename: profile.middlename,
                            mobileno: profile.mobileno,
                        }).then(function (res) {

                            if (res.data.status == "202") {
                                resolve(true)
                                userdetails.avatar = avatar;
                                userdetails.emptyphoto = "0";
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
                    gender: profile.gender,
                    country: profile.country,
                    birthdate: profile.birthdate,
                    emptyphoto: profile.emptyphoto,
                    mobileno: profile.mobileno,
                }).then(function (res) {

                    if (res.data.status == "202") {
                        resolve(true)
                        ToastAndroid.showWithGravityAndOffset("Profile successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        userdetails.avatar = res.data.emptyphoto;
                        userdetails.emptyphoto = "1";
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



            //await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(profile.email, profile.password).then(async (res) => {
            //  let uid = res.user.uid;
            //res.user.sendEmailVerification();
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
                            password: profile.password,
                            firstname: profile.firstname,
                            lastname: profile.lastname,
                            middlename: profile.middlename,
                            mobileno: profile.mobileno,
                            gender: profile.gender,
                            address: profile.address,
                            latitude: profile.latitude,
                            longitude: profile.longitude,
                            country: profile.country,
                            birthdate: profile.birthdate,
                            dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                            avatar: avatar,
                        }).then(function (res) {
                            if (res.data.status == "202") {

                                if (res.data.results == "") {
                                    resolve(true)
                                    ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                } else {
                                    ToastAndroid.showWithGravityAndOffset(res.data.results, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                    resolve(false)
                                }

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
                    uid: profile.password,
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    middlename: profile.middlename,
                    mobileno: profile.mobileno,
                    gender: profile.gender,
                    country: profile.country,
                    address: profile.address,
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    birthdate: profile.birthdate,
                    dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                    avatar: avatar
                }).then(function (res) {
                    if (res.data.status == "202") {

                        if (res.data.results == "") {
                            resolve(true)
                            ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset(res.data.results, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);

                        }
                    } else {
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }

                }).catch(function (error) {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });
            }






            /*}).catch(function (e) {
               
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
            })*/
        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        };

    })

};