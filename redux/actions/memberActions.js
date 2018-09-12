import { DISPLAY_MEMBER, INVITE_MEMBER, GET_MEMBERNOTIFICATION, GET_MEMBERGROUP, GET_INVITATIONCODE, GET_COUNTRIES, GENERATE_INVITATIONCODE, GET_MEMBER, DELETE_MEMBER, DISPLAY_HOME_MEMBER, DISPLAY_GROUP_MEMBER,CLEAR_HOME_MEMBERS } from './types';
//import firebase from 'react-native-firebase';
import {  ToastAndroid } from 'react-native';
import Moment from 'moment';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');










export const clearHomeMembers=()=> dispatch=> {
    
        dispatch({ 
            type: CLEAR_HOME_MEMBERS,
            payload: []
        });
   
};


export const getCountrries=()=> dispatch=> {
    let countries:{
        id: "",
        countrycode: "",
        country: "",
      }

      let count=0;
      let cnt=0;
    return new Promise((resolve) => {
        firebase.database().ref().child('countries').orderByChild("country").once('value', async (dataSnapshot)=> {
            let countries=[];
            if(dataSnapshot.exists){
                count=dataSnapshot.numChildren();
                await dataSnapshot.forEach(function(child) {
                    countries.push({
                      id: child.val().id,
                      countrycode: child.val().countrycode,
                      country: child.val().countrycode+" "+ child.val().country
                    })
                    cnt++;
                            if(cnt>=count){
                                dispatch({ 
                                    type: GET_COUNTRIES,
                                    payload: countries
                                });
                                resolve()
                            }
                          
                    
                });
               
    
            }
        
        })
    }).catch(function(err) {
        dispatch({ 
            type: GET_COUNTRIES,
            payload: []
        });
        resolve()
    });

   
};


//Update Code



export const generateInvitationCode = () => async dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/generateinvititationcode', {
                email: userdetails.email,
                uid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
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
export const getInvitationCode = () => async dispatch => {
       


        return new Promise(async (resolve) => {
            try {
                await axios.get(settings.baseURL + 'member/getmemberinfo/' + userdetails.userid)
                    .then(function (res) {
                        if (res.data.status == "202") {
                            let invitationcode = {
                                code: res.data.results.invitationcode,
                                expiration: res.data.results.invitationcodeexpiration,
                            }
                            dispatch({
                                type: GET_INVITATIONCODE,
                                payload: invitationcode
                            });
                            resolve(true)
                        } else {
                            dispatch({
                                type: GET_INVITATIONCODE,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        
                        dispatch({
                            type: GET_INVITATIONCODE,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {
                
                dispatch({
                    type: GET_INVITATIONCODE,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });


};


export const addMember = (invitationcode) => async dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/addmember', {
                invitationcode: invitationcode,
                uid: userdetails.userid,
            }).then(async function (res) {
                if (res.data.status == "202") {
                    if (res.data.results == "" && res.data.useruid!=="") {
                        ToastAndroid.showWithGravityAndOffset("Member successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);

                        await firebase.database().ref().child("users/" + userdetails.userid + "/members/" + res.data.useruid).set({
                            userid: res.data.useruid,
                            lastmovement: Date.now(),
                        }).catch(function (err) {
                            resolve(false)
                        });

                        await firebase.database().ref().child("users/" + res.data.useruid + "/members/" + userdetails.userid).set({
                            userid: userdetails.userid,
                            lastmovement: Date.now(),
                        }).catch(function (err) {
                            resolve(false)
                            });
                        resolve(true)

                    } else {
                        ToastAndroid.showWithGravityAndOffset(res.data.results, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    }
                  
                   
                } else {
                    console.log(res.data)
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



export const addGroupMember = (groupid,member) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'member/addgroupmember', {
                memberuid: member.uid,
                groupid: groupid,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
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



export const removeGroupMember = (groupid,member) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'member/removegroupmember', {
                memberuid: member.uid,
                groupid: groupid,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
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


export const displayMember = () => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'member/getmembers/' + userdetails.userid)
                .then(function (res) {
                    console.log(res)
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    console.log(error)
                    dispatch({
                        type: DISPLAY_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            console.log(e)
            dispatch({
                type: DISPLAY_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};




export const getMemberGroup = (userid) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'group/getmembergroup/' + userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_MEMBERGROUP,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_MEMBERGROUP,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: GET_MEMBERGROUP,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: GET_MEMBERGROUP,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};



export const getMemberNotification = (userid) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'member/getmembernotification/' + userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_MEMBERNOTIFICATION,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_MEMBERNOTIFICATION,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    
                    dispatch({
                        type: GET_MEMBERNOTIFICATION,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            
            dispatch({
                type: GET_MEMBERNOTIFICATION,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};

export const getMember = (userid) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'member/getmemberinfo/' + userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: GET_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: GET_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};



export const deleteMember=(memberuid)=> async dispatch=> {

    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/deletemember', {
                memberuid: memberuid,
                owneruid: userdetails.userid,
            }).then(async function (res) {
                if (res.data.status == "202") {
                   

                    await firebase.database().ref().child("users/" + userdetails.userid + "/members/" + memberuid).remove();

                    await firebase.database().ref().child("users/" + memberuid + "/members/" + userdetails.userid).remove();

                    ToastAndroid.showWithGravityAndOffset("Member successfully deleted", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);

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



export const displayGroupMember=(groupid)=> dispatch=> {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'group/getmembers/' + groupid+"/"+ userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_GROUP_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_GROUP_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: DISPLAY_GROUP_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: DISPLAY_GROUP_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};




export const displayHomeMember = () => async dispatch => {
    let members = [];
    let count = 0;
    let cnt = 0;
    if (userdetails.group == "") {
        return new Promise(async (resolve) => {
            try {
                

                await axios.get(settings.baseURL + 'member/gethomemembers/' + userdetails.userid)
                    .then(function (res) {
                        if (res.data.status == "202") {
                            count = res.data.results.length;
                            let x = 0;
                            console.log(res.data.results)
                            if (count > 0) {
                                res.data.results.forEach(data => {

                                    members.push({
                                        uid: data.uid,
                                        firstname: data.firstname,
                                        avatar: data.avatar,
                                        emptyphoto: data.emptyphoto,
                                        coordinates: {
                                            longitude: data.longitude,
                                            latitude: data.latitude
                                        },
                                        address: data.address,
                                    });

                                    cnt++;
                                    if (cnt >= count) {
                                        dispatch({
                                            type: DISPLAY_HOME_MEMBER,
                                            payload: members
                                        });
                                        resolve(true)
                                    }
                                })
                            } else {
                                dispatch({
                                    type: DISPLAY_HOME_MEMBER,
                                    payload: []
                                });
                                resolve(true)
                            }
                        } else {
                            dispatch({
                                type: DISPLAY_HOME_MEMBER,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        dispatch({
                            type: DISPLAY_HOME_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {
                
                dispatch({
                    type: DISPLAY_HOME_MEMBER,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });


       




    } else {

        return new Promise(async (resolve) => {
            try {
                await axios.get(settings.baseURL + 'group/gethomemembers/' + userdetails.group + "/" + userdetails.userid)
                    .then(function (res) {
                      
                        if (res.data.status == "202") {
                            count = res.data.results.length;
                            if (count > 0) {
                                res.data.results.forEach(data => {
                                    members.push({
                                        uid: data.uid,
                                        firstname: data.firstname,
                                        avatar: data.avatar,
                                        emptyphoto: data.emptyphoto,
                                        coordinates: {
                                            longitude: data.longitude,
                                            latitude: data.latitude
                                        },
                                        address: data.address,
                                    });

                                    cnt++;
                                    if (cnt >= count) {
                                        dispatch({
                                            type: DISPLAY_HOME_MEMBER,
                                            payload: members
                                        });
                                        resolve(true)
                                    }
                                })
                            } else {
                                dispatch({
                                    type: DISPLAY_HOME_MEMBER,
                                    payload: []
                                });
                                resolve(true)
                            }
                        } else {
                            dispatch({
                                type: DISPLAY_HOME_MEMBER,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        dispatch({
                            type: DISPLAY_HOME_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {

                dispatch({
                    type: DISPLAY_HOME_MEMBER,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });

        

    }

};






