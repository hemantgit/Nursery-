import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useApp();
  const [ordered, setOrdered] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const delivery = cartTotal >= 50 ? 0 : 5.99;
  const discount = promoApplied ? cartTotal * 0.1 : 0;
  const total = cartTotal + delivery - discount;

  const handleOrder = () => {
    setOrdered(true);
    clearCart();
  };

  if (ordered) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successSub}>Your plants are being carefully prepared. Estimated delivery in 3–5 business days.</Text>
        <View style={styles.successCard}>
          <Text style={styles.successCardTitle}>What Happens Next</Text>
          {[
            ['📦', 'Your order is being packed with care'],
            ['🚚', 'Shipped within 24 hours'],
            ['📍', 'Tracked delivery to your door'],
            ['🌿', 'Enjoy your new plants!'],
          ].map(([icon, text]) => (
            <View key={text} style={styles.successStep}>
              <Text style={{ fontSize: 18 }}>{icon}</Text>
              <Text style={styles.successStepText}>{text}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => { setOrdered(false); navigation.navigate('Home'); }}
        >
          <Text style={styles.continueBtnText}>Continue Shopping 🌿</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Cart</Text>
          {cart.length > 0 && (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        {cartTotal >= 50 && (
          <View style={styles.freeBanner}>
            <Text style={styles.freeBannerText}>🎉 You qualify for free delivery!</Text>
          </View>
        )}
        {cartTotal < 50 && cart.length > 0 && (
          <View style={styles.nearFreeBanner}>
            <Text style={styles.nearFreeText}>
              Add ${(50 - cartTotal).toFixed(2)} more for free delivery 🚚
            </Text>
            <View style={styles.nearFreeBar}>
              <View style={[styles.nearFreeProgress, { width: `${Math.min(100, (cartTotal / 50) * 100)}%` }]} />
            </View>
          </View>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Discover beautiful plants waiting for a new home.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.shopBtnText}>Browse Plants →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={[styles.itemImg, { backgroundColor: item.bgColor }]}>
                  <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                </View>
                <View style={styles.itemBody}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemCare}>{item.care} care</Text>
                  <View style={styles.itemBottom}>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemTotal}>${(item.price * item.qty).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Promo */}
            <View style={styles.promoRow}>
              <Text style={styles.promoInput}
                onPress={() => {
                  if (!promoApplied) {
                    setPromoApplied(true);
                    setPromoCode('LEAFBLOOM10');
                  }
                }}
              >
                {promoApplied ? '✓ LEAFBLOOM10 applied — 10% off!' : '🏷 Add promo code (try LEAFBLOOM10)'}
              </Text>
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            {promoApplied && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>Promo (LEAFBLOOM10)</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>−${discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, delivery === 0 && { color: colors.success }]}>
                {delivery === 0 ? 'FREE 🎉' : `$${delivery.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleOrder}>
              <Text style={styles.checkoutBtnText}>Place Order — ${total.toFixed(2)} 🌿</Text>
            </TouchableOpacity>
            <Text style={styles.secureNote}>🔒 Secure checkout · Free returns</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  clearText: { fontSize: 13, color: colors.coral, fontWeight: '600' },
  freeBanner: {
    backgroundColor: '#E8F5E9', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: colors.light,
  },
  freeBannerText: { fontSize: 13, color: colors.success, fontWeight: '600', textAlign: 'center' },
  nearFreeBanner: { backgroundColor: colors.amberLight, borderRadius: 10, padding: 10 },
  nearFreeText: { fontSize: 12, color: '#E65100', fontWeight: '600', marginBottom: 6 },
  nearFreeBar: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  nearFreeProgress: { height: 4, backgroundColor: colors.amber, borderRadius: 2 },

  list: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  cartItem: {
    backgroundColor: colors.white, borderRadius: 14, marginBottom: 10,
    flexDirection: 'row', overflow: 'hidden', ...shadows.sm,
  },
  itemImg: { width: 80, justifyContent: 'center', alignItems: 'center' },
  itemBody: { flex: 1, padding: 12 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  itemName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text, marginRight: 8 },
  removeBtn: { fontSize: 14, color: colors.textLight, padding: 2 },
  itemCare: { fontSize: 11, color: colors.textLight, marginBottom: 8 },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceAlt, borderRadius: 8,
  },
  qtyBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, color: colors.forest, fontWeight: '600' },
  qtyValue: { fontSize: 14, fontWeight: '700', color: colors.text, width: 28, textAlign: 'center' },
  itemTotal: { fontSize: 16, fontWeight: '800', color: colors.forest },

  promoRow: {
    backgroundColor: colors.white, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
  },
  promoInput: { fontSize: 13, color: colors.textMed, fontWeight: '500' },

  summary: {
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, ...shadows.lg,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: colors.textMed },
  summaryValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 10 },
  totalLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.forest },
  checkoutBtn: {
    backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 14, ...shadows.md,
  },
  checkoutBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secureNote: { fontSize: 12, color: colors.textLight, textAlign: 'center', marginTop: 10 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: colors.textLight, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  shopBtn: {
    backgroundColor: colors.forest, borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  shopBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },

  successContainer: { justifyContent: 'center', alignItems: 'center', padding: 32 },
  successEmoji: { fontSize: 72, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 10 },
  successSub: { fontSize: 14, color: colors.textMed, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  successCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20, width: '100%', ...shadows.sm,
    marginBottom: 24,
  },
  successCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 14 },
  successStep: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'center' },
  successStepText: { fontSize: 13, color: colors.textMed },
  continueBtn: {
    backgroundColor: colors.forest, borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  continueBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
