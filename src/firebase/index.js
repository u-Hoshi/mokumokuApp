import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
db.settings({ ignoreUndefinedProperties: true })
export const storage = firebase.storage()
