import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getAdminIssues } from '../services/api'

const AdminScreen = () => {

  const navigation = useNavigation()

  const [category, setCategory] = useState("All")
  const [priority, setPriority] = useState("All")
  const [status, setStatus] = useState("All")

  const [showCategory, setShowCategory] = useState(false)
  const [showPriority, setShowPriority] = useState(false)

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      loadIssues()
    }
  }, [isFocused])

  const loadIssues = async () => {
    setLoading(true)
    try {
      const data = await getAdminIssues()
      setIssues(data)
    } catch (error) {
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }

  // Derived counts
  const totalCount = issues.length
  const pendingCount = issues.filter(i => i.status === "Pending").length
  const progressCount = issues.filter(i => i.status === "In Progress").length
  const resolvedCount = issues.filter(i => i.status === "Resolved").length

  // Derived filtered issues 
  const filteredIssues = issues.filter(issue => {
    if (category !== "All" && issue.category !== category) return false
    if (priority !== "All" && issue.priority !== priority) return false
    if (status !== "All" && issue.status !== status) return false
    return true
  })

  return (

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}

      <View style={styles.header}>

        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage campus issues</Text>
        </View>

        <Pressable
          style={styles.logoutBtn}
          onPress={() => navigation.replace('RoleSelect')}
        >

          <MaterialIcons name="logout" size={20} color="#374151" />
          <Text style={styles.logoutText}>Logout</Text>

        </Pressable>

      </View>


      {/* STATUS CARDS */}

      <View style={styles.statusRow}>

        <View style={[styles.statusCard, styles.totalCard]}>
          <MaterialIcons name="bar-chart" size={26} color="#374151" />
          <Text style={styles.count}>{totalCount}</Text>
          <Text style={styles.label}>Total</Text>
        </View>

        <View style={[styles.statusCard, styles.pendingCard]}>
          <MaterialIcons name="schedule" size={26} color="#b45309" />
          <Text style={styles.count}>{pendingCount}</Text>
          <Text style={styles.label}>Pending</Text>
        </View>

      </View>


      <View style={styles.statusRow}>

        <View style={[styles.statusCard, styles.progressCard]}>
          <MaterialIcons name="error-outline" size={26} color="#2563eb" />
          <Text style={styles.count}>{progressCount}</Text>
          <Text style={styles.label}>In Progress</Text>
        </View>

        <View style={[styles.statusCard, styles.resolvedCard]}>
          <MaterialIcons name="check-circle" size={26} color="#16a34a" />
          <Text style={styles.count}>{resolvedCount}</Text>
          <Text style={styles.label}>Resolved</Text>
        </View>

      </View>


      {/* FILTER SECTION */}

      <View style={styles.filterContainer}>


        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" />
          <Text style={styles.searchText}>Search by location, problem...</Text>
        </View>


        {/* DROPDOWN ROW */}

        <View style={styles.dropdownRow}>

          <Pressable
            style={styles.dropdown}
            onPress={() => setShowCategory(!showCategory)}
          >

            <Text style={styles.dropdownText}>{category}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} />

          </Pressable>


          <Pressable
            style={styles.dropdown}
            onPress={() => setShowPriority(!showPriority)}
          >

            <Text style={styles.dropdownText}>{priority}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} />

          </Pressable>

        </View>


        {/* CATEGORY MENU */}

        {showCategory && (

          <View style={styles.menu}>

            {["All", "Electrical", "Furniture", "IT", "Hygiene", "Water", "Other"].map((item) => (

              <Pressable
                key={item}
                style={styles.menuItem}
                onPress={() => {

                  setCategory(item)
                  setShowCategory(false)

                }}
              >

                <Text>{item}</Text>

              </Pressable>

            ))}

          </View>

        )}


        {/* PRIORITY MENU */}

        {showPriority && (

          <View style={styles.menu}>

            {["All", "Critical", "Medium", "Normal"].map((item) => (

              <Pressable
                key={item}
                style={styles.menuItem}
                onPress={() => {

                  setPriority(item)
                  setShowPriority(false)

                }}
              >

                <Text>{item}</Text>

              </Pressable>

            ))}

          </View>

        )}


        {/* STATUS FILTER */}

        <View style={styles.statusFilterRow}>

          {["All", "Pending", "In Progress", "Resolved"].map((item) => (

            <Pressable
              key={item}
              style={[
                styles.filterBtn,
                status === item && styles.activeFilterBtn
              ]}
              onPress={() => setStatus(item)}
            >

              <Text
                style={[
                  styles.filterText,
                  status === item && styles.activeFilterText
                ]}
              >
                {item}
              </Text>

            </Pressable>

          ))}

        </View>

      </View>


      {/* ISSUES LIST */}

      <View style={{ paddingBottom: 30 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: '#6b7280' }}>Loading issues...</Text>
        ) : filteredIssues.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: '#6b7280' }}>No issues found matching filters.</Text>
        ) : (
          filteredIssues.map((issue) => (
            <Pressable
              key={issue.id}
              style={styles.issueCard}
              onPress={() => navigation.navigate('IssueDetail', { id: issue.id })}
            >

              <View style={styles.issueImage}>
                <MaterialIcons name="build" size={26} color="#374151" />
              </View>

              <View style={styles.issueContent}>

                <Text style={styles.issueTitle}>{issue.title}</Text>

                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={16} color="#6b7280" />
                  <Text style={styles.locationText}>{issue.locationDesc}</Text>
                </View>

                <View style={styles.tagRow}>

                  <View style={[styles.pendingTag, issue.status === "Resolved" && { backgroundColor: '#dcfce7' }, issue.status === "In Progress" && { backgroundColor: '#dbeafe' }]}>
                    <Text style={[styles.pendingText, issue.status === "Resolved" && { color: '#16a34a' }, issue.status === "In Progress" && { color: '#2563eb' }]}>
                      {issue.status}
                    </Text>
                  </View>

                  <View style={styles.normalTag}>
                    <Text style={styles.normalText}>{issue.priority}</Text>
                  </View>

                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{issue.category}</Text>
                  </View>

                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>{issue.daysPending} days pending</Text>
                  <Text style={styles.metaText}>by {issue.reporterName}</Text>
                </View>

              </View>

              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />

            </Pressable>
          ))
        )}
      </View>

    </ScrollView>

  )
}

export default AdminScreen


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f6f7fb'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827'
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  logoutText: {
    fontSize: 14,
    color: '#374151'
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15
  },

  statusCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4
  },

  totalCard: { backgroundColor: '#f9fafb' },
  pendingCard: { backgroundColor: '#fef3c7' },
  progressCard: { backgroundColor: '#dbeafe' },
  resolvedCard: { backgroundColor: '#dcfce7' },

  count: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 6
  },

  label: {
    fontSize: 14,
    marginTop: 2,
    color: '#374151'
  },

  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    marginHorizontal: 15,
    elevation: 4
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12
  },

  searchText: {
    marginLeft: 8,
    color: '#9CA3AF'
  },

  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '48%'
  },

  dropdownText: {
    color: '#374151'
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 6,
    paddingVertical: 6,
    elevation: 6
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12
  },

  statusFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },

  activeFilterBtn: {
    backgroundColor: "#fff",
    elevation: 2
  },

  filterText: {
    color: '#6b7280'
  },

  activeFilterText: {
    fontWeight: '600',
    color: '#111827'
  },

  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 16,
    marginTop: 15,
    elevation: 4
  },

  issueImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  issueContent: {
    flex: 1
  },

  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },

  locationText: {
    marginLeft: 4,
    color: '#6b7280',
    fontSize: 13
  },

  tagRow: {
    flexDirection: 'row',
    marginBottom: 6
  },

  pendingTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6
  },

  pendingText: {
    fontSize: 12,
    color: '#92400e'
  },

  normalTag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6
  },

  normalText: {
    fontSize: 12
  },

  categoryTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  categoryText: {
    fontSize: 12
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  metaText: {
    fontSize: 12,
    color: '#9ca3af'
  }

})