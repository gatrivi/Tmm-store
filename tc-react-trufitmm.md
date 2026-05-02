## 🌱 **Step 1: Basic Implementation**

Let’s break this down into **bite-sized steps**!

---

### 🛠 **Component Setup**

#### 1. **Create the `TaskList` Component**

- Use a functional component.
- Import `useState` from React.

```jsx
import React, { useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Array of { id, text }
  const [inputValue, setInputValue] = useState(""); // Input field value

  return <div>{/* Input field and button go here */}</div>;
};

export default TaskList;
```

---

#### 2. **Add Input Field and Button**

- Create a form with an input field and a button.
- Use `onChange` to track input value.

```jsx
return (
  <div>
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page refresh
        if (inputValue.trim()) {
          // Check if input is not empty
          setTasks([...tasks, { id: Date.now(), text: inputValue }]); // Add task
          setInputValue(""); // Clear input
        }
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add</button>
    </form>
  </div>
);
```

---

### 🛠 **Functionality**

#### 3. **Display Tasks**

- Map over the `tasks` array to render each task.

```jsx
return (
  <div>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (inputValue.trim()) {
          setTasks([...tasks, { id: Date.now(), text: inputValue }]);
          setInputValue("");
        }
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add</button>
    </form>

    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.text}</li>
      ))}
    </ul>
  </div>
);
```

---

#### 4. **Add Tasks (No Duplicates)**

- Before adding a task, check if it already exists.

```jsx
<form
  onSubmit={(e) => {
    e.preventDefault();
    if (inputValue.trim() && !tasks.some((task) => task.text === inputValue)) {
      // Check for duplicates
      setTasks([...tasks, { id: Date.now(), text: inputValue }]);
      setInputValue("");
    }
  }}
>
  {/* Input and button remain the same */}
</form>
```

---

#### 5. **Delete Tasks by ID**

- Add a "Delete" button next to each task.
- Use `filter` to remove the task from the `tasks` array.

```jsx
<ul>
  {tasks.map((task) => (
    <li key={task.id}>
      {task.text}
      <button
        onClick={() => {
          setTasks(tasks.filter((t) => t.id !== task.id)); // Remove task by ID
        }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>
```

---

### 🎯 **Final Code for Step 1**

```jsx
import React, { useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            inputValue.trim() &&
            !tasks.some((task) => task.text === inputValue)
          ) {
            setTasks([...tasks, { id: Date.now(), text: inputValue }]);
            setInputValue("");
          }
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}
            <button
              onClick={() => {
                setTasks(tasks.filter((t) => t.id !== task.id));
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
```

---

### ✅ **What We Achieved**

- A functional `TaskList` component.
- Ability to add tasks (no duplicates).
- Ability to delete tasks by ID.

**Next Step**: Enhance with local storage, validation, and best practices! 🚀
