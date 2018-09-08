
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Alert, Image, FlatList, Switch } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, List, ListItem, Tab, Badge, Tabs , TabHeading, FooterTab, Footer, Content, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getMember, displayMember, deleteMember, displayHomeMember, getMemberGroup, getMemberNotification } from '../../redux/actions/memberActions' ;
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';

var globalStyle = require('../../assets/style/GlobalStyle');



class InfoMember extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isbusy:false,
        }
      }

      
    async componentWillMount() {
       
        await this.props.getMember(this.props.navigation.state.params.memberuid).then(res => {
            if (res == true) {
                this.setState({ loading: false })
            }
        });
        await this.props.getMemberGroup(this.props.navigation.state.params.memberuid).then(res => {
           
        });
        await this.props.getMemberNotification(this.props.navigation.state.params.memberuid).then(res => {
        });

    }

    onDelete(){
        let self=this;
        this.setState({ isbusy:true})
        this.props.deleteMember(this.props.navigation.state.params.memberuid).then(res=>{
            
                self.props.displayMember();
            self.props.displayHomeMember();
            setTimeout(() => {
                this.props.navigation.pop(1);
                self.setState({ isbusy: false })
            },500)
           
        }).catch(function(err) {
            self.setState({loading:false})
        });
    }


    confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            'Are you sure you want to delete the member?',
            [
              
              {text: 'Yes', onPress: () => this.onDelete()},
              {text: 'No', style: 'cancel'},
            ],
            { cancelable: true }
          )
    }

    loading(){
        return (
          <Loading/>
        )
    }

    renderMemberNotification() {
        return (
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={item => item.id.toString()}
                stickyHeaderIndices={this.state.stickyHeaderIndices}
                data={this.props.placenotification}
                renderItem={({ item }) => (
                    <View key={item.id.toString()} >
                        <ListItem key={item.id.toString()} style={[globalStyle.listItem, { borderBottomWidth:0 }]}>
                            <Body>
                                <Text numberOfLines={1} style={globalStyle.listHeading}>{item.place}</Text>
                                <Text note numberOfLines={1} >{item.address}</Text>
                            </Body>
                        </ListItem>
                        <ListItem style={[globalStyle.listItem, { height: 20, borderBottomWidth: 0 }]}>
                            <Body>
                                <Text style={{ color: '#e67e22' }}>ARRIVES</Text>
                            </Body>
                            <Right>
                                {item.arrives === '1' &&
                                    <FontAwesome style={{ color: '#e67e22' }} size={25} name="toggle-on" />
                                }
                                {item.arrives === '0' &&
                                    <FontAwesome style={{ color: '#e67e22' }} size={25} name="toggle-off" />
                                }
                            </Right>
                        </ListItem>
                        <ListItem style={[globalStyle.listItem, { height: 20, borderBottomWidth: 1 }]}>
                            <Body>
                                <Text style={{ color: '#e67e22'}}>LEAVES</Text>
                            </Body>
                            <Right>
                                {item.leaves === '1' &&
                                    <FontAwesome style={{ color: '#e67e22' }} size={25} name="toggle-on" />
                                }
                                {item.leaves === '0' &&
                                    <FontAwesome style={{ color: '#e67e22' }} size={25} name="toggle-off" />
                                }
                            </Right>
                        </ListItem>
                     </View>
                   
                )}
            />)
    }



    renderMemberGroup() {
        return (
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={item => item.id.toString()}
                data={this.props.membergroups}
                renderItem={({ item }) => (

                    <ListItem key={item.id.toString()} avatar style={globalStyle.listItem}>
                        <Left style={globalStyle.listLeft}>
                            <View style={globalStyle.listAvatarContainer} >
                                <Thumbnail style={globalStyle.listAvatar} source={{ uri: item.avatar }} />
                            </View>
                        </Left>
                        <Body style={globalStyle.listBody} >
                            <Text numberOfLines={1}  style={globalStyle.listHeading}>{item.groupname}</Text>
                        </Body>
                    </ListItem>
                )}
            />)
    }


    ready() {
        

        return (
                
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>

                            <View style={{ marginTop: 10, paddingBottom: 10 }}>
                           
                    <View style={globalStyle.avatarContainer}>
                        {this.props.member.emptyphoto === '1' ? <Ionicons size={75} style={{ color: '#2c3e50' }} name="ios-person" /> :
                            <Image style={globalStyle.avatarBig} source={{ uri: this.props.member.avatar }} />
                        }

                            
                                    </View>
                                    <Label style={{ width: '100%', textAlign: 'center', color: '#16a085' }}>{this.props.member.fullname}</Label>
                                    <View style={{ width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><View><Label style={{ fontSize: 16 }}> <MaterialCommunityIcons name='email-outline' style={{ fontSize: 15 }} /> {this.props.member.email}</Label></View></View>
                                <View style={{ width: '100%', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><View><Label style={{ fontSize: 16 }}> <MaterialCommunityIcons name='cellphone' style={{ fontSize: 15 }} /> {this.props.member.mobileno}</Label></View></View>
                                <View style={{ marginTop: 10 }}>
                                    <Button
                                        onPress={() => this.confirmDelete()}
                                        bordered light full style={[globalStyle.deleteButton, {width:'90%'}]}>
                                        <Text style={{ color: 'white' }}>Delete </Text>
                                    </Button>
                                </View>
                            </View>
                            <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 2, borderBottomColor: '#16a085'  }}  tabContainerStyle={{ elevation: 0}} >
                                <Tab heading="Group" tabStyle={{ backgroundColor: '#16a085' }} textStyle={{ color: 'white' }} activeTextStyle={{ color: 'white', fontWeight: 'normal' }} activeTabStyle={{ backgroundColor: '#16a085' }} >
                                    <Content padder>
                                        <List>
                                            {this.renderMemberGroup()}
                                        </List>
                                    </Content>
                                    </Tab>
                                <Tab heading="Notification" tabStyle={{ backgroundColor: '#16a085' }} textStyle={{ color: 'white' }} activeTextStyle={{ color: 'white', fontWeight: 'normal' }} activeTabStyle={{ backgroundColor: '#16a085' }} >
                                    <Content padder>
                                        <List>
                                            {this.renderMemberNotification()}
                                        </List>
                                    </Content>
                                    </Tab>
                            
                                </Tabs>
                            
                                
                           

                               
                            </ScrollView>
                   
                            
                    
        );
    }
    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <View style={globalStyle.container}>
                        <Loader loading={this.state.isbusy} />
                        <OfflineNotice />
                        <Header hasTabs style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                    <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                                </Button>
                            </Left>
                            <Body style={globalStyle.headerBody}>
                                <Title>{this.props.navigation.state.params.firstname}</Title>
                            </Body>
                            <Right style={globalStyle.headerRight}>
                            </Right>

                        </Header>

                        {
                            this.state.loading ? this.loading() :
                                this.ready()
                        }
                    </View>

                </Container>
            </Root>



        );


        
    }

}


const mapStateToProps = state => ({
    member: state.fetchMember.member,
    placenotification: state.fetchMember.placenotification,
    membergroups: state.fetchMember.membergroups,
    isLoading:state.fetchMember.isLoading,
  })
  
  
InfoMember = connect(mapStateToProps, { getMember, displayMember, deleteMember, getMemberGroup, displayHomeMember, getMemberNotification})(InfoMember);
  
export default InfoMember;
  

