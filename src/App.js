import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "Low" });
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Due Date");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", description: "", dueDate: "", priority: "Low" });
  };

  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [movedItem] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, movedItem);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "Due Date") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sort === "Priority") return ["Low", "Medium", "High"].indexOf(a.priority) - ["Low", "Medium", "High"].indexOf(b.priority);
    return 0;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`task-manager ${darkMode ? "dark" : ""}`}>
        <h2>Task Manager</h2>
        <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>
        <div className="controls">
          <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
          <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="filters">
          <select onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)}>
            <option>Due Date</option>
            <option>Priority</option>
          </select>
        </div>
        <ul>
          {sortedTasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} moveTask={moveTask} toggleComplete={toggleComplete} deleteTask={deleteTask} />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
};

const Task = ({ task, index, moveTask, toggleComplete, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  return (
    <li ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
      <span>{task.title} - {task.priority} - {task.dueDate}</span>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default App;
