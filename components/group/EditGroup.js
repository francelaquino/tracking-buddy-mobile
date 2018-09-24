
import React, { Component } from 'react';
import { StatusBar, Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native';
import { Content, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { displayGroup,updateGroup, deleteGroup  } from '../../redux/actions/groupActions' ;
import Loader from '../shared/Loader';
import Loading from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
import { NavigationActions } from 'react-navigation'
var globalStyle = require('../../assets/style/GlobalStyle');
var registrationStyle = require('../../assets/style/Registration');

class EditGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isbusy: true,
            loading: false,
            groupNameOld: '',
            emptyphoto:'1',
            groupname:'',
            avatarsource:'',
            isPhotoChange:false,
            avatar:'',
            groupid:''
        };
      }

    componentWillMount() {
        this.initialize();
    }
            
    initialize() {
        setTimeout(() => {
            this.setState({
                avatarsource: { uri: this.props.navigation.state.params.group.avatar },
                groupNameOld: this.props.navigation.state.params.group.groupname,
                groupname: this.props.navigation.state.params.group.groupname,
                emptyphoto: this.props.navigation.state.params.group.emptyphoto,
                groupid: this.props.navigation.state.params.group.id,
                isbusy: false,
            })
        }, 500);
    }
    removePhoto(){
		this.setState({
            //avatarsource:{uri:''},
            isPhotoChange: true,
            emptyphoto:1,
        });
    }
    

    selectPhoto() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
          }
          else if (response.error) {
          }
          else if (response.customButton) {
          }
          else {
            let source = { uri: response.uri };
            
            this.setState({
              avatarsource: source,
                isPhotoChange: true,
                emptyphoto: '0',
            });
          }
        });
      }
          
    confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            'Are you sure you want to delete the group?',
            [
              
              {text: 'Yes', onPress: () => this.onDelete()},
              {text: 'No', style: 'cancel'},
            ],
            { cancelable: true }
          )
    }
    onDelete(){
        this.setState({loading:true})
        this.props.deleteGroup(this.state.groupid).then(res=>{
        	if(res==true){
                this.setState({loading:false})
                this.props.displayGroup();
                this.props.navigation.pop(2);
            }
        });


        
    }
    onUpdate(){
        
        if(this.state.groupname==""){
            return false;
        }
        this.setState({loading:true})
        let group={
            groupname:this.state.groupname,
            groupid: this.state.groupid,
            avatarsource:this.state.avatarsource,
            isPhotoChange:this.state.isPhotoChange,
            emptyphoto:this.state.emptyphoto,
        }
        this.props.updateGroup(group).then(res => {
            if(res===true){
                this.setState({loading:false})
                this.props.displayGroup();
                this.props.navigation.pop(2)
            }
        });

        
    }

   
    

    loading(){
        return (
          <Loading/>
        )
    }
    ready() {

        return (
               
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                <Content padder>
                        <View style={globalStyle.container}>
                            <TouchableOpacity style={{ marginTop: 20 }} onPress={this.selectPhoto.bind(this)}>
                                <View style={globalStyle.avatarContainer}>
                                   

                                        {this.state.emptyphoto === 1 ? <Ionicons size={75} style={{ color: '#2c3e50' }} name="ios-people" /> :
                                            <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                        }

                                </View>
                            </TouchableOpacity>
                            {this.state.emptyphoto !== 1  &&
                                <TouchableOpacity onPress={this.removePhoto.bind(this)}>
                                    <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                                </TouchableOpacity>
                                }
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Group Name</Label>
                                    <Input style={globalStyle.textinput} value={this.state.groupname} maxLength={20}
                                        onChangeText={groupname => this.setState({ groupname })} />
                                </Item>

                           


                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button style={globalStyle.secondaryButton}
                                    onPress={() => this.onUpdate()}
                                    bordered light full  >
                                    <Text style={{ color: 'white' }}>Update Group</Text>
                                </Button>



                                <Button
                                    onPress={() => this.confirmDelete()}
                                    bordered light full style={globalStyle.deleteButton}>
                                    <Text style={{ color: 'white' }}>Delete Group</Text>
                                </Button>
                            </View>

                    </View>
                </Content>
                    </ScrollView>
               
        )
    }



    
    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Loader loading={this.state.loading} />

                    <OfflineNotice />
                    
                    <Header style={globalStyle.header}>
                        <StatusBar backgroundColor="#149279" />
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>{this.props.navigation.state.params.group.groupname}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
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
})
  
EditGroup=connect(mapStateToProps,{updateGroup,displayGroup, deleteGroup})(EditGroup);
  
export default EditGroup;
