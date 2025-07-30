import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, FileSliders as Sliders, X, Check } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';

const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Duplex', 'Penthouse', 'Studio'];
const priceRanges = [
  { label: 'Any', min: 0, max: 0 },
  { label: '₦500K - ₦1M', min: 500000, max: 1000000 },
  { label: '₦1M - ₦3M', min: 1000000, max: 3000000 },
  { label: '₦3M - ₦5M', min: 3000000, max: 5000000 },
  { label: '₦5M - ₦10M', min: 5000000, max: 10000000 },
  { label: '₦10M+', min: 10000000, max: 0 },
];

const bedroomOptions = ['Any', '1', '2', '3', '4', '5+'];
const bathroomOptions = ['Any', '1', '2', '3', '4+'];

const amenities = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Generator', 
  'Air Conditioning', 'Balcony', 'Garden', 'Elevator', 'Furnished'
];

const nigerianLocations = [
  'Victoria Island', 'Lekki', 'Ikeja', 'Magodo', 'Ajah', 'Ikoyi',
  'Surulere', 'Yaba', 'Maryland', 'Gbagada', 'Festac', 'Apapa'
];

const sortOptions = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Size: Largest First', value: 'size_desc' },
  { label: 'Most Popular', value: 'popular' },
];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: any;
  onApplyFilters: (filters: any) => void;
}

function FilterModal({ visible, onClose, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (key: string, value: any) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = localFilters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
    updateFilter('amenities', updatedAmenities);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      propertyType: 'All',
      priceRange: priceRanges[0],
      bedrooms: 'Any',
      bathrooms: 'Any',
      minSize: '',
      maxSize: '',
      amenities: [],
      sortBy: sortOptions[0],
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Property Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Property Type</Text>
            <View style={styles.filterOptions}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    localFilters.propertyType === type && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter('propertyType', type)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      localFilters.propertyType === type && styles.filterOptionTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.filterOptions}>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  style={[
                    styles.filterOption,
                    localFilters.priceRange?.label === range.label && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter('priceRange', range)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      localFilters.priceRange?.label === range.label && styles.filterOptionTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bedrooms & Bathrooms */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalf}>
              <Text style={styles.filterSectionTitle}>Bedrooms</Text>
              <View style={styles.filterOptionsSmall}>
                {bedroomOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOptionSmall,
                      localFilters.bedrooms === option && styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter('bedrooms', option)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.bedrooms === option && styles.filterOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterHalf}>
              <Text style={styles.filterSectionTitle}>Bathrooms</Text>
              <View style={styles.filterOptionsSmall}>
                {bathroomOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOptionSmall,
                      localFilters.bathrooms === option && styles.filterOptionActive,
                    ]}
                    onPress={() => updateFilter('bathrooms', option)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        localFilters.bathrooms === option && styles.filterOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Property Size */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Property Size (sqm)</Text>
            <View style={styles.sizeInputs}>
              <View style={styles.sizeInputContainer}>
                <Text style={styles.sizeInputLabel}>Min</Text>
                <TextInput
                  style={styles.sizeInput}
                  value={localFilters.minSize}
                  onChangeText={(text) => updateFilter('minSize', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.placeholderText}
                />
              </View>
              <Text style={styles.sizeSeparator}>to</Text>
              <View style={styles.sizeInputContainer}>
                <Text style={styles.sizeInputLabel}>Max</Text>
                <TextInput
                  style={styles.sizeInput}
                  value={localFilters.maxSize}
                  onChangeText={(text) => updateFilter('maxSize', text)}
                  placeholder="Any"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.placeholderText}
                />
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {amenities.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityOption,
                    (localFilters.amenities || []).includes(amenity) && styles.amenityOptionActive,
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Text
                    style={[
                      styles.amenityOptionText,
                      (localFilters.amenities || []).includes(amenity) && styles.amenityOptionTextActive,
                    ]}
                  >
                    {amenity}
                  </Text>
                  {(localFilters.amenities || []).includes(amenity) && (
                    <Check size={16} color={Colors.white} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    localFilters.sortBy?.value === option.value && styles.filterOptionActive,
                  ]}
                  onPress={() => updateFilter('sortBy', option)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      localFilters.sortBy?.value === option.value && styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            title="Apply Filters"
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: 'All',
    priceRange: priceRanges[0],
    bedrooms: 'Any',
    bathrooms: 'Any',
    minSize: '',
    maxSize: '',
    amenities: [],
    sortBy: sortOptions[0],
  });
  const [savedSearches, setSavedSearches] = useState([
    '3 bedroom apartment Lekki',
    '2 bedroom flat Ikeja',
    'Villa Victoria Island'
  ]);

  const handleSearch = () => {
    console.log('Search:', { searchQuery, filters });
    // Add to recent searches if not empty
    if (searchQuery.trim() && !savedSearches.includes(searchQuery.trim())) {
      setSavedSearches([searchQuery.trim(), ...savedSearches.slice(0, 4)]);
    }
    // Implement search logic
  };

  const handleSaveSearch = () => {
    const searchString = `${filters.propertyType} ${filters.bedrooms}BR ${searchQuery}`.trim();
    if (!savedSearches.includes(searchString)) {
      setSavedSearches([searchString, ...savedSearches.slice(0, 4)]);
    }
  };

  const handleLocationPress = (location: string) => {
    setSearchQuery(location);
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyType !== 'All') count++;
    if (filters.priceRange.label !== 'Any') count++;
    if (filters.bedrooms !== 'Any') count++;
    if (filters.bathrooms !== 'Any') count++;
    if (filters.minSize || filters.maxSize) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.sortBy.value !== 'recent') count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Properties</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.secondaryText} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location, property type..."
              placeholderTextColor={Colors.placeholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Sliders size={20} color={Colors.primaryText} strokeWidth={2} />
              {getActiveFiltersCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <View style={styles.activeFiltersSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.activeFilters}>
                {filters.propertyType !== 'All' && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{filters.propertyType}</Text>
                  </View>
                )}
                {filters.priceRange.label !== 'Any' && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{filters.priceRange.label}</Text>
                  </View>
                )}
                {filters.bedrooms !== 'Any' && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{filters.bedrooms} BR</Text>
                  </View>
                )}
                {filters.bathrooms !== 'Any' && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{filters.bathrooms} BA</Text>
                  </View>
                )}
                {filters.amenities.length > 0 && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>
                      {filters.amenities.length} Amenities
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Search Button */}
        <View style={styles.searchButtonContainer}>
          <Button
            title="Search Properties"
            onPress={handleSearch}
            style={styles.searchButton}
          />
          {(searchQuery || getActiveFiltersCount() > 0) && (
            <Button
              title="Save Search"
              onPress={handleSaveSearch}
              variant="outline"
              style={styles.saveSearchButton}
            />
          )}
        </View>

        {/* Popular Locations */}
        <View style={styles.quickFiltersSection}>
          <Text style={styles.sectionTitle}>Popular Locations</Text>
          <View style={styles.quickFilters}>
            {nigerianLocations.map((location) => (
              <TouchableOpacity 
                key={location} 
                style={styles.quickFilter}
                onPress={() => handleLocationPress(location)}
              >
                <MapPin size={14} color={Colors.accent} strokeWidth={2} />
                <Text style={styles.quickFilterText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent/Saved Searches */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentSearches}>
            {savedSearches.map((search, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recentSearch}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Search size={16} color={Colors.secondaryText} strokeWidth={2} />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={setFilters}
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
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  
  // Search Section
  searchSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    marginLeft: Spacing.sm,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  filterButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },

  // Active Filters
  activeFiltersSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.md,
  },
  activeFilters: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  activeFilter: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.md,
  },
  activeFilterText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
  
  // Search Button
  searchButtonContainer: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  searchButton: {
    marginTop: 0,
  },
  saveSearchButton: {
    marginTop: 0,
  },
  
  // Quick Filters
  quickFiltersSection: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('subtitle') * Typography.lineHeight.normal,
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickFilterText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    marginLeft: Spacing.xs,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  
  // Recent Searches
  recentSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  recentSearches: {
    gap: Spacing.sm,
  },
  recentSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentSearchText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
  },
  resetText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.accent,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },
  modalFooter: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    marginTop: 0,
  },

  // Filter Sections
  filterSection: {
    marginVertical: Spacing.lg,
  },
  filterSectionTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  filterOptionText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },
  filterOptionTextActive: {
    color: Colors.white,
  },

  // Filter Row (for bedrooms/bathrooms)
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  filterHalf: {
    flex: 1,
  },
  filterOptionsSmall: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  filterOptionSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 40,
    alignItems: 'center',
  },

  // Size Inputs
  sizeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sizeInputContainer: {
    flex: 1,
  },
  sizeInputLabel: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginBottom: Spacing.xs,
  },
  sizeInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },
  sizeSeparator: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 20,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  amenityOptionActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  amenityOptionText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },
  amenityOptionTextActive: {
    color: Colors.white,
  },
});