// content.js

function getSteamID() {
  const abuseIDElement = document.querySelector('[name="abuseID"]');
  if (abuseIDElement) {
    return abuseIDElement.value;
  }

  const scriptContent = document.querySelector(
    ".responsive_page_template_content"
  )?.innerHTML;
  if (scriptContent) {
    const steamIDMatch = scriptContent.match(/"steamid":"(\d+)"/);
    return steamIDMatch?.[1] || null;
  }

  return null;
}

const steamID = getSteamID();
const steamID3 = BigInt(steamID) - BigInt("76561197960265728");

chrome.runtime.sendMessage({
  action: "fetchDotaStats",
  steamID: steamID3.toString(),
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "updateDotaStats") {
    updateDotaStatsDOM(message.data);
  }
});

function updateDotaStatsDOM(data) {
  const medalImage = data.seasonLeaderboardRank
    ? ""
    : chrome.runtime.getURL(data.medalImage);
  const leaderboardMedalImage = data.seasonLeaderboardRank
    ? chrome.runtime.getURL(data.leaderboardMedalImage)
    : null;

  const customize =
    document.querySelector(".profile_customization_area") ||
    document.querySelector(".profile_leftcol");

  const winRate =
    data.matchCount > 0 ? (data.winCount / data.matchCount) * 100 : 0;

  let starImage =
    data.seasonRank !== "80" && !data.seasonLeaderboardRank && data.starImage
      ? chrome.runtime.getURL(data.starImage)
      : "";

  const textNode = document.createElement("div");
  textNode.id = "dotastats";
  textNode.innerHTML = `
    <div class="profile_customization">
      <div class="profile_customization_header">Dota 2 Stats</div>
      <div class="profile_customization_block">
        <div class="favoritegroup_showcase">
          <div class="showcase_content_bg">
            <div class="dotastats_content favoritegroup_showcase_group showcase_slot">                  
              <div class="favoritegroup_content">
                <div class="dotastats_namerow favoritegroup_namerow ellipsis " >
                  <a href="https://stratz.com/players/${steamID3}" class="favoritegroup_name whiteLink" target="_blank">
                    ${data.playerName}
                  </a>
                  <br>
                  <span class="dotastats_description favoritegroup_description">
                    ${
                      data.isAnonymous
                        ? '<span class="dotastats_anon"></span>Anonymous'
                        : ""
                    }
                  </span>
                  ${
                    starImage
                      ? `<img src="${starImage}" alt="Star Image" class="custom-star-image" style="left: 264px;">`
                      : ""
                  }
                  <br>
                  <span class="dotastats_description favoritegroup_description leaderboard-rank">
                    ${
                      data.seasonLeaderboardRank
                        ? `${data.seasonLeaderboardRank}`
                        : ""
                    }
                  </span>
                </div>
                <div class="dotastats_stats_block">
                  <div class="dotastats_stats_row2 favoritegroup_stats showcase_stats_row">
                    ${
                      medalImage
                        ? `<div class="dotastats_stat showcase_stat favoritegroup_online">
                      <div class="value">
                        <img class="medal-image" src="${medalImage}" alt="Medal Image">
                      </div>
                    </div>`
                        : ""
                    }
                    ${
                      leaderboardMedalImage
                        ? `<div class="dotastats_stat showcase_stat favoritegroup_online">
                      <div class="value">
                        <img class="leaderboard-medal-image" src="${leaderboardMedalImage}" alt="Leaderboard Medal Image">
                      </div>
                    </div>`
                        : ""
                    }
                    <div class="dotastats_stat showcase_stat favoritegroup_online">
                      <div class="value" style="color:${"yellow"};">${
    data.matchCount
  }</div>
                      <div class="label">Matches</div>
                    </div>
                    <div class="dotastats_stat showcase_stat favoritegroup_online">
                      <div class="value" style="color: ${
                        winRate < 50 ? "red" : "green"
                      };">${winRate.toFixed(2)}%</div>
                      <div class="label">Win Rate</div>
                    </div>
                    <div class="dotastats_stat showcase_stat favoritegroup_online">
                      <div class="value">
                        ${
                          data.firstMatchDate
                            ? new Date(data.firstMatchDate).toLocaleDateString()
                            : "N/A"
                        }
                      </div>
                      <div class="label">First Match Date</div>
                    </div>
                    <br>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const existingNode = document.getElementById("dotastats");
  if (existingNode) {
    existingNode.innerHTML = textNode.innerHTML;
  } else {
    customize.prepend(textNode);
  }
}
