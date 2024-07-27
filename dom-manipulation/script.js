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
  {
    text: "I Think therefore I am",
    category: "Philosophy",
  },
];
//load quotes from local storage
function loadQuotes(){
  const storedQuotes=localStorage.getItem('quotes');
  if(storedQuotes){
    quotes=JSON.parse(storedQuotes);
  }
}
//save quotes tolocal storage
function saveQuotes(){
localStorage.setItem('quotes',JSON.stringify(quotes));
}
//show random Quote fun
function showRandomQuote() {
  //math.floor-rounds down
  //math.random() gives a random number between 0 and 1
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var randomQuote = quotes[randomIndex];
  document.getElementById("newQuote").innerText = randomQuote.text;
}

//create random Quote fun
function createAddQuoteForm() {
  const form = `
   
    <div>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
        <input id="newQuoteCategory" type="text" placeholder="Enter a new category"/>
        <button onclick="addQuote()">Add Quote</button>

    </div>`;
  document.getElementById("quoteForm").innerHTML = form;
}

function saveQuotes(){
localStorage.setItem("quotes","JSON.stringify(quotes))");
}
function loadQuotes(){
    const storedQuotes=localStorage.getItem('quotes');
    if(storedQuotes){
        quotes=JSON.parse(storedQuotes);
    }
}