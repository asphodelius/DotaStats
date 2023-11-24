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

dotabuffButton.style.backgroundColor = "#fc4801"; 
dotabuffButton.style.color = "white"; 
dotabuffButton.style.border = "none"; 
dotabuffButton.style.padding = "5px 10px"; 
dotabuffButton.style.position = "fixed"; 
dotabuffButton.style.top = "10px"; 
dotabuffButton.style.right = "120px"; 
dotabuffButton.style.cursor = "pointer"; 

dotabuffButton.style.fontFamily = "Arial, sans-serif"; 
dotabuffButton.style.fontWeight = "700"; 
dotabuffButton.style.fontSize = "14px"; 
dotabuffButton.style.lineHeight = "14px"; 
dotabuffButton.style.textTransform = "uppercase"; 

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
stratzButton.style.color = "white"; 
stratzButton.style.border = "none"; 
stratzButton.style.padding = "5px 10px"; 
stratzButton.style.position = "fixed"; 
stratzButton.style.top = "10px"; 
stratzButton.style.right = "30px"; 
stratzButton.style.cursor = "pointer"; 

stratzButton.style.fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'; // Font family
stratzButton.style.fontWeight = "700"; 
stratzButton.style.fontSize = "14px"; 
stratzButton.style.lineHeight = "14px"; 
stratzButton.style.textTransform = "uppercase"; 

stratzButton.onclick = function () {
  if (steamID) {
    window.location.href = `https://www.stratz.com/players/${steamID3}`;
  } else {
    console.error("SteamID3 not found");
  }
};

document.body.appendChild(stratzButton);
