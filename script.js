async function loadFlashcards() {
    const response = await fetch("http://127.0.0.1:8000/cards");
    const cards = await response.json();
  
    const container = document.getElementById("cards");
    container.innerHTML = "";
  
    cards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";
      let flipped = false;
      div.innerText = card.side1;
  
      div.addEventListener("click", () => {
        div.innerText = flipped ? card.side1 : card.side2;
        flipped = !flipped;
      });
  
      container.appendChild(div);
    });
  }
  
  loadFlashcards();

