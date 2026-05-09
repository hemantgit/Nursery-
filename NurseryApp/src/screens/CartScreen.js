import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';

const SAMPLE_CART = [
  { id: '1', name: 'Monstera Deliciosa', price: 25, emoji: '🌿', qty: 2 },
  { id: '3', name: 'Snake Plant', price: 22, emoji: '🌱', qty: 1 },
  { id: '7', name: 'Cactus Mix', price: 12, emoji: '🌵', qty: 3 },
];

export default function CartScreen() {
  const [items, setItems] = useState(SAMPLE_CART);
  const [ordered, setOrdered] = useState(false);

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = 5.99;
  const total = subtotal + delivery;

  if (ordered) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successSub}>Your plants are on their way. Estimated delivery: 3-5 days.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={() => { setOrdered(false); setItems(SAMPLE_CART); }}>
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerSub}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add some plants to get started!</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardEmoji}>
                  <Text style={styles.emojiText}>{item.emoji}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price} each</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemTotal}>${(item.price * item.qty).toFixed(2)}</Text>
              </View>
            ))}
            <View style={{ height: 16 }} />
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>${delivery.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setOrdered(true)}>
              <Text style={styles.checkoutBtnText}>Place Order 🌿</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: colors.white, fontSize: 24, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEmoji: {
    width: 50,
    height: 50,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emojiText: { fontSize: 28 },
  cardBody: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemPrice: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  qtyBtn: {
    backgroundColor: colors.background,
    borderRadius: 8,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtnText: { fontSize: 16, color: colors.text, fontWeight: '600', lineHeight: 20 },
  qtyValue: { fontSize: 15, fontWeight: '600', color: colors.text, marginHorizontal: 10 },
  itemTotal: { fontSize: 15, fontWeight: '700', color: colors.primary, minWidth: 55, textAlign: 'right' },
  summary: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: colors.textLight, fontSize: 15 },
  summaryValue: { color: colors.text, fontSize: 15 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  totalLabel: { color: colors.text, fontSize: 17, fontWeight: '700' },
  totalValue: { color: colors.primary, fontSize: 20, fontWeight: '700' },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: '700', color: colors.text },
  emptySub: { color: colors.textLight, marginTop: 8 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successEmoji: { fontSize: 72, marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: '700', color: colors.text },
  successSub: { color: colors.textLight, fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 32,
  },
  continueBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
