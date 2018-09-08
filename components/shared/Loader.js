

import React, { Component } from 'react';
import { Modal, View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { Content } from 'native-base';


class Loader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
        }
    }
    render() {
        return (
            <Modal style={styles.modalWrapper}
                transparent={true}
                onRequestClose={() => null}
                visible={this.props.loading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator color="white"
                            animating={this.props.loading} />
                        <Text style={{ color: 'white' }}>Please wait</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        height: Dimensions.get('window').height + 200,
    },
    modalBackground: {
        height: Dimensions.get('window').height + 200,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#515151',
        height: 70,
        width: 250,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    }
})
export default Loader;
