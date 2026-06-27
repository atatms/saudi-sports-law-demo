import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing, shadow } from '../theme';

export interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  selectedId?: string;
  placeholder: string;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isRTL?: boolean;
  onSelect: (id: string) => void;
}

/** Generic bottom-sheet single-select used for education level (and similar). */
export default function SelectField({
  options,
  selectedId,
  placeholder,
  title,
  icon,
  isRTL = true,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === selectedId);
  const row = isRTL ? 'row-reverse' : 'row';
  const ta = isRTL ? 'right' : 'left';

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} style={[styles.trigger, { flexDirection: row }]} onPress={() => setOpen(true)}>
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} /> : null}
        <Text style={[styles.triggerText, { textAlign: ta, color: selected ? colors.text : colors.textFaint }]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, shadow.floating]} onPress={() => {}}>
            <View style={[styles.sheetHeader, { flexDirection: row }]}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {options.map((o, i) => {
                const active = o.id === selectedId;
                return (
                  <TouchableOpacity
                    key={o.id}
                    style={[styles.row, { flexDirection: row }, i < options.length - 1 && styles.rowBorder]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(o.id);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.rowText, { textAlign: ta, color: active ? colors.primary : colors.text }]}>
                      {o.label}
                    </Text>
                    {active ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : <View style={styles.radio} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  triggerText: { flex: 1, fontSize: font.body, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '70%',
  },
  sheetHeader: { alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sheetTitle: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  row: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, gap: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowText: { flex: 1, fontSize: font.body, fontWeight: '700' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
});
