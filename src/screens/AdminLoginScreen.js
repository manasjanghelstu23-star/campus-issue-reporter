import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { loginUser } from '../services/api'

const AdminLoginScreen = ({navigation}) => {

const [isLoading, setIsLoading] = useState(false)

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const handleLogin = async () => {

if(!username || !password){
Alert.alert("Error","Enter username and password")
return
}

setIsLoading(true)
try {
  // Simulate admin role passing depending on actual backend setup
  const res = await loginUser({ email: username, password })
  if (res.token) {
    navigation.replace("Admin")
  }
} catch (error) {
  Alert.alert("Access Denied", "Only admin can login or invalid credentials")
} finally {
  setIsLoading(false)
}

}

const handleDemoLogin = () => {
navigation.replace("Admin")
}

return (

<View style={styles.container}>

<Text style={styles.title}>Admin Login</Text>

<TextInput
placeholder="Username"
style={styles.input}
value={username}
onChangeText={setUsername}
/>

<TextInput
placeholder="Password"
secureTextEntry
style={styles.input}
value={password}
onChangeText={setPassword}
/>

<Pressable style={[styles.loginButton, isLoading && { opacity: 0.7 }]} disabled={isLoading} onPress={handleLogin}>
<Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
</Pressable>

<Pressable style={styles.demoButton} onPress={handleDemoLogin}>
<Text style={styles.demoText}>Demo Login</Text>
</Pressable>

</View>

)

}

export default AdminLoginScreen

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:24
},

title:{
fontSize:26,
fontWeight:"600",
textAlign:"center",
marginBottom:30
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
padding:14,
marginBottom:15
},

loginButton:{
backgroundColor:"#2563eb",
padding:15,
borderRadius:10,
alignItems:"center",
marginTop:10
},

buttonText:{
color:"#fff",
fontWeight:"600",
fontSize:16
},

demoButton:{
marginTop:20,
alignItems:"center"
},

demoText:{
color:"#16a34a",
fontWeight:"600"
}

})