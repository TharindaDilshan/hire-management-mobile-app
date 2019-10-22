import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import Firebase from '../config/Firebase'
import {  ListItem, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import moment from 'moment'

class PastHires extends Component {
  
  constructor() {
    super();
    this.ref = Firebase.firestore().collection('hires');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      boards: []
    };
  }

  static navigationOptions = {
    title: 'Past Hires',
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  onCollectionUpdate = (querySnapshot) => {
    const boards = [];
    querySnapshot.forEach((doc) => {
      const { driverId, hireStatus,hireType, pickupDatetime, pickupLocation } = doc.data()
      boards.push({
        key: doc.id,
        driverId,
        hireStatus,
        hireType,
        pickupLocation,
        pickupDatetime: moment(pickupDatetime).format('MMM Do YYYY, h:mm:ss a')
      });
    });
    this.setState({
      boards,
      isLoading: false,
   });
  }
  render() { 
    // console.log('boom',this.props.user.id)
    return (
      <ScrollView style={styles.container}>
          {
            this.state.boards.filter(item => item.driverId === this.props.user.id && item.hireStatus === 'completed' ).map((item, i) => (
              <ListItem
                style={styles.listItem}
                key={i}
                title={item.pickupDatetime + '  ' + item.hireType.toUpperCase() + '  ' + item.pickupLocation.toUpperCase()}
                leftIcon={{name: 'book', type: 'font-awesome'}}
                onPress={() => {
                  this.props.navigation.navigate('PastHireDetails', {
                    hireId: item.key,
                  });
                }}
              />
            ))
          }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22,
   paddingTop: 30
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    textAlign: 'center',
    fontSize: 22
  },
})

const mapStateToProps = state => {
  return{
      user: state.user
  }
}

export default connect(mapStateToProps)(PastHires)
