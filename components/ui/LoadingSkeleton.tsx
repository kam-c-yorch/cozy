import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout, Spacing } from '../../constants/Spacing';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function LoadingSkeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = Layout.borderRadius.sm,
  style 
}: LoadingSkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, '#E8E8E8'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

interface PropertyCardSkeletonProps {
  style?: ViewStyle;
}

export function PropertyCardSkeleton({ style }: PropertyCardSkeletonProps) {
  return (
    <View style={[styles.propertyCardSkeleton, style]}>
      <LoadingSkeleton height={120} borderRadius={Layout.borderRadius.lg} />
      <View style={styles.propertyCardContent}>
        <LoadingSkeleton height={16} width="80%" style={{ marginBottom: Spacing.xs }} />
        <LoadingSkeleton height={12} width="60%" style={{ marginBottom: Spacing.sm }} />
        <View style={styles.propertyDetailsRow}>
          <LoadingSkeleton height={12} width={30} />
          <LoadingSkeleton height={12} width={30} />
          <LoadingSkeleton height={12} width={40} />
        </View>
        <LoadingSkeleton height={14} width="50%" style={{ marginTop: Spacing.xs }} />
      </View>
    </View>
  );
}

interface ListItemSkeletonProps {
  showAvatar?: boolean;
  style?: ViewStyle;
}

export function ListItemSkeleton({ showAvatar = true, style }: ListItemSkeletonProps) {
  return (
    <View style={[styles.listItemSkeleton, style]}>
      {showAvatar && (
        <LoadingSkeleton 
          width={50} 
          height={50} 
          borderRadius={25} 
          style={{ marginRight: Spacing.sm }} 
        />
      )}
      <View style={styles.listItemContent}>
        <LoadingSkeleton height={16} width="70%" style={{ marginBottom: Spacing.xs }} />
        <LoadingSkeleton height={12} width="90%" style={{ marginBottom: Spacing.xs }} />
        <LoadingSkeleton height={12} width="40%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border,
  },
  propertyCardSkeleton: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyCardContent: {
    padding: Spacing.sm,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listItemContent: {
    flex: 1,
  },
});