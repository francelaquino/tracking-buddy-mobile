
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, Platform, StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Picker, Alert, ToastAndroid, Form, Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Text, Icon, Content, Left, Right } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading  from '../shared/Loading';
import ImagePicker from 'react-native-image-picker';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import { saveLocation } from '../../redux/actions/locationActions';
import { registerUser } from '../../redux/actions/userActions';
var registrationStyle = require('../../assets/style/Registration');
var globalStyle = require('../../assets/style/GlobalStyle');


class Register extends Component {
  constructor(props) {
    super(props)
      this.state = {
          loading: false,
          latitude: '',
          longitude: '',
          address: '',
          isLoading: true,
          email: '',
          password: '',
          retypepassword: '',
          mobileno: '',
          firstname: '',
          middlename: '',
          lastname: '',
          avatar: '',
          avatarsource: ''

      };
    
  
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
          avatarsource: source
        });
      }
    });
  }




  /*onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  */
  
    async onSubmit() {





        if (this.state.email == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter email address", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.password == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }


        if (this.state.mobileno == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter mobile no", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.firstname == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter first name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.lastname == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter last name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }


        if (this.state.password != this.state.retypepassword) {
            ToastAndroid.showWithGravityAndOffset("Password mismatch", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        this.setState({ loading: true })
        let user = {
            email: this.state.email,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            middlename: this.state.middlename,
            mobileno: this.state.mobileno,
            avatarsource: this.state.avatarsource
        }


        this.props.registerUser(user).then((res) => {
            if (res == true) {
                
               this.props.saveLocation();

                this.resetState();
            }
            this.setState({ loading: false })
        })


       


    }


   resetState(){
      this.setState({
          email: '',
          password: '',
          retypepassword: '',
          mobileno: '',
          firstname: '',
          middlename: '',
          lastname: '',
          avatar: '',
          longitude: '',
          latitude: '',
          address: '',
          isLoading: false,
          loading: false,
          avatarsource: '',
      })
  }

  loading(){
	  return (
		<Loading/>
	  )
  }
  ready(){
		const { navigate } = this.props.navigation;
	  return (
			<Root>

              <Container style={globalStyle.containerWrapper} >
      <Loader loading={this.state.loading} />
                  <OfflineNotice />
                  <Header style={globalStyle.header}>
                      <StatusBar backgroundColor="#16a085" />
                      <Left style={globalStyle.headerLeft} >
                          <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                              <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                          </Button>
                      </Left>
                      <Body style={globalStyle.headerBody}>
                          <Title style={globalStyle.headerTitle}>REGISTRATION</Title>
                      </Body>
                      <Right style={globalStyle.headerRight} >



                      </Right>

                  </Header>
                  <Content padder>
			<ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                      <View style={globalStyle.container}>
                    <View  style={{marginBottom:20,marginTop:20}}>
						<TouchableOpacity onPress={this.selectPhoto.bind(this)}>
							<View style={registrationStyle.avatarContainer}>
							{ this.state.avatarsource === '' ? <Text style={{fontSize:10,marginTop:32,color:'white'}}>Select a Photo</Text> :
							<Image style={registrationStyle.avatar} source={this.state.avatarsource} />
							}
							</View>
						</TouchableOpacity>
					</View>
                         
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Email address</Label>
                              <Input style={globalStyle.textinput} 
							name="email" autoCorrect={false} maxLength = {50}
                                      value={this.state.email}
                                      autoCapitalize="none"
							onChangeText={email=>this.setState({email})}/>
						</Item>
					
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Password</Label>
                            <Input  style={registrationStyle.textinput } 
								name="password" autoCorrect={false}
								value={this.state.password} secureTextEntry
								onChangeText={password=>this.setState({password})}/>
						</Item>


                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Re-Type Password</Label>
                            <Input  style={registrationStyle.textinput} 
								name="retypepassword" autoCorrect={false}
								value={this.state.retypepassword} secureTextEntry
								onChangeText={retypepassword=>this.setState({retypepassword})}/>
						
						</Item>
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >First Name</Label>
                            <Input  style={registrationStyle.textinput} 
                                      maxLength={15}
                                      autoCapitalize="words"
								name="firstname" autoCorrect={false}
								value={this.state.firstname}
								onChangeText={firstname=>this.setState({firstname})}/>
						</Item>
					
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Middle Name</Label>
                        <Input  style={registrationStyle.textinput} 
                                      maxLength={15}
                                      autoCapitalize="words"
								name="middlename" autoCorrect={false}
								value={this.state.middlename}
								onChangeText={middlename=>this.setState({middlename})}/>
						</Item>
					
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Last Name</Label>
                            <Input  style={registrationStyle.textinput} 
                                      name="lastname" autoCorrect={false} maxLength={15}
                                      autoCapitalize="words"
								value={this.state.lastname}
								onChangeText={lastname=>this.setState({lastname})}/>
					</Item>
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Mobile No.</Label>
                            <Input  style={registrationStyle.textinput} 
								name="mobileno" autoCorrect={false}
								value={this.state.mobileno}
								onChangeText={mobileno=>this.setState({mobileno})}/>
						</Item>
					
						
					<View style={{justifyContent: 'center',alignItems: 'center',marginTop:10}}>
						<Button 
							onPress={()=>this.onSubmit()}
							full  style={registrationStyle.registrationbutton}>
							<Text>Register</Text>
						</Button>
                                  <TouchableOpacity style={{ marginTop: 20 }} underlayColor={'transparent'} onPress={() => this.props.navigation.goBack()}>
						<Text style={registrationStyle.haveaccount}>Already have an acccount? <Text style={registrationStyle.loginButton}>Login</Text></Text>
						</TouchableOpacity>
						
					</View>
					</View>
                      </ScrollView>
                      </Content>
				</Container>
			</Root>
	  )
  }
  render() {
		  return this.ready();
  }
}



const mapStateToProps = state => ({

})



Register = connect(mapStateToProps, { registerUser, saveLocation})(Register);

export default Register;
