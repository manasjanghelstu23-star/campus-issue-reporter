import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoleSelectScreen from './src/screens/RoleSelectScreen';
import StudentScreen from './src/screens/StudentScreen';
import AdminScreen from './src/screens/AdminScreen';  
import StudentLoginScreen from './src/screens/StudentLoginScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import ReportIssueScreen from './src/screens/ReportIssueScreen';
import MyComplaintsScreen from './src/screens/MyComplaintsScreen';
import PlaygroundScreen from './src/screens/PlaygroundScreen'; //test screen 
import IssueDetailScreen from './src/screens/IssueDetailScreen'; //test screen
import StudentIssueDetailScreen from './src/screens/StudentIssueDetailScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RoleSelect"
        screenOptions={{ headerShown: false }}
      >
        {/*test screen */}
        <Stack.Screen name="Playground" component={PlaygroundScreen} />        
        {/* Role selection first */}
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/*Admin flow */}
        <Stack.Screen name="Admin" component={AdminScreen} />

        {/* Student flow */}
        <Stack.Screen name="Student" component={StudentScreen} />
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
        <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} />

        <Stack.Screen 
        name="IssueDetail" 
        component={IssueDetailScreen}
        options={{headerShown:false}}
        />
        <Stack.Screen 
        name="StudentIssueDetail" 
        component={StudentIssueDetailScreen}
        options={{headerShown:false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;