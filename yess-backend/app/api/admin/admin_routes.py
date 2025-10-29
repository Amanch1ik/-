"""
Admin panel API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User
from app.models.partner import Partner
from app.models.transaction import Transaction
from app.models.order import Order
from app.core.security import get_current_admin_user

admin_router = APIRouter()


@admin_router.get("/admin/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get dashboard statistics"""
    total_users = db.query(User).count()
    active_partners = db.query(Partner).filter(Partner.is_active == True).count()
    total_transactions = db.query(Transaction).count()
    total_revenue = db.query(Transaction).filter(
        Transaction.status == 'completed'
    ).with_entities(func.sum(Transaction.amount)).scalar() or 0

    return {
        "total_users": total_users,
        "active_partners": active_partners,
        "total_transactions": total_transactions,
        "total_revenue": float(total_revenue),
        "users_growth": 12.5,
        "revenue_growth": 18.3
    }


@admin_router.get("/admin/users")
async def get_all_users(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all users with pagination and search"""
    query = db.query(User)

    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.phone.ilike(f"%{search}%"))
        )

    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "users": users,
        "total": total,
        "page": page,
        "limit": limit
    }


@admin_router.get("/admin/users/{user_id}")
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get detailed user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@admin_router.post("/admin/users/{user_id}/block")
async def block_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Block a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_blocked = True
    user.is_active = False
    db.commit()

    return {"message": "User blocked successfully"}


@admin_router.post("/admin/users/{user_id}/unblock")
async def unblock_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unblock a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_blocked = False
    user.is_active = True
    db.commit()

    return {"message": "User unblocked successfully"}


@admin_router.get("/admin/transactions")
async def get_all_transactions(
    page: int = 1,
    limit: int = 20,
    type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all transactions with filters"""
    query = db.query(Transaction)

    if type:
        query = query.filter(Transaction.type == type)
    if status:
        query = query.filter(Transaction.status == status)

    total = query.count()
    transactions = query.order_by(Transaction.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "limit": limit
    }


@admin_router.get("/admin/orders")
async def get_all_orders(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all orders"""
    query = db.query(Order)
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "orders": orders,
        "total": total,
        "page": page,
        "limit": limit
    }


@admin_router.get("/admin/analytics/users/growth")
async def get_users_growth(
    period: str = "month",
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get users growth analytics"""
    # Mock data for now - implement real analytics
    return [
        {"period": "Week 1", "users": 120},
        {"period": "Week 2", "users": 145},
        {"period": "Week 3", "users": 178},
        {"period": "Week 4", "users": 203}
    ]


@admin_router.get("/admin/analytics/revenue")
async def get_revenue_analytics(
    period: str = "month",
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get revenue analytics"""
    # Mock data for now - implement real analytics
    return [
        {"period": "Week 1", "revenue": 125000},
        {"period": "Week 2", "revenue": 142000},
        {"period": "Week 3", "revenue": 158000},
        {"period": "Week 4", "revenue": 175000}
    ]
