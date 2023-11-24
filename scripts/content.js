/**
 * Gets steamID from page report popup
 * @returns {string|null} SteamID or null if not found
 */
function getSteamID() {
  const abuseIDElement = document.getElementsByName("abuseID");
  if (abuseIDElement && abuseIDElement[0]) {
    return abuseIDElement[0].value;
  }

  const scriptContent = document.querySelector(
    ".responsive_page_template_content"
  )?.innerHTML;
  if (scriptContent) {
    const steamIDMatch = scriptContent.split("script")[2]?.split('"')[8];
    return steamIDMatch || null;
  }

  return null;
}

const steamID = getSteamID();

function convertSteamID64ToSteamID3(steamID) {
  const base = BigInt("76561197960265728");
  const steamID3 = BigInt(steamID) - base;
  return steamID3.toString();
}

const steamID3 = convertSteamID64ToSteamID3(steamID);

const dotabuffButton = document.createElement("button");
dotabuffButton.textContent = "Dotabuff";

dotabuffButton.style.backgroundColor = "#fc4801"; // Orange background color
dotabuffButton.style.color = "white"; // White text color
dotabuffButton.style.border = "none"; // No border
dotabuffButton.style.padding = "5px 10px"; // Padding
dotabuffButton.style.position = "fixed"; // Fixed position
dotabuffButton.style.top = "10px"; // 10 pixels from the top
dotabuffButton.style.right = "120px"; // 10 pixels from the right
dotabuffButton.style.cursor = "pointer"; // Cursor on hover

dotabuffButton.style.fontFamily = "Arial, sans-serif"; // Font family
dotabuffButton.style.fontWeight = "700"; // Font weight
dotabuffButton.style.fontSize = "14px"; // Font size
dotabuffButton.style.lineHeight = "14px"; // Line height
dotabuffButton.style.textTransform = "uppercase"; // Uppercase text

dotabuffButton.onclick = function () {
  if (steamID) {
    window.location.href = `https://www.dotabuff.com/players/${steamID}`;
  } else {
    console.error("SteamID not found");
  }
};

document.body.appendChild(dotabuffButton);

const stratzButton = document.createElement("button");
stratzButton.textContent = "Stratz";

stratzButton.style.background =
  "linear-gradient(135deg, rgba(10,21,23,1) 0%, rgba(1,145,173,1) 66%, rgba(5,96,113,1) 100%)";
stratzButton.style.color = "white"; // White text color
stratzButton.style.border = "none"; // No border
stratzButton.style.padding = "5px 10px"; // Padding
stratzButton.style.position = "fixed"; // Fixed position
stratzButton.style.top = "10px"; // 10 pixels from the top
stratzButton.style.right = "30px"; // Adjust as needed
stratzButton.style.cursor = "pointer"; // Cursor on hover

stratzButton.style.fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'; // Font family
stratzButton.style.fontWeight = "700"; // Font weight
stratzButton.style.fontSize = "14px"; // Font size
stratzButton.style.lineHeight = "14px"; // Line height
stratzButton.style.textTransform = "uppercase"; // Uppercase text

stratzButton.onclick = function () {
  if (steamID) {
    window.location.href = `https://www.stratz.com/players/${steamID3}`;
  } else {
    console.error("SteamID3 not found");
  }
};

document.body.appendChild(stratzButton);
