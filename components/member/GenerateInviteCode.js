
import React, { Component } from 'react';
import { StatusBar, Clipboard, Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Share } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content } from 'native-base';
import Loading  from '../shared/Loading';
import { connect } from 'react-redux';
import Loader from '../shared/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfflineNotice  from '../shared/OfflineNotice';
import { generateInvitationCode, getInvitationCode  } from '../../redux/actions/memberActions' ;
import firebase from 'react-native-firebase';
var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../shared/userDetails');

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class GenerateInviteCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isbusy: true,
            invitationcode:'',
            expiration:'',
        };
      }

    componentWillMount() {
        this.props.getInvitationCode().then(res => {
            if (res == true) {
                this.setState({ isbusy: false })
            }
        });
    }
            
    
    onGenerate(){
        this.setState({loading:true})
        this.props.generateInvitationCode().then(res=>{
            this.props.getInvitationCode();
            this.setState({loading:false})
            
        }).catch(function(err) {
            this.setState({loading:false})
        });
    }


    onShare() {
        if(this.props.invitationcode.code==""){
            ToastAndroid.showWithGravityAndOffset("Invalid invitation code", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }else{
            Share.share({
                message: this.props.invitationcode.code
            }).then(res => {
            });
        }
    }

    onCopy() {
        if(this.props.invitationcode.code==""){
            ToastAndroid.showWithGravityAndOffset("Invalid invitation code", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }else{
            Clipboard.setString(this.props.invitationcode.code)
            ToastAndroid.showWithGravityAndOffset("Copied to clipboard", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    }


   
    loading(){
        return (
          <Loading/>
        )
    }
    ready(){
        return (
            
                
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
          
                <Content padder>
                
                        <View style={globalStyle.container}>
                       
                        { this.props.invitationcode.code !='' &&
                                    <View >
                            <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: "center", flexDirection: 'column', fontSize: 40, marginBottom: 2, color: 'green' }}>{this.props.invitationcode.code}</Text>
                            {this.props.invitationcode.codestatus == 'valid' ? 
                                <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: "center", flexDirection: 'column', fontSize: 12, marginBottom: 5, color: 'gray' }}>Expires on {this.props.invitationcode.expiration}</Text> :
                                <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: "center", flexDirection: 'column', fontSize: 12, marginBottom: 5, color: 'red' }}>Expired invitation code</Text> 

                            }
                                    </View>
                        }
                        <Content padder>
                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                <Button 
                                    onPress={()=>this.onGenerate()}
                                    bordered light full style={globalStyle.secondaryButton}>
                                    <Text style={{color:'white'}}>Generate Code</Text>
                                </Button>
                                <Button
                                    onPress={() => this.onCopy()}
                                    bordered light full style={[globalStyle.secondaryButton, { marginTop:5 }]}>
                                    <Text style={{ color: 'white' }}>Copy Invitation Code</Text>
                                </Button>
                                <Button
                                    
                                    onPress={() => this.onShare()}
                                    bordered light full style={[globalStyle.secondaryButton, { marginTop: 5 }]}>
                                    <Text style={{ color: 'white' }}>Send Invitation Code</Text>
                                </Button>
                            </View>
                           
                            </Content>
                            <Text style={globalStyle.noteLabel} >To invite a member you have to generate a Invitation Code. </Text>
                        <Text style={globalStyle.noteLabel} >Send the Invitation code to the person you want to  be a member.</Text>
                        <View  style={globalStyle.banner300x250} >
                            <Banner
                            size={"MEDIUM_RECTANGLE"}
                            unitId="ca-app-pub-3378338881762914/9101870411"
                            request={request.build()}
                            />
                        </View>
                    </View>
                    </Content>
                    </ScrollView>
               
        )
    }
    

    render() {

        return (
            <Root>
                <Loader loading={this.state.loading} />
               
                <Container style={globalStyle.containerWrapper}>
                
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>INVITATION CODE</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}  >
                          

                        </Right>
                    </Header>

                    {
                        this.state.isbusy ? this.loading() :
                            this.ready()
                    }

                   
                </Container>


            </Root>
        )

      
    }
}


const mapStateToProps = state => ({
    invitationcode: state.fetchMember.invitationcode,
    isLoading:state.fetchMember.isLoading,
  })
  
  
  GenerateInviteCode=connect(mapStateToProps,{getInvitationCode,generateInvitationCode})(GenerateInviteCode);
  
  
  
export default GenerateInviteCode;