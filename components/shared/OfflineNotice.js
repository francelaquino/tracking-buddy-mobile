import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setConnection  } from '../../redux/actions/connectionActions' ;
const { width,height } = Dimensions.get('window');



class OfflineNotice extends PureComponent {

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
     this.props.setConnection(isConnected);
  };

  render() {
    if (!this.props.isConnected) {
      return (
        <View>
        </View>
      )
    }else{
        return null;
    }
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: 'red',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
      position: 'absolute',
    bottom:0,
    zIndex :99999
  },
  offlineText: { color: 'white' }
});



const mapStateToProps = state => ({
    isConnected: state.fetchConnection.isConnected,
})

OfflineNotice=connect(mapStateToProps,{setConnection})(OfflineNotice);

export default OfflineNotice;
