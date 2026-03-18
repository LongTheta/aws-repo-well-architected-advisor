# Cloud Architecture Client Questionnaire

Reusable prompt to gather minimum high-value inputs for refining a cost-effective AWS architecture after repo-based analysis.

---

## When to Use

After generating a cost-optimized baseline architecture from repo analysis. Use this questionnaire to refine recommendations for cost, resilience, security, and complexity.

---

## Intro Text

> I've generated a cost-optimized baseline architecture from your repos. To refine it for your real needs, answer these 6 quick questions.

---

## Core Questions (6)

### 1. Traffic pattern
Choose one:
- **Low**
- **Moderate**
- **High**
- **Spiky / bursty**

### 2. Availability requirement
Choose one:
- **Best effort**
- **Production standard** (around 99.9%)
- **High availability** (around 99.99%+)

### 3. Data criticality
Choose one:
- **Non-critical**
- **Important**
- **Mission-critical**

### 4. Security / compliance level
Choose one:
- **Basic**
- **Moderate**
- **High**
- **Regulated / federal / audited**

### 5. Team size / platform maturity
Choose one:
- **Solo builder**
- **Small engineering team**
- **Dedicated platform / DevOps team**

### 6. Cost priority
Choose one:
- **Aggressive savings**
- **Balanced**
- **Performance / resilience first**

---

## Optional Follow-Ups (Only if repo suggests they matter)

### 7. Expected environment count
- Dev only
- Dev + test
- Dev + test + prod
- Multi-environment / multi-account

### 8. Workload style
- API / web app
- Batch / scheduled jobs
- Event-driven
- Internal platform / shared service
- Data pipeline / analytics

### 9. User scale
- Internal users only
- Small external customer base
- Growing public workload
- Large-scale production

### 10. Recovery expectations
- Restore eventually is fine
- Need same-day recovery
- Need near-immediate recovery

---

## Output Format (After Collecting Answers)

Produce:

1. **Refined assumptions** — What we now assume based on answers
2. **Updated architecture recommendation** — Adjusted compute, network, storage, security
3. **What changed from baseline** — Delta summary
4. **Cost impact** — Higher / Lower / Similar; rough band if applicable
5. **Reliability impact** — Basic / Production / Mission-critical
6. **Security impact** — Adjustments to IAM, encryption, audit
7. **Complexity / ops impact** — Low / Medium / High

---

## Rules

- **If answers are missing** — Proceed with reasonable cost-conscious defaults (low traffic, best effort, non-critical, basic, small team, aggressive savings)
- **Do not ask more than 6 core questions** unless truly justified by repo context
- **Keep the tone practical and architect-like**
- **Use answers to right-size** the architecture, not to upsell complexity
- **Default to cheapest safe baseline** when answers are incomplete
- **Do not overwhelm** the user — prefer multiple choice or short answers

---

## Invocation

When the user has completed a repo-based architecture analysis and you want to refine it:

```
I've generated a cost-optimized baseline architecture from your repos. To refine it for your real needs, answer these 6 quick questions.

1. Traffic pattern: Low / Moderate / High / Spiky
2. Availability: Best effort / 99.9% / 99.99%+
3. Data criticality: Non-critical / Important / Mission-critical
4. Security/compliance: Basic / Moderate / High / Regulated
5. Team size: Solo / Small team / Platform team
6. Cost priority: Aggressive savings / Balanced / Performance-first

Your answers will be used to refine cost, resilience, security, and complexity.
```
