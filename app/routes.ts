import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/market", "routes/market.tsx"),
    route("/portfolio", "routes/portfolio.tsx"),
    route("/news", "routes/news.tsx"),
    route("/exchange", "routes/exchange.tsx"),
] satisfies RouteConfig;
