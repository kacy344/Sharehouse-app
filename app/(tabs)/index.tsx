import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [cleanDone, setCleanDone] = useState([false, false, false]);
  const [cleanTasks, setCleanTasks] = useState([
    "Take out the trash",
    "Vacuum living room",
    "Wash dishes",
  ]);

  const [newCleanTask, setNewCleanTask] = useState("");

  function addCleanTask() {
    if (newCleanTask.trim() === "") return;

    setCleanTasks([...cleanTasks, newCleanTask.trim()]);
    setCleanDone([...cleanDone, false]);
    setNewCleanTask("");
  }

  function deleteCleanTask(indexToDelete: number) {
    setCleanTasks(cleanTasks.filter((_, i) => i !== indexToDelete));
    setCleanDone(cleanDone.filter((_, i) => i !== indexToDelete));
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 50 }}>
        Sharehouse
      </Text>

      <Text style={{ fontSize: 22, marginTop: 30 }}>
        🧹 Cleaning
      </Text>

      <TextInput
        value={newCleanTask}
        onChangeText={setNewCleanTask}
        placeholder="Add a cleaning task"
        style={{
          marginTop: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={addCleanTask}
        style={{
          marginTop: 10,
          padding: 10,
          backgroundColor: "#4CAF50",
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Add Task</Text>
      </TouchableOpacity>

      {cleanTasks.map((task, index) => (
        <View
          key={index}
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const newDone = [...cleanDone];
              newDone[index] = !newDone[index];
              setCleanDone(newDone);
            }}
          >
            <Text
              style={{
                textDecorationLine: cleanDone[index] ? "line-through" : "none",
              }}
            >
              • {task}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => deleteCleanTask(index)}
            style={{
              padding: 6,
              backgroundColor: "#FF4D4D",
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "#fff" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
