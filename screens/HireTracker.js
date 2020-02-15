import React, { Component } from "react";
// import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    FlatList,
    ActivityIndicator
  } from 'react-native';
import Firebase from '../config/Firebase'
import {  ListItem, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux'
import moment from 'moment'

class HireTracker extends Component {

    static navigationOptions = {
        title: 'Update Tracker',
      };
  
    constructor() {
        super();
        this.state = {
            marked: false,
            isLoading: true,
            hire: {},
            key: '',
            updated: 0
            // importData: [
            //   {id:1, title: "Truck Dispatched", image:"https://img.icons8.com/color/48/000000/interstate-truck.png", backgroundColor:"green"},
            //   {id:2, title: "At Cargo Location", image:"https://img.icons8.com/color/48/000000/cargo-ship.png", backgroundColor:"#f6f6f6"},
            //   {id:3, title: "Cargo Loaded", image:"https://img.icons8.com/color/48/000000/container-truck.png", backgroundColor:"#f6f6f6"} ,
            //   {id:4, title: "In Transit", image:"https://img.icons8.com/color/48/000000/in-transit.png", backgroundColor:"#f6f6f6"} , 
            //   {id:5, title: "Destination Reached", image:"https://img.icons8.com/color/48/000000/fork-lift.png", backgroundColor:"#f6f6f6"} ,
            //   {id:6, title: "Hire Completed", image:"https://img.icons8.com/color/48/000000/checked-truck.png", backgroundColor:"#f6f6f6"} ,
            // ],
            // exportData: [
            //     {id:1, title: "Truck Dispatched", image:"https://img.icons8.com/color/48/000000/interstate-truck.png", backgroundColor:"#f6f6f6"},
            //     {id:2, title: "At Container Location", image:"https://img.icons8.com/color/48/000000/shipping-container.png", backgroundColor:"#f6f6f6"},
            //     {id:3, title: "In Transit", image:"https://img.icons8.com/color/48/000000/in-transit.png", backgroundColor:"#f6f6f6"} ,
            //     {id:4, title: "Cargo Loaded", image:"https://img.icons8.com/color/48/000000/container-truck.png", backgroundColor:"#f6f6f6"} ,
            //     {id:5, title: "In Transit", image:"https://img.icons8.com/color/48/000000/in-transit.png", backgroundColor:"#f6f6f6"},
            //     {id:6, title: "Port Reached", image:"https://img.icons8.com/color/48/000000/cargo-ship.png", backgroundColor:"#f6f6f6"} ,
            //     {id:7, title: "Hire Completed", image:"https://img.icons8.com/color/48/000000/checked-truck.png",backgroundColor:"#f6f6f6"} ,
            // ]
          };
        
    }
    clickEventListener(item) {
        const { navigation } = this.props;
        const ref = Firebase.firestore().collection('hires').doc(navigation.getParam('hireId'));
        const loc = "timeline." + item.val + ".bg"
        const tm = "timeline." + item.val + ".at"
        const st = "timeline." + item.val + ".set"
        ref.update({
            [loc]: "green",
            [tm]: new Date(),
            [st]: 1
        })
        ref.get().then((doc) => {
            this.setState({
                timeline: Object.values(doc.data().timeline).sort((a,b) => a.id > b.id)
            })
        })
        if(item.val === 'hireCompleted'){
            const notifRef = Firebase.firestore().collection('notifications')
            let data={
                to: 'Yk1pyMHhAQhk3PhGS6JRxcNSHdT2',
                data: 'Hire Marked as Completed',
                link: '/admin/hires/' + navigation.getParam('hireId'),
                type: 'hire completed',
                createdAt: new Date()
            }
            notifRef.add(data)
        }

    }
        
    componentDidMount() {
        const { navigation } = this.props;
        const ref = Firebase.firestore().collection('hires').doc(navigation.getParam('hireId'));
        ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    hire: doc.data(),
                    key: doc.id,
                    isLoading: false,
                    timeline: Object.values(doc.data().timeline).sort((a,b) => a.id > b.id)
                })
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
        <View style={styles.container}>
            <FlatList style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.timeline}
            horizontal={false}
            numColumns={1}
            keyExtractor= {(item) => {
                return item.id;
            }} 
            renderItem={({item}) => {
                return (
                <View>
                    <TouchableOpacity style={{
                        shadowColor: '#474747',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,
                    
                        elevation: 12,
                        marginVertical: 20,
                        marginHorizontal: 40,
                        backgroundColor:item.bg,
                        flexBasis: '42%',
                        width:120,
                        height:120,
                        borderRadius:60,
                        alignItems:'center',
                        justifyContent:'center',
                    }} onPress={() => {this.clickEventListener(item)}} disabled={item.set}>
                    <Image style={styles.cardImage} source={{uri:item.img}}/>
                    </TouchableOpacity>

                    <View style={styles.cardHeader}>
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                    {/* {item.set === 1 ? 
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Text style={styles.title2}>{moment(item.at.toDate()).format('MMM Do YYYY, h:mm a')}</Text>
                    </View>
                    :
                    null
                    } */}
                    </View>
                </View>
                )
            }}/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#f6f6f6",
  },
  listContainer:{
    alignItems:'center'
  },
  /******** card **************/
  card:{
    shadowColor: '#474747',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
    marginVertical: 20,
    marginHorizontal: 40,
    backgroundColor:"#f6f6f6",
    flexBasis: '42%',
    width:120,
    height:120,
    borderRadius:60,
    alignItems:'center',
    justifyContent:'center'
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage:{
    height: 50,
    width: 50,
    alignSelf:'center'
  },
  title:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
  title2:{
    fontSize:15,
    flex:1,
    alignSelf:'center',
    color:"black"
  },
})

const mapStateToProps = state => {
  return{
      user: state.user
  }
}

export default connect(mapStateToProps)(HireTracker)
