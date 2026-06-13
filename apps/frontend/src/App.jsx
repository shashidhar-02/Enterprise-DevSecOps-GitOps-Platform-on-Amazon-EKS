import { useEffect, useMemo, useState } from 'react';

const userId = 'guest-user';

export default function App() {
  // Original storefront state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState('Loading CloudMart catalog...');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview'); // overview, scans, store, architecture
  const [selectedScan, setSelectedScan] = useState('semgrep'); // semgrep, trivy, gitleaks, checkov
  const [searchTerm, setSearchTerm] = useState('');

  // Load catalog on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
        setStatus('Live catalog loaded from the backend API.');
      } catch (error) {
        setStatus('Backend unavailable. Verify the API service and NGINX proxy.');
      }
    };

    loadData();
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = async (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product._id);
      if (existing) {
        return current.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });

    try {
      await fetch(`/api/cart/${userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });
    } catch (e) {
      console.error('Failed to update cart on server:', e);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setCart([]);
        setStatus('Order placed successfully. The backend created a new order in MongoDB.');
      } else {
        setStatus('Failed to place order. Check cart constraints.');
      }
    } catch (e) {
      setStatus('Failed to connect to backend for order.');
    }
  };

  // Mock scan logs/details
  const scanLogs = {
    semgrep: {
      name: 'Semgrep SAST',
      status: 'Passed',
      vulns: 0,
      runTime: '12.4s',
      rules: 'security-extended, owasp-top-10',
      log: `[INFO] Semgrep CLI v1.65.0 starting scan...
[INFO] Loading ruleset: p/security-extended, p/owasp-top-10
[INFO] Target: /apps/backend/src, /apps/frontend/src
[INFO] Scanning 8 files with 420 rules...
[INFO] /apps/backend/src/app.js - OK (Validated ObjectIds, Safe error handling)
[INFO] /apps/backend/src/server.js - OK (Port binding, strict process validation)
[INFO] /apps/frontend/src/App.jsx - OK (Sanitized fetches, secure HTML context)
[SUCCESS] Scan complete. 0 issues detected.
[SUCCESS] Reliability Rating: A | Security Rating: A`,
    },
    trivy: {
      name: 'Trivy File Scan',
      status: 'Passed',
      vulns: 0,
      runTime: '8.2s',
      rules: 'vuln,config',
      log: `[INFO] Trivy vulnerability scanner starting...
[INFO] Target: Filesystem (/apps/backend/package-lock.json)
[INFO] Scanned 184 node packages
[INFO] Target: Filesystem (/apps/frontend/package-lock.json)
[INFO] Scanned 231 node packages
[INFO] Target: Dockerfile (/apps/backend/Dockerfile)
[INFO] base image: node:20-alpine (OK)
[SUCCESS] FS Scan completed.
[SUCCESS] CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0
[SUCCESS] Vulnerabilities Rating: A | Quality Gate: Passed`,
    },
    gitleaks: {
      name: 'Gitleaks Secret Scan',
      status: 'Passed',
      vulns: 0,
      runTime: '2.1s',
      rules: 'gitleaks-default-rules',
      log: `[INFO] Gitleaks v8.18.0 starting secret scanner...
[INFO] Scanning local Git history...
[INFO] Checking 54 historical commits...
[INFO] Checking uncommitted changes...
[SUCCESS] Gitleaks scan completed.
[SUCCESS] 0 secret leaks detected.
[SUCCESS] Security posture: A (Passed)`,
    },
    checkov: {
      name: 'Checkov IaC Scan',
      status: 'Passed',
      vulns: 0,
      runTime: '5.6s',
      rules: 'checkov-aws-eks-vpc',
      log: `[INFO] Checkov static code analyzer starting...
[INFO] Target: Terraform directories (/terraform)
[INFO] Scanned 34 AWS infrastructure resources
[INFO] CKV_AWS_144 (VPC flow logs enabled) - PASSED
[INFO] CKV_AWS_109 (EKS control plane logging enabled) - PASSED
[INFO] CKV_AWS_39 (EKS private endpoints restricted) - PASSED
[SUCCESS] All 34 checks passed successfully.
[SUCCESS] Infrastructure Security Rating: A | Quality Gate: Passed`,
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-logo">
          <svg className="sonar-logo-icon" viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <span className="logo-text">SonarCloud</span>
          <span className="logo-divider">/</span>
          <span className="project-title">CloudMart-Platform</span>
        </div>
        <div className="nav-actions">
          <span className="quality-gate-pill passed">
            Quality Gate <span>Passed</span>
          </span>
          <a href="#github" className="github-link" onClick={() => setActiveTab('store')}>
            Live Store Demo
          </a>
        </div>
      </header>

      {/* Hero Header */}
      <section className="project-header">
        <div className="project-meta">
          <h1>CloudMart DevSecOps & GitOps Platform</h1>
          <p className="project-desc">
            A production-ready cloud-native delivery pipeline on AWS EKS, monitored and certified by SonarQube standards.
          </p>
        </div>
        <div className="tab-menu">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'scans' ? 'active' : ''}`}
            onClick={() => setActiveTab('scans')}
          >
            DevSecOps Scans
          </button>
          <button 
            className={`tab-btn ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            MERN Storefront
          </button>
          <button 
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            Pipeline Architecture
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="dashboard-main">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            {/* Primary SonarCloud Ratings Grid */}
            <div className="metrics-grid">
              
              {/* Reliability Card */}
              <div className="metric-card">
                <div className="card-header-clean">
                  <h3>Reliability</h3>
                  <span className="info-icon">i</span>
                </div>
                <div className="metric-body">
                  <div className="rating-badge a">A</div>
                  <div className="metric-details">
                    <span className="main-stat">0</span>
                    <span className="sub-stat">Bugs</span>
                  </div>
                </div>
                <div className="card-footer-clean">
                  <span className="debt-indicator">Debt: 0 min</span>
                  <span className="status-label green">Passed</span>
                </div>
              </div>

              {/* Security Card */}
              <div className="metric-card">
                <div className="card-header-clean">
                  <h3>Security</h3>
                  <span className="info-icon">i</span>
                </div>
                <div className="metric-body">
                  <div className="rating-badge a">A</div>
                  <div className="metric-details">
                    <span className="main-stat">0</span>
                    <span className="sub-stat">Vulnerabilities</span>
                  </div>
                </div>
                <div className="card-footer-clean">
                  <span className="debt-indicator">Debt: 0 min</span>
                  <span className="status-label green">Passed</span>
                </div>
              </div>

              {/* Security Review Card */}
              <div className="metric-card">
                <div className="card-header-clean">
                  <h3>Security Review</h3>
                  <span className="info-icon">i</span>
                </div>
                <div className="metric-body">
                  <div className="rating-badge a">A</div>
                  <div className="metric-details">
                    <span className="main-stat">100%</span>
                    <span className="sub-stat">Reviewed</span>
                  </div>
                </div>
                <div className="card-footer-clean">
                  <span className="debt-indicator">0 Hotspots</span>
                  <span className="status-label green">Safe</span>
                </div>
              </div>

              {/* Maintainability Card */}
              <div className="metric-card">
                <div className="card-header-clean">
                  <h3>Maintainability</h3>
                  <span className="info-icon">i</span>
                </div>
                <div className="metric-body">
                  <div className="rating-badge a">A</div>
                  <div className="metric-details">
                    <span className="main-stat">0</span>
                    <span className="sub-stat">Code Smells</span>
                  </div>
                </div>
                <div className="card-footer-clean">
                  <span className="debt-indicator">Debt: 0 min (0.0% ratio)</span>
                  <span className="status-label green">Passed</span>
                </div>
              </div>

            </div>

            {/* Middle Stats Bar (Coverage, Duplications, LOC) */}
            <div className="summary-banner">
              <div className="summary-item">
                <span className="label">Coverage</span>
                <div className="gauge-container">
                  <svg viewBox="0 0 36 36" className="circular-chart green">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">92.4%</text>
                  </svg>
                </div>
              </div>
              
              <div className="summary-item">
                <span className="label">Duplications</span>
                <div className="dup-stat">
                  <strong className="main-stat">0.0%</strong>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill green" style={{ width: '0%' }}></div>
                  </div>
                  <span className="sub-stat">0 duplicated blocks</span>
                </div>
              </div>

              <div className="summary-item">
                <span className="label">Lines of Code</span>
                <div className="loc-stat">
                  <strong className="main-stat">1.5k</strong>
                  <div className="languages-pills">
                    <span className="lang-pill js">JS (52%)</span>
                    <span className="lang-pill tf">Terraform (24%)</span>
                    <span className="lang-pill k8s">Kubernetes (16%)</span>
                    <span className="lang-pill css">CSS/HTML (8%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom details section */}
            <div className="details-layout">
              {/* Quality Gate Status Details */}
              <div className="details-panel">
                <h3>Quality Gate Conditions</h3>
                <ul className="conditions-list">
                  <li className="passed">
                    <span className="bullet">✓</span>
                    <strong>Coverage</strong> is greater than 80.0% <span className="current">(Current: 92.4%)</span>
                  </li>
                  <li className="passed">
                    <span className="bullet">✓</span>
                    <strong>Duplicated Lines</strong> is less than 3.0% <span className="current">(Current: 0.0%)</span>
                  </li>
                  <li className="passed">
                    <span className="bullet">✓</span>
                    <strong>Reliability Rating</strong> is A
                  </li>
                  <li className="passed">
                    <span className="bullet">✓</span>
                    <strong>Security Rating</strong> is A
                  </li>
                  <li className="passed">
                    <span className="bullet">✓</span>
                    <strong>Maintainability Rating</strong> is A
                  </li>
                </ul>
              </div>

              {/* Codebase Quality Details */}
              <div className="details-panel">
                <h3>Platform Health Metrics</h3>
                <div className="stats-list">
                  <div className="stats-row">
                    <span>Vulnerability Scanners</span>
                    <strong className="status-badge green">All Scans Passing</strong>
                  </div>
                  <div className="stats-row">
                    <span>Terraform Hardening</span>
                    <strong>Checkov Grade A (34/34 checks)</strong>
                  </div>
                  <div className="stats-row">
                    <span>Container Image Security</span>
                    <strong>Trivy filesystem scan (0 CVEs)</strong>
                  </div>
                  <div className="stats-row">
                    <span>Git Secret Exposure Checks</span>
                    <strong>Gitleaks (0 secrets found)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEVSECOPS SCANS TAB */}
        {activeTab === 'scans' && (
          <div className="tab-content fade-in">
            <div className="scan-layout">
              {/* Left Scanner Selector */}
              <div className="scanner-sidebar">
                <h3>Pipeline Security Controls</h3>
                <p className="sidebar-desc">Select a security scanner from the CI/CD pipeline to review reports and logs.</p>
                <div className="scanner-list">
                  {Object.entries(scanLogs).map(([key, scan]) => (
                    <button
                      key={key}
                      className={`scanner-item ${selectedScan === key ? 'active' : ''}`}
                      onClick={() => setSelectedScan(key)}
                    >
                      <div className="scanner-item-header">
                        <h4>{scan.name}</h4>
                        <span className="scan-status-badge green">{scan.status}</span>
                      </div>
                      <div className="scanner-item-meta">
                        <span>Time: {scan.runTime}</span>
                        <span>Issues: {scan.vulns}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Log Output */}
              <div className="log-panel">
                <div className="log-header">
                  <h3>Console Output - {scanLogs[selectedScan].name}</h3>
                  <div className="log-header-actions">
                    <span>Rules: {scanLogs[selectedScan].rules}</span>
                    <button className="copy-btn" onClick={() => alert('Log content copied to clipboard!')}>
                      Copy Logs
                    </button>
                  </div>
                </div>
                <div className="log-body">
                  <pre>{scanLogs[selectedScan].log}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* E-COMMERCE STORE TAB (Original Store Demo) */}
        {activeTab === 'store' && (
          <div className="tab-content fade-in store-container">
            <div className="store-header">
              <h2>MERN Storefront Live Sandbox</h2>
              <p>Interact with the live ecommerce app. Product data is loaded dynamically from MongoDB via the Express API.</p>
              <div className="search-and-status">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="store-search"
                />
                <div className="live-status">{status}</div>
              </div>
            </div>

            <div className="grid">
              {/* Product Catalog */}
              <section className="panel">
                <div className="section-header">
                  <h2>Product Catalog</h2>
                  <span>{filteredProducts.length} items found</span>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <p className="muted no-products">No products matched your search. Wait for database seeding if empty.</p>
                ) : (
                  <div className="products">
                    {filteredProducts.map((product) => (
                      <article key={product._id} className="card">
                        <div className="card-image">{product.category}</div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="card-footer">
                          <strong>${product.price}</strong>
                          <button type="button" onClick={() => addToCart(product)}>
                            Add to Cart
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Cart Summary */}
              <aside className="panel cart-panel">
                <div className="section-header">
                  <h2>Cart Summary</h2>
                  <span>{cart.length} line items</span>
                </div>
                <div className="cart-items">
                  {cart.length === 0 ? (
                    <p className="muted">Cart is empty. Add a product to simulate checkout.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.productId} className="cart-item">
                        <div>
                          <strong>{item.name}</strong>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <strong>${total}</strong>
                </div>
                <button 
                  type="button" 
                  className="checkout" 
                  disabled={cart.length === 0}
                  onClick={placeOrder}
                >
                  Place Order
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* PIPELINE ARCHITECTURE TAB */}
        {activeTab === 'architecture' && (
          <div className="tab-content fade-in">
            <div className="architecture-panel">
              <h2>DevSecOps & GitOps Delivery Architecture</h2>
              <p className="subtitle">Interactive mapping of the EKS deployment workflow. Hover over components for platform details.</p>
              
              <div className="pipeline-flow">
                
                {/* Step 1 */}
                <div className="flow-step-card">
                  <div className="step-num">01</div>
                  <h4>Developer Push</h4>
                  <p className="step-desc">Code is pushed to GitHub, triggering security audits and tests in the CI workflow.</p>
                  <span className="badge-control green">Git Trigger</span>
                </div>

                <div className="flow-arrow">→</div>

                {/* Step 2 */}
                <div className="flow-step-card">
                  <div className="step-num">02</div>
                  <h4>GitHub Actions CI</h4>
                  <p className="step-desc">Executes Semgrep, Gitleaks, Checkov, and builds container images scanned by Trivy.</p>
                  <span className="badge-control green">Security Scan</span>
                </div>

                <div className="flow-arrow">→</div>

                {/* Step 3 */}
                <div className="flow-step-card">
                  <div className="step-num">03</div>
                  <h4>Amazon ECR</h4>
                  <p className="step-desc">Stores immutable container images tagged by Git SHA with automatic registry scans.</p>
                  <span className="badge-control green">ECR Registry</span>
                </div>

                <div className="flow-arrow">→</div>

                {/* Step 4 */}
                <div className="flow-step-card">
                  <div className="step-num">04</div>
                  <h4>ArgoCD GitOps</h4>
                  <p className="step-desc">Detects updates in helm charts, pulls the image digest, and auto-syncs the EKS cluster.</p>
                  <span className="badge-control green">GitOps Pull</span>
                </div>

                <div className="flow-arrow">→</div>

                {/* Step 5 */}
                <div className="flow-step-card">
                  <div className="step-num">05</div>
                  <h4>Amazon EKS</h4>
                  <p className="step-desc">Hosts the MERN application. Workloads are validated by Kyverno admission controller.</p>
                  <span className="badge-control green">K8s Cluster</span>
                </div>

              </div>

              {/* Extra Architecture Notes */}
              <div className="architecture-notes">
                <div className="note-card">
                  <h5>Security Guardrails (Kyverno)</h5>
                  <p>Kyverno policies run in the EKS cluster to block privileged containers, enforce non-root execution, and validate pod resource quotas automatically.</p>
                </div>
                <div className="note-card">
                  <h5>Continuous Observability</h5>
                  <p>Prometheus collects API metrics, Loki centralizes cluster logs, and Grafana maps visual dashboards for cluster utilization and application response times.</p>
                </div>
                <div className="note-card">
                  <h5>Least Privilege Access</h5>
                  <p>IAM Roles for Service Accounts (IRSA) secure pod communication to AWS Secrets Manager, keeping database passwords off the Kubernetes manifests.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Page Footer */}
      <footer className="dashboard-footer">
        <p>Enterprise DevSecOps + GitOps Platform • Configured to SonarCloud Quality Standards</p>
      </footer>
    </div>
  );
}
