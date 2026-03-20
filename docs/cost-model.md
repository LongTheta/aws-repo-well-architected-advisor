# Cost Model

Structured cost analysis for architecture decisions. Uses **heuristic** rates today; AWS Price List API and Cost Explorer integration are planned. See [pricing-integration.md](pricing-integration.md).

---

## Pricing Module

The `pricing/` module provides:

1. **AWS Price List Query API** — Targeted price lookups (requires boto3, AWS credentials)
2. **AWS Price List Bulk API** — Larger catalog retrieval
3. **Heuristic fallback** — When API unavailable; clearly labeled

### What Requires AWS Credentials

- `fetch_price_catalog.py` — Fetches price catalog
- `estimate_costs.py` with API mode — Uses catalog when available

### What Is Estimate vs Observed

- **Estimate** — From Price List API or heuristic; not actual billing
- **Observed** — Optional Cost Explorer overlay (future); actual spend

---

## Approach

- **Numerical ranges**: min/max USD per component
- **Pricing source**: `price_list_api` | `bulk_catalog` | `cost_explorer` | `heuristic_fallback`
- **Confidence score**: 0.0–1.0; downgraded when assumptions incomplete
- **Missing assumptions**: Explicitly listed

---

## Schemas

- `schemas/pricing-input.schema.json` — Input (region, usage_assumptions, selected_services)
- `schemas/pricing-estimate.schema.json` — Output (per-component estimates)
- `schemas/cost-analysis.schema.json` — Legacy/combined cost analysis

---

## Usage

```bash
python scripts/fetch_price_catalog.py --region us-east-1
python scripts/estimate_costs.py --input examples/pricing-input-example.json
```

---

## See Also

- [pricing/README.md](../pricing/README.md)
- [docs/aws-finops-decision-optimization.md](aws-finops-decision-optimization.md)
