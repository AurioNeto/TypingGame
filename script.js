const quotes = [
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
let words = [];
let wordIndex = 0;
let coefIndex = 0;
let startTime = Date.now();
let actualScore;
let actualTime;
let quoteCoef = [98, 53, 170, 57, 45, 65, 88]; 
let state = 0;

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const modalHidder = document.getElementById('modal');

function setScore() {
  let coef = quoteCoef[coefIndex];
  let score = Math.round((coef / actualTime)*100) /100;
  return score;
};

function closeModal() {
  if (modalHidder.className === 'modal'){
    modalHidder.className = 'modal hidden';
    typedValueElement.value = '';
    typedValueElement.setAttribute("disabled", "disabled");
    quoteElement.innerHTML = '';
    state = 0;
  }
};

function startGame() {
  state = 1;
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  coefIndex = quoteIndex;
  const quote = quotes[quoteIndex];
  words = quote.split(' ');
  wordIndex = 0;
  const spanWords = words.map(function(word) { return `<span>${word} </span>`});
  quoteElement.innerHTML = spanWords.join('');
  
  console.log(localStorage.getItem('highscore'));
  if( !localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', 0);
  }
  console.log(localStorage.getItem('highscore'));

  quoteElement.childNodes[0].className = 'highlight';
  messageElement.innerText = '';
  typedValueElement.value = '';
  typedValueElement.removeAttribute("disabled", "disabled");
  typedValueElement.focus();
  startTime = new Date().getTime();
}

document.addEventListener('keydown', (e)=>{ 
  if (e.key == 'Enter' && state === 0) {
    startGame();
  }
});

document.getElementById('start').addEventListener('click', startGame);

typedValueElement.addEventListener('input', () => {
  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;
  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    actualTime = elapsedTime / 1000
    actualScore = setScore();
    if ( actualScore > localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', actualScore);
    };
    const message = `Your score was ${actualScore} letters per second. <br> Your Highscore is ${localStorage.getItem('highscore')} lps`;
    messageElement.innerHTML = message;
    modalHidder.className = 'modal';
  } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord){
      typedValueElement.value = '';
      wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    quoteElement.childNodes[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
      typedValueElement.className = '';
  } else {
     typedValueElement.className = 'error';
  }
});

modalHidder.addEventListener('click', closeModal);
document.addEventListener('keydown', (e)=>{ 
  if (e.key == 'Escape') {
    closeModal();
  }
});