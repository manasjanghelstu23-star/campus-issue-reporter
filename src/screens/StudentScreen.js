import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getMyComplaints } from '../services/api';




/* Animated press wrapper */
const AnimatedPress = ({ children, style, activeStyle, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const pressIn = () => {
    setPressed(true);
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setPressed(false));
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={[
          style,
          pressed && activeStyle,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

const StudentScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const data = await getMyComplaints("2918");
      setComplaints(data || []);
    } catch (e) {
      console.warn("Error fetching data:", e);
    }
  };

  const pendingCount = complaints.filter(i => i.status === "Pending").length;
  const progressCount = complaints.filter(i => i.status === "In Progress").length;
  const resolvedCount = complaints.filter(i => i.status === "Resolved").length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Portal</Text>
          <Text style={styles.subtitle}>Report campus issues</Text>
        </View>

        <AnimatedPress
        style={styles.logoutBtn}
        onPress={() => navigation.replace('RoleSelect')}
        >
        <MaterialIcons name="logout" size={24} color="black" />
        <Text style={styles.logoutText}>Logout</Text>
        </AnimatedPress>
      </View>

      {/* Status Cards */}
      <View style={styles.statusRow}>
        <View style={[styles.statusCard, styles.pending]}>
          <Text style={styles.count}>{pendingCount}</Text>
          <Text style={styles.label}>Pending</Text>
        </View>

        <View style={[styles.statusCard, styles.progress]}>
          <Text style={styles.count}>{progressCount}</Text>
          <Text style={styles.label}>In Progress</Text>
        </View>

        <View style={[styles.statusCard, styles.resolved]}>
          <Text style={styles.count}>{resolvedCount}</Text>
          <Text style={styles.label}>Resolved</Text>
        </View>
      </View>

      {/* Report Problem */}
      <AnimatedPress
        style={styles.actionCard}
        activeStyle={styles.actionCardActive}
        onPress={() => navigation.navigate('ReportIssue')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#fefeff' }]}>
          <MaterialIcons name="photo-camera" size={24} color="black" style={styles.icon} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Report a Problem</Text>
          <Text style={styles.actionSubtitle}>
            Capture and submit a new issue
          </Text>
        </View>
      </AnimatedPress>

      {/* My Complaints */}
      <AnimatedPress
        style={styles.actionCard}
        activeStyle={styles.actionCardActive}
        onPress={() => navigation.navigate('MyComplaints')}
      >
        <View style={[styles.iconBox, { backgroundColor: '#ffffff' }]}>
          <MaterialIcons name="list" size={24} color="black" style={styles.icon} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>My Complaints</Text>
          <Text style={styles.actionSubtitle}>
            View and track submitted issues
          </Text>
        </View>
      </AnimatedPress>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {complaints.length > 0 ? (
          complaints.slice(0, 3).map(issue => (
            <AnimatedPress
              key={issue.id}
              style={[styles.actionCard, { marginBottom: 10, padding: 12 }]}
              onPress={() => navigation.navigate('StudentIssueDetail', { id: issue.id })}
            >
              <View style={[styles.iconBox, { height: 40, width: 40 }]}>
                <MaterialIcons name="build" size={20} color="black" style={styles.icon} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{issue.title}</Text>
                <Text style={styles.actionSubtitle}>{issue.status} • {issue.locationDesc}</Text>
              </View>
            </AnimatedPress>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No issues reported yet</Text>
            <Text style={styles.emptySubtitle}>
              When you report a problem, it will appear here.
            </Text>
          </View>
        )}
      </View>
      {/* test screen*/}
      <AnimatedPress
  style={styles.actionCard}
  activeStyle={styles.actionCardActive}
  onPress={() => navigation.navigate('Playground')}
>
  <View style={[styles.iconBox, { backgroundColor: '#ffffff' }]}>
    <MaterialIcons name="science" size={24} color="black" style={styles.icon} />
  </View>
  <View style={styles.actionText}>
    <Text style={styles.actionTitle}>Test Screen</Text>
    
  </View>
</AnimatedPress>

    </ScrollView>
  );
};

export default StudentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
    padding: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 8,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  /* Status Cards */
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    
  },
  statusCard: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 12,
  },
  pending: { backgroundColor: '#F97316' },
  progress: { backgroundColor: '#2563EB' },
  resolved: { backgroundColor: '#16A34A' },

  count: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    fontSize: 13,
    marginTop: 6,
    color: '#FFFFFF',
  },

  /* Action Cards */
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  actionCardActive: {
    borderColor: '#2563EB',
  },

  iconBox: {
    height: 64,
    width: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  /* Recent */
  section: {
    marginTop: 10,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});


