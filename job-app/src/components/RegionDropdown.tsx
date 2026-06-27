import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, shadow } from '../theme';
import { regions, ALL_REGIONS_ID, getRegionById } from '../data/regions';

interface Props {
  selectedId: string; // 'all' or a region id
  onSelect: (id: string) => void;
}

/**
 * قائمة منسدلة للمناطق الإدارية في السعودية.
 * Dropdown listing the 13 Saudi administrative regions (plus "all regions"),
 * showing the number of cities per region.
 */
export default function RegionDropdown({ selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const selected = getRegionById(selectedId);
  const label = selected ? selected.name : 'كل المناطق';

  const data = [
    { id: ALL_REGIONS_ID, name: 'كل المناطق', nameEn: 'All regions', cities: [] as string[] },
    ...regions,
  ];

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.trigger}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="location-outline" size={16} color={colors.primary} />
        <Text style={styles.triggerText} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, shadow.floating]} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>اختر المنطقة</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => {
                const active = item.id === selectedId;
                return (
                  <TouchableOpacity
                    style={styles.row}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(item.id);
                      setOpen(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.rowTitle, active && { color: colors.primary }]}>
                        {item.name}
                      </Text>
                      {item.cities.length > 0 ? (
                        <Text style={styles.rowSub}>
                          {item.cities.length} مدن · {item.cities.slice(0, 2).join('، ')}
                        </Text>
                      ) : (
                        <Text style={styles.rowSub}>جميع مناطق المملكة</Text>
                      )}
                    </View>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    ) : (
                      <View style={styles.radio} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  triggerText: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.text,
    writingDirection: 'rtl',
    maxWidth: 150,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '78%',
  },
  sheetHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sheetTitle: { fontSize: font.h2, fontWeight: '800', color: colors.text, writingDirection: 'rtl' },
  sep: { height: 1, backgroundColor: colors.divider },
  row: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 14, gap: spacing.md },
  rowTitle: { fontSize: font.body, fontWeight: '700', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
  rowSub: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right', marginTop: 3, writingDirection: 'rtl' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
});
