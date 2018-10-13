
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar, Platform, StyleSheet, View, TextInput, TouchableOpacity, ScrollView,  Alert, ToastAndroid, Form, Image } from 'react-native';
import { Picker , Root, Container, Header, Body, Title, Item, Input, Label, Button, Text, Icon, Content, Left, Right } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading  from '../shared/Loading';
import ImagePicker from 'react-native-image-picker';
import Loader from '../shared/Loader';
import axios from 'axios';
import OfflineNotice from '../shared/OfflineNotice';
import { saveLocation } from '../../redux/actions/locationActions';
import { registerUser , getcountry } from '../../redux/actions/userActions';
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
          email: 'aquinof@rchsp.med.sa',
          password: '111111',
          retypepassword: '111111',
          mobileno: '0538191138',
          firstname: 'Francel',
          middlename: 'Dizon',
          lastname: 'Aquino',
          avatar: '',
          avatarsource: '',
          gender:'',
          birthdate:'',
          country:'',

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



   componentWillMount() {
        this.props.getcountry();
        
    }

    async onDateChange(date) {
        coordinates = []
        this.setState({birthdate:date }) 
    }


  
  
    async onSubmit() {


        let self = this;


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
        if (this.state.birthdate == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter birthdate", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        if (this.state.gender == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter gender", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.country == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter country", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

       


        if (this.state.password != this.state.retypepassword) {
            ToastAndroid.showWithGravityAndOffset("Password mismatch", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        this.setState({ loading: true })
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {

                    await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false&key=AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q")
                        .then(function (res) {
                            let address = res.data.results[0].formatted_address
                            let latitude = position.coords.latitude;
                            let longitude = position.coords.longitude;
                            let user = {
                                email: self.state.email,
                                password: self.state.password,
                                firstname: self.state.firstname,
                                lastname: self.state.lastname,
                                middlename: self.state.middlename,
                                mobileno: self.state.mobileno,
                                address: address,
                                latitude: latitude,
                                longitude: longitude,
                                gender: self.state.gender,
                                country: self.state.country,
                                birthdate: self.state.birthdate,
                                avatarsource: self.state.avatarsource
                            }

                            self.props.registerUser(user).then((res) => {
                                if (res == true) {

                                    self.props.saveLocation();
                                    //self.resetState();
                                    self.props.navigation.navigate('Login');
                                }
                                self.setState({ loading: false })
                            })


                            
                        }).catch(function (error) {
                        });





                },
                (err) => {
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } catch (error) {
        }


        


       


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
          gender:'',
          birthdate:'',
          country:'',
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
  onGenderValueChange(value) {
    this.setState({
      gender: value
    });
  }

  onCountryValueChange(value) {
    this.setState({
      country: value
    });
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
                                      maxLength={20}
                                      autoCapitalize="words"
								name="firstname" autoCorrect={false}
								value={this.state.firstname}
								onChangeText={firstname=>this.setState({firstname})}/>
						</Item>
					
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Middle Name</Label>
                        <Input  style={registrationStyle.textinput} 
                                      maxLength={20}
                                      autoCapitalize="words"
								name="middlename" autoCorrect={false}
								value={this.state.middlename}
								onChangeText={middlename=>this.setState({middlename})}/>
						</Item>
					
                          <Item stackedLabel>
                              <Label style={globalStyle.label} >Last Name</Label>
                            <Input  style={registrationStyle.textinput} 
                                      name="lastname" autoCorrect={false} maxLength={20}
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

                         <Item stackedLabel>
                              <Label style={globalStyle.label} >Birthdate</Label>
                              
                              <Input  style={[registrationStyle.textinput,{position:'absolute',top:20,left:5}]} 
								name="mobileno" autoCorrect={false}
								value={this.state.birthdate}
								/> 
                           <DatePicker
                            style={{width:'100%' }}
                            mode="date"
                            maxDate="2013-06-01"
                            date={this.state.birthdate}
                            format="DD-MMM-YYYY"
                            confirmBtnText="Confirm"
                            hideText={true}
                            cancelBtnText="Cancel"
                            iconSource={require('../../images/today.png')}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute', right: 0
                                },
                                dateInput:{
                                    borderWidth:0,
                                    position: 'absolute', left: 7
                                }

                            }}
                            onDateChange={(date) => this.onDateChange(date)}

                        />
						</Item>

                         <Item stackedLabel>
                              <Label style={globalStyle.label} >Gender</Label>
                              <Picker
                                mode="dropdown"
                                iosHeader="Select Gender"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ width: '100%' }}
                                selectedValue={this.state.gender}
                                onValueChange={this.onGenderValueChange.bind(this)}
                                >
                                 <Picker.Item label="Select gender" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                </Picker>
						</Item>

                        <Item stackedLabel>
                              <Label style={globalStyle.label} >Country</Label>
                              <Picker
                                mode="dropdown"
                                iosHeader="Select Country"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{ width: '100%' }}
                                selectedValue={this.state.country}
                                onValueChange={this.onCountryValueChange.bind(this)}
                                >
                                <Picker.Item label="Select country" value="" />
                                {this.props.countries.map((item, index) => {
                                return (< Picker.Item label={item.country} value={item.id} key={index} />);
                                })}  
                                </Picker>
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
    countries: state.fetchUser.countries,
    isLoading: state.fetchLocation.isLoading,
  })
  


Register = connect(mapStateToProps, { registerUser, saveLocation ,getcountry })(Register);

export default Register;
