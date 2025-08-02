import React, { useState } from 'react';
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
import { Bell, Menu, Plus, MapPin, Bed, Bath, Square, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';
import { DrawerMenu } from '../../components/ui/DrawerMenu';
import { getCurrentUserProfile } from '../../lib/auth';
import { PropertyStatusManager } from '../../components/ui/PropertyStatusManager';
import { router } from 'expo-router';
import React, { useEffect } from 'react';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - (Layout.screenPadding * 2) - Spacing.md) / 2;

// Mock property data for realtor
const mockListings = [
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
    status: 'Active',
    statusColor: Colors.success,
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
    status: 'Pending',
    statusColor: Colors.warning,
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
    status: 'Rented',
    statusColor: Colors.accent,
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
    status: 'Active',
    statusColor: Colors.success,
  },
];

interface ListingCardProps {
  listing: typeof mockListings[0];
  onPress: () => void;
  onMore: () => void;
}

function ListingCard({ listing, onPress, onMore }: ListingCardProps) {
  return (
    <TouchableOpacity style={styles.listingCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: listing.image }} style={styles.listingImage} />
        <View style={[styles.statusBadge, { backgroundColor: listing.statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: Colors.white }]} />
          <Text style={styles.statusText}>{listing.status}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={onMore}>
          <MoreHorizontal size={16} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={12} color={Colors.secondaryText} strokeWidth={2} />
          <Text style={styles.locationText} numberOfLines={1}>
            {listing.location}
          </Text>
        </View>
        
        <View style={styles.listingDetails}>
          <View style={styles.detailItem}>
            <Bed size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{listing.beds}</Text>
          </View>
          <View style={styles.detailItem}>
            <Bath size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{listing.baths}</Text>
          </View>
          <View style={styles.detailItem}>
            <Square size={12} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.detailText}>{listing.area}m²</Text>
          </View>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>{listing.price}</Text>
          <Text style={styles.period}>{listing.period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ListingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [showDrawer, setShowDrawer] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [listings, setListings] = useState(mockListings);

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

  const handleListingPress = (listingId: string) => {
    console.log('Listing pressed:', listingId);
    // Navigate to listing details/edit
  };

  const handleMore = (listingId: string) => {
    setSelectedPropertyId(listingId);
    setShowStatusManager(true);
  };

  const handleStatusChange = (newStatus: string, propertyId: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === propertyId 
        ? { 
            ...listing, 
            status: newStatus,
            statusColor: getStatusColor(newStatus)
          }
        : listing
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return Colors.success;
      case 'Pending': return Colors.warning;
      case 'Rented': return Colors.accent;
      case 'Inactive': return Colors.error;
      default: return Colors.secondaryText;
    }
  };

  const handleAddProperty = () => {
    router.push('/add-property');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleMenu = () => {
    setShowDrawer(true);
  };

  const handleSignOut = () => {
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
          <Text style={styles.headerTitle}>My Listings</Text>
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

      {/* Add Property Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Property"
          onPress={handleAddProperty}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
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
        {/* Listings Grid */}
        <View style={styles.listingsGrid}>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => handleListingPress(listing.id)}
              onMore={() => handleMore(listing.id)}
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

      {/* Status Manager Modal */}
      <PropertyStatusManager
        visible={showStatusManager}
        onClose={() => setShowStatusManager(false)}
        propertyId={selectedPropertyId}
        currentStatus={listings.find(l => l.id === selectedPropertyId)?.status as any || 'Active'}
        onStatusChange={handleStatusChange}
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
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
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
  
  // Add Button
  addButtonContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  addButtonText: {
    color: Colors.white,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  
  // Listings Grid
  listingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  listingCard: {
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
  listingImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  moreButton: {
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
  
  // Listing Info
  listingInfo: {
    padding: Spacing.sm,
  },
  listingTitle: {
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
  listingDetails: {
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