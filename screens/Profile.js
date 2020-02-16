import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    ActivityIndicator
  } from 'react-native';

import { connect } from 'react-redux'
import Firebase from '../config/Firebase'
import moment from 'moment'

class Profile extends React.Component {

    constructor() {
        super();
        this.ref = Firebase.firestore().collection('drivers');
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          boards: []
        };
    }
    
    static navigationOptions = {
        title: 'Profile',
    };
    
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
        const boards = [];
        querySnapshot.forEach((doc) => {
          const data  = doc.data()
          boards.push({
            key: doc.id,
            data
          });
        });
        this.setState({
          boards,
          isLoading: false,
       });
    }

    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    render() {
        if(this.state.isLoading){
            return(
              <View style={styles.activity}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )
        }
        const user = this.state.boards.filter(item => item.key === this.props.user.id)
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                        source={{uri: 'https://bootdey.com/img/Content/avatar/avatar1.png'}}/>

                        <Text style={styles.name}> {user[0].data.firstName + " " + user[0].data.lastName} </Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                    <Text style={styles.textInfo}> {user[0].data.email} </Text>
                
                    <Text style={styles.textInfo}> {user[0].data.nic} </Text>
                    
                    <Text style={styles.textInfo}> {user[0].data.licenseNo} </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#1E90FF",
      },
      headerContent:{
        padding:30,
        alignItems: 'center',
      },
      avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
      },
      name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
      },
      bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
      },
      textInfo:{
        fontSize:18,
        marginTop:20,
        color: "#696969",
      }
})

const mapStateToProps = state => {
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)