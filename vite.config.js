import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	server: {
		port: 3000, // Change port if needed
	},
	plugins: [tailwindcss()],
});
