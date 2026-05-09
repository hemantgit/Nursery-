import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Animated, Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { PLANTS, TRENDING, BESTSELLERS, NEW_ARRIVALS, CATEGORIES } from '../data/plants';
import { BLOG_POSTS } from '../data/blogPosts';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = Math.min(160, (SCREEN_W - 48) / 2);

const TESTIMONIALS = [
  { id: '1', name: 'Sarah M.', rating: 5, text: 'My Monstera arrived perfectly packed and is thriving! The AI care assistant is genuinely helpful.', avatar: '👩' },
  { id: '2', name: 'James T.', rating: 5, text: 'Best plant shop online. The plant finder quiz matched me with exactly what I needed.', avatar: '👨' },
  { id: '3', name: 'Priya K.', rating: 5, text: 'Stunning quality plants and super fast delivery. My living room has been transformed!', avatar: '👩🏾' },
];

function StarRating({ rating, size = 12 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1,2,3,4,5].map(s => (
        <Text key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? colors.gold : colors.border }}>★</Text>
      ))}
    </View>
  );
}

function PlantCard({ plant, onPress, onAddToCart, isWishlisted, onWishlist }) {
  const discount = plant.originalPrice
    ? Math.round((1 - plant.price / plant.originalPrice) * 100)
    : null;
  return (
    <TouchableOpacity style={[styles.plantCard, { width: CARD_W }]} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.plantCardImg, { backgroundColor: plant.bgColor }]}>
        <Text style={styles.plantEmoji}>{plant.emoji}</Text>
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        {plant.newArrival && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishBtn} onPress={onWishlist}>
          <Text style={{ fontSize: 16 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.plantCardBody}>
        <Text style={styles.plantCareLevel}>{plant.care}</Text>
        <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
        <StarRating rating={plant.rating} />
        <Text style={styles.plantReviews}>({plant.reviews})</Text>
        <View style={styles.priceRow}>
          <Text style={styles.plantPrice}>${plant.price}</Text>
          {plant.originalPrice && (
            <Text style={styles.plantOrigPrice}>${plant.originalPrice}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addCartBtn} onPress={onAddToCart}>
          <Text style={styles.addCartText}>+ Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addToCart, toggleWishlist, isInWishlist, cartCount } = useApp();
  const [searchText, setSearchText] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['rgba(27,67,50,0)', 'rgba(27,67,50,1)'],
    extrapolate: 'clamp',
  });

  const handleSearch = () => {
    if (searchText.trim()) navigation.navigate('Shop', { query: searchText });
  };

  return (
    <View style={styles.container}>
      {/* Floating header */}
      <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg, paddingTop: insets.top + 8 }]}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerLogo}>🌿 LeafBloom</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Wishlist')}>
              <Text style={{ fontSize: 20 }}>🤍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Cart')}>
              <Text style={{ fontSize: 20 }}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: insets.top + 70 }]}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌱 Free delivery over $50</Text>
          </View>
          <Text style={styles.heroTitle}>Bring Nature{'\n'}Into Your World</Text>
          <Text style={styles.heroSub}>Premium plants, expert care guides, and AI-powered advice — all in one place.</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search 200+ plants..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>Go</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroStats}>
            {[['500+', 'Plant Varieties'], ['50K+', 'Happy Customers'], ['4.9★', 'App Rating']].map(([val, label]) => (
              <View key={label} style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{val}</Text>
                <Text style={styles.heroStatLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Guarantee Banner */}
        <View style={styles.guaranteeBanner}>
          {[['🚚', 'Free Delivery', '$50+'], ['🌿', '30-Day', 'Guarantee'], ['🤖', 'AI Plant', 'Advisor'], ['⭐', 'Expert', 'Curated']].map(([icon, line1, line2]) => (
            <View key={line1} style={styles.guaranteeItem}>
              <Text style={styles.guaranteeIcon}>{icon}</Text>
              <Text style={styles.guaranteeLine1}>{line1}</Text>
              <Text style={styles.guaranteeLine2}>{line2}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                onPress={() => navigation.navigate('Shop', { category: cat.id })}
              >
                <View style={styles.catEmoji}>
                  <Text style={{ fontSize: 28 }}>{cat.emoji}</Text>
                </View>
                <Text style={styles.catLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Feature Banner */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => navigation.navigate('AI')}
          activeOpacity={0.9}
        >
          <View style={styles.aiBannerContent}>
            <View style={styles.aiTag}><Text style={styles.aiTagText}>✨ POWERED BY AI</Text></View>
            <Text style={styles.aiBannerTitle}>Meet Your Plant{'\n'}Care Expert</Text>
            <Text style={styles.aiBannerSub}>Diagnose problems, get care tips, and find your perfect plant — instantly.</Text>
            <View style={styles.aiBannerBtn}>
              <Text style={styles.aiBannerBtnText}>Try AI Assistant →</Text>
            </View>
          </View>
          <View style={styles.aiBannerEmoji}>
            <Text style={{ fontSize: 72 }}>🤖</Text>
            <Text style={{ fontSize: 40, marginTop: -10 }}>🌿</Text>
          </View>
        </TouchableOpacity>

        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop', { filter: 'trending' })}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {TRENDING.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                onAddToCart={() => addToCart(plant)}
                isWishlisted={isInWishlist(plant.id)}
                onWishlist={() => toggleWishlist(plant)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Best Sellers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop', { filter: 'bestseller' })}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {BESTSELLERS.slice(0, 6).map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                onAddToCart={() => addToCart(plant)}
                isWishlisted={isInWishlist(plant.id)}
                onWishlist={() => toggleWishlist(plant)}
              />
            ))}
          </ScrollView>
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🆕 New Arrivals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Shop', { filter: 'new' })}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {NEW_ARRIVALS.map(plant => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                onAddToCart={() => addToCart(plant)}
                isWishlisted={isInWishlist(plant.id)}
                onWishlist={() => toggleWishlist(plant)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Plant Finder CTA */}
        <View style={styles.finderBanner}>
          <Text style={styles.finderEmoji}>🌱</Text>
          <Text style={styles.finderTitle}>Not sure which plant?</Text>
          <Text style={styles.finderSub}>Answer 5 quick questions and our AI will find your perfect match.</Text>
          <TouchableOpacity
            style={styles.finderBtn}
            onPress={() => navigation.navigate('PlantFinder')}
          >
            <Text style={styles.finderBtnText}>Take the Plant Quiz →</Text>
          </TouchableOpacity>
        </View>

        {/* Blog */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📖 Plant Care Guides</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Blog')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {BLOG_POSTS.filter(b => b.featured).map(post => (
              <TouchableOpacity
                key={post.id}
                style={styles.blogCard}
                onPress={() => navigation.navigate('Blog')}
                activeOpacity={0.9}
              >
                <View style={[styles.blogCardImg, { backgroundColor: post.gradient[0] }]}>
                  <Text style={{ fontSize: 40 }}>{post.emoji}</Text>
                </View>
                <View style={styles.blogCardBody}>
                  <Text style={styles.blogCategory}>{post.category}</Text>
                  <Text style={styles.blogTitle} numberOfLines={2}>{post.title}</Text>
                  <Text style={styles.blogMeta}>{post.readTime} · {post.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 What Our Customers Say</Text>
          {TESTIMONIALS.map(t => (
            <View key={t.id} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={{ fontSize: 24 }}>{t.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <StarRating rating={t.rating} size={14} />
                </View>
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
            </View>
          ))}
        </View>

        {/* Newsletter */}
        <View style={styles.newsletter}>
          <Text style={styles.newsletterTitle}>🌿 Join the Green Community</Text>
          <Text style={styles.newsletterSub}>Get care tips, exclusive deals, and new arrivals straight to your inbox.</Text>
          <View style={styles.newsletterRow}>
            <TextInput
              style={styles.newsletterInput}
              placeholder="your@email.com"
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.newsletterBtn}>
              <Text style={styles.newsletterBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
  },
  headerInner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  headerLogo: { color: colors.white, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { position: 'relative', padding: 8 },
  cartBadge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: colors.amber, borderRadius: 8, minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },

  hero: {
    backgroundColor: colors.forest,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroBadge: {
    backgroundColor: 'rgba(74,193,157,0.2)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(74,193,157,0.4)',
  },
  heroBadgeText: { color: colors.light, fontSize: 12, fontWeight: '600' },
  heroTitle: { color: colors.white, fontSize: 36, fontWeight: '800', lineHeight: 44, marginBottom: 12 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: colors.white, fontSize: 14 },
  searchBtn: {
    backgroundColor: colors.amber, borderRadius: 12,
    paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center',
  },
  searchBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  heroStats: { flexDirection: 'row', gap: 24 },
  heroStat: {},
  heroStatVal: { color: colors.white, fontSize: 18, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },

  guaranteeBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: -1,
    borderRadius: 16,
    padding: 16,
    ...shadows.md,
    zIndex: 10,
  },
  guaranteeItem: { flex: 1, alignItems: 'center' },
  guaranteeIcon: { fontSize: 22, marginBottom: 4 },
  guaranteeLine1: { fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center' },
  guaranteeLine2: { fontSize: 10, color: colors.textLight, textAlign: 'center' },

  section: { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  seeAll: { fontSize: 13, color: colors.medium, fontWeight: '600' },

  catScroll: { marginHorizontal: -4 },
  catCard: {
    alignItems: 'center', marginHorizontal: 6, width: 75,
  },
  catEmoji: {
    width: 62, height: 62, backgroundColor: colors.mint,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    marginBottom: 6, ...shadows.sm,
  },
  catLabel: { fontSize: 11, color: colors.textMed, fontWeight: '600', textAlign: 'center' },

  hScroll: { marginHorizontal: -4 },
  plantCard: {
    backgroundColor: colors.white, borderRadius: 16, marginHorizontal: 6,
    overflow: 'hidden', ...shadows.md,
  },
  plantCardImg: {
    height: 130, justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  plantEmoji: { fontSize: 52 },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: colors.coral, borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  discountText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  newBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: colors.aiPurple, borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  newBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  wishBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center',
  },
  plantCardBody: { padding: 10 },
  plantCareLevel: { fontSize: 10, color: colors.medium, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  plantName: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 3 },
  plantReviews: { fontSize: 10, color: colors.textLight, marginTop: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 8 },
  plantPrice: { fontSize: 16, fontWeight: '800', color: colors.forest },
  plantOrigPrice: { fontSize: 12, color: colors.textLight, textDecorationLine: 'line-through' },
  addCartBtn: {
    backgroundColor: colors.forest, borderRadius: 8,
    paddingVertical: 7, alignItems: 'center',
  },
  addCartText: { color: colors.white, fontSize: 11, fontWeight: '700' },

  aiBanner: {
    marginHorizontal: 16, marginTop: 28,
    backgroundColor: colors.aiPurple, borderRadius: 20,
    padding: 24, flexDirection: 'row', overflow: 'hidden',
    ...shadows.lg,
  },
  aiBannerContent: { flex: 1, marginRight: 8 },
  aiTag: {
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  aiTagText: { color: colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  aiBannerTitle: { color: colors.white, fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 8 },
  aiBannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  aiBannerBtn: {
    backgroundColor: colors.white, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start',
  },
  aiBannerBtnText: { color: colors.aiPurple, fontWeight: '700', fontSize: 13 },
  aiBannerEmoji: { justifyContent: 'center', alignItems: 'center' },

  finderBanner: {
    marginHorizontal: 16, marginTop: 28,
    backgroundColor: colors.mint, borderRadius: 20, padding: 24,
    alignItems: 'center',
  },
  finderEmoji: { fontSize: 48, marginBottom: 12 },
  finderTitle: { fontSize: 20, fontWeight: '800', color: colors.forest, marginBottom: 8, textAlign: 'center' },
  finderSub: { fontSize: 14, color: colors.textMed, textAlign: 'center', lineHeight: 20, marginBottom: 18 },
  finderBtn: {
    backgroundColor: colors.forest, borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  finderBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },

  blogCard: {
    width: 220, backgroundColor: colors.white, borderRadius: 16,
    marginHorizontal: 6, overflow: 'hidden', ...shadows.sm,
  },
  blogCardImg: {
    height: 100, justifyContent: 'center', alignItems: 'center',
  },
  blogCardBody: { padding: 12 },
  blogCategory: { fontSize: 10, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  blogTitle: { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18, marginBottom: 6 },
  blogMeta: { fontSize: 11, color: colors.textLight },

  testimonialCard: {
    backgroundColor: colors.white, borderRadius: 14, padding: 16,
    marginBottom: 10, ...shadows.sm,
  },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  testimonialAvatar: {
    width: 42, height: 42, backgroundColor: colors.mint,
    borderRadius: 21, justifyContent: 'center', alignItems: 'center',
  },
  testimonialName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  testimonialText: { fontSize: 13, color: colors.textMed, lineHeight: 20, fontStyle: 'italic' },

  newsletter: {
    marginHorizontal: 16, marginTop: 28,
    backgroundColor: colors.forest, borderRadius: 20, padding: 24,
  },
  newsletterTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  newsletterSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  newsletterRow: { flexDirection: 'row', gap: 8 },
  newsletterInput: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.white, fontSize: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  newsletterBtn: {
    backgroundColor: colors.amber, borderRadius: 10,
    paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center',
  },
  newsletterBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
});
