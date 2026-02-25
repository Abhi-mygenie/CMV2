from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
import uuid

from core.database import db
from core.auth import get_current_user
from core.helpers import get_default_templates_and_automation
from models.schemas import (
    WhatsAppTemplate, WhatsAppTemplateCreate, WhatsAppTemplateUpdate,
    AutomationRule, AutomationRuleCreate, AutomationRuleUpdate,
    AUTOMATION_EVENTS
)

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


@router.post("/setup-defaults")
async def setup_default_templates(user: dict = Depends(get_current_user)):
    """
    Create default WhatsApp templates and automation rules for existing user.
    Skips if templates already exist.
    """
    # Check if user already has templates
    existing_count = await db.whatsapp_templates.count_documents({"user_id": user["id"]})
    
    if existing_count > 0:
        return {
            "message": "Templates already exist",
            "templates_created": 0,
            "automation_rules_created": 0
        }
    
    templates, automation_rules = get_default_templates_and_automation(user["id"])
    
    # Insert templates
    templates_created = 0
    if templates:
        await db.whatsapp_templates.insert_many(templates)
        templates_created = len(templates)
    
    # Insert automation rules
    rules_created = 0
    if automation_rules:
        await db.automation_rules.insert_many(automation_rules)
        rules_created = len(automation_rules)
    
    return {
        "message": "Default templates and automation rules created",
        "templates_created": templates_created,
        "automation_rules_created": rules_created
    }


# WhatsApp Template CRUD Endpoints
@router.post("/templates", response_model=WhatsAppTemplate)
async def create_template(template_data: WhatsAppTemplateCreate, user: dict = Depends(get_current_user)):
    template_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    template_doc = {
        "id": template_id,
        "user_id": user["id"],
        "name": template_data.name,
        "message": template_data.message,
        "media_type": template_data.media_type,
        "media_url": template_data.media_url,
        "variables": template_data.variables or [],
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }
    
    await db.whatsapp_templates.insert_one(template_doc)
    return WhatsAppTemplate(**template_doc)

@router.get("/templates", response_model=List[WhatsAppTemplate])
async def list_templates(user: dict = Depends(get_current_user)):
    templates = await db.whatsapp_templates.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [WhatsAppTemplate(**t) for t in templates]

@router.get("/templates/{template_id}", response_model=WhatsAppTemplate)
async def get_template(template_id: str, user: dict = Depends(get_current_user)):
    template = await db.whatsapp_templates.find_one({"id": template_id, "user_id": user["id"]}, {"_id": 0})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return WhatsAppTemplate(**template)

@router.put("/templates/{template_id}", response_model=WhatsAppTemplate)
async def update_template(template_id: str, update_data: WhatsAppTemplateUpdate, user: dict = Depends(get_current_user)):
    template = await db.whatsapp_templates.find_one({"id": template_id, "user_id": user["id"]})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.whatsapp_templates.update_one({"id": template_id}, {"$set": update_dict})
    
    updated = await db.whatsapp_templates.find_one({"id": template_id}, {"_id": 0})
    return WhatsAppTemplate(**updated)

@router.delete("/templates/{template_id}")
async def delete_template(template_id: str, user: dict = Depends(get_current_user)):
    # Check if template is used in any automation rules
    rule_using_template = await db.automation_rules.find_one({"template_id": template_id, "user_id": user["id"]})
    if rule_using_template:
        raise HTTPException(status_code=400, detail="Template is used in automation rules. Remove the rules first.")
    
    result = await db.whatsapp_templates.delete_one({"id": template_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted"}


# Automation Rule CRUD Endpoints
@router.post("/automation", response_model=AutomationRule)
async def create_automation_rule(rule_data: AutomationRuleCreate, user: dict = Depends(get_current_user)):
    # Validate event type
    if rule_data.event_type not in AUTOMATION_EVENTS:
        raise HTTPException(status_code=400, detail=f"Invalid event type. Must be one of: {AUTOMATION_EVENTS}")
    
    # Validate template exists
    template = await db.whatsapp_templates.find_one({"id": rule_data.template_id, "user_id": user["id"]})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Check if rule already exists for this event type
    existing_rule = await db.automation_rules.find_one({
        "user_id": user["id"],
        "event_type": rule_data.event_type
    })
    if existing_rule:
        raise HTTPException(status_code=400, detail=f"Automation rule already exists for event '{rule_data.event_type}'")
    
    rule_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    rule_doc = {
        "id": rule_id,
        "user_id": user["id"],
        "event_type": rule_data.event_type,
        "template_id": rule_data.template_id,
        "is_enabled": rule_data.is_enabled,
        "delay_minutes": rule_data.delay_minutes,
        "conditions": rule_data.conditions,
        "created_at": now,
        "updated_at": now
    }
    
    await db.automation_rules.insert_one(rule_doc)
    return AutomationRule(**rule_doc)

@router.get("/automation", response_model=List[AutomationRule])
async def list_automation_rules(user: dict = Depends(get_current_user)):
    rules = await db.automation_rules.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [AutomationRule(**r) for r in rules]

@router.get("/automation/events")
async def get_automation_events():
    """Get all available automation event types with descriptions"""
    event_descriptions = {
        "points_earned": "When customer earns points from a purchase",
        "points_redeemed": "When customer redeems points",
        "bonus_points": "When bonus points are given manually",
        "wallet_credit": "When money is added to wallet",
        "wallet_debit": "When money is deducted from wallet",
        "birthday": "On customer's birthday",
        "anniversary": "On customer's anniversary",
        "first_visit": "After first purchase",
        "tier_upgrade": "When customer upgrades tier",
        "coupon_earned": "When customer receives a coupon",
        "points_expiring": "When points are about to expire",
        "feedback_received": "When customer submits feedback",
        "inactive_reminder": "When customer hasn't visited in X days"
    }
    return {"events": AUTOMATION_EVENTS, "descriptions": event_descriptions}

@router.get("/automation/{rule_id}", response_model=AutomationRule)
async def get_automation_rule(rule_id: str, user: dict = Depends(get_current_user)):
    rule = await db.automation_rules.find_one({"id": rule_id, "user_id": user["id"]}, {"_id": 0})
    if not rule:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    return AutomationRule(**rule)

@router.put("/automation/{rule_id}", response_model=AutomationRule)
async def update_automation_rule(rule_id: str, update_data: AutomationRuleUpdate, user: dict = Depends(get_current_user)):
    rule = await db.automation_rules.find_one({"id": rule_id, "user_id": user["id"]})
    if not rule:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    # Validate event type if being updated
    if "event_type" in update_dict and update_dict["event_type"] not in AUTOMATION_EVENTS:
        raise HTTPException(status_code=400, detail=f"Invalid event type. Must be one of: {AUTOMATION_EVENTS}")
    
    # Validate template if being updated
    if "template_id" in update_dict:
        template = await db.whatsapp_templates.find_one({"id": update_dict["template_id"], "user_id": user["id"]})
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
    
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.automation_rules.update_one({"id": rule_id}, {"$set": update_dict})
    
    updated = await db.automation_rules.find_one({"id": rule_id}, {"_id": 0})
    return AutomationRule(**updated)

@router.delete("/automation/{rule_id}")
async def delete_automation_rule(rule_id: str, user: dict = Depends(get_current_user)):
    result = await db.automation_rules.delete_one({"id": rule_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    return {"message": "Automation rule deleted"}

@router.post("/automation/{rule_id}/toggle")
async def toggle_automation_rule(rule_id: str, user: dict = Depends(get_current_user)):
    rule = await db.automation_rules.find_one({"id": rule_id, "user_id": user["id"]})
    if not rule:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    
    new_status = not rule.get("is_enabled", True)
    await db.automation_rules.update_one(
        {"id": rule_id},
        {"$set": {"is_enabled": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"is_enabled": new_status}

@router.get("/automation-with-templates")
async def get_automation_with_templates(user: dict = Depends(get_current_user)):
    """Get all automation rules with their associated template details"""
    rules = await db.automation_rules.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    templates = await db.whatsapp_templates.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    template_lookup = {t["id"]: t for t in templates}
    
    result = []
    for rule in rules:
        rule_with_template = dict(rule)
        template = template_lookup.get(rule["template_id"])
        if template:
            rule_with_template["template"] = template
        result.append(rule_with_template)
    
    return {
        "rules": result,
        "available_events": AUTOMATION_EVENTS,
        "templates": templates
    }
