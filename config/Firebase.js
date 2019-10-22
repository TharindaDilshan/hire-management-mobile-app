import firebase from 'firebase'
import 'firebase/firestore'
// import {apiKey, authDomain, databaseURL, projectId, messagingSenderId, appId} from 'react-native-dotenv'

var firebaseConfig = {
    apiKey: "AIzaSyB0_LTBs3_DdQN17AVfkWKP82oL-2WwXFw",
    authDomain: "trans-global-logistics-969a7.firebaseapp.com",
    databaseURL: "https://trans-global-logistics-969a7.firebaseio.com",
    projectId: "trans-global-logistics-969a7",
    storageBucket: "trans-global-logistics-969a7.appspot.com",
    messagingSenderId: "10690174031",
    appId: "1:10690174031:web:89c7488d5d17566b76de3a"
  };


const Firebase =  firebase.initializeApp(firebaseConfig);
  
export const db = firebase.firestore()

// db.settings({
//   timestampsInSnapshots: true
// })



export default Firebase