import puppeteer from "puppeteer";

export const FetchInternships = async (req, res) => {
  const { category } = req.query;
  console.log("Requested Category:", category);

  if (!category) return res.status(400).json({ error: "Category is required" });

  const URL = `https://internshala.com/jobs/keywords-${encodeURIComponent(category)}`;

  try {
    console.log(`🚀 Opening category page: ${URL}`);
    const browser = await puppeteer.launch({ headless: "new" }); // 'new' is more stable with Chromium in recent Puppeteer
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "networkidle2" });
    await page.waitForSelector(".individual_internship");

    const internships = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".individual_internship"))
        .map(el => {
          const title = el.querySelector("h3 a")?.innerText.trim();
          if (!title) return null; // skip if title is missing

          return {
            title,
            company: el.querySelector(".company_name")?.innerText.trim() || "Unknown Company",
            location: el.querySelector(".locations span a")?.innerText.trim() || "No Location",
            link: el.querySelector("a")?.href || "No Link",
            logo: el.querySelector(".internship_logo img")?.src || "No Logo",
            duration: el.querySelector(".ic-16-briefcase + span")?.innerText.trim() || "Duration Not Specified",
            stipend: el.querySelector(".ic-16-money + span")?.innerText.trim() || "Unpaid",
          };
        })
        .filter(item => item !== null)
        .slice(0, 15); // limit to first 15 valid internships
    });

    await browser.close();
    res.json(internships);
  } catch (error) {
    console.error("🚨 Error fetching internships:", error.message);
    res.status(500).json({ error: "Failed to fetch internships" });
  }
};
