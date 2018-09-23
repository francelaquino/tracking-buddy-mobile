
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import Loader  from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Loading from '../shared/Loading';
import { createGroup,displayGroup  } from '../../redux/actions/groupActions' ;
var globalStyle = require('../../assets/style/GlobalStyle');
var registrationStyle = require('../../assets/style/Registration');



class CreateGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            busy:true,
            loading: false,
            groupname: '',
            avatarsource: '',
            avatar: '',
            emptyphoto:'1',
        };
    }

	
	
	
	
	removePhoto(){
		this.setState({emptyphoto:'1'});
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
                    emptyphoto:'0'
                });
            }
        });
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({busy:false})
        }, 500);
        
    } 
    onSubmit() {
        if (this.state.groupname == "") {
            return false;
        }
        this.setState({ loading: true })
        this.props.createGroup(this.state.groupname, this.state.avatarsource,this.state.emptyphoto).then(res => {
           
            if (res == true) {
                this.removePhoto();
                this.state.groupname = "";
                this.setState({ loading: false })
                this.props.displayGroup();
                this.props.navigation.goBack();
               
            } else {
                this.setState({ loading: false })
            }
            
        });
    }


    loading() {
        return (
                    <Loading />
        )
  }
    ready() {
        return (
          
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <Content padder>
                            <View style={globalStyle.container}>
                                <TouchableOpacity style={{ marginTop: 20 }} onPress={this.selectPhoto.bind(this)}>
                            <View style={globalStyle.avatarContainer}>

                                {this.state.emptyphoto === '1' ? <Ionicons size={75} style={{ color: '#2c3e50' }} name="ios-people" />  :
                                            <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                        }

                                    </View>
                                </TouchableOpacity>
                                {this.state.emptyphoto === '0' &&
                                    <TouchableOpacity onPress={this.removePhoto.bind(this)}>
                                        <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                                    </TouchableOpacity>
                                }
                                    <Item stackedLabel>
                                        <Label style={globalStyle.label} >Group Name</Label>
                                        <Input style={globalStyle.textinput} value={this.state.groupname} maxLength={20}
                                            onChangeText={groupname => this.setState({ groupname })}  />
                                    </Item>
                                    


                                


                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Button style={globalStyle.secondaryButton}
                                        onPress={() => this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{ color: 'white' }}>Save</Text>
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
                <Loader loading={this.state.loading} />
                <OfflineNotice />
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>ADD GROUP</Title>
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
  
CreateGroup=connect(mapStateToProps,{createGroup,displayGroup})(CreateGroup);
  
export default CreateGroup;
