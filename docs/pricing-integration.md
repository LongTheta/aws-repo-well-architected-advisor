# Pricing Integration Point

**Status**: Planned. AWS Price List API and Cost Explorer integration are not yet implemented.

This document defines where real pricing will plug in when implemented.

---

## Integration Points

### 1. AWS Price List Query API

**Location**: `scripts/estimate_costs.py` (or new `scripts/fetch_price_catalog.py`)

**Purpose**: Targeted price lookups for specific services (Lambda, DynamoDB, RDS, etc.)

**Data required**:
- `region` (e.g. us-east-1)
- `service_code` (e.g. AmazonDynamoDB, AWSLambda)
- `usage_type` / `instance_type` for dimension-based pricing

**Plug-in point**: Replace or augment heuristic lookup in `estimate_heuristic()` with `boto3.client("pricing").get_products()` when credentials available.

**Output**: Same `pricing-estimate.schema.json` with `pricing_source: "price_list_api"` and higher `confidence_score`.

---

### 2. AWS Cost Explorer

**Location**: New module or extension to `estimate_costs.py`

**Purpose**: Overlay actual historical cost data when `optional_account_context.use_cost_explorer: true`

**Data required**:
- AWS credentials with `ce:GetCostAndUsage`
- `account_id`
- `start_date`, `end_date` (e.g. last 30 days)

**Plug-in point**: After heuristic/Price List estimate, optionally fetch `GetCostAndUsage` and add `historical_overlay` to output. Clearly label as **observed** vs **estimated**.

**Output**: Extend `pricing-estimate.schema.json` with optional `historical_cost` object.

---

### 3. Usage Assumptions (Required Input)

**Schema**: `schemas/pricing-input.schema.json`

**Required for estimation**:
- `monthly_requests` — for Lambda, API Gateway, DynamoDB
- `storage_gb` — for S3, DynamoDB
- `lambda_memory_mb`, `lambda_avg_duration_ms` — for Lambda
- `ecs_vcpu`, `ecs_memory_gb` — for ECS Fargate
- `rds_instance_class` — for RDS

**Missing assumptions**: When incomplete, `estimate_costs.py` records `missing_assumptions` and downgrades `confidence_score`.

---

## What Remains Heuristic vs Real

| Component | Current | After Price List API | After Cost Explorer |
|-----------|---------|----------------------|---------------------|
| Lambda | Heuristic | Real list price | Real spend overlay |
| DynamoDB | Heuristic | Real list price | Real spend overlay |
| RDS | Heuristic | Real list price | Real spend overlay |
| S3 | Heuristic | Real list price | Real spend overlay |
| API Gateway | Heuristic | Real list price | Real spend overlay |

**Heuristic** = Fixed rates in code; no API call.
**Real list price** = From `pricing.us-east-1.amazonaws.com` or GetProducts.
**Real spend** = From Cost Explorer; actual billing data.

---

## Fallback Behavior

When AWS credentials are unavailable or API calls fail:
- Use heuristic rates (current behavior)
- Set `pricing_source: "heuristic_fallback"`
- Set `pricing_mode: "heuristic"` in output
- Do not fabricate exact prices

---

## See Also

- [cost-model.md](cost-model.md)
- `schemas/pricing-input.schema.json`
- `schemas/pricing-estimate.schema.json`
