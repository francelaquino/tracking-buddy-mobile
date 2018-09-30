
import React, { Component } from 'react';
import { StatusBar, TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, FlatList  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayMessages  } from '../../redux/actions/locationActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
var globalStyle = require('../../assets/style/GlobalStyle');
import firebase from 'react-native-firebase';



class PlaceNotifications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            notifications: [],
        };
    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
        this.props.displayMessages().then(res => {
            this.setState({ loading: false, notifications: this.props.messages })
            
        });
    }

    componentDidMount() {
        firebase.notifications().removeAllDeliveredNotifications();

    }


    

    loading(){
        return (
          <Loading/>
        )
    }

    searchFilterFunction = text => {
        if (text != "") {
            this.setState({ notifications: []})
            let ideas = this.props.messages.filter((idea) => {
                return idea.message.includes(text)
            });

            console.log(ideas)

            this.setState({ notifications: [ ...ideas] })

          
        } else {
            this.setState({ notifications: this.props.messages})
        }

    };
    renderNotifications() {
        return (
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                data={this.state.notifications}
                renderItem={({ item }) => (
                 
                        <ListItem key={item.id}  button avatar style={globalStyle.listItem}  >
                        <Left style={globalStyle.listLeft}>
                            <View style={globalStyle.listAvatarContainer} >

                                {item.emptyphoto === "1" ? <Ionicons size={46} style={{ color: '#2c3e50' }} name="ios-person" /> :
                                    <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                                }
                            </View>
                </Left>
                        <Body style={globalStyle.listBody} >
                            <Text numberOfLines={1} style={globalStyle.listHeading}>{item.message}</Text>
                        <Text numberOfLines={1} note style={{ fontSize: 12 }}>{item.datetime}</Text>
                           
                            
                        </Body>
                    
                    <Right style={globalStyle.listRight}>
                            {item.action === "Leaves" ? <SimpleLineIcons style={[globalStyle.listRightOptionIcon, { color: '#e67e22' }]} name='logout' /> :
                                <SimpleLineIcons style={[globalStyle.listRightOptionIcon, { color:'#e67e22'}]} name='login' />
                            }
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
                            {this.renderNotifications()}
                        </List>
                         
                            </View>
                            </Content>
                    </ScrollView>
                    
        )
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
                            <Title>NOTIFICATIONS</Title>
                        </Body>
                        <Right style={globalStyle.headerRight} >
                           

                        </Right>
                    </Header>
                    <Header style={globalStyle.header} searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input placeholder="Search" onChangeText={text => this.searchFilterFunction(text)} />
                        </Item>
                        <Button transparent>
                            <Text>Search</Text>
                        </Button>
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
    messages: state.fetchLocation.messages,
  })
  
PlaceNotifications = connect(mapStateToProps, { displayMessages })(PlaceNotifications);
  
export default PlaceNotifications;

