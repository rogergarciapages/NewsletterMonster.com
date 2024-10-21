// src/app/trending/page.tsx

import { Newsletter } from "../../types";
import TrendingPageClient from "../components/trending-page-client";

async function fetchNewsletters() {
  const response = await fetch('http://localhost:3000/api/newsletters/popular?skip=0&take=11', {
    cache: 'no-store', // Ensure fresh data is fetched each time
  });

  if (!response.ok) {
    throw new Error('Failed to fetch newsletters');
  }

  return response.json() as Promise<Newsletter[]>;
}

const TrendingPage = async () => {
  const newsletters = await fetchNewsletters();

  return (
    <div>
      <h1>Trending Newsletters</h1>
      <TrendingPageClient newsletters={newsletters} />
    </div>
  );
};

export default TrendingPage;
