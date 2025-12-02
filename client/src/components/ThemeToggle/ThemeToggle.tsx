import React, { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import { Sun, Moon } from "lucide-react";
import { LS } from "../../utils/storage";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useContext(ThemeContext) as [boolean, (value: boolean) => void];

  const toggleTheme = () => {
    LS.set("theme", !darkMode);
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        darkMode
          ? "hover:bg-slate-700 bg-slate-700 text-yellow-400"
          : "hover:bg-slate-200 bg-slate-100 text-slate-600"
      }`}
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
