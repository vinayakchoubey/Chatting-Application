import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme); // Apply theme globally
    set({ theme });
  },
}));


document.documentElement.setAttribute("data-theme", localStorage.getItem("chat-theme") || "coffee");
