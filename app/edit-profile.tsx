import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Building2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getCurrentUserProfile } from '../lib/auth';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  bio: string;
  company?: string;
  license?: string;
  experience?: string;
  avatar?: string;
}

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'realtor' | 'home_seeker'>('home_seeker');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    bio: '',
    company: '',
    license: '',
    experience: '',
    avatar: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setUserRole(userProfile.profile.role);
        setProfileData({
          name: userProfile.profile.name || '',
          email: userProfile.profile.email || '',
          phone: userProfile.profile.phone || '',
          address: '',
          city: '',
          state: '',
          bio: '',
          company: '',
          license: '',
          experience: '',
          avatar: '',
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = () => {
    // Mock avatar selection - in real app would use image picker
    const mockAvatars = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    ];
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    updateProfileData('avatar', randomAvatar);
  };

  const handleSave = async () => {
    if (!profileData.name || !profileData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarChange}>
            {profileData.avatar ? (
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={Colors.white} strokeWidth={2} />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Camera size={16} color={Colors.white} strokeWidth={2} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Tap to change photo</Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="Full Name *"
            value={profileData.name}
            onChangeText={(text) => updateProfileData('name', text)}
            placeholder="Enter your full name"
          />

          <Input
            label="Email Address *"
            value={profileData.email}
            onChangeText={(text) => updateProfileData('email', text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Input
            label="Phone Number"
            value={profileData.phone}
            onChangeText={(text) => updateProfileData('phone', text)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Location Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <Input
            label="Address"
            value={profileData.address}
            onChangeText={(text) => updateProfileData('address', text)}
            placeholder="Enter your address"
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="City"
                value={profileData.city}
                onChangeText={(text) => updateProfileData('city', text)}
                placeholder="City"
              />
            </View>
            <View style={styles.rowItem}>
              <Input
                label="State"
                value={profileData.state}
                onChangeText={(text) => updateProfileData('state', text)}
                placeholder="State"
              />
            </View>
          </View>
        </View>

        {/* Professional Information (Realtors only) */}
        {userRole === 'realtor' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            
            <Input
              label="Company/Agency"
              value={profileData.company}
              onChangeText={(text) => updateProfileData('company', text)}
              placeholder="Enter your company name"
            />

            <Input
              label="License Number"
              value={profileData.license}
              onChangeText={(text) => updateProfileData('license', text)}
              placeholder="Enter your license number"
            />

            <Input
              label="Years of Experience"
              value={profileData.experience}
              onChangeText={(text) => updateProfileData('experience', text)}
              placeholder="e.g., 5 years"
            />
          </View>
        )}

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {userRole === 'realtor' ? 'Professional Bio' : 'About Me'}
          </Text>
          <Input
            label={userRole === 'realtor' ? 'Tell clients about your expertise' : 'Tell us about yourself'}
            value={profileData.bio}
            onChangeText={(text) => updateProfileData('bio', text)}
            placeholder={
              userRole === 'realtor' 
                ? 'Describe your experience, specialties, and what makes you unique...'
                : 'Share a bit about yourself and what you\'re looking for...'
            }
            style={styles.bioInput}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.black,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },

  // Sections
  section: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },

  // Form
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  bioInput: {
    minHeight: 100,
  },

  // Footer
  footer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    marginTop: 0,
  },
});