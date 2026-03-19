import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getMyComplaints } from '../services/api';

const MyComplaintsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // REAL DATA WILL COME FROM BACKEND LATER
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      loadComplaints();
    }
  }, [isFocused]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      // Example student ID
      const data = await getMyComplaints("2918");
      setComplaints(data);
    } catch (e) {
      console.warn("Error fetching complaints:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate('StudentIssueDetail', { id: item.id })}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>📍 {item.locationDesc}</Text>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, item.status === "Pending" ? styles.pending : item.status === "Resolved" ? { backgroundColor: '#16A34A' } : { backgroundColor: '#2563EB' }]}>
            <Text style={[styles.badgeText, item.status !== "Pending" && { color: '#fff' }]}>{item.status}</Text>
          </View>
          <View style={[styles.badge, styles.normal]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
        </View>

        <Text style={styles.time}>🕒 {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Complaints</Text>
        <Text style={styles.count}>
          {complaints.length} issues reported
        </Text>
      </View>

      {/* EMPTY STATE OR LOADING */}
      {loading ? (
        <View style={styles.emptyBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No complaints yet</Text>
          <Text style={styles.emptySub}>
            Your submitted complaints will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyComplaintsScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  back: {
    fontSize: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },

  count: {
    color: '#6B7280',
    marginTop: 4,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  location: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },

  pending: {
    backgroundColor: '#FEF3C7',
  },

  normal: {
    backgroundColor: '#E0E7FF',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  time: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  arrow: {
    fontSize: 26,
    color: '#2563EB',
    marginLeft: 6,
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },

  emptySub: {
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
});