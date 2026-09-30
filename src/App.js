
import { getTrending } from "./api/tmdb";

export default function App() {
  getTrending()
    .then((r) => console.log(r.data.results[0]))
    .catch((e) => console.log("Error:", e.message));
  return <h1 style={{ color: "red" }}>Test</h1>;
}

