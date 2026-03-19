import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const RoleSelectScreen = () => {

const navigation = useNavigation()

return (

<View style={styles.container}>

{/* HEADER SECTION */}
<View style={styles.header}>

<Image
 source={require('../components/assets/images/GGV-logo.png')}
 style={styles.image}
/>
<Image
 source={require('../components/assets/images/complaint.png')}
 style={styles.logo}
/>

<Text style={styles.title}>
Campus Issue Reporter
</Text>

<Text style={styles.subtitle}>
Report and track campus infrastructure issues
</Text>

</View>


{/* ROLE CARDS */}

<View style={styles.cardContainer}>

{/* STUDENT */}

<Pressable
style={styles.card}
onPress={()=>navigation.navigate("StudentLogin")}
>

<View style={styles.iconBox}>
<MaterialIcons name="school" size={28} color="#fff"/>
</View>

<View style={styles.cardText}>
<Text style={styles.cardTitle}>Student</Text>
<Text style={styles.cardSubtitle}>
Report problems across the campus
</Text>
</View>

<MaterialIcons name="chevron-right" size={26} color="#aaa"/>

</Pressable>


{/* ADMIN */}

<Pressable
style={styles.card}
onPress={()=>navigation.navigate("AdminLogin")}
>

<View style={[styles.iconBox,{backgroundColor:"#16a34a"}]}>
<MaterialIcons name="admin-panel-settings" size={28} color="#fff"/>
</View>

<View style={styles.cardText}>
<Text style={styles.cardTitle}>Admin</Text>
<Text style={styles.cardSubtitle}>
Manage and resolve reported issues
</Text>
</View>

<MaterialIcons name="chevron-right" size={26} color="#aaa"/>

</Pressable>

</View>


{/* GUEST BUTTON */}

<Pressable
style={styles.guestBtn}
onPress={()=>navigation.replace("Student")}
>

<Text style={styles.guestText}>
Continue as Guest Student
</Text>

</Pressable>


</View>

)

}

export default RoleSelectScreen


const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f1f5f9"
},

header:{
backgroundColor:"#2553eb",
paddingTop:80,
paddingBottom:50,
borderBottomLeftRadius:30,
borderBottomRightRadius:30
},

image:{
width:40,
height:40,
borderRadius:12,
marginBottom:12,
marginLeft:20,
marginTop:-40,


},
logo:{
width:90,
height:90, 
alignSelf:"center",
},

title:{
fontSize:22,
paddingTop:10,
alignSelf:"center",
fontWeight:"700",
color:"#fff"
},

subtitle:{
fontSize:14,
alignSelf:"center",
color:"#e2e8f0",
marginTop:6
},

cardContainer:{
padding:20,
marginTop:20
},

card:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
padding:18,
borderRadius:16,
marginBottom:16,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10,
elevation:4
},

iconBox:{
width:46,
height:46,
borderRadius:12,
backgroundColor:"#2563eb",
alignItems:"center",
justifyContent:"center",
marginRight:14
},

cardText:{
flex:1
},

cardTitle:{
fontSize:17,
fontWeight:"600"
},

cardSubtitle:{
fontSize:13,
color:"#6b7280",
marginTop:3
},

guestBtn:{
marginHorizontal:20,
marginTop:10,
borderWidth:1,
borderColor:"#2563eb",
paddingVertical:14,
borderRadius:12,
alignItems:"center"
},

guestText:{
color:"#2563eb",
fontWeight:"600"
}

})