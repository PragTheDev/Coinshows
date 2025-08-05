import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state") || "TX"; // Default to Texas

    console.log(`🕷️ Starting ${state} coin show scraping...`);

    const response = await axios.get(
      `https://www.coinzip.com/index.php?state=${state}`,
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

    console.log(`✅ Successfully fetched Coinzip ${state} page!`);

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
            id: showCount + 1000,
            name: cleanText(showName),
            title: cleanText(showName), // For the modal
            date: formattedDate,
            location: cleanText(cityText),
            venue: extractVenue(showName, cityText),
            description: `Coin show in ${cleanText(
              cityText
            )} - check Coinzip for full details.`,
            source: "coinzip",
            state: state,
            url: `https://www.coinzip.com/${$link.attr("href")}`,
            // Additional fields for modal (will be populated later if needed)
            nextDate: formattedDate,
            address: null,
            city: cleanText(cityText).split(",")[0],
            zip: null,
            contact: null,
            phone: null,
            email: null,
            website: null,
            time: null,
            futureDates: [],
            dealers: [],
          };

          shows.push(show);
          showCount++;
          console.log(
            `📍 Found: ${show.name} on ${show.date} in ${show.location}`
          );
        }
      }
    });

    console.log(`✅ Successfully scraped ${shows.length} ${state} coin shows!`);
    console.log(`Total shows found: ${showCount}`);

    return Response.json({
      success: true,
      message: `Successfully scraped ${shows.length} ${state} coin shows`,
      shows: shows,
      scrapedAt: new Date().toISOString(),
      source: "coinzip",
      state: state,
    });
  } catch (error) {
    console.error("❌ Scraping failed! :", error);

    return Response.json(
      {
        success: false,
        message: "Failed to scrape coin shows",
        error: error.message,
        shows: [],
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
    const cleanDate = dateText.replace(/(\d+)(st|nd|rd|th)/g, "$1").trim();
    const dateParts = cleanDate.split(" - ");
    const startDate = dateParts[0].trim();

    let dateToProcess = startDate;
    if (!startDate.includes(",") && cleanDate.includes(",")) {
      const yearMatch = cleanDate.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        dateToProcess = `${startDate}, ${yearMatch[1]}`;
      }
    }

    const date = new Date(dateToProcess);

    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return dateText;
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
  const name = showName.toLowerCase();
  const city = cityText.split(",")[0].trim();

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
    return `${city} Event Center`;
  }
}
