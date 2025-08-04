import axios from "axios";
import * as cheerio from "cheerio";

class CoinzipScraper {
  constructor() {
    this.baseUrl = "https://coinzip.com";
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };
  }

  // Scrape the main coinzip homepage for coin shows
  async scrapeHomepage() {
    try {
      console.log("🕷️ Scraping Coinzip homepage...");
      const response = await axios.get(this.baseUrl, { headers: this.headers });
      const $ = cheerio.load(response.data);

      const shows = [];
      let showCount = 0;

      // Look for coin show links and data
      $('a[href*="coinShowPage.php"]').each((index, element) => {
        const $link = $(element);
        const href = $link.attr("href");
        const text = $link.text().trim();

        if (text && text.length > 10) {
          // Filter out empty or very short links
          // Extract show info from the link text
          const match = text.match(/^(.*?)\s+(.+?)$/);
          if (match) {
            const dateText = match[1];
            const nameAndLocation = match[2];

            // Try to extract location (usually last part after last space)
            const locationMatch = nameAndLocation.match(
              /^(.*?)\s+([A-Z]{2}|[A-Za-z\s]+,\s*[A-Z]{2})$/
            );

            const show = {
              id: showCount + 1,
              name: locationMatch ? locationMatch[1].trim() : nameAndLocation,
              date: this.parseDate(dateText),
              location: locationMatch
                ? locationMatch[2].trim()
                : "Location TBD",
              venue: "Details available on site",
              description: `Coin show event - visit Coinzip for full details`,
              source: "coinzip",
              sourceUrl: href.startsWith("http")
                ? href
                : `${this.baseUrl}/${href}`,
              scrapedAt: new Date().toISOString(),
            };

            // Only add if we have a reasonable name and date
            if (show.name.length > 3 && show.date) {
              shows.push(show);
              showCount++;
            }
          }
        }
      });

      console.log(`✅ Scraped ${shows.length} shows from Coinzip homepage`);
      return shows;
    } catch (error) {
      console.error("❌ Error scraping Coinzip homepage:", error.message);
      return [];
    }
  }

  // Parse date strings from Coinzip format
  parseDate(dateStr) {
    try {
      // Handle formats like "Aug 8th - Aug 9th, 2025" or "Aug 10th, 2025"
      const currentYear = new Date().getFullYear();

      // Extract first date from range
      const dateMatch = dateStr.match(
        /([A-Za-z]+)\s+(\d+)(?:st|nd|rd|th)?.*?(\d{4})/
      );
      if (dateMatch) {
        const [, month, day, year] = dateMatch;
        const monthNum = this.getMonthNumber(month);
        if (monthNum !== -1) {
          return `${year}-${monthNum
            .toString()
            .padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
      }

      // Fallback: try to extract any valid date
      const fallbackMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (fallbackMatch) {
        const [, month, day, year] = fallbackMatch;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      return null;
    } catch (error) {
      console.warn("⚠️ Could not parse date:", dateStr);
      return null;
    }
  }

  // Convert month name to number
  getMonthNumber(monthName) {
    const months = {
      jan: 1,
      january: 1,
      feb: 2,
      february: 2,
      mar: 3,
      march: 3,
      apr: 4,
      april: 4,
      may: 5,
      jun: 6,
      june: 6,
      jul: 7,
      july: 7,
      aug: 8,
      august: 8,
      sep: 9,
      september: 9,
      oct: 10,
      october: 10,
      nov: 11,
      november: 11,
      dec: 12,
      december: 12,
    };
    return months[monthName.toLowerCase()] || -1;
  }

  // Scrape specific coin show page for detailed info
  async scrapeShowDetails(showUrl) {
    try {
      const fullUrl = showUrl.startsWith("http")
        ? showUrl
        : `${this.baseUrl}/${showUrl}`;
      const response = await axios.get(fullUrl, { headers: this.headers });
      const $ = cheerio.load(response.data);

      // Extract detailed information from the show page
      const details = {
        venue: "",
        address: "",
        hours: "",
        admission: "",
        contact: "",
        website: "",
        description: "",
      };

      // Look for common patterns in show pages
      const pageText = $("body").text();

      // Extract venue info
      const venueMatch = pageText.match(/venue[:\s]+([^\n]+)/i);
      if (venueMatch) details.venue = venueMatch[1].trim();

      // Extract hours
      const hoursMatch = pageText.match(/hours?[:\s]+([^\n]+)/i);
      if (hoursMatch) details.hours = hoursMatch[1].trim();

      // Extract admission
      const admissionMatch = pageText.match(/admission[:\s]+([^\n]+)/i);
      if (admissionMatch) details.admission = admissionMatch[1].trim();

      return details;
    } catch (error) {
      console.warn("⚠️ Could not scrape show details:", error.message);
      return {};
    }
  }

  // Main scraping method
  async scrapeAll() {
    console.log("🚀 Starting Coinzip scraping...");
    const shows = await this.scrapeHomepage();

    // Optionally enhance with detailed info (commented out for performance)
    // for (let i = 0; i < Math.min(shows.length, 5); i++) {
    //   const details = await this.scrapeShowDetails(shows[i].sourceUrl);
    //   shows[i] = { ...shows[i], ...details };
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    // }

    return shows;
  }
}

export default CoinzipScraper;
