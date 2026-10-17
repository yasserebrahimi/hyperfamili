# AI Product Technical Design Document

> مرجع مکمل پروژه افق کوروش/گلرنگ؛ نه وضعیت تأییدشده هایپرفامیلی. متن ورودی استخراج شده است و تصاویر و صفحه‌آرایی در اصل سند می‌مانند. اعداد دوباره راستی‌آزمایی نشده‌اند.

Technical Design Report: Sovereign AI Architecture for Ofogh Koorosh Chain Stores

1. Executive Summary and Architectural Directive

This document serves as the definitive technical specification for the implementation of advanced Artificial Intelligence systems within the Ofogh Koorosh Chain Stores (OKCS) ecosystem. The architectural mandate is strict: Sovereign On-Premise capability. Given the geopolitical operating environment (Iran), the operational scale (exceeding 5,000 branches), and the critical nature of the retail supply chain, this design rejects reliance on external hyperscalers (AWS, Azure, GCP).

The architecture is designed to be resilient to international service disruptions, sanctioned hardware unavailability, and unstable Wide Area Network (WAN) conditions. It leverages a cloud-native software stack deployed on commodity high-performance hardware, specifically maximizing consumer-grade GPU availability (NVIDIA RTX 4090s) to circumvent export controls on enterprise accelerators (H100/A100). The following sections detail the engineering decomposition of three core AI products: Demand Forecasting, Logistics Optimization, and Semantic Search.

1. AI Product Decomposition (From Idea to Production)

To ensure alignment with business objectives and technical feasibility, we decompose the prioritized initiatives into distinct engineering products. Each product is treated as an isolated system with defined inputs, outputs, and service level objectives (SLOs).

1.1 Product 1: Hyper-Localized Demand Forecasting (Strategic)

The primary strategic objective is the minimization of inventory shrinkage and the prevention of stock-outs across the 5,000+ store network. The complexity arises from the heterogeneity of the network, which includes both corporate-owned and franchise locations, each with distinct demographic profiles and demand patterns.

1.1.1 Problem Formalization

The business requirement of "predicting sales" translates technically into a Global Probabilistic Multivariate Time-Series Regression problem. We are not predicting a single scalar value for future sales; rather, we are modeling the conditional probability distribution of demand to enable risk-aware inventory planning.

Target Variable ($y$): Daily unit sales per Stock Keeping Unit (SKU) per Store ID.

Prediction Horizon:

Operational: $t+1$ to $t+14$ days (for automated replenishment).

Tactical: $t+1$ to $t+180$ days (for supply chain procurement).

Granularity: Daily aggregation. Hourly granularity is deemed noise-heavy and storage-intensive for the non-perishable categories, though it may be revisited for fresh goods in Phase 3.

Mathematical Framing:
We aim to minimize the Quantile Loss ($\mathcal{L}$) across multiple quantiles ($\tau \in \{0.1, 0.5, 0.9\}$). This allows the logistics engine to select a safety stock level based on the item's margin. High-margin items may use the $P90$ forecast to prevent stock-outs, while low-margin, bulky items may use $P50$ to minimize storage costs.

$$\mathcal{L}(\Omega, W) = \sum_{y_t \in \Omega} \sum_{q \in \mathcal{Q}} \sum_{\tau=1}^{\tau_{max}} \frac{QL(y_{t+\tau}, \hat{y}_{t+\tau}^{(q, \tau)})}{M}$$

Inference Constraints:

Throughput: With approximately 10,000 active SKUs across 5,000 stores, the system must generate 50 million prediction vectors daily.

Latency: This is an Offline Batch Inference workload. The inference window must complete between store closing (23:00) and warehouse picking start (05:00).

Cold Start: New SKUs and new franchise locations must be handled via metadata-based generalization rather than requiring historical series.

1.2 Product 2: Last-Mile Logistics Optimization (Mid-Term)

The logistics challenge addresses the distribution from regional warehouses (Distribution Centers - DCs) to the branch network, and secondarily, the growing B2C delivery segment (Okala).

1.2.1 Problem Formalization

This is framed as a Capacitated Vehicle Routing Problem with Time Windows (CVRPTW). The optimization engine must construct routes that minimize total fleet cost while respecting strict operational constraints.

Objective Function: Minimize $J = \alpha \times \text{TotalDistance} + \beta \times \text{TotalDuration} + \gamma \times \text{PenaltyLate}$, where $\alpha, \beta, \gamma$ are weights tuned by the logistics finance team.

Constraints:

Hard Constraints:

Vehicle Capacity ($Q_k$): Sum of pallet weights/volume must not exceed vehicle $k$'s limit.

Time Windows ($[a_i, b_i]$): Delivery must occur during the store's receiving hours (e.g., 06:00 - 10:00).

Soft Constraints: Traffic congestion profiles in major urban centers like Tehran, requiring time-dependent travel time matrices.

Inference Constraints:

Mode: On-Demand / Near-Real-Time. Routes are calculated in batches once orders are finalized, but dynamic re-routing may be required for B2C deliveries.

Latency: Route generation for a fleet of 50 vehicles delivering to 500 locations must converge within 15 minutes.

1.3 Product 3: Semantic Search & Recommendation (Quick Win)

To improve the e-commerce experience on the Okala platform, the system must move beyond lexical (keyword) search to semantic understanding, addressing the "zero-result" problem common in Persian language queries due to spelling variations and synonyms.

1.3.1 Problem Formalization

This is a Dense Vector Retrieval problem utilizing Approximate Nearest Neighbor (ANN) search.

Mechanism: A Two-Tower architecture (Bi-Encoder).

Query Encoder: Maps user search queries to a dense vector space $\mathbb{R}^d$.

Item Encoder: Maps product titles and descriptions to the same vector space.

Metric: Cosine Similarity between query vector $u$ and item vector $v$.

Inference Constraints:

Mode: Real-Time.

Latency: End-to-end response time (Encoding + Index Search + Re-ranking) must be $< 100$ms at P99.

Throughput: Must support peak loads of 500 queries per second (QPS) during sales campaigns.

2. Data Engineering Layer

The foundation of sovereign AI is a robust data substrate. We assume a Lakehouse Architecture implemented on bare-metal servers using open-source technologies to replicate the capabilities of Databricks or Snowflake without the licensing or geopolitical risks.

2.1 Data Sources


| Domain | System | Entity | Granularity | Freshness | Notes |
| Sales | POS / ERP (Golrang System) | Transaction Logs | Line-Item | T+1 Day (Batch) | The source of truth. Data volume is high (millions of rows/day). |
| Inventory | WMS | Stock Snapshots | SKU/Store | Hourly | Critical feature for demand forecasting to distinguish zero sales (no demand) from zero sales (out of stock). |
| Digital | Okala Web/App | Clickstream | Event | Real-Time | User views, cart additions, search logs. Ingested via Kafka. |
| Context | External | Calendar | Daily | Static | Crucial: Must include the Jalali calendar, lunar religious holidays, and official government closures. |


2.2 Data Pipelines

Given the instability of inter-city internet connectivity in Iran, the pipeline design prioritizes partition tolerance and local buffering.

2.2.1 Ingestion Strategy: Distributed Buffering

Instead of a direct real-time connection from 5,000 stores to the central datacenter, we implement a Store-and-Forward architecture.

Store Agent: A lightweight collector (Fluent Bit) runs on the store server. It tails POS logs and writes them to a local buffer (Persistent Queue).

Transmission: The agent attempts to push compressed micro-batches (Parquet/Arrow) to the central object storage (MinIO) via secure VPN tunnels. If the connection drops, data accumulates locally and is retried with exponential backoff.

Central Ingestion: A Kafka (or Redpanda) cluster in the Tehran datacenter acts as the entry point for real-time digital streams, while MinIO serves as the landing zone for batched POS uploads.

2.2.2 Processing Engine: Spark on Kubernetes

Transformation logic is executed using Apache Spark running on the central Kubernetes cluster.

Validation: We utilize Great Expectations within the Spark pipeline to enforce data quality contracts (e.g., sales_qty >= 0, store_id exists in Master Data). Invalid records are routed to a "Dead Letter Queue" table for manual inspection, preventing pipeline blockage.

2.3 Storage Design: The Bare-Metal Lakehouse

We standardize on MinIO as the high-performance object storage layer, compatible with S3 APIs, running on NVMe-accelerated servers. To manage data reliability and performance, we overlay Delta Lake.

Bronze Layer (Raw): Immutable landing zone. Stores raw Parquet files as received from store agents. Retention: 3 years.

Silver Layer (Clean): Deduplicated, validated, and enriched tables. The schemas are enforced here. Jalali dates are normalized to a standard technical format (e.g., YYYY-MM-DD string or Unix timestamp) while retaining Jalali metadata columns.

Gold Layer (Features): Aggregated feature tables optimized for ML training (e.g., store_sku_weekly_sales).

Small File Optimization: POS data ingestion creates thousands of small files (KB size). A nightly Compaction Job (Delta OPTIMIZE command) is mandatory to coalesce these into larger files (128MB - 1GB) to ensure high throughput during model training.

Partitioning:

Sales Data: Partitioned by Year / Month / Region.

Clickstream: Partitioned by Date / Event_Type.

3. Feature Engineering & Representation

3.1 Feature Categories

3.1.1 Temporal Features (The Jalali Challenge)

Standard libraries (Pandas, PyTorch) default to Gregorian calendars, which misaligns with Iranian consumer behavior driven by the Solar Hijri (Jalali) and Lunar Hijri calendars.

Cyclical Encoding: We must not encode months/days as simple integers. We map the Jalali timeline to a cyclical coordinate system:

$$x_{sin} = \sin\left(\frac{2 \pi t}{T}\right), \quad x_{cos} = \cos\left(\frac{2 \pi t}{T}\right)$$

This ensures the model understands that the end of Esfand (Month 12) is temporally adjacent to Farvardin (Month 1).

Lunar Drift: Religious holidays (Ramadan, Moharram) drift ~11 days annually relative to the solar calendar. We engineer specific features: days_until_eid, is_ramadan, days_since_ashura.

3.1.2 Rolling Window Aggregations

For the forecasting model, input sequences require historical context:

sales_rolling_mean_7d, sales_rolling_std_7d (Volatility).

sales_lag_1 (Yesterday), sales_lag_7 (Last week same day).

3.1.3 Categorical Embeddings

High-cardinality features (Store ID, SKU ID) are not one-hot encoded. We utilize Entity Embeddings learned during training.

Store Embedding: $\mathbb{R}^{32}$ vector capturing latent store attributes (e.g., luxury neighborhood vs. working-class, proximity to schools).

Item Embedding: $\mathbb{R}^{64}$ vector capturing product relationships (e.g., dairy, complementary goods).

3.2 Feature Store Strategy

To prevent training-serving skew, we deploy a Hybrid Feature Store using Feast (Feature Store).

Offline Store: Points to the Delta Lake (Gold Layer) for generating historical training datasets.

Online Store: Syncs the latest feature values (e.g., "Yesterday's Sales", "Current Price") to Redis. This allows the Real-Time Inference services (like Product 3) to fetch pre-computed features with sub-millisecond latency.

Registry: The Feast registry resides on a shared volume or PostgreSQL DB within the K8s cluster, versioning feature definitions (e.g., driver_hourly_stats:v2).

4. Model Design & Algorithm Selection (CORE)

4.1 AI Product 1: Demand Forecasting (TFT)

Baseline: A Seasonal Naive model is implemented first. It predicts $y_t = y_{t-7}$ (next Monday equals last Monday). This captures the dominant weekly seasonality of grocery retail and serves as the performance floor.

Production Model: Temporal Fusion Transformer (TFT).

Rationale: Retail demand involves complex interactions between static covariates (Store Metadata), known future inputs (Holidays), and observed past inputs (Sales). Standard LSTM/GRU models struggle to integrate these heterogeneous inputs effectively. TFT's attention mechanisms allow it to weigh the importance of different time steps and features dynamically.

Architecture:

Gated Residual Networks (GRN): Filter out irrelevant features (noise suppression).

Multi-Head Attention: Learns long-term dependencies across the 90-day lookback window.

Quantile Output: The final layer outputs the 10th, 50th, and 90th percentiles simultaneously.

Training Strategy:

Window: Sliding window approach. Training samples are generated by sliding a (Lookback + Forecast) window across the historical timeline.

Loss Function: Quantile Loss (Pinball Loss).

Complexity: High training cost (requires GPU). Inference is moderately expensive but acceptable for batch processing.

4.2 AI Product 2: Logistics Optimization (OR-Tools)

Baseline: Heuristic "Nearest Neighbor" routing or manual dispatcher planning.

Production Model: Google OR-Tools (Constraint Solver).

Rationale: Logistics is a combinatorial optimization problem, not a prediction problem. Machine learning (RL) is often unstable for hard constraint satisfaction. OR-Tools provides a robust, industry-standard solver for VRP.

Algorithm: Guided Local Search (GLS) on top of the CP-SAT solver.

Distance Matrix:

We utilize Valhalla or OSRM self-hosted on the cluster.

Map Data: Ingest OpenStreetMap (OSM) PBF files for Iran. Updates are pulled monthly from Geofabrik mirrors (via proxy).

Hybrid Approach: We use ML (XGBoost) to predict "Travel Time Multipliers" based on time-of-day and weather, which are then fed into the OR-Tools solver as edge weights. This injects "traffic intelligence" into the deterministic solver.

4.3 AI Product 3: Semantic Search (DistilBERT + HNSW)

Baseline: Elasticsearch default BM25 (TF-IDF) text search.

Production Model: Fine-Tuned XLM-RoBERTa or DistilBERT (Multilingual).

Rationale: These models have pre-training on Persian corpora and can capture semantic nuance.

Fine-Tuning: We employ a "Contrastive Loss" approach. Positive pairs are (Query, Clicked Product). Negative pairs are (Query, Random Product). This pulls relevant items closer in vector space.

Index Structure: HNSW (Hierarchical Navigable Small World) within Elasticsearch 8.x.

Configuration: m (number of connections) = 16, ef_construction (beam width) = 100. This balances index size (RAM usage) with recall accuracy.

Hybrid Search: The final query combines the vector score (Cosine) with the BM25 score (Keyword match) using Reciprocal Rank Fusion (RRF) to ensure exact matches (e.g., searching for a specific barcode) are not lost.

5. Optimization & Decision Engines

For Product 2 (Logistics), the mathematical formulation is critical for the solver configuration.

Variables:

$x_{ijk} \in \{0, 1\}$: Binary variable, 1 if vehicle $k$ travels from node $i$ to $j$.

$t_{ik}$: Arrival time of vehicle $k$ at node $i$.

$u_{ik}$: Cumulative load of vehicle $k$ at node $i$.

Constraints (OR-Tools Python Implementation Logic):

Flow Conservation: $\sum_j x_{ijk} = \sum_j x_{jik}$ (Vehicle arriving at a node must leave it).

Capacity: $u_{jk} \geq u_{ik} + d_j - M(1 - x_{ijk})$ (Load increases by demand $d_j$ at node $j$).

Time Windows: $a_i \leq t_{ik} \leq b_i$ (Arrival must be within window).

Soft Window Implementation: We allow violation of $b_i$ but add a large penalty cost proportional to $(t_{ik} - b_i)$ to the objective function. This ensures the solver returns a solution even if perfect timing is impossible (common in Tehran traffic).

6. Inference & Serving Architecture

6.1 Serving Modes

Forecasting (Batch): PyTorch inference jobs run nightly on the GPU cluster. Results are written to the Forecasts table in Delta Lake and then synced to the ERP (Oracle/SQL Server) via a JDBC connector for the purchasing team.

Logistics (On-Demand): Exposed as an Internal REST API (FastAPI). When the Warehouse Manager clicks "Plan Routes," the API fetches orders, calls the Valhalla Distance Matrix service, runs the OR-Tools solver, and returns the GeoJSON routes. Latency target: < 5 minutes for full fleet optimization.

Search (Real-Time): Integrated directly into the Okala backend. When a user types, the backend calls the Encoder Service (Triton Inference Server) to get the vector, then queries Elasticsearch.

6.2 Deployment Pattern: Central vs. Edge

Centralized: All primary model training and the Search/Forecasting inference occur in the Tehran Datacenter.

Edge Considerations:

For the 5,000 branches, deploying complex inference hardware is cost-prohibitive and operationally complex.

Exception: We utilize the in-store servers (Windows/Linux boxes) only for data buffering (Fluent Bit).

Future State: If vision-based analytics (e.g., shelf monitoring) is prioritized later, we will leverage NVIDIA Jetson modules or similar edge-TPU devices deployed to stores, managed via K3s (Lightweight Kubernetes).

6.3 Performance & Reliability targets

Latency: Search < 100ms.

Throughput: Search must handle 500 QPS. We achieve this by scaling the Elasticsearch Replica shards and the Triton Encoder pods horizontally.

Fallbacks:

Search: If the Vector Engine times out, automatically fallback to pure BM25 (Keyword) search.

Logistics: If OR-Tools fails to converge, fallback to a "Cluster-First, Route-Second" heuristic (Spatial clustering).

7. MLOps & Lifecycle Management

We assume a "disconnected" or "air-gapped" style operation where external SaaS (WandB, SageMaker) is unavailable.

7.1 The Stack

Version Control: GitLab (Self-Hosted).

Experiment Tracking: MLflow (Self-Hosted). It logs parameters, metrics, and artifacts (models) to MinIO.

Data Versioning: DVC (Data Version Control). DVC allows us to version large datasets (GBs/TBs) in MinIO while keeping lightweight metadata pointers in Git. This ensures reproducibility: "Model v2 was trained on Data Commit hash abc1234".

CI/CD: GitLab CI.

Pipeline: Commit -> Lint -> Unit Test -> Build Docker Image -> Push to Internal Registry.

CT (Continuous Training): A scheduled pipeline triggers the training job on the GPU cluster.

7.2 Drift Detection

Monitor: We run a lightweight statistical check (KS-Test or Population Stability Index) on the input data features every week.

Trigger: If the distribution of "Price" or "Sales Volume" shifts significantly (e.g., due to sudden hyper-inflation or a pandemic event), an alert is sent to the Data Science team to trigger manual retraining or investigation. Automatic retraining is dangerous in volatile markets (feedback loops).

8. Infrastructure Stack (Iran-Ready)

8.1 Compute: The "Monster" Nodes

Sanctions prevent reliable access to NVIDIA H100/A100 data center GPUs. We must engineer around this using high-end consumer hardware.

Node Specification:

GPU: 4x NVIDIA GeForce RTX 4090 (24GB VRAM).

CPU: AMD Ryzen Threadripper PRO 7965WX (24 Cores). Crucial Detail: Consumer CPUs (Intel Core i9) usually offer only ~20-24 PCIe lanes. Running 4 GPUs requires massive PCIe bandwidth. The Threadripper PRO offers 128 PCIe 5.0 lanes, allowing us to run the GPUs at x16 or x8 speeds without bottlenecking data transfer.

Power: 2x 1600W PSUs (Titanium rated). 4090s can peak at 450W-600W each.

Cooling: Custom water-cooling loops or server-chassis with high-CFM industrial fans are required to prevent thermal throttling of these consumer cards in a rack.

Limitation: No NVLink. Distributed training must use PCIe Peer-to-Peer (P2P), which is slower. We compensate by maximizing single-node batch sizes and using Gradient Accumulation.

8.2 Platform: Kubernetes

Distribution: RKE2 (Rancher Kubernetes Engine 2). It is FIPS-compliant, secure by default, and fully self-contained (air-gap friendly). It does not require external cloud controller managers.

Storage: Longhorn (Block Storage). Provides highly available persistent volumes for databases (Postgres, Redis) across the bare-metal nodes, replicating data to prevent loss if a disk fails.

8.3 Tooling & Proxies (The Access Layer)

Docker Registry: We deploy Harbor as an internal registry. It is configured as a Proxy Cache for Docker Hub.

Mirror Configuration: We point Harbor to accessible mirrors (e.g., focker.ir or academic mirrors in Asia) to pull base images. The internal cluster only talks to Harbor.

Python (PyPI): We host a Bandersnatch mirror or Sonatype Nexus repository. It caches all pip install requests.

Config: pip config set global.index-url https://nexus.internal/simple injected into all CI/CD runners.

9. Security, Governance & Reliability

Access Control: All MinIO buckets are locked down with specific Policy documents. Training pods mount secrets (Kubernetes Secrets) containing temporary MinIO credentials with Read-Only access to the Bronze/Silver layers and Write access only to the Model Artifact bucket.

Explainability: For the TFT model, we extract the "Variable Selection Network" weights to generate a "Feature Importance Report" for the commercial team. This explains why the model predicted a spike (e.g., "High importance attributed to days_until_eid").

Audit Logs: All queries to the Logistics API and Search API are logged to an ELK (Elasticsearch-Logstash-Kibana) stack for performance auditing and security review.

10. Step-by-Step Execution Plan

Phase 0: Foundations (Weeks 1-4)

Hardware: Source and assemble 2x "Monster" Training Nodes (Threadripper + 4x 4090).

Platform: Install RKE2, Longhorn, MinIO, and Harbor.

Connectivity: Configure the Registry Mirrors (Docker/PyPI) to ensure the team can actually install software.

Data: Establish the VPN tunnel from 1 Pilot Store. Ingest POS logs to MinIO.

Phase 1: MVP - Semantic Search (Weeks 5-12)

Why: Low data dependency (only needs Product Catalog, not transaction history), high visibility.

Action: Train DistilBERT model. Index 20,000 SKUs in Elasticsearch.

Integration: Replace the "No Results" page in Okala with the Vector Search results.

Success Criteria: "Zero Search Results" rate drops from X% to <5%.

Phase 2: Pilot - Demand Forecasting (Weeks 13-24)

Scope: 50 Representative Stores.

Action: Build the Spark Pipeline for ETL. Engineer Jalali features. Train TFT baseline.

Output: Generate CSV forecasts for the Replenishment Team to review manually (Shadow Mode).

Success Criteria: Forecast accuracy (WMAPE) improves by 10% over current manual/naive methods.

Phase 3: Production Scale & Logistics (Months 6-9)

Logistics: Deploy Valhalla and OR-Tools. Integrate with the Warehouse Management System.

Forecasting: Roll out to all 5,000 stores. Optimize Spark jobs for the massive data volume (Compaction).

Ops: Full automation of retraining pipelines.

11. Build vs Buy Decision Matrix


| Component | Decision | Rationale for Iran Context |
| Compute Infrastructure | BUILD | AWS/Azure/GCP are strictly unavailable/sanctioned. Access to H100s is restricted. We must build on-prem with consumer GPUs. |
| Mapping / Routing | BUILD | Google Maps API is expensive and a single-point-of-failure (can be blocked). Self-hosting Valhalla/OSRM on OSM data guarantees sovereignty. |
| Orchestration | BUILD | Managed K8s is not an option. RKE2 is the standard for air-gapped/on-prem clusters. |
| Forecasting Engine | BUILD | Commercial tools (SAS, Blue Yonder) are expensive and difficult to license. Custom TFT allows specific handling of Jalali calendars and local market dynamics. |
| Object Storage | BUILD | MinIO is the de-facto standard for on-prem S3 compatibility. |


Conclusion

This architecture represents a pragmatic, robust, and sovereign path to AI maturity for Ofogh Koorosh. By anchoring the design on commodity hardware (RTX 4090s), open-source software (MinIO, RKE2, OR-Tools), and local connectivity resilience (Store-and-Forward), the organization insulates itself from external geopolitical shocks. The roadmap prioritizes the high-value, lower-risk "Search" product to build momentum, before tackling the computational heavyweights of network-wide Forecasting and Logistics. This is not merely a theoretical design but a battle-hardened specification for operating at scale under constraint.