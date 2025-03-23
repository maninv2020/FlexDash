export function toggleDarkMode() {
    const currentMode = localStorage.getItem("darkMode") === "true";
    const newMode = !currentMode;

    localStorage.setItem("darkMode", newMode);
    document.documentElement.setAttribute("data-theme", newMode ? "dark" : "light");

    if (Alpine?.store("app")) {
        Alpine.store("app").darkMode = newMode;
    }
}
