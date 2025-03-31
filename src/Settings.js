import React from "react";

const Settings = ({ darkMode, setDarkMode }) => {
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="flex flex-col items-center">
                <button
                    onClick={toggleDarkMode}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                >
                    Toggle {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
