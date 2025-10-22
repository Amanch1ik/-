"""Partner schemas"""
from pydantic import BaseModel
from decimal import Decimal
from typing import Optional


class PartnerBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    max_discount_percent: Decimal


class PartnerResponse(PartnerBase):
    id: int
    logo_url: Optional[str]
    is_active: bool
    
    class Config:
        from_attributes = True


class PartnerLocationResponse(BaseModel):
    id: int
    partner_id: int
    partner_name: str
    address: Optional[str]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    phone_number: Optional[str]
    working_hours: Optional[str]
    max_discount_percent: Decimal
    
    class Config:
        from_attributes = True

