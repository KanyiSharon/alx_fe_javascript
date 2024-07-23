let quotes = [
  { text: "So many books, so little time.", 
    category: "Humor" },
  {
    text: "A room without books is like a body without a soul.",
    category: "Philosophy"
  },
  {
    text: "You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.",
    category: "Love"
  },
  {
    text:"I Think therefore I am",
    category: "Philosophy"
  }
];
//show random Quote fun
function showRandomQuto(){
    //math.floor-rounds down 
    //math.random() gives a random number between 0 and 1
    var randomIndex =Math.floor(Math.random()*quotes.length);
    var randomQuote = quotes[randomIndex];

}

//create random Quote fun
function createAddQuoteForm(){
    const form=`
   
    <div>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote"/>
        <input id="newQuoteCategory" type="text" placeholder="Enter a new category"/>
        <button onclick="addQuote()">Add Quote</button>

    </div>`;
    document.getElementById('quoteForm').innerHTML=form;
}

