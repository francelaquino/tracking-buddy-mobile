
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

class NoConnection extends Component{
    render() {
        return (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>Network connection error</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
      backgroundColor: '#b52424',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width:'100%',
    },
    offlineText: { color: '#fff' }
  });
  
export default  NoConnection;
