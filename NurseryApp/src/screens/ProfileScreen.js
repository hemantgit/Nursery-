import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';

const ORDERS = [
  { id: '#1042', date: 'May 5, 2026', items: 3, total: '$71.00', status: 'Delivered' },
  { id: '#1039', date: 'Apr 28, 2026', items: 1, total: '$25.00', status: 'Delivered' },
  { id: '#1035', date: 'Apr 15, 2026', items: 2, total: '$40.00', status: 'Delivered' },
];

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>Alex Green</Text>
          <Text style={styles.userEmail}>alex.green@email.com</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Plants</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>Gold</Text>
              <Text style={styles.statLabel}>Tier</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {ORDERS.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>{order.date} · {order.items} items</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>{order.total}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Order updates & offers</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifications ? colors.primary : colors.white}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Newsletter</Text>
              <Text style={styles.settingDesc}>Weekly plant care tips</Text>
            </View>
            <Switch
              value={newsletter}
              onValueChange={setNewsletter}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={newsletter ? colors.primary : colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsCard}>
          {['Help Center', 'Contact Us', 'Return Policy', 'Privacy Policy'].map((item, idx, arr) => (
            <View key={item}>
              <TouchableOpacity style={styles.menuRow}>
                <Text style={styles.menuText}>{item}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              {idx < arr.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
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
  profileCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.background,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 40 },
  userName: { fontSize: 20, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderLeft: {},
  orderId: { fontSize: 14, fontWeight: '700', color: colors.text },
  orderDate: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  orderRight: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 15, fontWeight: '700', color: colors.primary },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  statusText: { fontSize: 11, color: colors.success, fontWeight: '600' },
  settingsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  settingDesc: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuText: { fontSize: 14, color: colors.text },
  menuArrow: { fontSize: 20, color: colors.textLight },
  logoutBtn: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.error,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: colors.error, fontSize: 15, fontWeight: '600' },
});
