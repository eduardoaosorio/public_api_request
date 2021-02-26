const galleryDiv = document.querySelector("#gallery");

const apiUrl = "https://randomuser.me/api/?results=12&nat=us";

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.json())
    .then((data) => data.results)
    .catch((err) => console.log("Something went wrong:\n", err));
}

function checkStatus(response) {
  if (response.ok) return Promise.resolve(response);
  else return Promise.reject(new Error(response.statusText));
}

async function displayPeople() {
  try {
    const peopleData = await fetchData(apiUrl);
    for (let person of peopleData) {
      const personDiv = `
      <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
      </div>
      `;
      galleryDiv.insertAdjacentHTML("beforeend", personDiv);
    }
  } catch (err) {
    console.log("Something went wrong:\n", err);
  }
}

displayPeople();
