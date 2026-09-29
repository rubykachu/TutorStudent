import { HomeScreen } from "./home-screen";

// Progress lives in the browser (IndexedDB), so the home screen renders on
// the client from the static content index.
export default function HomePage() {
  return <HomeScreen />;
}
