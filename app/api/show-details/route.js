import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const showUrl = searchParams.get("url");

    if (!showUrl) {
      return Response.json(
        { success: false, message: "Show URL is required" },
        { status: 400 }
      );
    }
    // Validate URL format
    console.log(`🔍 Fetching detailed info for: ${showUrl}`);

    const response = await axios.get(showUrl, {
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
    });

    const $ = cheerio.load(response.data);

    // Extract detailed information
    const details = {
      title: null,
      nextDate: null,
      venue: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      contact: null,
      phone: null,
      email: null,
      website: null,
      time: null,
      description: null,
      futureDates: [],
      dealers: [],
    };

    // Extract show title
    const titleElement = $('.bold.fL[style*="font-size:16px"]');
    if (titleElement.length > 0) {
      details.title = cleanText(titleElement.text());
    }

    // Extract next show date
    const nextDateElement = titleElement.next().find("span");
    if (nextDateElement.length > 0) {
      const nextDateText = nextDateElement.text();
      const dateMatch = nextDateText.match(/Next show:\s*(.+)/);
      if (dateMatch) {
        details.nextDate = cleanText(dateMatch[1]);
      }
    }

    // Extract venue name
    const venueElement = $('.bold.fL.lh15[style*="font-size:15px"]');
    if (venueElement.length > 0) {
      details.venue = cleanText(venueElement.text());
    }

    // Extract address components
    const addressElements = venueElement.siblings(".fL.lh15");
    const addressParts = [];
    addressElements.each((i, el) => {
      const text = cleanText($(el).text());
      if (text && !text.includes("Contact:") && !text.includes("Phone:")) {
        addressParts.push(text);
      }
    });

    if (addressParts.length > 0) {
      details.address = addressParts[0];
      if (addressParts.length > 1) {
        const cityStateZip = addressParts[1];
        const parts = cityStateZip.split(",");
        if (parts.length >= 2) {
          details.city = cleanText(parts[0]);
          const stateZip = cleanText(parts[1]).split(" ");
          if (stateZip.length >= 2) {
            details.state = stateZip[0];
            details.zip = stateZip[1];
          }
        }
      }
    }

    // Extract contact information
    $("div").each((i, el) => {
      const $div = $(el);
      const text = $div.text().trim();

      if (text.includes("Contact:")) {
        const contactDiv = $div.next(".fL.p10L.pt3");
        if (contactDiv.length > 0) {
          details.contact = cleanText(contactDiv.text());
        }
      }

      if (text.includes("Phone:")) {
        const phoneDiv = $div.next(".fL.p10L.pt3");
        if (phoneDiv.length > 0) {
          details.phone = cleanText(phoneDiv.text());
        }
      }
    });

    // Extract website
    const websiteLink = $('a[href*="http"]').first();
    if (websiteLink.length > 0) {
      details.website = websiteLink.attr("href");
    }

    // Extract show times and description
    const showContent = $('.fL[style*="width:100%"]').last();
    if (showContent.length > 0) {
      const contentText = showContent.text();

      // Extract hours
      const timeMatch = contentText.match(/(\d+\s*AM\s*to\s*\d+\s*PM)/i);
      if (timeMatch) {
        details.time = cleanText(timeMatch[1]);
      }

      // Extract description (everything after the time)
      details.description = cleanText(contentText);
    }

    // Extract future dates
    const futureDatesDiv = $('div:contains("Future show dates:")');
    if (futureDatesDiv.length > 0) {
      const datesContainer = futureDatesDiv.parent();
      datesContainer.find(".fL").each((i, el) => {
        const dateText = cleanText($(el).text());
        if (
          dateText &&
          dateText !== "Future show dates:" &&
          dateText.includes("2025")
        ) {
          details.futureDates.push(dateText.replace("•", "").trim());
        }
      });
    }

    // Extract dealers
    $(".dealerSetup").each((i, el) => {
      const dealerName = cleanText($(el).text());
      const dealerLocation = cleanText(
        $(el).siblings(".dealerCitySetup").text()
      );

      if (dealerName && dealerLocation) {
        details.dealers.push({
          name: dealerName,
          location: dealerLocation,
        });
      }
    });

    console.log(`✅ Successfully extracted details for: ${details.title}`);

    return Response.json({
      success: true,
      details: details,
    });
  } catch (error) {
    console.error("❌ Failed to fetch show details:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch show details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function
function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
