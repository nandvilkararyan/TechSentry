// Utility functions for data formatting and cleaning

/**
 * Removes HTML tags from text
 * @param {string} text - Text that may contain HTML tags
 * @returns {string} - Clean text without HTML tags
 */
export const removeHtmlTags = (text) => {
  if (!text || typeof text !== "string") return text;

  // Decode entities first so encoded tags (e.g. &lt;jats:p&gt;) can be removed safely.
  let cleaned = text;
  for (let i = 0; i < 2; i += 1) {
    cleaned = cleaned
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");
  }

  return cleaned
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Formats input date to YYYY/MM/DD, including compact numeric dates.
 * Supports: ISO date, Date object, YYYYMMDD, YYMMDD, or YYYY.
 * @param {string|number|Date} value
 * @returns {string}
 */
export const formatYearMonthDay = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";

  const raw = String(value).trim();
  if (!raw) return "N/A";

  const pad2 = (num) => String(num).padStart(2, "0");

  // Handle purely numeric compact forms first.
  const digits = raw.replace(/[^0-9]/g, "");

  if (/^[0-9]{8}$/.test(digits)) {
    const yyyy = digits.slice(0, 4);
    const mm = digits.slice(4, 6);
    const dd = digits.slice(6, 8);
    return `${yyyy}/${mm}/${dd}`;
  }

  if (/^[0-9]{6}$/.test(digits)) {
    const yy = Number(digits.slice(0, 2));
    const yyyy =
      yy >= 70 ? `19${digits.slice(0, 2)}` : `20${digits.slice(0, 2)}`;
    const mm = digits.slice(2, 4);
    const dd = digits.slice(4, 6);
    return `${yyyy}/${mm}/${dd}`;
  }

  if (/^[0-9]{4}$/.test(digits)) {
    return `${digits}/01/01`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "Invalid Date";

  return `${parsed.getFullYear()}/${pad2(parsed.getMonth() + 1)}/${pad2(parsed.getDate())}`;
};

/**
 * Formats date in a consistent way
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long'
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = "medium") => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const options = {
      short: { month: "short", day: "numeric", year: "numeric" },
      medium: { month: "short", day: "numeric", year: "numeric" },
      long: { month: "long", day: "numeric", year: "numeric" },
    };

    return dateObj.toLocaleDateString("en-US", options[format]);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

/**
 * Formats date with time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date with time
 */
export const formatDateTime = (date) => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("DateTime formatting error:", error);
    return "Invalid Date";
  }
};

/**
 * Gets year from date
 * @param {string|Date} date - Date to get year from
 * @returns {string} - Year as string
 */
export const getYear = (date) => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return dateObj.getFullYear().toString();
  } catch (error) {
    console.error("Year extraction error:", error);
    return "Invalid Date";
  }
};

/**
 * Formats date in a more readable format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatReadableDate = (date) => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  } catch (error) {
    console.error("Readable date formatting error:", error);
    return "Invalid Date";
  }
};

/**
 * Cleans and formats text content
 * @param {string} text - Text to clean and format
 * @param {number} maxLength - Maximum length (optional)
 * @returns {string} - Cleaned and formatted text
 */
export const cleanText = (text, maxLength = null) => {
  if (!text || typeof text !== "string") return text;

  let cleaned = removeHtmlTags(text);

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Truncate if maxLength is provided
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength) + "...";
  }

  return cleaned;
};

/**
 * Processes word cloud data to ensure proper format
 * @param {Array} words - Word cloud data
 * @returns {Array} - Processed word cloud data
 */
export const processWordCloudData = (words) => {
  if (!Array.isArray(words)) return [];

  return words
    .filter((word) => word && (word.text || word.word))
    .map((word) => ({
      text: removeHtmlTags(word.text || word.word || ""),
      value: word.value || word.frequency || word.size || 1,
      frequency: word.frequency || word.value || word.size || 1,
    }))
    .filter((word) => word.text.length > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 words
};
