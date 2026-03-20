# Organization Model

AWS Organizations / Control Tower landing zone and multi-account topology modeling.

## Supported Patterns

- Single-account workloads
- Multi-account environments
- Control Tower landing zones
- Shared services + security + network + workload account patterns

## Model Captures

- Management account
- Audit account
- Log archive account
- Workload OUs
- Account-per-environment or shared account strategies
- CI/CD and state backend locations
- Cross-account deployment assumptions

## Usage

```bash
python scripts/build_org_topology.py --mode single
python scripts/build_org_topology.py --mode multi-account --config org-config.json
```
