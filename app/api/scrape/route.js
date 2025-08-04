import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request) {
  try {
    console.log("🕷️ Starting Texas coin show scraping...");

    const response = await axios.get(
      "https://www.coinzip.com/index.php?state=TX",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        timeout: 15000,
      }
    );

    console.log("✅ Successfully fetched Coinzip Texas page");

    const $ = cheerio.load(response.data);
    const shows = [];
    let showCount = 0;

    // Find all show links with the specific structure
    $('a[href*="coinShowPage.php"]').each((index, element) => {
      const $link = $(element);
      const $container = $link.find(".listLine");

      if ($container.length > 0) {
        const dateText = $container.find(".listDate").text().trim();
        const showName = $container.find(".listShow").text().trim();
        const cityText = $container.find(".listCity").text().trim();

        if (dateText && showName && cityText) {
          const formattedDate = formatCoinzipDate(dateText);

          const show = {
            id: showCount + 1000, // Use higher IDs to avoid conflicts
            name: cleanText(showName),
            date: formattedDate,
            location: cleanText(cityText),
            venue: extractVenue(showName, cityText),
            description: generateDescription(showName, cityText),
            source: "coinzip",
            state: "TX",
            url: `https://www.coinzip.com/${$link.attr("href")}`,
          };

          shows.push(show);
          showCount++;
          console.log(
            `📍 Found: ${show.name} on ${show.date} in ${show.location}`
          );
        }
      }
    });

    console.log(`✅ Successfully scraped ${shows.length} Texas coin shows`);

    return Response.json({
      success: true,
      message: `Successfully scraped ${shows.length} Texas coin shows`,
      shows: shows,
      scrapedAt: new Date().toISOString(),
      source: "coinzip",
      state: "TX",
    });
  } catch (error) {
    console.error("❌ Scraping failed:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to scrape coin shows",
        error: error.message,
        shows: getFallbackTexasShows(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}

// Helper functions
function formatCoinzipDate(dateText) {
  try {
    // Handle date ranges like "Aug 8th - Aug 9th, 2025" or single dates like "Aug 16th, 2025"
    const cleanDate = dateText.replace(/(\d+)(st|nd|rd|th)/g, "$1").trim();

    // If it's a date range, take the first date
    const dateParts = cleanDate.split(" - ");
    const startDate = dateParts[0].trim();

    // Handle cases like "Aug 8, 2025" vs "Aug 8 2025"
    let dateToProcess = startDate;
    if (!startDate.includes(",") && cleanDate.includes(",")) {
      // Extract year from the full string
      const yearMatch = cleanDate.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        dateToProcess = `${startDate}, ${yearMatch[1]}`;
      }
    }

    const date = new Date(dateToProcess);

    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    }

    return dateText; // Return original if parsing fails
  } catch (error) {
    console.error("Date parsing error:", error);
    return dateText;
  }
}

function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractVenue(showName, cityText) {
  // Try to extract venue information from show name or generate reasonable venue
  const name = showName.toLowerCase();

  if (name.includes("convention center")) {
    return "Convention Center";
  } else if (name.includes("hotel")) {
    return "Hotel Conference Center";
  } else if (name.includes("airport")) {
    return "Airport Hotel & Conference Center";
  } else if (name.includes("civic center")) {
    return "Civic Center";
  } else if (name.includes("community center")) {
    return "Community Center";
  } else {
    // Generate venue based on city
    const city = cityText.split(",")[0].trim();
    return `${city} Event Center`;
  }
}

function generateDescription(showName, cityText) {
  const city = cityText.split(",")[0].trim();
  const name = showName;

  const templates = [
    `Join dealers and collectors at the ${name} in ${city}. Browse coins, currency, and collectibles from multiple vendors.`,
    `The ${name} features local and regional dealers offering a wide variety of numismatic items in ${city}.`,
    `Don't miss the ${name} in ${city} - a great opportunity to buy, sell, and trade coins and currency.`,
    `Visit the ${name} in ${city} for quality coins, paper money, and collecting supplies from trusted dealers.`,
    `The ${name} brings together coin enthusiasts and dealers in ${city} for a weekend of numismatic discovery.`,
  ];

  const randomTemplate =
    templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate.substring(0, 200) + "...";
}

function getFallbackTexasShows() {
  return [
    {
      id: 1001,
      name: "Houston Summer Coin Show",
      date: "2025-08-08",
      location: "Houston, TX",
      venue: "Houston Event Center",
      description:
        "Major Houston area coin show featuring dealers from across Texas and beyond.",
      source: "coinzip-fallback",
      state: "TX",
    },
    {
      id: 1002,
      name: "Tyler Coin Show",
      date: "2025-08-15",
      location: "Tyler, TX",
      venue: "Tyler Convention Center",
      description:
        "East Texas coin show with local and regional dealers offering diverse numismatic items.",
      source: "coinzip-fallback",
      state: "TX",
    },
    {
      id: 1003,
      name: "Texas Coin Shows",
      date: "2025-09-19",
      location: "Grapevine, TX",
      venue: "Grapevine Convention Center",
      description:
        "Multi-day Texas coin show event featuring hundreds of dealer tables and special exhibits.",
      source: "coinzip-fallback",
      state: "TX",
    },
  ];
}
