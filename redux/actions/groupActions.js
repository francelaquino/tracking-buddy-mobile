import { CREATE_GROUP, DISPLAY_GROUP, DELETE_GROUP } from './types';
//import firebase from 'react-native-firebase';
import { ToastAndroid } from 'react-native';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');

randomString=(length)=>{  
    let text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
    






//update code
randomString = (length) => {
    let text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const createGroup = (groupname, avatarsource) => dispatch => {
    let avatar = "";
    let groupid = userdetails.userid +"_"+ randomString(5);
    return new Promise(async (resolve) => {
        try {
            if (avatarsource != "") {
                let avatarlink = groupid + ".jpg";
                 firebase.storage().ref("/group_photos/" + avatarlink).putFile(avatarsource.uri.replace("file:/", "")).then(async res => {
                    avatar = res.downloadURL;
                    await axios.post(settings.baseURL + 'group/addgroup', {
                        groupname: groupname,
                        avatar: avatar,
                        avatarfilename: avatarlink,
                        owner: userdetails.userid,
                    }).then(function (res) {
                    console.log(res)
                    if (res.data.status == "202") {
                        if (res.data.isexist == "true") {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Group name already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(true)
                            ToastAndroid.showWithGravityAndOffset("Group successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
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
                await axios.post(settings.baseURL + 'group/addgroup', {
                    groupname: groupname,
                    avatar: avatar,
                    owner: userdetails.userid,
                    avatarfilename:''
                }).then(function (res) {
                    console.log(res)
                    if (res.data.status == "202") {
                        if (res.data.isexist == "true") {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Group already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(true)
                            ToastAndroid.showWithGravityAndOffset("Group successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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

        } catch (e) {
            
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })



    return new Promise((resolve) => {

        firebase.database().ref(".info/connected").on("value", function (snap) {
            if (snap.val() === true) {

                firebase.database().ref().child("groups/" + userdetails.userid).orderByChild("groupname").equalTo(groupname).once("value", snapshot => {
                    if (snapshot.val()) {
                        resolve("Group already exist");
                    } else {
                        let groupid = userdetails.userid + randomString(4);
                        if (avatarsource != "") {
                            let avatarlink = groupid + ".jpg";
                            let ref = firebase.storage().ref("/group_photos/" + avatarlink);
                            ref.putFile(avatarsource.uri.replace("file:/", "")).then(res => {
                                avatar = res.downloadURL;
                                setTimeout(() => {
                                    let groupRef = firebase.database().ref().child("groups/" + userdetails.userid + "/" + groupid);
                                    groupRef.set({
                                        id: groupid,
                                        groupname: groupname,
                                        avatar: avatar,
                                        datecreated: Date.now(),
                                        dateupdated: Date.now(),
                                    })
                                        .catch(function (err) {
                                            console.log('error', err);
                                        });

                                    resolve("Group successfully created");
                                }, 0);
                            })
                                .catch(function (err) {
                                    console.log('error', err);

                                });
                        } else {
                            setTimeout(() => {
                                let groupRef = firebase.database().ref().child("groups/" + userdetails.userid + "/" + groupid);
                                groupRef.set({
                                    id: groupid,
                                    groupname: groupname,
                                    avatar: emptyPhoto,
                                    datecreated: Date.now(),
                                    dateupdated: Date.now(),
                                })
                                    .catch(function (err) {
                                        console.log('error', err);
                                    });
                                resolve("Group successfully created");
                            }, 0);
                        }
                    }
                }).catch(function (err) {
                    console.log('error', err);
                    resolve("");

                });
            } else {
                resolve("");
                ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });
    });
};






export const updateGroup = (group) => dispatch => {


        let avatar = "";
        return new Promise(async (resolve) => {
            try {
                let avatar = "";
                console.log(group)
                if (group.isPhotoChange == true) {

                    const ref = firebase.storage().ref("/group_photos/" + group.avatarfilename);
                    const unsubscribe = ref.putFile(group.avatarsource.uri.replace("file:/", "")).on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                        },
                        (error) => {
                            unsubscribe();
                        },
                        async (resUrl) => {
                            avatar = resUrl.downloadURL;
                            await axios.post(settings.baseURL + 'group/updategroup', {
                                groupname: group.groupname,
                                owner: userdetails.userid,
                                avatar: avatar,
                                id: group.groupid,
                            }).then(function (res) {
                                if (res.data.status == "202") {
                                    resolve(true)
                                    ToastAndroid.showWithGravityAndOffset("Group successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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
                    await axios.post(settings.baseURL + 'group/updategroup', {
                        groupname: group.groupname,
                        owner: userdetails.userid,
                        avatar: group.avatarsource.uri,
                        id: group.groupid,
                    }).then(function (res) {
                        if (res.data.status == "202") {
                            resolve(true);
                            ToastAndroid.showWithGravityAndOffset("Group successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        resolve(false);
                        
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });
                }


            } catch (e) {
                
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                resolve(false)
            }

        })


};




export const deleteGroup = (groupid) => dispatch => {


    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'group/deletegroup', {
                id: groupid,
                owneruid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    ToastAndroid.showWithGravityAndOffset("Group successfully deleted", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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


export const displayGroup = () => dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'group/getgroups/' + userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_GROUP,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_GROUP,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: DISPLAY_GROUP,
                        payload: []
                    });
                    resolve(false)
                    
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            
            dispatch({
                type: DISPLAY_GROUP,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};