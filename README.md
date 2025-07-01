# 🚀 DevLaunchPad

> A powerful collection of development tools built with **React + TypeScript + Vite**, designed to make developers' lives easier and more productive. Clean UI, fast performance, and crafted with 💖.

---

## 🛠️ Tech Stack

- ⚛️ **React 18**
- 💙 **TypeScript**
- ⚡ **Vite**
- 🎨 **Tailwind CSS**
- 🔌 **Socket.IO** (for real-time multiplayer tools like ShipBattle)
- 🧠 **Framer Motion** *(for smooth transitions and animations)*

---

## 📁 Folder Structure

```
/src ├── assets # Images and SVGs
     ├── components # Reusable components
     ├── pages # Route-based pages
     ├── tools # Tool-specific folders
     ├── hooks # Custom hooks
     ├── utils # Utility functions
```

---

## 🎯 Available Tools (5)

| Tool Name         | Description                                              | Status     |
|------------------|----------------------------------------------------------|------------|
| ✅ JSON Formatter | Beautify and minify JSON content                        | Completed  |
| ✅ Color Picker   | Pick colors from image or manually with copy preview    | Completed  |
| ✅ Markdown Editor| Rich markdown editing, copy/export supported            | Completed  |
| ✅ Text Generator | Generate the Text content with desired para/lines       | Completed  |
| ✅ URL Encode/Decoder | Encode and Decode your url from your given url      | Completed  |
| ✅ ShipBattle Game| Real-time guessing game with grid + chat                | Completed  |
| ✅ Collab Chats   | Real-time chat with friends in private room.            | Completed  |

> 💡 More tools coming soon! Follow the journey 🛠️

---

## 📦 Installation

```bash
# Clone the repo
git clone https: https://github.com/akmroyal/Dev-Launch-Pad-Tools-App.git
cd devlaunchpad

# Install dependencies
npm install

# Start the dev server
npm run dev
```
## 🔍 ESLint Setup (Recommended)
Using type-safe strict rules for better code quality:

```
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // ...tseslint.configs.strictTypeChecked, // Optional strict
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

```

## ✨ Features
- Modular structure for scalable tools

- Fully responsive and accessible

- Styled with Tailwind CSS

- Built-in clipboard copy support

- Focus on DX (Developer Experience)

## 🛡 License
MIT © Ashutosh Maurya

---
### Made with 💘 by your favorite TypeScript dev 😎
---
