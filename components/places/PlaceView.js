
import React, { Component } from 'react';
import { FlatList, StatusBar, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem, Left, Right, Thumbnail, Switch, Separator } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { getPlaceNotification,updateMemberNotification  } from '../../redux/actions/memberActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class PlaceView extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            id:'',
            loading:true,
            region: {
                  latitude: -37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
            notifications: [],
            mapMode: 'standard',
        };

      }
    

    

    componentWillMount() {
        this.initialize();
    }
            
    async initialize() {
       
        await this.setState({
            id:this.props.navigation.state.params.place.id,
            place:this.props.navigation.state.params.place.place,
            region:{
                latitude: this.props.navigation.state.params.place.latitude,
                longitude: this.props.navigation.state.params.place.longitude,
                latitudeDelta: this.props.navigation.state.params.place.latitudedelta,
                longitudeDelta: this.props.navigation.state.params.place.longitudedelta,
            },
           
        })
        await this.props.getPlaceNotification(this.props.navigation.state.params.place.id).then(async res => {
            this.setState({ notifications:[] })
            let count = 0;
            let cnt = 0;
            count = this.props.members.length;
            console.log(this.props.members)
            let x = 0;
            if (count > 0) {
                await this.props.members.forEach(data => {
                  
                    if (data.arrives == '1') {
                        data.arrives = true;
                    } else {
                        data.arrives = false;
                    }
                    if (data.leaves == '1') {
                        data.leaves = true;
                    } else {
                        data.leaves = false;
                    }
                    this.setState({
                        notifications: this.state.notifications.concat(data)
                    });
                    cnt++;
                })
            }
            if (cnt >= count) {
                this.setState({ loading: false })
            }
            
        });
    }


 

    async changeMapMode() {
        if (this.state.mapMode == "standard") {
            this.setState({
                mapMode: 'satellite'
            });
        } else {
            this.setState({
                mapMode: 'standard'
            });
        }

    }
    onArrivesChange(item,value,index){
        this.props.updateMemberNotification(this.props.navigation.state.params.place.id, item, value, 'arrives').then(res => {
            let noti = this.state.notifications;
            noti[index].arrives = value;
            this.setState({ notifications: noti })
        });
    }
    onLeavesChange(item,value,index){
        this.props.updateMemberNotification(this.props.navigation.state.params.place.id, item, value, 'leaves').then(res => {
            let noti = this.state.notifications;
            noti[index].leaves = value;
            this.setState({ notifications: noti })

        });
    }
    renderMember() {
        return (
            <View >
                <FlatList
                    style={{ flex: 1 }}
                    keyExtractor={item => item.id.toString()}
                    data={this.state.notifications}
                    renderItem={({ item,index }) => (
                        <ListItem avatar key={item.id.toString()} style={[globalStyle.listItem, {}]}  >
                            <Left style={globalStyle.listLeft}>

                                <View style={globalStyle.listAvatarContainer} >
                                     {item.emptyphoto === "1" ? <Text style={{fontSize:23,color:'#16a085'}}>{item.firstletter}</Text> :
                                    <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                                }

                                </View>

                            </Left>
                            <Body style={[globalStyle.listBody, {}]} >
                                <Text style={globalStyle.listHeading}>{item.firstname}</Text>
                            </Body>

                            <Right style={[globalStyle.listRight, { width: 100, height: 60 }]} >
                                <View style={{ width: 100, height: 20, position: 'absolute', top: 2, right: 0 }}>
                                    <Text style={{ fontSize: 12, color: '#e67e22' }}>ARRIVES</Text>
                                    <Switch onValueChange={arrives => this.onArrivesChange(item, arrives,index)} style={{ position: 'absolute', top: 0, right: 0 }} value={item.arrives} />
                                </View>
                                <View style={{ width: 100, height: 20, position: 'absolute', top: 32, right: 0 }}>
                                    <Text style={{ fontSize: 12, color: '#e67e22', position: 'absolute', top: 0 }}>LEAVES</Text>
                                    <Switch onValueChange={leaves => this.onLeavesChange(item, leaves,index)} style={{ position: 'absolute', top: 0, right: 0 }} value={item.leaves} />
                                </View>
                            </Right>
                        </ListItem>



                    )}
                />
            </View>)
    }


    loading() {
        return (
            <Loading />
        )
    }
    ready() {
      

        return (

            
                <View style={styles.mainContainer}>
                    <View style={styles.mapContainer}>
                        <Image style={globalStyle.marker}
                            source={require('../../images/placemarker.png')} />
                        <MapView ref={map => { this.map = map }}
                            zoomEnabled={true}
                            region={{ latitude: this.props.navigation.state.params.place.latitude, longitude: this.props.navigation.state.params.place.longitude, latitudeDelta: this.props.navigation.state.params.place.latitudedelta, longitudeDelta: this.props.navigation.state.params.place.latitudedelta }}
                            style={StyleSheet.absoluteFill}
                            textStyle={{ color: '#bc8b00' }}
                            loadingEnabled={true}
                            mapType={this.state.mapMode}
                            showsMyLocationButton={false}>

                            <MapView.Marker coordinate={this.state.region} >
                                <Image style={globalStyle.marker}
                                    source={require('../../images/placemarker.png')} />
                            </MapView.Marker>


                        </MapView>

                    </View>

                    <View style={globalStyle.mapMenu}>

                      
                        <TouchableOpacity style={globalStyle.mapMenuCircleMap} onPress={() => this.changeMapMode()} >
                            <View style={globalStyle.mapMenuCircleContainer}>
                                <SimpleLineIcons size={23} style={{ color: 'white' }} name="globe" />
                            </View>
                        </TouchableOpacity>
                        <Text style={globalStyle.mapMenuLabel}>Map Style </Text>





                    </View>






                    <View style={styles.footerContainer}>
                        <List style={{ height: 35 }}>
                            <Separator bordered>
                                <Text style={{ height: 35, textAlignVertical: 'center' }}>Notify me when</Text>
                            </Separator>
                        </List>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <Content padder>
                            <View>
                                {
                                    this.renderMember()
                                    }
                            </View>
                        </Content>
                        </ScrollView  >
                    </View>
                   

                </View>


          

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
                            <Title>{this.state.place}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}  >
                            <Button transparent onPress={() => this.props.navigation.navigate("EditCreatePlace", { place: this.props.navigation.state.params.place })}>
                                <MaterialIcons size={30} style={{ color: 'white' }} name='edit' />
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



const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderBottomColor:'silver',
        borderBottomWidth:.5,
      },

    mapContainer: {
        height:200,
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
      
    },

    footerContainer: {
        flex: 1,
        
      },
  });

  
  

const mapStateToProps = state => ({
    members:state.fetchMember.placenotification,
    isLoading:state.fetchMember.isLoading,
  })
  
PlaceView=connect(mapStateToProps,{getPlaceNotification,updateMemberNotification})(PlaceView);
  
export default PlaceView;

