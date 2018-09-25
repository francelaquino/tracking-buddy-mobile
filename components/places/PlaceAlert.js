
import React, { Component } from 'react';
import {  StatusBar, TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions,Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem, Left, Right, Thumbnail, Switch, Separator } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader  from '../shared/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { savePlaceNotification,getPlaceNotification  } from '../../redux/actions/locationActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class PlaceAlert extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            busy:false,
            placeid:'',
            userid:'',
            loading:true,
            firstname:'',
            place:'',
            longitude:'',
            latitude:'',
            arrives:false,
            leaves:false,
        
        };

      }
    

    

      

    

    componentWillMount() {
        this.initialize();
    }
            
    async initialize(){
        await this.setState({
            placeid:this.props.navigation.state.params.placeid,
            userid:this.props.navigation.state.params.userid,
            firstname:this.props.navigation.state.params.firstname,
            place:this.props.navigation.state.params.place,
            latitude:this.props.navigation.state.params.region.latitude,
            longitude:this.props.navigation.state.params.region.longitude
           
        })

        await this.props.getPlaceNotification(this.state.placeid, this.state.userid).then(res => {
            this.setState({ leaves: this.props.alerts.leaves, arrives: this.props.alerts.arrives, loading: false })
        });


        
        
        
       
    }
    
    async onSubmit(){
        this.setState({busy:true})
        let alert={
            placeid:this.state.placeid,
            useruid:this.state.userid,
            arrives:this.state.arrives,
            leaves:this.state.leaves,
        }
        this.props.savePlaceNotification(alert).then(res => {
            this.setState({ busy: false })

        }).catch(function (err) {
            this.setState({ busy: false })
            });


      
      
    }
   
    loading(){
        return (
          <Loading/>
        )
    }
    
    ready(){
        return (

           
                        <View style={globalStyle.container}>
                        <List style={{ height: 35 }}>
                            <Separator  bordered>
                                <Text style={{ height: 35, textAlignVertical: 'center' }}>{this.state.firstname}'s notification</Text>
                            </Separator>
                </List>
                <Content padder>
                        <List>
                            
                            <ListItem >
                            <Body>
                                    <Text style={{ color: '#e67e22' }}>ARRIVES</Text>
                            </Body>
                            <Right>
                                <Switch onValueChange={arrives => this.setState({arrives})} value={this.state.arrives}  />
                            </Right>
                            </ListItem>
                            <ListItem >
                            <Body>
                                    <Text style={{ color: '#e67e22' }}>LEAVES</Text>
                            </Body>
                            <Right>
                            <Switch onValueChange={leaves => this.setState({leaves})} value={this.state.leaves}  />
                            </Right>
                            </ListItem>
                        </List>
                        
                        <Button disabled={!this.state.place} style={this.state.place ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                        onPress={()=>this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{color:'white'}}>Save</Text>
                                    </Button>
                                    </Content>
                </View>
            
        )
    }



    render() {


        return (
            <Root>
                <Loader loading={this.state.busy} />
                <OfflineNotice />
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>{this.state.place}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
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



const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        opacity:0,
      },

    mapContainer: {
        height:200,
        
       
        justifyContent: 'center',
        alignItems: 'center'
      
    },
    footerContainer: {
        borderTopColor:'silver',
        borderTopWidth:.5,
        flex: 1,
        padding:5,
        
      },
  });

  
  

const mapStateToProps = state => ({
    isLoading:state.fetchLocation.isLoading,
    alerts:state.fetchLocation.alerts,
  })
  
  PlaceAlert=connect(mapStateToProps,{savePlaceNotification,getPlaceNotification})(PlaceAlert);
  
export default PlaceAlert;

