"""
Partner admin API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.models.partner import Partner
from app.core.security import get_current_admin_user

partner_admin_router = APIRouter()


@partner_admin_router.get("/admin/partners")
async def get_all_partners(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all partners with pagination and search"""
    query = db.query(Partner)

    if search:
        query = query.filter(
            (Partner.name.ilike(f"%{search}%")) |
            (Partner.category.ilike(f"%{search}%"))
        )

    total = query.count()
    partners = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "partners": partners,
        "total": total,
        "page": page,
        "limit": limit
    }


@partner_admin_router.get("/admin/partners/{partner_id}")
async def get_partner_details(
    partner_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get detailed partner information"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    return partner


@partner_admin_router.post("/admin/partners/{partner_id}/verify")
async def verify_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Verify a partner"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    partner.is_verified = True
    db.commit()

    return {"message": "Partner verified successfully"}


@partner_admin_router.put("/admin/partners/{partner_id}")
async def update_partner(
    partner_id: int,
    partner_data: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Update partner information"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    for key, value in partner_data.items():
        if hasattr(partner, key):
            setattr(partner, key, value)

    db.commit()
    db.refresh(partner)

    return partner


@partner_admin_router.post("/admin/partners/{partner_id}/activate")
async def activate_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Activate a partner"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    partner.is_active = True
    db.commit()

    return {"message": "Partner activated successfully"}


@partner_admin_router.post("/admin/partners/{partner_id}/deactivate")
async def deactivate_partner(
    partner_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Deactivate a partner"""
    partner = db.query(Partner).filter(Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")

    partner.is_active = False
    db.commit()

    return {"message": "Partner deactivated successfully"}
