import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { loginUser, registerUser } from '../services/api'

const StudentLoginScreen = () => {

const navigation = useNavigation()
const [isLoading, setIsLoading] = useState(false)

const [mode,setMode] = useState("login")
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleSubmit = async () => {
    if (!email || !password) {
        Alert.alert("Error", "Please fill required fields")
        return
    }
    
    setIsLoading(true)
    try {
        if (mode === "login") {
            const res = await loginUser({ email, password })
            if (res.token) {
                navigation.replace("Student")
            }
        } else {
            const res = await registerUser({ name, email, password })
            if (res.success) {
                Alert.alert("Success", "Account created successfully!")
                setMode("login")
            }
        }
    } catch (err) {
        Alert.alert("Error", err.message || "An error occurred")
    } finally {
        setIsLoading(false)
    }
}

return (

<View style={styles.container}>

<Text style={styles.title}>
{mode === "login" ? "Student Login" : "Create Account"}
</Text>

{mode === "signup" && (

<TextInput
placeholder="Full Name"
placeholderTextColor='grey'
style={styles.input}
value={name}
onChangeText={setName}
/>

)}

<TextInput
placeholder="Email"
placeholderTextColor='grey'
style={styles.input}
value={email}
onChangeText={setEmail}
/>

<TextInput
placeholder="Password"
placeholderTextColor='grey'
secureTextEntry
style={styles.input}
value={password}
onChangeText={setPassword}
/>

<Pressable style={[styles.button, isLoading && { opacity: 0.7 }]} disabled={isLoading} onPress={handleSubmit}>
<Text style={styles.buttonText}>
{isLoading ? "Saving..." : (mode === "login" ? "Login" : "Create Account")}
</Text>
</Pressable>

{mode === "login" ? (

<Pressable onPress={()=>setMode("signup")}>
<Text style={styles.link}>Create new account</Text>
</Pressable>

) : (

<Pressable onPress={()=>setMode("login")}>
<Text style={styles.link}>Already have an account? Login</Text>
</Pressable>

)}

</View>

)

}


export default StudentLoginScreen

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

button:{
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

link:{
textAlign:"center",
marginTop:20,
color:"#2563eb",
fontWeight:"500"
}

})