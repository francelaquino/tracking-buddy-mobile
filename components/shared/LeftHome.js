
import React, { Component } from 'react';
import { Button, Icon,Left, Drawer } from 'native-base';

var globalStyle = require('../../assets/style/GlobalStyle');


class LeftHome extends Component {
    render(){
        const navigation = this.props.navigation;
        return (
            <Left style={globalStyle.headerMenu} >
                <Button transparent onPress={()=>this.navigation.openDrawer()} >
                    <Icon size={30} name='menu' />
                </Button> 
            </Left>
        )
    }
}


  
export  default  LeftHome ;
