import Firebase, { db } from '../config/Firebase.js'

export const LOGIN = 'LOGIN'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'

export const login = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user
            const response = await Firebase.auth().signInWithEmailAndPassword(email, password)
            
            dispatch(getUser(response.user.uid))
        } catch (e) {
            alert(e)
        }
    }
}

export const getUser = uid => {
    return async(dispatch, getState) => {
        try{
            const user = await db.collection('drivers').doc(uid).get()

            dispatch({type: LOGIN, payload: {data: user.data(), id:user.id}})
        } catch (e){
            alert(e)
        }
    }
}

export const updateEmail = email => {
    return {
        type: UPDATE_EMAIL,
        payload: email
    }
}

export const updatePassword = password => {
    return {
        type: UPDATE_PASSWORD,
        payload: password
    }
}