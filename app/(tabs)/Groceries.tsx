import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function GroceriesScreen() {
  const [groceryDone, setGroceryDone] = useState([false, false, false]);
  const [groceryList, setGroceryList] = useState([
    "Milk",
    "Eggs",
    "Bread",
  ]);
  const [newGrocery, setNewGrocery] = useState("");

  function addGrocery() {
    if (newGrocery.trim() === "") return;

    setGroceryList([...groceryList, newGrocery.trim()]);
    setGroceryDone([...groceryDone, false]);
    setNewGrocery("");
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", marginTop: 40 }}>
        Groceries 🛒
      </Text>

      <TextInput
        value={newGrocery}
        onChangeText={setNewGrocery}
        placeholder="Add a grocery item"
        style={{
          marginTop: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={addGrocery}
        style={{
          marginTop: 10,
          padding: 10,
          backgroundColor: "#4CAF50",
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Add Item</Text>
      </TouchableOpacity>

      {groceryList.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            const newDone = [...groceryDone];
            newDone[index] = !newDone[index];
            setGroceryDone(newDone);
          }}
          style={{ marginTop: 10 }}
        >
          <Text
            style={{
              textDecorationLine: groceryDone[index] ? "line-through" : "none",
            }}
          >
            • {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
