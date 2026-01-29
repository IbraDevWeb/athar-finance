from pydantic import BaseModel, Field
from typing import Optional, Dict

class ComplianceDetails(BaseModel):
    sector_compliant: bool
    debt_compliant: bool
    cash_compliant: bool
    revenue_compliant: bool
    overall_score: float

class HalalScreeningResult(BaseModel):
    ticker: str
    is_halal: bool
    sector: str
    price: float
    debt_to_market_cap: float
    cash_to_market_cap: float
    non_halal_revenue_ratio: float
    compliance_details: ComplianceDetails