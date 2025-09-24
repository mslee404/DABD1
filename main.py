from typing import Union, List
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path as path

app = FastAPI(title="HTTP Methods Demo API", version="1.0.0")

DATA_FILE = path("flashcards.json")

def load_cards():
    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

class Card(BaseModel):
    side1: str
    side2: str

class CardUpdate(BaseModel):
    side1: Union[str, None] = None
    side2: Union[str, None] = None

# class User(BaseModel):
#     username: str
#     email: str
#     age: int

# GET - Read operations
@app.get("/")
def read_root():
    return {"message": "Welcome to My Flashcard API", "version": "1.0.0"}

@app.get("/cards", response_model=List[dict])
def get_all_cards():
    return load_cards()

@app.get("/cards/{card_id}")
def read_card(card_id: int):
    cards = load_cards()

    for card in cards:
        if card["id"] == card_id:
            return card

    raise HTTPException(status_code=404, detail="Card not found")

# POST - Create operations
@app.post("/card")
def create_card(card: Card):
    cards = load_cards()
    new_id = max([c["id"] for c in cards], default=0) + 1

    new_card = {
        "id": new_id,
        "side1": card.side1,
        "side2": card.side2,
    }

    cards.append(new_card)
    write_data(cards)
    return new_card

@app.patch("/card/{card_id}")
def partial_update_card(card_id: int, card_update: CardUpdate):
    cards = load_cards()
    
    for card in cards:
        if card["id"] == card_id:
            if card_update.side1 is not None:
                card["side1"] = card_update.side1
            if card_update.side2 is not None:
                card["side2"] = card_update.side2
    
            write_data(cards)
            return card
        
    raise HTTPException(status_code=404, detail="Card not found")
 
# DELETE - Delete operations
@app.delete("/card/{card_id}")
def delete_card(card_id: int):
    cards = load_cards()
    
    for card in cards:
        if card["id"] == card_id:
            cards.remove(card)
    
            write_data(cards)
            return {"message": "Card deleted successfully"}

    raise HTTPException(status_code=404, detail="Card not found")
