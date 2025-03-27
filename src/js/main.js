// Dark Mode Persistence on Loadz
if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
}
// Import main stylesheet
import "../styles/main.css";
// Import Alpine.js (a lightweight JavaScript framework for declarative UI)
import Alpine from "alpinejs";
// Import Alpine Store
import initAlpineStore from "./alpineStore";
// Import motion animations
import { initMotionEffects } from "./motionAnimations";
// Import NumberFlow
import "number-flow";

// Make Alpine globally accessible
window.Alpine = Alpine;

// Wait for Alpine to initialize before setting up the global store
document.addEventListener("alpine:init", () => {
    /**
     * Initialize a global store in Alpine.js
     */
    initAlpineStore();
});

// Initialize motion animations
initMotionEffects();

Alpine.start();
