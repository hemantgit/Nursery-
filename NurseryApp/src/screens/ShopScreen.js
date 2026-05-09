import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { PLANTS, CATEGORIES } from '../data/plants';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const COLS = SCREEN_W > 600 ? 3 : 2;
const CARD_W = (SCREEN_W - 32 - (COLS + 1) * 8) / COLS;

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'new', label: 'New Arrivals' },
];

const CARE_LEVELS = ['All', 'Very Easy', 'Easy', 'Moderate', 'Advanced'];

function StarRating({ rating, size = 11 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <Text key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? colors.gold : colors.border }}>★</Text>
      ))}
    </View>
  );
}

function PlantGridCard({ plant, onPress, onAddToCart, isWishlisted, onWishlist }) {
  const discount = plant.originalPrice
    ? Math.round((1 - plant.price / plant.originalPrice) * 100)
    : null;
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.cardImg, { backgroundColor: plant.bgColor }]}>
        <Text style={styles.cardEmoji}>{plant.emoji}</Text>
        {discount && <View style={styles.discountBadge}><Text style={styles.discountText}>-{discount}%</Text></View>}
        {plant.newArrival && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
        <TouchableOpacity style={styles.wishBtn} onPress={onWishlist}>
          <Text style={{ fontSize: 15 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.careLabel}>{plant.care}</Text>
        <Text style={styles.plantName} numberOfLines={2}>{plant.name}</Text>
        <View style={styles.ratingRow}>
          <StarRating rating={plant.rating} />
          <Text style={styles.reviewCount}>({plant.reviews})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${plant.price}</Text>
          {plant.originalPrice && <Text style={styles.origPrice}>${plant.originalPrice}</Text>}
        </View>
        <View style={styles.tagsRow}>
          {plant.airPurifying && <View style={styles.tag}><Text style={styles.tagText}>🌬 Air</Text></View>}
          {plant.petFriendly && <View style={styles.tag}><Text style={styles.tagText}>🐾 Pet</Text></View>}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>+ Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ShopScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { addToCart, toggleWishlist, isInWishlist, cartCount } = useApp();
  const [search, setSearch] = useState(route?.params?.query || '');
  const [category, setCategory] = useState(route?.params?.category || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [careFilter, setCareFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [airPurifyingOnly, setAirPurifyingOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = PLANTS;

    // Filter preset from route
    if (route?.params?.filter === 'trending') list = list.filter(p => p.trending);
    if (route?.params?.filter === 'bestseller') list = list.filter(p => p.bestSeller);
    if (route?.params?.filter === 'new') list = list.filter(p => p.newArrival);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (careFilter !== 'All') list = list.filter(p => p.care === careFilter);
    if (petFriendlyOnly) list = list.filter(p => p.petFriendly);
    if (airPurifyingOnly) list = list.filter(p => p.airPurifying);

    switch (sortBy) {
      case 'price_asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'new': return [...list].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      default: return [...list].sort((a, b) => b.reviews - a.reviews);
    }
  }, [search, category, sortBy, careFilter, petFriendlyOnly, airPurifyingOnly, route?.params]);

  // Grid rendering (chunked into rows)
  const rows = [];
  for (let i = 0; i < filtered.length; i += COLS) {
    rows.push(filtered.slice(i, i + COLS));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Shop Plants</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={{ fontSize: 14, marginRight: 6 }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search plants..."
              placeholderTextColor={colors.textLight}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={{ fontSize: 16, color: colors.textLight }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={() => setShowFilters(v => !v)}
          >
            <Text style={{ fontSize: 14 }}>⚙️</Text>
            <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, category === cat.id && styles.catChipActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catChipLabel, category === cat.id && styles.catChipLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expanded Filters */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterSectionTitle}>Sort By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortChip, sortBy === opt.id && styles.sortChipActive]}
                onPress={() => setSortBy(opt.id)}
              >
                <Text style={[styles.sortChipText, sortBy === opt.id && styles.sortChipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.filterSectionTitle}>Care Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {CARE_LEVELS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.sortChip, careFilter === c && styles.sortChipActive]}
                onPress={() => setCareFilter(c)}
              >
                <Text style={[styles.sortChipText, careFilter === c && styles.sortChipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.toggleRow}>
            <TouchableOpacity style={styles.toggleItem} onPress={() => setPetFriendlyOnly(v => !v)}>
              <View style={[styles.toggleBox, petFriendlyOnly && styles.toggleBoxActive]}>
                {petFriendlyOnly && <Text style={styles.toggleCheck}>✓</Text>}
              </View>
              <Text style={styles.toggleLabel}>🐾 Pet Friendly Only</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleItem} onPress={() => setAirPurifyingOnly(v => !v)}>
              <View style={[styles.toggleBox, airPurifyingOnly && styles.toggleBoxActive]}>
                {airPurifyingOnly && <Text style={styles.toggleCheck}>✓</Text>}
              </View>
              <Text style={styles.toggleLabel}>🌬 Air Purifying Only</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>{filtered.length} plants found</Text>
      </View>

      {/* Grid */}
      <ScrollView style={styles.grid} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🌵</Text>
            <Text style={styles.emptyTitle}>No plants found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search terms.</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={() => { setSearch(''); setCategory('all'); setCareFilter('All'); }}>
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {rows.map((row, ri) => (
              <View key={ri} style={styles.gridRow}>
                {row.map(plant => (
                  <PlantGridCard
                    key={plant.id}
                    plant={plant}
                    onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                    onAddToCart={() => addToCart(plant)}
                    isWishlisted={isInWishlist(plant.id)}
                    onWishlist={() => toggleWishlist(plant)}
                  />
                ))}
              </View>
            ))}
            <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  cartBtn: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: colors.coral, borderRadius: 8, minWidth: 15, height: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceAlt, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  filterToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  filterToggleActive: { backgroundColor: colors.forest },
  filterToggleText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  filterToggleTextActive: { color: colors.white },
  catRow: { marginHorizontal: -4 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, marginHorizontal: 3,
    borderWidth: 1, borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  catChipEmoji: { fontSize: 13 },
  catChipLabel: { fontSize: 12, color: colors.textMed, fontWeight: '600' },
  catChipLabelActive: { color: colors.white },

  filterPanel: {
    backgroundColor: colors.surface, padding: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  filterSectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  sortChip: {
    backgroundColor: colors.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  sortChipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  sortChipText: { fontSize: 12, color: colors.textMed, fontWeight: '500' },
  sortChipTextActive: { color: colors.white },
  toggleRow: { flexDirection: 'row', gap: 20 },
  toggleItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleBox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  toggleBoxActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  toggleCheck: { color: colors.white, fontSize: 12, fontWeight: '700' },
  toggleLabel: { fontSize: 13, color: colors.textMed },

  resultsBar: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  resultsText: { fontSize: 12, color: colors.textLight, fontWeight: '500' },

  grid: { flex: 1, paddingHorizontal: 8, paddingTop: 8 },
  gridRow: { flexDirection: 'row', justifyContent: 'flex-start' },

  card: {
    backgroundColor: colors.white, borderRadius: 14, margin: 4,
    overflow: 'hidden', ...shadows.sm,
  },
  cardImg: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cardEmoji: { fontSize: 48 },
  discountBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: colors.coral, borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  discountText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  newBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: colors.aiPurple, borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  newBadgeText: { color: colors.white, fontSize: 9, fontWeight: '700' },
  wishBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    width: 26, height: 26, justifyContent: 'center', alignItems: 'center',
  },
  cardBody: { padding: 10 },
  careLabel: { fontSize: 9, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  plantName: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 2, marginBottom: 3, lineHeight: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  reviewCount: { fontSize: 9, color: colors.textLight },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '800', color: colors.forest },
  origPrice: { fontSize: 11, color: colors.textLight, textDecorationLine: 'line-through' },
  tagsRow: { flexDirection: 'row', gap: 4, marginBottom: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: colors.mint, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  tagText: { fontSize: 9, color: colors.forest, fontWeight: '600' },
  addBtn: {
    backgroundColor: colors.forest, borderRadius: 7,
    paddingVertical: 6, alignItems: 'center',
  },
  addBtnText: { color: colors.white, fontSize: 10, fontWeight: '700' },

  emptyState: { padding: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  emptyText: { fontSize: 13, color: colors.textLight, textAlign: 'center', marginBottom: 20 },
  resetBtn: {
    backgroundColor: colors.forest, borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  resetBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
