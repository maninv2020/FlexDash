import $ from "jquery";
import "number-flow";
import { animate, press, easeInOut } from "motion";

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
    progress: {
        duration: 300,
    },
};

// Initialize all features
$(function () {
    buttonPressEffect();
    numberCounter();
    initTabs();
    initProgressBars();
});

$(window).on("load", function () {
    initTabs();
    initProgressBars();
});

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
        const duration = $element.data("duration") || 700;

        if (!number) return;

        if (typeof customElements !== "undefined" && customElements.get("number-flow")) {
            const flowElement = document.createElement("number-flow");
            flowElement.spinTiming = { duration };
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
                    duration,
                    step: function (now) {
                        $(this).text(formatter.format(Math.ceil(now)));
                    },
                },
            );
        }
    });
}

function initTabs() {
    $(".tabs").each(function () {
        const $tabs = $(this);
        const $controls = $tabs.find(".tabs-control");
        const $sections = $tabs.find(".tabs-section");
        const $animatedControl = $tabs.find(".animated-tabs-control");

        // Set initial active tab
        const initialTab = $controls.first().data("tab");
        $controls.first().attr("data-active", "true");
        $sections.filter(`[data-section="${initialTab}"]`).attr("data-active", "true");

        // Position animated control initially
        const initialControl = $controls.first();
        const initialRect = initialControl[0].getBoundingClientRect();
        const tabsBarRect = $tabs.find(".tabs-bar")[0].getBoundingClientRect();

        $animatedControl.css({
            width: initialRect.width,
            left: initialRect.left - tabsBarRect.left,
        });

        // Handle tab switching
        $controls.on("click", function () {
            const tabId = $(this).data("tab");
            const $this = $(this);

            // Update controls
            $controls.attr("data-active", "false");
            $this.attr("data-active", "true");

            // Update sections
            $sections.attr("data-active", "false");
            $sections.filter(`[data-section="${tabId}"]`).attr("data-active", "true");

            // Animate the control
            const rect = this.getBoundingClientRect();
            const tabsBarRect = $tabs.find(".tabs-bar")[0].getBoundingClientRect();

            animate(
                $animatedControl[0],
                {
                    width: rect.width,
                    left: rect.left - tabsBarRect.left,
                },
                {
                    duration: 0.03,
                    easing: easeInOut,
                },
            );
        });
    });
}

// Progress bar animation
function initProgressBars() {
    $(".progress-bar").each(function () {
        const $progressBar = $(this);
        const $fill = $progressBar.find(".progress-bar-fill");
        const targetProgress = parseFloat($fill.data("progress")) || 0;
        const duration = parseFloat($fill.data("duration")) || ANIMATION_CONFIG.progress.duration;
        const isVertical = $progressBar.hasClass("progress-bar-vertical");

        // Animate progress width/height based on orientation
        animate($fill[0], { [isVertical ? "height" : "width"]: `${targetProgress}%` }, { duration: duration / 1000 });

        // Animate stripes if progress-stripes-animated class is present
        if ($fill.hasClass("progress-stripes-animated")) {
            const stripeAnimation = animate(
                $fill[0],
                {
                    backgroundPosition: ["0px 0px", "-16px 0px"],
                },
                {
                    duration: 0.5,
                    repeat: Infinity,
                    easing: "linear",
                },
            );

            // Store animation reference for cleanup if needed
            $fill.data("stripeAnimation", stripeAnimation);
        }
    });
}
