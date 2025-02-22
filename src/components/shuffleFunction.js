// shuffleFunction.js

export default function shuffleArray() {
    let array = [
      "A", "B", "C", "D", "E", "F", 
      "G", "H", "I", "J", "K", ""
    ];
  
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  
    return array;
  }
  