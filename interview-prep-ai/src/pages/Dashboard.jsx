import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RoleCard from "../components/RoleCard";
import FloatingAddButton from "../components/FloatingAddButton";
import CreateSessionModal from "../components/CreateSessionModal";
import CreateSessionModalAddNew from "../components/CreateSessionModalAddNew";
import { useTheme } from "../context/themeContext";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { theme } = useTheme();
  const [customRoles, setCustomRoles] = useState([]);

  // Load custom roles
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customRoles") || "[]");
    setCustomRoles(saved);
  }, []);

  // Save role click to history
  const saveToHistory = (role) => {
    const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
    history.unshift({
      id: role.id || role._id || "",
      role: role.title,
      experience: role.exp?.replace(" Years", ""),
      topics: role.desc,
      date: Date.now(),
    });
    localStorage.setItem("sessionHistory", JSON.stringify(history));
  };

  // Delete custom role
  const deleteRole = (index) => {
    let saved = JSON.parse(localStorage.getItem("customRoles") || "[]");
    saved.splice(index, 1);
    localStorage.setItem("customRoles", JSON.stringify(saved));
    setCustomRoles(saved);
  };

  const defaultRoles = [
    {
      code: "FD",
      title: "Frontend Developer",
      desc: "React.js, DOM manipulation, CSS Flexbox",
      exp: "2 Years",
      updated: "30th Apr 2025",
      bg: "#e9f7f5",
    },
    {
      code: "BD",
      title: "Backend Developer",
      desc: "Node.js, Express, REST APIs, MongoDB",
      exp: "3 Years",
      updated: "1st May 2025",
      bg: "#fdf3d8",
    },
    {
      code: "FS",
      title: "Full Stack Developer",
      desc: "MERN stack, deployment strategies",
      exp: "4 Years",
      updated: "30th Apr 2025",
      bg: "#e9f0ff",
    },
    {
      code: "DA",
      title: "Data Analyst",
      desc: "SQL, Excel, Visualization, Power BI",
      exp: "2 Years",
      updated: "30th Apr 2025",
      bg: "#ffe9e5",
    },
    {
      code: "DE",
      title: "DevOps Engineer",
      desc: "CI/CD, Docker, Kubernetes, AWS",
      exp: "5 Years",
      updated: "30th Apr 2025",
      bg: "#e9f0ff",
    },
    {
      code: "AI",
      title: "AI/ML Engineer",
      desc: "Python, ML, NLP, deployment",
      exp: "1 Year",
      updated: "30th Apr 2025",
      bg: "#eaffea",
    },
  ];

  const markedCustomRoles = customRoles.map((r) => ({
    ...r,
    isCustom: true,
  }));

  const roles = [...defaultRoles, ...markedCustomRoles];

  return (
    <Fragment>
      <Navbar />

      <div
        style={{
          padding: "10px 40px",
          background: "var(--bg)",
          minHeight: "100vh",
          transition: "background 0.35s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: "28px",
            paddingBottom: "50px",
          }}
        >
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              role={role}
              onClick={() => {
                saveToHistory(role);
                setSelectedRole(role);
                setOpenModal("role");
              }}
              onDelete={
                role.isCustom
                  ? () => deleteRole(index - defaultRoles.length)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {openModal === "role" && selectedRole && (
        <CreateSessionModal role={selectedRole} close={() => setOpenModal(null)} />
      )}

      {openModal === "add" && (
        <CreateSessionModalAddNew close={() => setOpenModal(null)} />
      )}

      <FloatingAddButton onClick={() => setOpenModal("add")} />
    </Fragment>
  );
};

export default Dashboard;