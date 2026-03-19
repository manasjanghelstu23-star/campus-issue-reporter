import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { launchImageLibrary } from 'react-native-image-picker'
import { getIssueById, updateIssueStatus } from '../services/api'

const IssueDetailScreen = () => {

    const route = useRoute()
    const navigation = useNavigation()
    const issueId = route.params?.id || "1" // Default to 1 for direct previews

    const [issueData, setIssueData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("Pending")
    const [remarks, setRemarks] = useState("")
    const [showTray, setShowTray] = useState(false)
    const [afterImage, setAfterImage] = useState(null)

    const beforeImage = issueData?.beforeImage || "https://via.placeholder.com/300x200.png?text=Before"

    useEffect(() => {
        loadData()
    }, [issueId])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getIssueById(issueId)
            if (data) {
                setIssueData(data)
                setStatus(data.status)
                setRemarks(data.adminRemarks || "")
                if (data.afterImage) setAfterImage(data.afterImage)
            }
        } catch (error) {
            console.warn("Could not load issue:", error)
        } finally {
            setLoading(false)
        }
    }

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7,
        })

        if (!result.didCancel && result.assets) {
            setAfterImage(result.assets[0].uri)
        }
    }

    const getStatusColor = () => {
        if (status === "Resolved") return "#16a34a"
        if (status === "In Progress") return "#2563eb"
        return "#92400e"
    }

    const handleSave = async () => {
        try {
            await updateIssueStatus(issueId, status, remarks);
            Alert.alert(
                "Saved ✅",
                `Status: ${status}\nRemarks: ${remarks || "No remarks"}`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
            )
        } catch (error) {
            Alert.alert("Error", "Could not save the issue.");
        }
    }

    if (loading || !issueData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading issue...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* BEFORE + AFTER */}
            <View style={styles.imageRow}>

                <View style={styles.imageBox}>
                    <Image source={{ uri: beforeImage }} style={styles.image} />
                    <Text style={styles.imageLabel}>Before</Text>
                </View>

                <View style={styles.imageBox}>
                    {afterImage ? (
                        <>
                            <Image source={{ uri: afterImage }} style={styles.image} />
                            <Text style={styles.imageLabel}>After</Text>
                        </>
                    ) : (
                        <Pressable style={styles.uploadBox} onPress={pickImage}>
                            <MaterialIcons name="add-a-photo" size={28} color="#6b7280" />
                            <Text style={{ marginTop: 6 }}>Upload</Text>
                        </Pressable>
                    )}
                </View>

            </View>

            {/* TAGS */}
            <View style={styles.tagRow}>
                <Pressable
                    style={[styles.pendingTag, { backgroundColor: getStatusColor() }]}
                    onPress={() => setShowTray(prev => !prev)}
                >
                    <Text style={[styles.pendingText, { color: '#fff' }]}>
                        {status}
                    </Text>
                </Pressable>

                <View style={styles.normalTag}>
                    <Text>{issueData.priority}</Text>
                </View>

                <View style={styles.categoryTag}>
                    <Text>{issueData.category}</Text>
                </View>
            </View>

            {/* STATUS TRAY */}
            {showTray && (
                <View style={styles.trayMenu}>
                    {["Pending", "In Progress", "Resolved"].map(item => (
                        <Pressable
                            key={item}
                            style={styles.trayItem}
                            onPress={() => {
                                setStatus(item)
                                setShowTray(false)
                            }}
                        >
                            <Text>{item}</Text>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* TITLE */}
            <Text style={styles.title}>{issueData.title}</Text>

            {/* OVERDUE */}
            <View style={styles.overdueCard}>
                <MaterialIcons name="warning" size={20} color="#dc2626" />
                <Text style={styles.overdueText}>
                    {issueData.daysPending > 0 ? `Overdue: ${issueData.daysPending} days pending` : "Recent report"}
                </Text>
            </View>

            {/* INFO */}
            <View style={styles.infoGrid}>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-on" size={16} color="#6b7280" />
                        <Text style={styles.infoText}>{issueData.locationDesc || "Unknown"}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Reported on</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="schedule" size={16} color="#6b7280" />
                        <Text style={styles.infoText}>{new Date(issueData.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.infoSub}>{new Date(issueData.createdAt).toLocaleTimeString()}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Reporter</Text>
                    <Text style={styles.infoText}>{issueData.reporterName || "Anonymous"}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Students Affected</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="group" size={16} color="#6b7280" />
                        <Text style={styles.infoText}>{issueData.affectedCount}</Text>
                    </View>
                </View>

            </View>

            {/* UPDATE STATUS */}
            <Text style={styles.sectionTitle}>Update Status</Text>

            <Pressable
                style={styles.dropdown}
                onPress={() => setShowTray(prev => !prev)}
            >
                <Text style={{ color: getStatusColor(), fontWeight: "600" }}>
                    {status}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} />
            </Pressable>

            {/* REMARKS */}
            <Text style={styles.inputLabel}>Admin Remarks</Text>

            <TextInput
                style={styles.textArea}
                placeholder="Add notes about this issue..."
                value={remarks}
                onChangeText={setRemarks}
                multiline
            />

            {/* SAVE BUTTON */}
            <Pressable style={styles.saveBtn} onPress={handleSave}>
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={styles.saveText}>Save Changes</Text>
            </Pressable>

        </ScrollView>
    )
}

export default IssueDetailScreen

// 🎨 STYLES
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f6f7fb",
        padding: 16
    },

    imageRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    imageBox: {
        width: "48%",
        height: 160,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#e5e7eb"
    },

    image: {
        width: "100%",
        height: "100%"
    },

    imageLabel: {
        position: "absolute",
        top: 6,
        left: 6,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 6,
        borderRadius: 6
    },

    uploadBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    tagRow: {
        flexDirection: "row",
        marginTop: 10
    },

    pendingTag: {
        backgroundColor: "#fef3c7",
        padding: 6,
        borderRadius: 6,
        marginRight: 6
    },

    pendingText: {
        fontWeight: "600"
    },

    normalTag: {
        backgroundColor: "#e5e7eb",
        padding: 6,
        borderRadius: 6,
        marginRight: 6
    },

    categoryTag: {
        backgroundColor: "#f3f4f6",
        padding: 6,
        borderRadius: 6
    },

    trayMenu: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 6,
        elevation: 5
    },

    trayItem: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderColor: "#ddd"
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 12
    },

    overdueCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fee2e2",
        padding: 12,
        borderRadius: 10,
        marginTop: 14
    },

    overdueText: {
        color: "#b91c1c",
        marginLeft: 6,
        fontWeight: "600"
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 18
    },

    infoItem: {
        width: "50%",
        marginBottom: 16
    },

    infoLabel: {
        color: "#6b7280",
        marginBottom: 4
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    infoText: {
        marginLeft: 4,
        fontWeight: "600"
    },

    infoSub: {
        color: "#6b7280",
        marginLeft: 20
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 10
    },

    inputLabel: {
        fontWeight: "600",
        marginBottom: 6
    },

    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        padding: 12,
        marginBottom: 14
    },

    textArea: {
        height: 100,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        padding: 12,
        textAlignVertical: "top"
    },

    saveBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#7c3aed",
        padding: 14,
        borderRadius: 12,
        marginTop: 20
    },

    saveText: {
        color: "#fff",
        marginLeft: 6,
        fontWeight: "600"
    }

})