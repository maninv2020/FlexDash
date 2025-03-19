import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import inject from "@rollup/plugin-inject";

export default defineConfig({
	server: {
		port: 3000, // Change port if needed
	},
	plugins: [
		tailwindcss(),
		inject({
			$: "jquery", // Automatically import jQuery as $
			jQuery: "jquery", // Allow usage as jQuery too
		}),
	],
});
