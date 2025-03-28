import $ from "jquery";
import "number-flow";
import { animate, press } from "motion";

// Animation configurations
const ANIMATION_CONFIG = {
    button: {
        scale: 0.95,
        duration: 0.6,
        ripple: {
            scale: [0, 4],
            opacity: [0.2, 0],
        },
    },
    number: {
        duration: 700,
    },
};

// Utility functions
const createRipple = (element, event) => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event?.clientX ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
    const y = event?.clientY ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
    const computedStyle = window.getComputedStyle(element);
    const rippleColor = computedStyle.color;

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

    return ripple;
};

// Button press effect
function buttonPressEffect() {
    press(".btn,.pressable,.btn-icon", (element, event) => {
        if (element.disabled || element.classList.contains("loading-btn")) return;

        // Apply button press animation
        animate(element, { scale: ANIMATION_CONFIG.button.scale });

        // Create and animate ripple
        const ripple = createRipple(element, event);
        element.appendChild(ripple);

        animate(ripple, ANIMATION_CONFIG.button.ripple, {
            duration: ANIMATION_CONFIG.button.duration,
        }).finished.then(() => ripple.remove());

        // Return to normal scale after press
        return () => animate(element, { scale: 1 });
    });
}

// Number counter with fallback
function numberCounter() {
    $(".number-flow").each(function () {
        const $element = $(this);
        const number = parseFloat($element.data("number"));
        const style = $element.data("style") || "decimal";
        const currency = $element.data("currency") || "USD";
        const notation = $element.data("notation") || "standard";

        if (!number) return;

        if (typeof customElements !== "undefined" && customElements.get("number-flow")) {
            const flowElement = document.createElement("number-flow");
            flowElement.spinTiming = { duration: ANIMATION_CONFIG.number.duration };
            flowElement.format = { style, currency, notation };
            flowElement.locales = "en-US";
            $element.replaceWith(flowElement);
            requestAnimationFrame(() => {
                flowElement.update(0);
                flowElement.update(number);
            });
        } else {
            const formatter = new Intl.NumberFormat("en-US", {
                style,
                currency,
                notation,
            });

            $element.prop("counter", 0).animate(
                { counter: number },
                {
                    duration: ANIMATION_CONFIG.number.duration,
                    step: function (now) {
                        $(this).text(formatter.format(Math.ceil(now)));
                    },
                },
            );
        }
    });
}

// Initialize all features
$(function () {
    buttonPressEffect();
    numberCounter();
});
