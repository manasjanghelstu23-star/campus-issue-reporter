import { 
    StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator 
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getIssueById } from '../services/api'
import { COLORS } from '../theme/colors'

const STATUS_STEPS = ["Pending", "In Progress", "Resolved"]

const StudentIssueDetailScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const issueId = route.params?.id

    const [issueData, setIssueData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (issueId) {
            loadData()
        }
    }, [issueId])

    const loadData = async () => {
        try {
            setLoading(true)
            const data = await getIssueById(issueId)
            setIssueData(data)
        } catch (error) {
            console.warn("Could not load issue track:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !issueData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading tracking details...</Text>
            </View>
        )
    }

    const currentStepIndex = STATUS_STEPS.indexOf(issueData.status)

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Issue</Text>
            </View>

            {/* Title & Meta */}
            <View style={styles.card}>
                <View style={[styles.badge, styles.categoryBadge]}>
                    <Text style={styles.badgeText}>{issueData.category}</Text>
                </View>
                <Text style={styles.title}>{issueData.title}</Text>
                
                <View style={styles.metaRow}>
                    <MaterialIcons name="location-on" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{issueData.locationDesc}</Text>
                </View>

                <View style={styles.metaRow}>
                    <MaterialIcons name="schedule" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{new Date(issueData.createdAt).toLocaleString()}</Text>
                </View>
            </View>

            {/* Tracking Flow */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Status Tracking</Text>
                
                <View style={styles.timeline}>
                    {STATUS_STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        
                        return (
                            <View key={step} style={styles.timelineStep}>
                                {/* Line connector */}
                                {index < STATUS_STEPS.length - 1 && (
                                    <View style={[styles.timelineLine, isCompleted && index < currentStepIndex ? styles.lineActive : {}]} />
                                )}
                                
                                {/* Dot */}
                                <View style={[styles.timelineDot, isCompleted ? styles.dotActive : {}]}>
                                    {isCompleted && <MaterialIcons name="check" size={14} color="#fff" />}
                                </View>

                                {/* Text content */}
                                <View style={styles.timelineContent}>
                                    <Text style={[styles.stepTitle, isCurrent ? styles.stepTitleCurrent : (isCompleted ? styles.stepTitleCompleted : {})]}>{step}</Text>
                                    {isCurrent && issueData.adminRemarks ? (
                                        <Text style={styles.stepDesc}>Admin Note: {issueData.adminRemarks}</Text>
                                    ) : isCurrent && index === 0 ? (
                                        <Text style={styles.stepDesc}>Your request has been filed and awaits admin approval.</Text>
                                    ) : null}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>

            {/* Attached Photo */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Attached Photo</Text>
                {issueData.beforeImage ? (
                    <Image source={{ uri: issueData.beforeImage }} style={styles.image} />
                ) : (
                    <Text style={styles.metaText}>No photos attached.</Text>
                )}
            </View>
            
            <View style={{ height: 40 }} />
        </ScrollView>
    )
}

export default StudentIssueDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FF',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    backBtn: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        elevation: 4
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10
    },
    categoryBadge: {
        backgroundColor: '#f3f4f6'
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4b5563'
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    metaText: {
        marginLeft: 8,
        color: '#6b7280',
        fontSize: 14
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: '#e5e7eb'
    },
    timeline: {
        marginLeft: 10
    },
    timelineStep: {
        flexDirection: 'row',
        marginBottom: 30,
        position: 'relative'
    },
    timelineLine: {
        position: 'absolute',
        left: 11,
        top: 24,
        bottom: -30,
        width: 2,
        backgroundColor: '#e5e7eb',
        zIndex: -1
    },
    lineActive: {
        backgroundColor: '#4F46E5'
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 2
    },
    dotActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#c7d2fe'
    },
    timelineContent: {
        flex: 1,
        justifyContent: 'center'
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9ca3af'
    },
    stepTitleCompleted: {
        color: '#4b5563'
    },
    stepTitleCurrent: {
        color: '#111827',
        fontWeight: '700'
    },
    stepDesc: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 4,
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4F46E5'
    }
})
