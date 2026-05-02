import React, { useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]); // Array of { id, text }
  const [inputValue, setInputValue] = useState(""); // Input field value
  return <div>TaskList</div>;
}
