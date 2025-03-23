import { toggleDarkMode } from "./themeUtils";

export default function initAlpineStore() {
    Alpine.store("app", {
        darkMode: localStorage.getItem("darkMode") === "true",
        sidebarOpen: true,
        user: {
            name: "John Doe",
            role: "Admin",
        },
        toggleDarkMode,
    });
    console.log("Alpine Store initialized:", Alpine.store("app"));
}
