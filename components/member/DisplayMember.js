
import React, { Component } from 'react';
import { StatusBar, Modal,TouchableOpacity, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { displayMember  } from '../../redux/actions/memberActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
import firebase from 'react-native-firebase';
var globalStyle = require('../../assets/style/GlobalStyle');


const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class DisplayMember extends Component {
    constructor(props) {
        super(props)
        this.state={
            loading: true,
            memberid:'',
        }
      }

   
    componentWillMount() {

        this.initialize();
    }
    /*onReload = () => {
        this.initialize();
    }*/
   
    initialize() {
        this.props.displayMember().then((res) => {
            if (res == true) {
                this.setState({
                    loading: false,
                })

            }
        });
    }
    

    renderMember(){
        return (
            <FlatList
                style={{flex:1}}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.uid}
                data={this.props.members}
                renderItem={({ item }) => (

                        <ListItem key={item.uid}  button avatar style={globalStyle.listItem}  onPress={() => {this.props.navigation.navigate("InfoMember",{firstletter: item.firstletter,memberuid:item.uid,firstname:item.firstname})}}>
                            <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                               
                                {item.emptyphoto === "1" ? <Text style={{fontSize:23,color:'#16a085'}}>{item.firstletter}</Text> :
                                    <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                                }
                                </View>
                            </Left>
                            <Body style={globalStyle.listBody} >
                            <Text numberOfLines={1}  style={globalStyle.listHeading}>{item.firstname}</Text>
                            <Text note numberOfLines={1} >{item.address}</Text>
                            </Body>
                            <Right style={globalStyle.listRight} >
                                <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                            </Right>
                            </ListItem>
                        ) }
                />)
    }

    loading(){
        return (
          <Root>
          <Container style={globalStyle.containerWrapper}>
          <Loading/>
          </Container>
          </Root>
        )
    }
   
    
    ready(){
        return (
           
                    <Content padder>
                        <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                            <View style={globalStyle.container}>
                            <List>
                                {this.renderMember()}
                            </List>
                           
                            </View>
                            <View style={{width:'99%',marginTop:10}}>
                           <Banner
                            size={"SMART_BANNER"}
                            unitId="ca-app-pub-3378338881762914/1400949141"
                            request={request.build()}
                            />
                               </View>
                        </ScrollView>
                        </Content>
        )
    }


    render() {

        return (

            <Root>
                <Container style={globalStyle.containerWrapper}>
                   
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>MEMBERS</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            <Button transparent onPress={() => this.props.navigation.navigate("NewInvite", { onReload: this.onReload })}>
                                <MaterialIcons size={28} style={{ color: 'white' }} name='person-add' />
                            </Button>

                        </Right>
                    </Header>
                    {
                        this.state.loading ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
        )




        
    }
    
}




const mapStateToProps = state => ({
    members: state.fetchMember.members,
  })
  
  
DisplayMember=connect(mapStateToProps,{displayMember})(DisplayMember);
  
  
export default DisplayMember;