// FUNCTION DECLARATIONS

/**
 * Makes a get request on specified url and return a promise with data ready to use
 *
 * @param {string} url - random user API url
 * @return {object} Promise, if resolved PromiseResult is an array containing person objects
 */
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.json())
    .then((data) => data.results)
    .catch((err) => console.log("Something went wrong:\n", err));
}

/**
 * Helper function for fetchData, checks if response was successful
 *
 * @param {object} response - response promise
 * @return {object} Promise, if resolved PromiseResult is an object
 */
function checkStatus(response) {
  if (response.ok) return Promise.resolve(response);
  else return Promise.reject(new Error(response.statusText));
}

/**
 *  Displays person cards, and adds click event listeners on each card
 *
 * @param {array} peopleData - Array containing person objects
 */
function displayPeople(peopleData) {
  const galleryDiv = document.querySelector("#gallery");
  galleryDiv.innerHTML = "";
  for (let i = 0; i < peopleData.length; i++) {
    const personDiv = `
      <div class="card" data-person-index="${i}">
        <div class="card-img-container">
            <img class="card-img" src="${peopleData[i].picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${peopleData[i].name.first} ${peopleData[i].name.last}</h3>
            <p class="card-text">${peopleData[i].email}</p>
            <p class="card-text cap">${peopleData[i].location.city}, ${peopleData[i].location.state}</p>
        </div>
      </div>
      `;
    galleryDiv.insertAdjacentHTML("beforeend", personDiv);
    const currentCard = document.querySelectorAll(".card")[i];
    currentCard.addEventListener("click", (e) => {
      displayModal(peopleData, i);
      enableModalButtons(peopleData);
    });
  }
}

/**
 * Displays modal
 *
 * @param {array} peopleData - Array containing person objects
 * @param {number} personIndex - index of the person object to be displayed in modal (index according to peopleData)
 */
function displayModal(peopleData, personIndex) {
  const galleryDiv = document.querySelector("#gallery");
  let modalHtml = `
  <div class="modal-container" data-person-index="${personIndex}">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">&#215;</button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
              peopleData[personIndex].picture.large
            }" alt="profile picture">
            <h3 id="name" class="modal-name cap">${
              peopleData[personIndex].name.first
            } ${peopleData[personIndex].name.last}</h3>
            <p class="modal-text">${peopleData[personIndex].email}</p>
            <p class="modal-text cap">${
              peopleData[personIndex].location.city
            }</p>
            <hr>
            <p class="modal-text">${peopleData[personIndex].cell.replace(
              "-",
              " "
            )}</p>
            <p class="modal-text">${
              peopleData[personIndex].location.street.number
            } ${peopleData[personIndex].location.street.name}., ${
    peopleData[personIndex].location.city
  }, ${peopleData[personIndex].location.state} ${
    peopleData[personIndex].location.postcode
  }</p>
            <p class="modal-text">Birthday: ${peopleData[
              personIndex
            ].dob.date.replace(/(\d{4})-(\d{2})-(\d{2}).*/, "$2/$3/$1")}</p>
        </div>
    </div> 
  `;
  // Conditional to add navigation buttons on modal if needed
  if (galleryDiv.childElementCount !== 1) {
    modalHtml += `<div class="modal-btn-container">`;
    if (personIndex === 0) {
      modalHtml += `
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      `;
    } else if (personIndex === peopleData.length - 1) {
      modalHtml += `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      `;
    } else {
      modalHtml += `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      `;
    }
    modalHtml += `</div>`;
  }
  modalHtml += `</div>`;
  galleryDiv.insertAdjacentHTML("afterend", modalHtml);
}

/**
 * Enables modal buttons' functionality
 *
 * @param {array} peopleData - Array containing person objects
 */
function enableModalButtons(peopleData) {
  const modalContainerDiv = document.querySelector(".modal-container");
  modalContainerDiv.addEventListener("click", (e) => {
    if (e.target.id === "modal-close-btn") {
      modalContainerDiv.remove();
    } else if (e.target.id === "modal-prev") {
      const personIndex = +e.target.parentElement.parentElement.getAttribute(
        "data-person-index"
      );
      for (let i = 0; i < peopleData.length; i++) {
        if (i === personIndex) {
          modalContainerDiv.remove();
          displayModal(peopleData, i - 1);
          enableModalButtons(peopleData);
        }
      }
    } else if (e.target.id === "modal-next") {
      const personIndex = +e.target.parentElement.parentElement.getAttribute(
        "data-person-index"
      );
      for (let i = 0; i < peopleData.length; i++) {
        if (i === personIndex) {
          modalContainerDiv.remove();
          displayModal(peopleData, i + 1);
          enableModalButtons(peopleData);
        }
      }
    }
  });
}

/**
 * Searches people, creates and inserts people card elements according to search results
 *
 * @param {object} searchInput - Search bar input element
 * @param {array} peopleData - Array containing person objects
 */
function searchPeople(searchInput, peopleData) {
  const matchesFound = [];
  if (searchInput.value !== "") {
    for (let i = 0; i < peopleData.length; i++) {
      const personFullName = `${peopleData[i].name.first} ${peopleData[i].name.last}`;
      if (
        personFullName.toLowerCase().includes(searchInput.value.toLowerCase())
      ) {
        matchesFound.push(peopleData[i]);
      }
    }
    if (matchesFound.length === 0) {
      document.querySelector("#gallery").innerHTML = `
      <div class="card">
            <h3 class="card-name cap">No matches found</h3>
      </div>
      `;
    } else {
      displayPeople(matchesFound);
    }
  } else {
    displayPeople(peopleData);
  }
}

// START OF DOM MANIPULATION

const apiUrl = "https://randomuser.me/api/?results=12&nat=us";

// Add search bar using JavaScript when the page loads
document.querySelector(".search-container").insertAdjacentHTML(
  "beforeend",
  `
  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <button type="button" id="search-submit" class="search-submit">&#x1F50D;</button>
  </form>
`
);

// async IIFE to easily pass allPeopleData to functions that need it
(async () => {
  const allPeopleData = await fetchData(apiUrl);

  displayPeople(allPeopleData);

  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", () => {
    searchPeople(searchInput, allPeopleData);
  });
})();
