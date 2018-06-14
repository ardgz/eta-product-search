document.getElementById("searchBtn").addEventListener("click", searchDatabase);

function searchDatabase() {
  const criteriaValue = document.getElementById("criteria").value;
  const queryValue = document.getElementById("searchQuery").value;
  const url = 'http://localhost:3000';
  const data = {criteria: criteriaValue, query: queryValue};
  searchQuery(url, data);
}

function searchQuery(url, data) {
  return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(response => {
        let data = JSON.parse(response);
        outputResults(data);
      });
}

function outputResults(searchResults) {
  // Clear previous generated tables
  document.getElementById("results").innerHTML = '';

  // If search results has at least one entry
  if (searchResults.length > 0) {
    // Retrieve header names from results
    let firstEntry = searchResults[0];
    let headerLabelArray = Object.keys(searchResults[0]);
    
    // Remove MongoDB _Id header
    headerLabelArray.splice(0, 1);
    
    // Start creation of results table
    let table = document.createElement('table');

    // Create Header row of table
    let headerRow = table.insertRow();
    for(header of headerLabelArray) {
      headerRow.insertCell().textContent = header;
    }

    // Create rest of the rows of the table
    for(let i = 0; i < searchResults.length; i++) {
      let tableRow = table.insertRow();
      tableRow.insertCell().textContent = searchResults[i].ID;
      tableRow.insertCell().textContent = searchResults[i].Description;
      tableRow.insertCell().textContent = searchResults[i].lastSold;
      tableRow.insertCell().textContent = searchResults[i].ShelfLife;
      tableRow.insertCell().textContent = searchResults[i].Department;
      tableRow.insertCell().textContent = searchResults[i].Price;
      tableRow.insertCell().textContent = searchResults[i].Unit;
      tableRow.insertCell().textContent = searchResults[i].xFor;
      tableRow.insertCell().textContent = searchResults[i].Cost;
    }

    // Add generated table onto HTML page
    document.getElementById("results").appendChild(table);
  }
  else {
    // Create a div with a message that no results were found
    let divElement = document.createElement('div');
    divElement.setAttribute('class', 'noMatches');
    const noResultsMesssage = document.createTextNode('No matching entries found in database.');
    divElement.appendChild(noResultsMesssage);
    document.getElementById("results").appendChild(divElement);
  }
}