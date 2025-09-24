async function loadFlashcards() {
    const colors = ["#9eccf0", "#f5c8c4", "#f59c9a", "#ffbe98", "#ffe7ab", "#c5dba9"];
    let col = 0;

    const response = await fetch("http://127.0.0.1:8000/cards");
    const cards = await response.json();
  
    const container = document.getElementById("cards");
    container.innerHTML = "";
  
    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.backgroundColor = colors[col];
        col = (col + 1) % colors.length;
    
        const side1 = document.createElement("div");
        side1.className = "side1";
        side1.innerText = card.side1;
    
        const side2 = document.createElement("div");
        side2.className = "side2";
        side2.innerText = card.side2;
        side2.style.display = "none";
    
        let flipped = false;
    
        div.addEventListener("click", () => {
            if (flipped) {
                side1.style.display = "block";
                side2.style.display = "none";
            } else {
                side1.style.display = "none";
                side2.style.display = "block";
            }
            flipped = !flipped;
        });
    
        const del_btn = document.createElement("button");
        del_btn.className = "delete-button";
    
        del_btn.addEventListener("click", async (e) => {
            e.stopPropagation(); 
            await fetch(`http://127.0.0.1:8000/card/${card.id}`, {
                method: "DELETE"
            });
            div.remove();
        });

        const edit_btn = document.createElement("button");
        edit_btn.className = "edit-button";

        edit_btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const edit_side1 = prompt("Edit Side 1:", card.side1);
            const edit_side2 = prompt("Edit Side 2:", card.side2);

            if (edit_side1 === null || edit_side2 === null) return;

            await fetch(`http://127.0.0.1:8000/card/${card.id}`, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }, body: JSON.stringify({
                    side1: edit_side1,
                    side2: edit_side2
                })
            })

            loadFlashcards();
        });
    
        div.appendChild(side1);
        div.appendChild(side2);
        div.appendChild(del_btn); 
        div.appendChild(edit_btn); 
        container.appendChild(div);
    });
}

loadFlashcards();

document.getElementById("addCardBtn").addEventListener("click", async () => {
    const new_side1 = document.getElementById("addSide1").value;
    const new_side2 = document.getElementById("addSide2").value;

    await fetch(`http://127.0.0.1:8000/card`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
            }, body: JSON.stringify({
                side1: new_side1,
                side2: new_side2
            })
        });

    document.getElementById("addSide1").value = "";
    document.getElementById("addSide2").value = "";

    loadFlashcards();
    });