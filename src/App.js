import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!task.trim() || !dateTime) {
      alert("Please enter task and date/time");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        dateTime: dateTime,
        completed: false,
      },
    ]);

    setTask("");
    setDateTime("");
  };

  const toggleStatus = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const getCountdown = (dateTime) => {
    const now = new Date();
    const deadline = new Date(dateTime);
    const diff = deadline - now;

    if (diff <= 0) {
      return "Overdue";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const completedTasks = tasks.filter((t) => t.completed);
  const ongoingTasks = tasks.filter(
    (t) =>
      !t.completed &&
      new Date(t.dateTime) > new Date()
  );
  const pendingTasks = tasks.filter(
    (t) =>
      !t.completed &&
      new Date(t.dateTime) <= new Date()
  );

  const renderTasksList = (taskList, isPending = false) => (
    <ul>
      {taskList.map((t) => (
        <li key={t.id}>
          <div>
            <strong>{t.text}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(t.dateTime).toLocaleString()}
              {isPending && (
                <div style={{ fontSize: "11px", color: "#e74c3c", marginTop: "4px", fontWeight: "bold" }}>
                  ⏳ {getCountdown(t.dateTime)}
                </div>
              )}
            </div>
          </div>

          <div>
            <span className={`status ${t.completed ? "done" : "pending"}`}>
              {t.completed ? "Completed" : "Pending"}
            </span>

            <button
              className="toggle-btn"
              onClick={() => toggleStatus(t.id)}
            >
              ✔
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <h2>Task Tracker</h2>

      {/* Task input */}
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      {/* Date & Time input (per task) */}
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
      />

      <button className="add-btn" onClick={addTask}>
        Add Task
      </button>

      {/* Pending Tasks Section */}
      <div className="section">
        <h3 className="section-title">
          ⏰ Pending Tasks ({pendingTasks.length})
        </h3>
        {pendingTasks.length > 0 ? (
          renderTasksList(pendingTasks, true)
        ) : (
          <p className="empty-message">No pending tasks</p>
        )}
      </div>

      {/* Ongoing Tasks Section */}
      <div className="section">
        <h3 className="section-title">
          ⚡ Ongoing Tasks ({ongoingTasks.length})
        </h3>
        {ongoingTasks.length > 0 ? (
          renderTasksList(ongoingTasks)
        ) : (
          <p className="empty-message">No ongoing tasks</p>
        )}
      </div>

      {/* Completed Tasks Section */}
      <div className="section">
        <h3 className="section-title">
          ✓ Completed Tasks ({completedTasks.length})
        </h3>
        {completedTasks.length > 0 ? (
          renderTasksList(completedTasks)
        ) : (
          <p className="empty-message">No completed tasks</p>
        )}
      </div>
    </div>
  );
}

export default App;
