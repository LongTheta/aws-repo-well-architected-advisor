# Pricing Module

Real AWS pricing integration for cost estimation. Supports Price List API, bulk catalog, and optional Cost Explorer overlays.

## Pricing Sources

1. **AWS Price List Query API** — Targeted price lookups for specific services
2. **AWS Price List Bulk API** — Larger catalog retrieval
3. **AWS Cost Explorer** (optional) — Historical cost overlays when credentials available

## Model

- **Service catalog price data** — Fetched from AWS or cached
- **Workload usage assumptions** — From `pricing-input` or architecture model
- **Historical cost data** — Optional overlay from Cost Explorer

## Usage

```bash
# Fetch price catalog (requires AWS credentials for API)
python scripts/fetch_price_catalog.py --region us-east-1 --output pricing/catalog/

# Estimate costs (falls back to heuristic if API unavailable)
python scripts/estimate_costs.py --input examples/pricing-input-example.json
```

## Constraints

- Does not fabricate exact prices when data is incomplete
- Clearly labels estimate quality (`pricing_source`, `confidence_score`)
- Fallback to heuristic when API calls unavailable
- No live changes to AWS resources
