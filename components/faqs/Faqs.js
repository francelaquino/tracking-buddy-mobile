
import React, { Component } from 'react';
import {  StatusBar, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,CheckBox, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { displayGroupMember, addGroupMember, displayHomeMember, removeGroupMember } from '../../redux/actions/memberActions';
import { displayGroup } from '../../redux/actions/groupActions';
import { LeftHome } from '../shared/LeftHome';
import OfflineNotice  from '../shared/OfflineNotice';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class Faqs extends Component {
    constructor(props) {
        super(props)
      }

    

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>FAQS</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                           

                        </Right>
                    </Header>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <Content padder>
                                <View style={styles.container}>
                                <Label style={styles.question}>1. Where I can download the app?</Label>
                                <Text style={styles.answer}>You can download the app on this link.</Text>
                                 </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>2. Where I can  reset my forgotten password?</Label>
                                <Text style={styles.answer}>There is reset link at the login page.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>3. Can I stop my member tracking my location?</Label>
                                <Text style={styles.answer}>You can stop your member to track you by loging out or removing your member from  your list.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>4. What shall I do if I receive the invitation code?</Label>
                                <Text style={styles.answer}>By clicking on Add member and pasting the invitation, mean you are accepting your friend invitation and he/she can tract you anytime.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>5. How can I add notifications?</Label>
                                <Text style={styles.answer}>You need to add place after that you need to open the places menu and you can turn on the notifications.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>6. Why I did not receive any update from my member?</Label>
                                <Text style={styles.answer}>Your member might not have internet access, phone is off, or the account is logout.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>7. What happen if there is no internet?</Label>
                                <Text style={styles.answer}>The app will still save the location history and upload it to the database once it detects internet.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>8. What if the My GPS Buddy app is close?</Label>
                                <Text style={styles.answer}>The app will run at background and  your member still can track you.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>9. What is the use of groups?</Label>
                                <Text style={styles.answer}>This will help you to organize your member and to separate them to be visible with your other group.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>10. What is the use of places?</Label>
                                <Text style={styles.answer}>Place is primary use to mark the geo-location to let you notify if your member leaves or arrive to that location.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>11. Can my member in different group can see my other member in different groups?</Label>
                                <Text style={styles.answer}>No. they cannot.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>12. How do I view the location history?</Label>
                                <Text style={styles.answer}>You can see the location history of your member by clicking on members icon.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>13. How much battery will this application consume?</Label>
                                    <Text style={styles.answer}>You can see the location history of your member by clicking on members icon.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>14. What happen if my phone is lock?</Label>
                                <Text style={styles.answer}>Even the phone is lock the app still working in background.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>15. How to find my phone if stolen?</Label>
                                <Text style={styles.answer}>You need to login in our website using your username to view all the connected member and device.</Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>16. How can I avail the invisible mode?</Label>
                                <Text style={styles.answer}>You have to subscribe the premium version </Text>
                                </View>
                                <View style={styles.container}>
                                <Label style={styles.question}>17. How can I can more that 10 places?</Label>
                                <Text style={styles.answer}>No. the maximum number of places that is allow for free is 6. If  you want more places. You have to subscribe the premium plan.</Text>
                                </View>
                        </Content>
                    </ScrollView>
                   
                </Container>
            </Root>



        )


        
    }
    
}


const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        flex: 1,
        marginBottom: 10,
         padding:5,

    },
    answer: {
        flex: 1,
        fontSize: 15,
        marginLeft: 15,
        
    },
    question: {
        flex: 1,
        marginLeft: 5,
        fontSize: 15,
        color:'#1abc9c',
        marginBottom:5,
    },


});



  
export default Faqs;