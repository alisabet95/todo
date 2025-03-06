#active with this: uvicorn fast.app.main:app --reload
#venv\Scripts\activate
#source env/bin/activate


from fastapi import APIRouter, Path
from typing import Optional
from pydantic import BaseModel

router = APIRouter()



item_names = {
    1: {"id": 1, "name": "ali", "age":29},
    2: {"id": 2, "name": "John", "age": 20},
    3: {"id": 3, "name": "Shadi", "age":15},
    4:{ "id": 4, "name": "Mina", "age": 25}
}


class Stu(BaseModel):
    id: int
    name: str
    age: int

names_list = list(item_names.values())

@router.get("/items")
def read_items():
    return names_list

@router.get("/items/{id}")
def get_id(id: int= Path(description="practice", le=4, ge=1)):
    return item_names[id]


@router.get("/items-get")
def get_name(name: Optional[str] = None):
    for i in item_names:
        if item_names[i]["name"].lower() == name.lower():
            return item_names[i]
    return {"name": "not found"}


@router.post("/creation/{id}")
def create(id: int, new: Stu):
    if id in item_names:
        return {"error": "Item exists"}
    item_names[id] = new
    return item_names[id]