# Mintgecko 🧊🦎💹

A **crypto dashboard** built with React, Redux Toolkit, and the [CoinGecko API](https://www.coingecko.com/en/api).  
Mintgecko lets you explore real-time market data, track coins, view detailed charts, and manage a personalized watchlist.

!! Mintgecko is still a work in progress !!

---

## 🚀 Features to build

- 🔎 **Market Overview** – Browse top cryptocurrencies with live prices, market cap, and volume.  
- 📊 **Coin Detail Pages** – Price, supply, and interactive historical charts (7/30/90 days).  
- ⭐ **Watchlist** – Add/remove favorite coins, persisted to localStorage.  
- 💱 **Currency Toggle** – Switch between USD and MYR (expandable to other currencies).  
- 🧭 **Sorting & Pagination** – Order by market cap, 24h %, or volume, with paginated results.  
- ⚡ **State Management** – Built with Redux Toolkit slices & async thunks.  
- ✅ **Error Handling** – Graceful loading states, error messages, and retry logic.

---

## 🛠️ Tech Stack

- [React](https://react.dev/) (Vite)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [CoinGecko REST API](https://www.coingecko.com/en/api)  

---

## 📂 Project Structure

to be refined:

```
src/
app/
components/
state/
store.ts

```

---

## ⚙️ Installation & Setup

1. **Clone the repo**
   ``
   git clone https://github.com/yourusername/mintgecko.git
   cd mintgecko
``

2. **Install dependencies**
``npm install``

3. **Create environment file**
`` # .env.local
VITE_COINGECKO_API_KEY=your_api_key_here``

4. **Run the app**
`` npm run dev``

5. **Build for production**
   `` npm run build
   npm run preview``

---

## 🧑‍💻 Roadmap

- Add user authentication (JWT/NextAuth)

- Deploy demo on Vercel

- Dark mode toggle

- Infinite scroll for markets

- Real-time updates via WebSocket

---

## 🙌 Acknowledgements

- CoinGecko API
 for market data

- Redux Toolkit
 for powering state management
