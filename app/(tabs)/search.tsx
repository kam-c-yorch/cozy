import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Map, Grid3x3 as Grid3X3, List } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import { Layout } from '../../constants/Layout';
import { MapView } from '../../components/ui/MapView';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

const { width: screenWidth } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image: string;
  featured: boolean;
}

interface FilterState {
  propertyType: string;
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  maxArea: number;
  amenities: string[];
  sortBy: string;
}

const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Duplex', 'Penthouse'];
const amenitiesList = ['Pool', 'Parking', 'Security', 'Gym', 'Garden', 'Balcony', 'AC', 'Generator'];
const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Most Popular'];

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BR Apartment',
    price: 2500000,
    location: 'Victoria Island, Lagos',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    type: 'Apartment',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    price: 8500000,
    location: 'Lekki Phase 1, Lagos',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: 'Villa',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '3',
    title: 'Cozy 2BR House',
    price: 1800000,
    location: 'Ikeja, Lagos',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: 'House',
    image: 'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filters, setFilters] = useState<FilterState>({
    propertyType: 'All',
    priceRange: [0, 10000000],
    bedrooms: 0,
    bathrooms: 0,
    minArea: 0,
    maxArea: 1000,
    amenities: [],
    sortBy: 'Newest First',
  });

  const formatPrice = (price: number) => {
    return `₦${(price / 1000000).toFixed(1)}M`;
  };

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockProperties.filter(property => {
        const matchesType = filters.propertyType === 'All' || property.type === filters.propertyType;
        const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
        const matchesBedrooms = filters.bedrooms === 0 || property.bedrooms >= filters.bedrooms;
        const matchesBathrooms = filters.bathrooms === 0 || property.bathrooms >= filters.bathrooms;
        const matchesArea = property.area >= filters.minArea && property.area <= filters.maxArea;
        const matchesSearch = searchQuery === '' || 
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesPrice && matchesBedrooms && matchesBathrooms && matchesArea && matchesSearch;
      });

      // Apply sorting
      switch (filters.sortBy) {
        case 'Price: Low to High':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Most Popular':
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        default:
          // Newest First - keep original order
          break;
      }

      setProperties(filtered);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters]);

  const renderPropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity style={styles.propertyCard}>
      <View style={styles.propertyImage}>
        <Text style={styles.imagePlaceholder}>📷</Text>
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.propertyPrice}>{formatPrice(item.price)}</Text>
        <View style={styles.propertyDetails}>
          <Text style={styles.propertyLocation} numberOfLines={1}>📍 {item.location}</Text>
          <Text style={styles.propertySpecs}>{item.bedrooms}BR • {item.bathrooms}BA • {item.area}m²</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Property }) => (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.listImage}>
        <Text style={styles.imagePlaceholder}>📷</Text>
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.listLocation}>📍 {item.location}</Text>
        <Text style={styles.listSpecs}>{item.bedrooms}BR • {item.bathrooms}BA • {item.area}m²</Text>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.filterCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.filterApply}>Apply</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Property Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Property Type</Text>
            <View style={styles.filterOptions}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filters.propertyType === type && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, propertyType: type }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.propertyType === type && styles.filterOptionTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Min Price</Text>
                <TextInput
                  style={styles.priceField}
                  value={filters.priceRange[0].toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    setFilters(prev => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
                  }}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Max Price</Text>
                <TextInput
                  style={styles.priceField}
                  value={filters.priceRange[1].toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 10000000;
                    setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
                  }}
                  placeholder="10000000"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Bedrooms & Bathrooms */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Bedrooms</Text>
            <View style={styles.numberSelector}>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberOption,
                    filters.bedrooms === num && styles.numberOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
                >
                  <Text style={[
                    styles.numberOptionText,
                    filters.bedrooms === num && styles.numberOptionTextActive
                  ]}>
                    {num === 0 ? 'Any' : `${num}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Bathrooms</Text>
            <View style={styles.numberSelector}>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberOption,
                    filters.bathrooms === num && styles.numberOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, bathrooms: num }))}
                >
                  <Text style={[
                    styles.numberOptionText,
                    filters.bathrooms === num && styles.numberOptionTextActive
                  ]}>
                    {num === 0 ? 'Any' : `${num}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {amenitiesList.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityOption,
                    filters.amenities.includes(amenity) && styles.amenityOptionActive
                  ]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenity)
                        ? prev.amenities.filter(a => a !== amenity)
                        : [...prev.amenities, amenity]
                    }));
                  }}
                >
                  <Text style={[
                    styles.amenityOptionText,
                    filters.amenities.includes(amenity) && styles.amenityOptionTextActive
                  ]}>
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option && styles.sortOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: option }))}
                >
                  <Text style={[
                    styles.sortOptionText,
                    filters.sortBy === option && styles.sortOptionTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties, locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text.secondary}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={18} color={viewMode === 'grid' ? Colors.primary.main : Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={18} color={viewMode === 'list' ? Colors.primary.main : Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'map' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Map size={18} color={viewMode === 'map' ? Colors.primary.main : Colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.resultsCount}>{properties.length} properties found</Text>
      </View>

      {/* Active Filters */}
      {(filters.propertyType !== 'All' || filters.amenities.length > 0) && (
        <ScrollView horizontal style={styles.activeFilters} showsHorizontalScrollIndicator={false}>
          {filters.propertyType !== 'All' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{filters.propertyType}</Text>
              <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, propertyType: 'All' }))}>
                <Text style={styles.removeFilter}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          {filters.amenities.map((amenity) => (
            <View key={amenity} style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{amenity}</Text>
              <TouchableOpacity onPress={() => {
                setFilters(prev => ({
                  ...prev,
                  amenities: prev.amenities.filter(a => a !== amenity)
                }));
              }}>
                <Text style={styles.removeFilter}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Content */}
      {loading ? (
        <ScrollView style={styles.content}>
          <LoadingSkeleton type="propertyCard" />
          <LoadingSkeleton type="propertyCard" />
          <LoadingSkeleton type="propertyCard" />
        </ScrollView>
      ) : viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            address="Lagos, Nigeria"
            showControls={true}
            style={styles.map}
          />
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={viewMode === 'grid' ? renderPropertyCard : renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.propertiesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.md,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.background.primary,
  },
  resultsCount: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  activeFilters: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.sm,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.light,
    borderRadius: 16,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.xs,
  },
  activeFilterText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.primary.main,
    marginRight: Spacing.xs,
  },
  removeFilter: {
    fontSize: 16,
    color: Colors.primary.main,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    margin: Layout.screenPadding,
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  propertiesList: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  propertyCard: {
    width: (screenWidth - (Layout.screenPadding * 2) - Spacing.md) / 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: Spacing.md,
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  propertyImage: {
    height: 120,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.accent.main,
    borderRadius: 4,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  featuredText: {
    fontSize: 10,
    color: Colors.background.primary,
    fontWeight: 'bold',
  },
  propertyInfo: {
    padding: Spacing.sm,
  },
  propertyTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  propertyPrice: {
    fontSize: Typography.h3.fontSize,
    fontWeight: 'bold',
    color: Colors.primary.main,
    marginBottom: Spacing.xs,
  },
  propertyDetails: {
    gap: 2,
  },
  propertyLocation: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  propertySpecs: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  listImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  listPrice: {
    fontSize: Typography.h3.fontSize,
    fontWeight: 'bold',
    color: Colors.primary.main,
  },
  listLocation: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  listSpecs: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
  },
  filterModal: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  filterCancel: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.secondary,
  },
  filterTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  filterApply: {
    fontSize: Typography.body.fontSize,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },
  filterSection: {
    marginVertical: Spacing.lg,
  },
  filterSectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  filterOptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
  },
  filterOptionTextActive: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  priceField: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  numberSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  numberOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minWidth: 50,
    alignItems: 'center',
  },
  numberOptionActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  numberOptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
  },
  numberOptionTextActive: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  amenityOptionActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  amenityOptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
  },
  amenityOptionTextActive: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  sortOptions: {
    gap: Spacing.sm,
  },
  sortOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  sortOptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.text.primary,
  },
  sortOptionTextActive: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
});