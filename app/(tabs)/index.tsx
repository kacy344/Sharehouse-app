import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

/* ---------- Types ---------- */
type Chore = {
  id: string;
  name: string;
  points: number;
  done: boolean;
};

/* ---------- Component ---------- */
export default function HomeScreen() {
  /* Enable animations on Android */
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /* ---------- State ---------- */
  const [chores, setChores] = useState<Chore[]>([
    { id: "1", name: "Fold washing", points: 10, done: false },
    { id: "2", name: "Pack dishwasher", points: 5, done: false },
    { id: "3", name: "Cook dinner", points: 20, done: false },
  ]);

  const [myPoints, setMyPoints] = useState(0);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [displayedDate, setDisplayedDate] = useState(new Date());

  const leaderboard = [
    { name: "You", points: myPoints },
    { name: "Lily", points: 120 },
    { name: "Elle", points: 95 },
  ];

  /* ---------- Calendar logic ---------- */
  const today = new Date();

  const year = displayedDate.getFullYear();
  const month = displayedDate.getMonth();

  const monthName = displayedDate.toLocaleString("default", {
    month: "long",
  });

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  const todayIndex = today.getDay();
  const monday = new Date(today);
  const diff = todayIndex === 0 ? -6 : 1 - todayIndex;
  monday.setDate(today.getDate() + diff);

  const weekDates = weekDays.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthDays: { day: number; current: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    monthDays.push({ day: daysInPrevMonth - i, current: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    monthDays.push({ day: d, current: true });
  }

  /* ---------- Swipe logic ---------- */
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
      Math.abs(gesture.dx) > 20,

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -50) {
        setDisplayedDate(prev => {
          const d = new Date(prev);
          d.setMonth(prev.getMonth() + 1);
          return d;
        });
      }

      if (gesture.dx > 50) {
        setDisplayedDate(prev => {
          const d = new Date(prev);
          d.setMonth(prev.getMonth() - 1);
          return d;
        });
      }
    },
  });

  /* ---------- Storage ---------- */
  useEffect(() => {
    async function loadData() {
      const storedChores = await AsyncStorage.getItem("CHORES");
      const storedPoints = await AsyncStorage.getItem("POINTS");

      if (storedChores) setChores(JSON.parse(storedChores));
      if (storedPoints) setMyPoints(Number(storedPoints));
    }
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("CHORES", JSON.stringify(chores));
  }, [chores]);

  useEffect(() => {
    AsyncStorage.setItem("POINTS", myPoints.toString());
  }, [myPoints]);

  /* ---------- Helpers ---------- */
  function confirmChoreDone(choreId: string) {
    const chore = chores.find(c => c.id === choreId);
    if (!chore) return;

    Alert.alert(
      "Chore completed?",
      `Did you finish "${chore.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => markChoreDone(choreId) },
      ]
    );
  }

  function markChoreDone(choreId: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setChores(prev =>
      prev.map(c =>
        c.id === choreId ? { ...c, done: true } : c
      )
    );

    const completed = chores.find(c => c.id === choreId);
    if (completed) setMyPoints(p => p + completed.points);
  }

  function toggleCalendar() {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    setCalendarExpanded(p => !p);
  }

  function onDatePress(day: number, current: boolean) {
    if (!current) return;
    Alert.alert(
      "Add event",
      `Add event on ${day} ${monthName}?`
    );
  }

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>♥</Text>
          </View>
          <Text style={styles.headerTitle}>ShareHouse</Text>
        </View>

        {/* My Chores */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Chores</Text>

          {chores.filter(c => !c.done).map(chore => (
            <TouchableOpacity
              key={chore.id}
              onPress={() => confirmChoreDone(chore.id)}
              style={styles.choreRow}
            >
              <View style={styles.radio} />
              <Text style={styles.choreText}>{chore.name}</Text>
              <View style={styles.checkBox} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.cardTitle}>Calendar</Text>
              <Text style={styles.monthTitle}>
                {monthName} {year}
              </Text>
            </View>

            <TouchableOpacity
              onPress={toggleCalendar}
              style={styles.calendarToggle}
            >
              <Text style={styles.calendarToggleText}>
                {calendarExpanded ? "▴" : "▾"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Weekday labels */}
          <View style={styles.weekdayRow}>
            {weekDays.map((day, i) => (
              <Text key={i} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Week view */}
          {!calendarExpanded && (
            <View style={styles.calendarRow}>
              {weekDates.map((date, i) => {
                const isToday =
                  date.toDateString() ===
                  today.toDateString();

                return (
                  <View
                    key={i}
                    style={[
                      styles.calendarDay,
                      isToday && styles.calendarToday,
                    ]}
                  >
                    <Text style={styles.calendarDateText}>
                      {date.getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Month view */}
          {calendarExpanded && (
            <View
              style={styles.monthGrid}
              {...panResponder.panHandlers}
            >
              {monthDays.map((item, i) => {
                const isToday =
                  item.current &&
                  item.day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.monthDay,
                      !item.current && styles.monthDayMuted,
                      isToday && styles.calendarToday,
                    ]}
                    onPress={() =>
                      onDatePress(item.day, item.current)
                    }
                  >
                    <Text
                      style={[
                        styles.monthDayText,
                        !item.current &&
                          styles.monthDayTextMuted,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Leaderboard */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leaderboard</Text>

          {[...leaderboard]
            .sort((a, b) => b.points - a.points)
            .map(person => {
              const max = Math.max(
                ...leaderboard.map(p => p.points)
              );
              const width = (person.points / max) * 100;

              return (
                <View key={person.name} style={{ marginTop: 12 }}>
                  <Text style={styles.leaderText}>
                    {person.name} — {person.points} pts
                  </Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${width}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    color: "#2563EB",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calendarToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarToggleText: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },
  monthTitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  weekdayRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  calendarRow: {
    flexDirection: "row",
  },
  calendarDay: {
    flex: 1,
    height: 44,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarToday: {
    borderWidth: 2,
    borderColor: "#2563EB",
  },
  calendarDateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  monthDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  monthDayMuted: {
    backgroundColor: "#F9FAFB",
  },
  monthDayText: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  monthDayTextMuted: {
    color: "#9CA3AF",
  },

  choreRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D1D5DB",
    marginRight: 12,
  },
  choreText: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
  },

  leaderText: {
    fontSize: 14,
    color: "#1C1C1E",
    marginBottom: 6,
  },
  barBg: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 6,
  },
});
