
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, FlatList  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayPlaces  } from '../../redux/actions/locationActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
var globalStyle = require('../../assets/style/GlobalStyle');

import firebase from 'react-native-firebase';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class PlaceList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        };
    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
        this.props.displayPlaces().then(res => {
            this.setState({ loading: false })
        });
    }




    

    loading(){
        return (
          <Loading/>
        )
    }

    renderPlaces() {
        return (
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                data={this.props.places}
                renderItem={({ item }) => (
                    <ListItem icon key={item.id} button avatar style={globalStyle.listItem}  onPress={() => {this.props.navigation.navigate("PlaceView",{place:item})}}>
                    
                    <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                               
                                <Text style={{fontSize:23,color:'#16a085'}}>{item.firstletter}</Text> 
                                </View>
                            
                </Left>
                        <Body style={globalStyle.listBody} >
                            <Text numberOfLines={1} style={globalStyle.listHeading}>{item.place}</Text>
                            <Text  numberOfLines={1} note style={{fontSize:12}}>{item.address}</Text>
                        </Body>
                    
                        <Right style={globalStyle.listRight}>
                            <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                        </Right>
                    </ListItem>
                ) }
            />)
    }
    ready(){
      
         
        return(
           
                   
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                <Content padder >
                    <View style={globalStyle.container}>
                    
                        <List>
                            {this.renderPlaces()}
                        </List>
                         
                            </View>
                            <View  style={globalStyle.banner300x250} >
                                    <Banner
                                    size={"MEDIUM_RECTANGLE"}
                                    unitId="ca-app-pub-3378338881762914/9101870411"
                                    request={request.build()}
                                    />
                                </View>
                            </Content>
                    </ScrollView>
                    
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
                        <Body style={globalStyle.headerBody}>
                            <Title>PLACES</Title>
                        </Body>
                        <Right style={globalStyle.headerRight} >
                            <Button transparent onPress={() => this.props.navigation.navigate('CreatePlace', { address:""})}>
                                <MaterialIcons size={28} style={{ color: 'white' }} name='add-circle' />
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
    places: state.fetchLocation.places,
    isLoading: state.fetchLocation.isLoading,
  })
  
PlaceList=connect(mapStateToProps,{displayPlaces})(PlaceList);
  
export default PlaceList;

