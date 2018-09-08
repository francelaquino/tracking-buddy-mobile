
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet,ActivityIndicator } from 'react-native';
import { Content } from 'native-base';


class Loading extends Component{
    render() {
        return (
            <View style={[styles.container]}>
            <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator color="gray" />
                <Text style={{ color: 'gray'}}>Please wait</Text>
            </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
    },
    activityIndicatorWrapper: {
        marginTop:-100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    }
  })
export default  Loading;
