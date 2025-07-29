import { Platform } from 'react-native';

const fontFamily = {
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const Typography = {
  // Font families
  fontFamily,
  
  // Font sizes (for backward compatibility)
  sizes: {
    small: 12,
    body: 14,
    subtitle: 16,
    title: 20,
    h2: 24,
  },
  
  // Font weights (for backward compatibility)
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  } as const,
  
  // Font sizes (responsive)
  fontSize: {
    // Mobile sizes
    mobile: {
      small: 12,
      body: 14,
      subtitle: 16,
      title: 20,
      heading: 24,
    },
    // Desktop sizes
    desktop: {
      small: 14,
      body: 16,
      subtitle: 18,
      title: 22,
      heading: 28,
    },
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    semiBold: '600',
    bold: '700',
  } as const,
};

export const getResponsiveFontSize = (size: keyof typeof Typography.fontSize.mobile) => {
  return Platform.select({
    web: Typography.fontSize.desktop[size],
    default: Typography.fontSize.mobile[size],
  });
};