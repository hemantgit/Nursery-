import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width: SCREEN_W } = Dimensions.get('window');
const COLS = SCREEN_W > 600 ? 3 : 2;
const CARD_W = (SCREEN_W - 32 - (COLS + 1) * 8) / COLS;

export default function WishlistScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={{ width: 60 }} />
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🤍</Text>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySub}>Save plants you love by tapping the heart icon.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.shopBtnText}>Discover Plants →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.countText}>{wishlist.length} saved plant{wishlist.length !== 1 ? 's' : ''}</Text>
          <View style={styles.grid}>
            {wishlist.map(plant => (
              <TouchableOpacity
                key={plant.id}
                style={[styles.card, { width: CARD_W }]}
                onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                activeOpacity={0.88}
              >
                <View style={[styles.cardImg, { backgroundColor: plant.bgColor }]}>
                  <Text style={{ fontSize: 48 }}>{plant.emoji}</Text>
                  <TouchableOpacity style={styles.heartBtn} onPress={() => toggleWishlist(plant)}>
                    <Text style={{ fontSize: 16 }}>❤️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.careLvl}>{plant.care}</Text>
                  <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                  <Text style={styles.plantPrice}>${plant.price}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(plant)}>
                    <Text style={styles.addBtnText}>+ Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { paddingVertical: 6 },
  backBtnText: { fontSize: 14, color: colors.medium, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: colors.textLight, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  shopBtn: {
    backgroundColor: colors.forest, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 12,
  },
  shopBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 8 },
  countText: { fontSize: 13, color: colors.textLight, padding: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  card: {
    backgroundColor: colors.white, borderRadius: 14, margin: 4,
    overflow: 'hidden', ...shadows.sm,
  },
  cardImg: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  heartBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    width: 26, height: 26, justifyContent: 'center', alignItems: 'center',
  },
  cardBody: { padding: 10 },
  careLvl: { fontSize: 9, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  plantName: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 2, marginBottom: 4 },
  plantPrice: { fontSize: 15, fontWeight: '800', color: colors.forest, marginBottom: 8 },
  addBtn: { backgroundColor: colors.forest, borderRadius: 7, paddingVertical: 7, alignItems: 'center' },
  addBtnText: { color: colors.white, fontSize: 10, fontWeight: '700' },
});
