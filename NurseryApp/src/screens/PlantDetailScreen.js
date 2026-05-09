import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { getPlantById, PLANTS } from '../data/plants';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');

function StarRating({ rating, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Text key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? colors.gold : colors.border }}>★</Text>
      ))}
    </View>
  );
}

function Badge({ emoji, label, highlight }) {
  return (
    <View style={[styles.badge, highlight && styles.badgeHighlight]}>
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text style={[styles.badgeText, highlight && styles.badgeTextHighlight]}>{label}</Text>
    </View>
  );
}

export default function PlantDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { plantId } = route.params;
  const plant = getPlantById(plantId);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('care');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!plant) return null;

  const wishlisted = isInWishlist(plant.id);
  const relatedPlants = PLANTS.filter(p => p.category === plant.category && p.id !== plant.id).slice(0, 4);
  const discount = plant.originalPrice ? Math.round((1 - plant.price / plant.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    addToCart(plant, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Area */}
        <View style={[styles.heroArea, { backgroundColor: plant.bgColor, paddingTop: insets.top + 60 }]}>
          <Text style={styles.heroEmoji}>{plant.emoji}</Text>
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Back + Wish buttons overlay */}
        <View style={[styles.overlay, { top: insets.top + (Platform.OS === 'web' ? 8 : 8) }]}>
          <TouchableOpacity style={styles.overlayBtn} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.overlayBtn} onPress={() => toggleWishlist(plant)}>
            <Text style={{ fontSize: 18 }}>{wishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.category}>{plant.category.toUpperCase()}</Text>
              <Text style={styles.name}>{plant.name}</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.price}>${plant.price}</Text>
              {plant.originalPrice && (
                <Text style={styles.origPrice}>${plant.originalPrice}</Text>
              )}
            </View>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={plant.rating} />
            <Text style={styles.ratingText}>{plant.rating}</Text>
            <Text style={styles.reviewCount}>{plant.reviews.toLocaleString()} reviews</Text>
          </View>

          <Text style={styles.shortDesc}>{plant.shortDesc}</Text>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>☀️</Text>
              <Text style={styles.infoLabel}>Light</Text>
              <Text style={styles.infoValue}>{plant.light}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💧</Text>
              <Text style={styles.infoLabel}>Water</Text>
              <Text style={styles.infoValue}>{plant.water}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🌡</Text>
              <Text style={styles.infoLabel}>Humidity</Text>
              <Text style={styles.infoValue}>{plant.humidity}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📏</Text>
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{plant.size}</Text>
            </View>
          </View>

          {/* Badges */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesRow}>
            <Badge emoji="🌱" label={plant.care} highlight />
            {plant.airPurifying && <Badge emoji="🌬" label="Air Purifying" />}
            {plant.petFriendly && <Badge emoji="🐾" label="Pet Friendly" />}
            {plant.fastGrowing && <Badge emoji="⚡" label="Fast Growing" />}
            {plant.trending && <Badge emoji="🔥" label="Trending" />}
            {plant.newArrival && <Badge emoji="✨" label="New Arrival" />}
          </ScrollView>

          {/* Qty + Add to Cart */}
          <View style={styles.cartRow}>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.min(plant.stock, q + 1))}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.addCartBtn, addedToCart && styles.addedCartBtn]}
              onPress={handleAddToCart}
            >
              <Text style={styles.addCartText}>
                {addedToCart ? '✓ Added to Cart!' : `Add to Cart — $${(plant.price * qty).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.stockInfo}>
            {plant.stock <= 5 ? `⚠️ Only ${plant.stock} left in stock` : `✓ In Stock (${plant.stock} available)`}
          </Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            {['care', 'about', 'ai'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'care' ? '🌿 Care' : tab === 'about' ? '📖 About' : '🤖 AI Tips'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'care' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabSectionTitle}>Care Tips</Text>
              {plant.careTips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'about' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabSectionTitle}>About this Plant</Text>
              <Text style={styles.aboutText}>{plant.description}</Text>
              <View style={styles.funFactBox}>
                <Text style={styles.funFactTitle}>💡 Did You Know?</Text>
                <Text style={styles.funFactText}>{plant.funFact}</Text>
              </View>
              <View style={styles.tagsSection}>
                {plant.tags.map(tag => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'ai' && (
            <View style={styles.tabContent}>
              <View style={styles.aiTipsBox}>
                <View style={styles.aiTipsHeader}>
                  <Text style={{ fontSize: 24 }}>🤖</Text>
                  <Text style={styles.aiTipsTitle}>AI Care Insights</Text>
                </View>
                <Text style={styles.aiTipsText}>
                  Based on thousands of plant owner reports, here are the key success factors for your {plant.name}:
                </Text>
                <View style={styles.aiInsight}>
                  <Text style={styles.aiInsightEmoji}>💡</Text>
                  <Text style={styles.aiInsightText}>
                    Most {plant.name} owners water too frequently. The {plant.water.toLowerCase()} watering schedule is crucial — err on the side of underwatering.
                  </Text>
                </View>
                <View style={styles.aiInsight}>
                  <Text style={styles.aiInsightEmoji}>☀️</Text>
                  <Text style={styles.aiInsightText}>
                    Position near a {plant.light.toLowerCase()} light source. Rotate 90° every 2 weeks for even growth.
                  </Text>
                </View>
                <View style={styles.aiInsight}>
                  <Text style={styles.aiInsightEmoji}>📊</Text>
                  <Text style={styles.aiInsightText}>
                    Care difficulty: {plant.care}. Our AI rates this plant {plant.rating}/5 for beginner success based on customer feedback.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.aiChatBtn}
                  onPress={() => navigation.navigate('AIChat')}
                >
                  <Text style={styles.aiChatBtnText}>💬 Ask AI About This Plant</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Related Plants */}
          {relatedPlants.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>You Might Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedPlants.map(rp => (
                  <TouchableOpacity
                    key={rp.id}
                    style={styles.relatedCard}
                    onPress={() => navigation.replace('PlantDetail', { plantId: rp.id })}
                  >
                    <View style={[styles.relatedImg, { backgroundColor: rp.bgColor }]}>
                      <Text style={{ fontSize: 32 }}>{rp.emoji}</Text>
                    </View>
                    <Text style={styles.relatedName} numberOfLines={1}>{rp.name}</Text>
                    <Text style={styles.relatedPrice}>${rp.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroArea: {
    height: 280, justifyContent: 'center', alignItems: 'center',
  },
  heroEmoji: { fontSize: 110 },
  discountBadge: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: colors.coral, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  discountText: { color: colors.white, fontWeight: '800', fontSize: 12 },
  overlay: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  overlayBtn: {
    width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, justifyContent: 'center', alignItems: 'center', ...shadows.sm,
  },
  content: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -20, padding: 24,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  titleLeft: { flex: 1, marginRight: 12 },
  category: { fontSize: 11, color: colors.medium, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, lineHeight: 30 },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontSize: 28, fontWeight: '800', color: colors.forest },
  origPrice: { fontSize: 14, color: colors.textLight, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ratingText: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewCount: { fontSize: 13, color: colors.textLight },
  shortDesc: { fontSize: 15, color: colors.textMed, lineHeight: 22, marginBottom: 20 },

  infoGrid: {
    flexDirection: 'row', gap: 8, marginBottom: 16,
  },
  infoCard: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 10, alignItems: 'center',
  },
  infoIcon: { fontSize: 18, marginBottom: 4 },
  infoLabel: { fontSize: 9, color: colors.textLight, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { fontSize: 11, color: colors.text, fontWeight: '700', textAlign: 'center' },

  badgesRow: { marginBottom: 20, marginHorizontal: -4 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, marginHorizontal: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  badgeHighlight: { backgroundColor: colors.mint, borderColor: colors.light },
  badgeText: { fontSize: 12, color: colors.textMed, fontWeight: '600' },
  badgeTextHighlight: { color: colors.forest },

  cartRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceAlt, borderRadius: 12,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 36, height: 46, justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnText: { fontSize: 20, color: colors.forest, fontWeight: '600' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: colors.text, width: 32, textAlign: 'center' },
  addCartBtn: {
    flex: 1, backgroundColor: colors.forest, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', paddingVertical: 14,
  },
  addedCartBtn: { backgroundColor: colors.success },
  addCartText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  stockInfo: { fontSize: 12, color: colors.textLight, marginBottom: 24, textAlign: 'center' },

  tabs: {
    flexDirection: 'row', backgroundColor: colors.surfaceAlt,
    borderRadius: 12, padding: 4, marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.white, ...shadows.sm },
  tabText: { fontSize: 13, color: colors.textLight, fontWeight: '600' },
  tabTextActive: { color: colors.forest },
  tabContent: { marginBottom: 24 },
  tabSectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.medium, marginTop: 7 },
  tipText: { flex: 1, fontSize: 14, color: colors.textMed, lineHeight: 20 },
  aboutText: { fontSize: 14, color: colors.textMed, lineHeight: 22, marginBottom: 16 },
  funFactBox: {
    backgroundColor: colors.amberLight, borderRadius: 12, padding: 16, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: colors.amber,
  },
  funFactTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  funFactText: { fontSize: 13, color: colors.textMed, lineHeight: 19 },
  tagsSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagPill: {
    backgroundColor: colors.mint, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  tagPillText: { fontSize: 12, color: colors.forest, fontWeight: '600' },

  aiTipsBox: { backgroundColor: colors.aiPurpleLight, borderRadius: 16, padding: 18 },
  aiTipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  aiTipsTitle: { fontSize: 16, fontWeight: '700', color: colors.aiPurple },
  aiTipsText: { fontSize: 13, color: colors.textMed, lineHeight: 19, marginBottom: 14 },
  aiInsight: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  aiInsightEmoji: { fontSize: 18, marginTop: 2 },
  aiInsightText: { flex: 1, fontSize: 13, color: colors.textMed, lineHeight: 19 },
  aiChatBtn: {
    backgroundColor: colors.aiPurple, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', marginTop: 6,
  },
  aiChatBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },

  relatedSection: { marginBottom: 8 },
  relatedTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  relatedCard: { width: 110, marginRight: 12, alignItems: 'center' },
  relatedImg: {
    width: 90, height: 90, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  relatedName: { fontSize: 11, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 2 },
  relatedPrice: { fontSize: 12, fontWeight: '700', color: colors.forest },
});
