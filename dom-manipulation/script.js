const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Replace with your mock API URL

// Initial quotes array
let quotes = [
  { text: "So many books, so little time.", category: "Humor" },
  {
    text: "A room without books is like a body without a soul.",
    category: "Philosophy",
  },
  {
    text: "You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.",
    category: "Love",
  },
  { text: "I think therefore I am", category: "Philosophy" },
];

// Fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Load quotes from server and local storage
async function loadQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  localStorage.setItem("serverQuotes", JSON.stringify(serverQuotes));
  quotes = JSON.parse(localStorage.getItem("quotes")) || serverQuotes;
  populateCategories();
  filterQuotes();
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Post new quotes to the server
async function postQuote(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
    const serverQuote = await response.json();
    return serverQuote;
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Periodically fetch new quotes from the server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);
  quotes = mergedQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  notifyUser("Quotes synced with server");
}

// Resolve conflicts by giving precedence to server data
function resolveConflicts(localQuotes, serverQuotes) {
  const serverQuotesMap = new Map(
    serverQuotes.map((quote) => [quote.id, quote])
  );
  const mergedQuotes = localQuotes.map(
    (quote) => serverQuotesMap.get(quote.id) || quote
  );
  return mergedQuotes.concat(
    serverQuotes.filter((quote) => !serverQuotesMap.has(quote.id))
  );
}

// Notify users about updates
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Example of manually resolving conflicts (simple implementation)
function manuallyResolveConflicts(localQuotes, serverQuotes) {
  // Example implementation: user decides which quote to keep
  const resolvedQuotes = [];
  // Add your manual conflict resolution logic here
  return resolvedQuotes;
}

// Populate category filter dropdown
function populateCategories() {
  const categories = Array.from(new Set(quotes.map((quote) => quote.category)));
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem("selectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes(); // Call filterQuotes to apply the last selected category
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = filteredQuotes
    .map((quote) => `<p>${quote.text} - <i>${quote.category}</i></p>`)
    .join("");
}

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = randomQuote.text;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    const serverQuote = await postQuote(newQuote);
    quotes = quotes.map((quote) => (quote === newQuote ? serverQuote : quote));
    saveQuotes();
    populateCategories(); // Reapply filter to include the new quote
    filterQuotes(); // Reapply filter to include the new quote
    showRandomQuote();
    document.getElementById("newQuoteText").value = ""; // Clear the input field
    document.getElementById("newQuoteCategory").value = ""; // Clear the input field
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Create form to add new quotes
function createAddQuoteForm() {
  const form = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
      <input id="newQuoteCategory" type="text" placeholder="Enter a new category"/>
      <button type="button" onclick="addQuote()">Add Quote</button>
    </div>`;
  document.getElementById("quoteForm").innerHTML = form;
}

// Load last viewed quote from session storage
function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    const quote = JSON.parse(lastViewedQuote);
    document.getElementById("quoteDisplay").innerText = quote.text;
  } else {
    showRandomQuote(); // Show a random quote if no last viewed quote is stored
  }
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories(); // Reapply filter to include the new quote
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
function initialize() {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();
  loadLastViewedQuote();
  setInterval(syncQuotes, 60000); // Sync quotes every 60 seconds
}

document.addEventListener("DOMContentLoaded", initialize);
