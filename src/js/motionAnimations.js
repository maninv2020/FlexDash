import { animate, motionValue, press } from "motion";

/**
 * Applies a press animation to button elements.
 */
function applyButtonPressEffect() {
    press(".btn,.pressable,.btn-icon", (element, event) => {
        // Prevent animation if button is disabled
        if (element.disabled || element.classList.contains("loading-btn")) return;

        // Apply button press animation
        animate(element, { scale: 0.95 });

        // Create ripple effect
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        // Get button size and position
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event?.clientX ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
        const y = event?.clientY ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
        const computedStyle = window.getComputedStyle(element);
        const rippleColor = computedStyle.color;

        // Set ripple initial style
        Object.assign(ripple.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            position: "absolute",
            background: rippleColor,
            borderRadius: "50%",
            opacity: "1",
            transform: "scale(0)",
            pointerEvents: "none",
        });

        element.appendChild(ripple);

        // Animate ripple using Motion One
        animate(ripple, { scale: [0, 4], opacity: [0.2, 0] }, { duration: 0.6 }).finished.then(() => {
            ripple.remove();
        });

        // Return to normal scale after press
        return () => animate(element, { scale: 1 });
    });
}

/**
 * Initializes motion-based effects for interactive elements.
 */
export function initMotionEffects() {
    applyButtonPressEffect();
}
