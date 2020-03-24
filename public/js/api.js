const BASE_URL = "https://api.football-data.org/v2/";
const API_KEY = "75af84e4748f4c41af93c189a986430a";
const LEAGUE_ID = "2014";

const ENDPOINT_STANDINGS = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
const ENDPOINT_TEAM = `${BASE_URL}teams/`;

// Champions League = 2001
// Liga Jerman = 2002
// Liga Belanda = 2003
// Liga Inggris = 2021
// Liga Spanyol = 2014
// Liga Perancis = 2015

var fetchApi = url => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY
    }
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log("Error :" + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}
function json(response) {
  return response.json();
}
function error(error) {
  console.log("Error : " + error);
}

function showKlasemen(data) {
  var klasemensHTML = "";
  data.standings[0].table.forEach(standings => {
    klasemensHTML += `
    <tr>
        <td>${standings.position}</td>
        <td class="valign-wrapper"><img src="${
      standings.team.crestUrl
      }" width="20"> &nbsp;&nbsp;&nbsp; 
          <a href="./pages/team.html?id=${standings.team.id}">
            <b>${standings.team.name}</b>
          </a>
        </td>
        <td>${standings.playedGames}</td>
        <td>${standings.won}</td>
        <td>${standings.draw}</td>
        <td>${standings.lost}</td>
        <td>${standings.goalsFor}</td>
        <td>${standings.goalsAgainst}</td>
        <td>${standings.goalDifference}</td>
        <td><b>${standings.points}</b></td>
    </tr>
    `;
  });
  document.getElementById("standings").innerHTML = klasemensHTML;
}

function getKlasemen() {
  if ("caches" in window) {
    caches.match(ENDPOINT_STANDINGS).then(response => {
      if (response) {
        response.json().then(data => {
          showKlasemen(data);
        });
      }
    });
  }

  fetchApi(ENDPOINT_STANDINGS)
    .then(status)
    .then(json)
    .then(data => {
      showKlasemen(data);
    })
    .catch(error);
}

function showTeam(data) {
  var detailTeamHTML = `
    <div class="center-align">
    <img src="${data.crestUrl}" width="90">
    <h4 class="black-text"><b>${data.name}</b></h4>
    </div>
    <p class="center-align">
      <small>Address : ${data.address}</small>
      <br>
      <small>Phone : ${data.phone}</small>
      <br>
      <small>Founded : ${data.founded}</small>
      <br>
      <small>Venue : ${data.venue}</small>
    </p>
    <p class="center-align">
      <a href="${data.website}" target="_blank"></i>Official Website</a>
    </p>
`;

  var playersTeamHTML = "";
  data.squad.forEach(data => {
    if (data.role === "PLAYER") {
      playersTeamHTML += `
        
          <div class="card-panel">
            <span class="nama">${data.name}</span><br>
            <span class="position">${data.position}</span>
          </div>
        `;
    }
  });

  document.getElementById("detailTeam").innerHTML = detailTeamHTML;
  document.getElementById("players").innerHTML = playersTeamHTML;
}

function getTeam() {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");

    if ("caches" in window) {
      caches.match(ENDPOINT_TEAM + idParams).then(response => {
        if (response) {
          response.json().then(data => {
            showTeam(data);
            resolve(data);
          });
        }
      });
    }

    fetchApi(ENDPOINT_TEAM + idParams)
      .then(status)
      .then(json)
      .then(data => {
        showTeam(data);
        resolve(data);
      });
  });
}

function showMatch(data) {
  var matchHTML = "";
  data.matches.forEach(match => {
    matchHTML += `
      <div class="card-panel valign-wrapper">
        <div class="col s6">
          <p><b>HOME</b></p>
          <p>${match.homeTeam.name}</p>
          
        </div>
        <div class="col s7">
          <p><b>AWAY</b></p>
          <p> ${match.awayTeam.name}</p>
        </div>
        <div class="col s12 m12">
          <p>${convertDate(new Date(match.utcDate))}</p>
        </div>
      </div>
    `;

  });
  document.getElementById("matches").innerHTML = matchHTML;
}

function getMatch() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParams = urlParams.get("id");

  if ("caches" in window) {
    caches
      .match(ENDPOINT_TEAM + idParams + "/matches?status=SCHEDULED")
      .then(response => {
        if (response) {
          response.json().then(data => {
            showMatch(data);
          });
        }
      });
  }

  fetchApi(ENDPOINT_TEAM + idParams + "/matches?status=SCHEDULED")
    .then(status)
    .then(json)
    .then(data => {
      showMatch(data);
    });
}

function getSavedFavorite() {
  getAllFavorite().then(teams => {
    var favHTML = `<div class="center-align">
        <h4>DAFTAR TEAM FAVORITE</h4>
    </div>`;
    if (teams.length == 0)
      favHTML += `<div class="container">kamu belum punya team favorit<div class="container">`;
    teams.forEach(team => {
      favHTML += `
      <div class="col s4 m4" >
        <div class="card center-align">
          <div class="card-image">
            <img src="${team.crestUrl}" style="padding: 15px; height: 200px;">
          </div>
          <div class="card-content">
            <h5>${team.shortName}</h5>
          </div>
          <div class="card-action">
            <a onclick="deleteOnClick(${team.id})">Hapus</a>
          </div>
        </div>
      </div>`;
    });
    document.getElementById("team-favorite").innerHTML = favHTML;
  });
}

var deleteOnClick = idteam => {
  var confir = confirm("Yakin hapus tim dari daftar favorite?");
  if (confir == true) {
    deleteFavorite(idteam);
  }
};




