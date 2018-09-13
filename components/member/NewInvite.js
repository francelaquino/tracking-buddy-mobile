
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right } from 'native-base';
import { connect } from 'react-redux';
import Loader from '../shared/Loader';
import Loading from '../shared/Loading';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfflineNotice  from '../shared/OfflineNotice';
import { addMember, displayMember, displayHomeMember } from '../../redux/actions/memberActions';
var globalStyle = require('../../assets/style/GlobalStyle');


class NewInvite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isbusy:true,
            invitationcode:'',
        };
      }
    
    componentWillMount() {
        this.initialize();
    }
            
    initialize(){
        this.setState({
            isbusy:false,
        })
    }
    
    goBack(){
        this.props.navigation.goBack();
    }  
    onSubmit(){
        if(this.state.invitationcode==""){
            return false;
        }
        this.setState({loading:true})
        this.props.addMember(this.state.invitationcode).then(async res=>{
            if (res == true) {
                await this.props.displayMember();
                await this.props.displayHomeMember();
                this.setState({invitationcode:'',loading:false})
            }else{
                this.setState({invitationcode:'',loading:false})
            }
        });
    }

    loading() {
        return (
            <Loading />
        )
    }
    ready(){
        return (
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <Content padder>
                            <View style={globalStyle.container}>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Invitation Code</Label>
                                    <Input style={globalStyle.textinput} name="invitationcode" autoCorrect={false}
                                        value={this.state.invitationcode} maxLength={20} autoCapitalize="characters"
                                        onChangeText={invitationcode => this.setState({ invitationcode })} />
                                </Item>

                           
                            
                            
                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                <Button disabled={!this.state.invitationcode}
                                    onPress={()=>this.onSubmit()}
                                    bordered light full rounded style={globalStyle.secondaryButton}>
                                    <Text style={{color:'white'}}>Submit</Text>
                                </Button>
                            </View>

                            </View>
                            </Content>
                    </ScrollView>
                    
        );
    }

    render() {
        return (
            <Root>
                <Loader loading={this.state.loading} />
                <OfflineNotice />
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={[globalStyle.headerBody, { flex: 3 }]}>
                            <Title>ADD MEMBER</Title>
                        </Body>
                        <Right  >
                        </Right>
                    </Header>

                    {
                        this.state.isbusy ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
        );
      
    }
}


const mapStateToProps = state => ({
    members: state.fetchMember.members,
})
  
export default connect(mapStateToProps,{displayMember,addMember,displayHomeMember})(NewInvite);