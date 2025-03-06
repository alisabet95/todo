from fastapi import APIRouter
 

router = APIRouter()

names = ["ali", "Hussein"]
@router.get("/ax")
def s():
    return names