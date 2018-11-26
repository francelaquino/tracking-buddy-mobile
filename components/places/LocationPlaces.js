
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions, Animated } from 'react-native';
import { Radio, Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab, Segment } from 'native-base';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker'
import Entypo from 'react-native-vector-icons/Entypo';
import {  displayLocationsList } from '../../redux/actions/locationActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loading from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import Moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';
import firebase from 'react-native-firebase';
var settings = require('../../components/shared/Settings');
var globalStyle = require('../../assets/style/GlobalStyle');


const advert = firebase.admob().interstitial('ca-app-pub-3378338881762914/1693535138');

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

class LocationPlaces extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            isBusy:true,
            mapMode: 'standard',
            addresslist:[],
        };

    }

   

    
    componentDidMount() {
            advert.loadAd(request.build());
            advert.on('onAdLoaded', () => {
                advert.show();
            });
           
        this.initialize();
    }

        
     initialize() {
        this.props.displayLocationsList(this.props.navigation.state.params.useruid, this.props.navigation.state.params.dateFilter).then(res => {
           
            this.setState({ isBusy:false })
       
        })

    }

    

    searchFilterFunction = text => {
        if (text != "") {
            this.setState({ addresslist: [] })
            let address = this.props.locationslist.filter((item) => {
                return item.address.includes(text)
            });


            this.setState({ addresslist: [...address] })


        } else {
            this.setState({ addresslist: this.props.locationslist })
        }

    };

    
   
    
    
    ready(){
        
        return (
            <View style={styles.mainContainer}>

               <View style={styles.mainContainer}>
                <Header style={{ backgroundColor:'#ecf0f1'}} searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" onChangeText={text => this.searchFilterFunction(text)} />
                    </Item>
                </Header>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <View style={globalStyle.container}>
                        <List>
            <FlatList
             keyExtractor={item => item.address}
            style={{flex:1}}
                                    data={this.props.locationslist}
                                    renderItem={({ item , index }) => (
                                        <ListItem icon key={index} button avatar style={globalStyle.listItem} onPress={() => { this.props.navigation.navigate("LocationDetails", { location: item }) }}>
                        <Left style={globalStyle.listLeft}>
                            <SimpleLineIcons size={30} style={{ color: '#16a085', position:'absolute',top:10, }} name='location-pin' />
                           </Left>
                    <Body style={globalStyle.listBody} >
                        <Text numberOfLines={1} style={globalStyle.listHeading}>{item.address}</Text>
                        <Text note numberOfLines={1} >{item.datemovement} / {item.activitytype}</Text>
                        </Body>
                        <Right style={globalStyle.listRight} >
                            <SimpleLineIcons style={globalStyle.listRightOptionIcon} name='arrow-right' />
                        </Right>
                </ListItem>
                ) }
            />
                        </List>


                    </View>
                </Content>
            </ScrollView></View>
                
            </View>
        )
    }

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                   
                    <Loader loading={this.state.isBusy} />
                    <Header style={globalStyle.header} hasSegment>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>LOCATION HISTORY</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            
                        </Right>
                    </Header>

                    {
                            this.ready()
                    }

                </Container>
            </Root>
        )

        
    }
   
}
  


const styles = StyleSheet.create({

    mainContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        padding: 2,
        backgroundColor: '#1eaec5',
        alignItems: 'center',
        borderTopWidth: 0,
    },

    mapContainer: {
        flex: 1,
        display: 'flex',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {

        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },
    markertransparent: {
        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: '#932424',
        fontSize: 7,
        width: 20,
        marginTop: 4,
        position: 'absolute',


    },
    searchContainer: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        padding: 5,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor:'#efebef',
        
    },
    
   
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    }

});

const mapStateToProps = state => ({
    locationslist: state.fetchLocation.locationslist,
  })
  
LocationPlaces = connect(mapStateToProps, {   displayLocationsList })(LocationPlaces);
  
export default LocationPlaces;

