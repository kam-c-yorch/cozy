import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Menu, Heart, MapPin, Bed, Bath, Square } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { DrawerMenu } from '../../components/ui/DrawerMenu';
import { getCurrentUserProfile } from '../../lib/auth';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - (Layout.screenPadding * 2) - Spacing.md) / 2;

// Mock property data
const mockProperties = [
  {
    id: '1',
    title: 'Modern 3BR Apartment',
    location: 'Victoria Island, Lagos',
    price: '₦2,500,000',
    period: '/month',
    beds: 3,
    baths: 2,
    area: '120',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '2',
    title: 'Luxury Villa',
    location: 'Lekki Phase 1, Lagos',
    price: '₦8,000,000',
    period: '/month',
    beds: 5,
    baths: 4,
    area: '350',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '3',
    title: 'Cozy 2BR Flat',
    location: 'Ikeja GRA, Lagos',
    price: '₦1,800,000',
    period: '/month',
    beds: 2,
    baths: 2,
    area: '85',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '4',
    title: 'Executive Duplex',
    location: 'Magodo, Lagos',
    price: '₦4,200,000',
    period: '/month',
    beds: 4,
    baths: 3,
    area: '200',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
];

interface PropertyCardProps {
  property: typeof mockProperties[0];
  onPress: () => void;
  onFavorite: () => void;
}

function PropertyCard({ property, onPress, onFavorite }: PropertyCardProps) {
  return (
    <TouchableOpacity style={styles.propertyCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.propertyImage} />
        {property.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
          <Heart size={16} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={12} color={Colors.secondaryText} strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Bed size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{property.beds}</Text>
          </View>
          <View style={styles.detailItem}>
            <Bath size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{property.baths}</Text>
          </View>
          <View style={styles.detailItem}>
            <Square size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{property.area}m²</Text>
          </View>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{property.price}</Text>
          <Text style={styles.period}>{property.period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showDrawer, setShowDrawer] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  const handleFavorite = (propertyId: string) => {
    console.log('Favorite toggled:', propertyId);
    // Handle favorite logic
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    // Navigate to notifications screen
  };

  const handleMenu = () => {
    setShowDrawer(true);
  };

  const handleSignOut = () => {
    // Handle sign out - this would typically navigate back to auth screen
    console.log('User signed out');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
          <Menu size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.locationText}>Lagos, Nigeria</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <Bell size={24} color={Colors.primaryText} strokeWidth={2} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Properties Grid */}
        <View style={styles.propertiesGrid}>
          {mockProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPress={() => handlePropertyPress(property.id)}
              onFavorite={() => handleFavorite(property.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Drawer Menu */}
      <DrawerMenu
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
        userProfile={userProfile}
        onSignOut={handleSignOut}
      />
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
  menuButton: {
    padding: Spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  notificationButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('subtitle') * Typography.lineHeight.normal,
  },
  seeAllText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.accent,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  
  // Properties Grid
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyCard: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Property Info
  propertyInfo: {
    padding: Spacing.sm,
  },
  propertyTitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: 2,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.tight,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  locationText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: 2,
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  period: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: 2,
  },
});