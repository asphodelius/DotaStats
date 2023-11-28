// background.js

import config from "./config.js";

const apiUrl = "https://api.stratz.com/graphql";
const bearerToken = config.apiKey;

function makeGraphQLRequest(steamID3) {
  const query = `
    query MyQuery($steamAccountId: Long!) {
      player(steamAccountId: $steamAccountId) {
        steamAccount {
          name 
          isAnonymous 
          seasonRank 
          smurfFlag
          seasonLeaderboardRank
          proSteamAccount {
            isPro
            name
          }
        }
        firstMatchDate
        matchCount 
        winCount 
      }
    }
  `;

  const variables = {
    steamAccountId: steamID3,
  };

  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((data) => processAndSendMessage(data))
    .catch((error) => console.error("GraphQL Error:", error));
}

function processAndSendMessage(data) {
  console.log(data);
  const processedData = processGraphQLData(data);
  sendMessageToContentScript(processedData);
}

function processGraphQLData(data) {
  const playerData = data?.data?.player;

  // Use proSteamAccount name if available, otherwise use playerName
  const playerName =
    (playerData?.steamAccount?.proSteamAccount?.isPro &&
      playerData?.steamAccount?.proSteamAccount?.name) ||
    playerData?.steamAccount?.name ||
    "";

  const processedData = {
    playerName: playerName,
    isPro: playerData?.steamAccount?.proSteamAccount?.isPro || false, // Added isPro field
    isAnonymous: playerData?.steamAccount?.isAnonymous || false,
    seasonRank: playerData?.steamAccount?.seasonRank || "",
    smurfFlag: playerData?.steamAccount?.smurfFlag || false,
    seasonLeaderboardRank:
      playerData?.steamAccount?.seasonLeaderboardRank || "",
    matchCount: playerData?.matchCount || 0,
    winCount: playerData?.winCount || 0,
    firstMatchDate: convertTimestampToDate(playerData?.firstMatchDate),
  };

  processedData.medalImage = getMedalImage(processedData.seasonRank);
  processedData.starImage = getStarImage(processedData.seasonRank);
  processedData.leaderboardMedalImage = getLeaderboardMedalImage(
    processedData.seasonRank,
    processedData.seasonLeaderboardRank
  );

  return processedData;
}

function convertTimestampToDate(timestamp) {
  return timestamp ? new Date(timestamp * 1000) : null;
}

function getMedalImage(seasonRank) {
  return seasonRank === 80
    ? ""
    : `images/ranks/medal_${Math.floor(seasonRank / 10)}.png`;
}

function getStarImage(seasonRank) {
  const parsedSeasonRank = parseInt(seasonRank);
  return parsedSeasonRank &&
    parsedSeasonRank < 80 &&
    parsedSeasonRank % 10 !== 0
    ? `images/ranks/star_${parsedSeasonRank % 10}.png`
    : "";
}

function getLeaderboardMedalImage(seasonRank, seasonLeaderboardRank) {
  const parsedSeasonRank = parseInt(seasonRank);
  const parsedLeaderboardRank = parseInt(seasonLeaderboardRank);

  if (parsedSeasonRank === 80 && !isNaN(parsedLeaderboardRank)) {
    return parsedLeaderboardRank <= 10
      ? "images/ranks/medal_8c.png"
      : parsedLeaderboardRank <= 100
      ? "images/ranks/medal_8b.png"
      : "images/ranks/medal_8.png";
  }

  return "";
}

function sendMessageToContentScript(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, {
        action: "updateDotaStats",
        data: data,
      });
    } else {
      console.error("No active tab found");
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchDotaStats") {
    const steamID3 = Number(request.steamID);
    makeGraphQLRequest(steamID3);
  }
});
