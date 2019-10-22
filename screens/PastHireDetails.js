import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { List, ListItem, Text, Card, Button } from 'react-native-elements';
import Firebase from '../config/Firebase';
import moment from 'moment'

class PastHireDetails extends Component {
  static navigationOptions = {
    title: 'Hire Details',
  };
  
  constructor() {
    super();
    this.state = {
      isLoading: true,
      hire: {},
      key: ''
    };
    
  }
  componentDidMount() {
    const { navigation } = this.props;
    const ref = Firebase.firestore().collection('hires').doc(navigation.getParam('hireId'));
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          hire: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        {this.state.hire.hireType === 'import' ? 
          <Card style={styles.container}>
            <View style={styles.subContainer}>
              <View>
                <Text h3>{this.state.hire.hireType.toUpperCase()}</Text>
              </View>
              <View>
                <Text h5>Date: {moment(this.state.hire.completedDatetime.toDate()).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Customer: {this.state.hire.customerName}</Text>
              </View>
              <View>
                <Text h5>Vehicle: {this.state.hire.vehicleNo}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text h3>Container Details</Text>
              </View>
              <View>
                <Text h5>Container Type: {this.state.hire.containerType}</Text>
              </View>
              <View>
                <Text h5>Pickup Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Container Location: {this.state.hire.pickupLocation}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text h3>Cargo Details</Text>
              </View>
              <View>
                <Text h5>Cargo Type: {this.state.hire.cargoType}</Text>
              </View>
              <View>
                <Text h5>Cargo Weight: {this.state.hire.weight}</Text>
              </View>
              <View>
                <Text h5>Vessel Arrived Date: {moment(this.state.hire.vesselArrivalDatetime).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Unloaded Port: {this.state.hire.unloadingPort}</Text>
              </View>
              <View>
                <Text h5>Destination: {this.state.hire.destination}</Text>
              </View>
            </View>
          </Card>
        :
        <Card style={styles.container}>
          <View style={styles.subContainer}>
              <View>
                <Text h3>{this.state.hire.hireType.toUpperCase()}</Text>
              </View>
              <View>
                <Text h5>Date: {moment(this.state.hire.completedDatetime.toDate()).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Customer: {this.state.hire.customerName}</Text>
              </View>
              <View>
                <Text h5>Vehicle: {this.state.hire.vehicleNo}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text h3>Container Details</Text>
              </View>
              <View>
                <Text h5>Container Type: {this.state.hire.containerType}</Text>
              </View>
              <View>
                <Text h5>Pickup Date: {moment(this.state.hire.pickupDatetime).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Container Location: {this.state.hire.pickupLocation}</Text>
              </View>
            </View>
            <View style={styles.subContainer}>
              <View>
                <Text h3>Cargo Details</Text>
              </View>
              <View>
                <Text h5>Cargo Type: {this.state.hire.cargoType}</Text>
              </View>
              <View>
                <Text h5>Cargo Weight: {this.state.hire.weight}</Text>
              </View>
              <View>
                <Text h5>Loaded Date: {moment(this.state.hire.loadingDatetime).format('MMM Do YYYY, h:mm:ss a')}</Text>
              </View>
              <View>
                <Text h5>Loaded Port: {this.state.hire.loadingPort}</Text>
              </View>
            </View>
        </Card>
        }
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
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
  detailButton: {
    marginTop: 10
  }
})

export default PastHireDetails;