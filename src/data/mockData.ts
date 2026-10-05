import { CandidateProfile, CyberIncident, JobRecommendation, ShoppingProduct } from '../types/career';

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  name: 'Alex Rivera',
  targetRole: 'Full Stack Software Engineer',
  degree: 'B.Tech in Computer Science & Engineering',
  college: 'National Institute of Technology',
  graduationYear: '2026',
  experienceLevel: 'Entry Level (Fresh Graduate)',
  github: 'https://github.com/alexrivera-dev',
  linkedin: 'https://linkedin.com/in/alexrivera-tech',
  portfolio: 'https://alexrivera.dev',
  currentSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'MongoDB', 'Git', 'REST APIs', 'SQL']
};

export const SAMPLE_RESUMES: Record<string, { title: string; targetRole: string; content: string }> = {
  mern: {
    title: 'Full Stack MERN Developer (Placement Ready)',
    targetRole: 'Full Stack Developer',
    content: `ALEX RIVERA
Bangalore, India | +91 98765 43210 | alexrivera-dev@gmail.com
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/alexrivera-dev

EDUCATION
Bachelor of Technology in Computer Science & Engineering (2022 – 2026)
National Institute of Technology | CGPA: 8.85/10.0

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, Python, C++, SQL
Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3
Backend & DB: Node.js, Express.js, REST APIs, MongoDB, PostgreSQL, Redis
Tools & DevOps: Git, Docker, Postman, Jest, Linux, CI/CD, Vite

PROJECTS
1. AI Career Coach Platform (React, Node.js, Gemini API, Express, Tailwind CSS)
- Architected a full-stack career platform analyzing 500+ student resumes with ATS scoring algorithm.
- Implemented real-time AI mock interview simulator with speech recognition and STAR feedback scoring.
- Engineered automated skill gap analytics with custom learning roadmaps, reducing prep time by 40%.
- Integrated robust REST APIs with rate-limiting, error boundaries, and response caching.

2. Cyber Incident Reporting Portal (React, Express, MongoDB, Node.js)
- Built enterprise-grade incident management portal with P1-P4 triage matrix and evidence hash validation.
- Designed dynamic SOC admin dashboard displaying real-time MTTR metrics and threat category analytics.
- Deployed multi-role RBAC authorization and secure audit trails for SOC compliance.

3. Distributed E-Commerce Microservice (Node.js, Redis, MongoDB)
- Developed resilient cart and checkout services handling 1,000+ concurrent simulated transactions.
- Implemented Redis cache-aside strategy, reducing database read latency by 65%.

EXPERIENCE / INTERNSHIPS
Software Engineering Intern | DevCore Technologies (May 2025 – July 2025)
- Spearheaded migration of legacy internal dashboard to React 19 + TypeScript, boosting load speed by 35%.
- Collaborated in an agile scrum team of 8 engineers, participating in daily standups and code reviews.
- Authored 25+ unit and integration test suites achieving 88% code coverage with Jest.

ACHIEVEMENTS & CERTIFICATIONS
- Global Rank 412 out of 18,000+ participants in LeetCode Biweekly Contest 120 (Rating: 1850+).
- AWS Certified Cloud Practitioner (2025).
- Finalist in Smart India Hackathon (National Level, 2024).`
  },
  cyber: {
    title: 'Cyber Security & SOC Analyst Resume',
    targetRole: 'Cyber Security Analyst',
    content: `JORDAN CHEN
SecOps & Cyber Defense Specialist | jordan.chen.cyber@proton.me | +1 (555) 234-5678
LinkedIn: linkedin.com/in/jordanchen-sec | GitHub: github.com/jordanchen-cyber

PROFESSIONAL SUMMARY
Proactive Cybersecurity graduate with hands-on experience in vulnerability assessment, SIEM monitoring, threat intelligence, and incident triage. Proven track record in building automated threat detection tools.

TECHNICAL COMPETENCIES
- Security Operations: SIEM (Splunk, Elastic), Wireshark, Nmap, Snort, Burp Suite
- Incident Response: NIST CSF, MITRE ATT&CK Framework, Root Cause Analysis, Memory Forensics
- Languages & Scripting: Python (Scapy, Requests), Bash, PowerShell, SQL
- Cloud & Infrastructure: AWS Security Groups, Linux Hardening, Docker, Firewalls

PROJECT HIGHLIGHTS
1. Automated Incident Reporting & Evidence Vault Portal
- Created web platform for forensic intake, SHA-256 evidence verification, and containment tracking.
- Automated alert correlation reducing false positives by 28%.

2. Python Network Intrusion & Port Scanner
- Developed multi-threaded port scanner identifying common CVEs and unpatched services across subnets.

CERTIFICATIONS
- CompTIA Security+ (SY0-701)
- Certified Ethical Hacker (CEH v12) - In Progress`
  },
  data: {
    title: 'Data Analyst & Machine Learning Associate',
    targetRole: 'Data Analyst / Junior ML Engineer',
    content: `PRIYA SHARMA
Hyderabad, India | priya.sharma.data@gmail.com | +91 99887 76655
GitHub: github.com/priyasharma-analytics | Kaggle: kaggle.com/priyadata

SUMMARY
Analytical thinker with strong command over Python, SQL, statistical modeling, and PowerBI. Passionate about transforming raw data pipelines into actionable business insights.

CORE SKILLS
- Analytics: Python (Pandas, NumPy, Scikit-Learn), SQL, Tableau, PowerBI, Excel (VBA)
- Machine Learning: Classification, Linear/Logistic Regression, Random Forests, Clustering
- Databases: PostgreSQL, BigQuery, MongoDB

KEY PROJECTS
1. AI Recommendation Engine for E-Commerce
- Built collaborative and content-based recommendation models evaluating 50,000+ item transactions.
- Improved product click-through rates (CTR) by 22% in simulated A/B testing.

2. Placement Predictor & Salary Insights Model
- Trained ML model on 5,000+ student profiles predicting placement probability with 89% accuracy.`
  }
};

export const INITIAL_JOB_RECOMMENDATIONS: JobRecommendation[] = [
  {
    id: 'job-1',
    title: 'Associate Software Engineer (Full Stack)',
    company: 'NexusTech Global',
    logo: '💼',
    location: 'Bangalore / Hybrid',
    type: 'Full-time',
    salary: '₹8,50,000 - ₹12,00,000 / yr',
    matchScore: 94,
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL'],
    description: 'Looking for high-energy campus graduates to join our Core Platforms team. You will build customer-facing web apps and high-throughput microservices.',
    applyLink: 'https://careers.example.com/nexustech-fullstack',
    applicationStatus: 'Saved'
  },
  {
    id: 'job-2',
    title: 'Frontend Developer (React 19 & Next.js)',
    company: 'HyperScale AI',
    logo: '🚀',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹10,00,000 - ₹14,50,000 / yr',
    matchScore: 91,
    requiredSkills: ['React', 'Tailwind CSS', 'TypeScript', 'State Management', 'Vite'],
    matchedSkills: ['React', 'Tailwind CSS', 'TypeScript', 'Vite'],
    description: 'Help build next-generation AI interfaces with cutting-edge UI engineering, streaming responses, and responsive motion design.',
    applyLink: 'https://careers.example.com/hyperscale-frontend',
    applicationStatus: 'Applied',
    appliedDate: '2026-10-02'
  },
  {
    id: 'job-3',
    title: 'Graduate SDE - Backend & Cloud',
    company: 'CloudSphere Labs',
    logo: '☁️',
    location: 'Pune / On-site',
    type: 'Full-time',
    salary: '₹9,00,000 - ₹13,00,000 / yr',
    matchScore: 86,
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'System Design Basics'],
    matchedSkills: ['Node.js', 'Express', 'MongoDB'],
    description: 'Join our backend infrastructure division. You will build fault-tolerant message queues, microservices, and database replication layers.',
    applyLink: 'https://careers.example.com/cloudsphere-sde',
    applicationStatus: 'Interviewing',
    appliedDate: '2026-09-28'
  },
  {
    id: 'job-4',
    title: 'Junior Cyber Defense & SOC Analyst',
    company: 'Aegis Sentinel Security',
    logo: '🛡️',
    location: 'Hyderabad / Hybrid',
    type: 'Full-time',
    salary: '₹7,50,000 - ₹11,00,000 / yr',
    matchScore: 78,
    requiredSkills: ['Incident Response', 'Network Security', 'Linux', 'Python Scripting', 'SIEM'],
    matchedSkills: ['Linux', 'Python Scripting'],
    description: 'Monitor alerts, investigate security anomalies, handle incident triage, and maintain containment playbooks in our 24/7 SOC.',
    applyLink: 'https://careers.example.com/aegis-soc',
    applicationStatus: 'Saved'
  }
];

export const MOCK_CYBER_INCIDENTS: CyberIncident[] = [
  {
    id: 'INC-2026-084',
    title: 'Credential Harvesting Phishing Campaign Targeting Dev Ops',
    severity: 'P1-Critical',
    status: 'Containment',
    category: 'Phishing',
    reporter: 'dev-ops-lead@company.internal',
    timestamp: '2026-10-05 08:34:12 UTC',
    affectedSystems: ['AWS Production IAM', 'Internal GitLab', 'SSO Gateway'],
    description: 'Deceptive domain mimicking enterprise Okta SSO portal was dispatched to 42 engineering personnel. 3 users submitted 2FA credentials.',
    evidenceFiles: [
      { name: 'phishing_raw_headers.eml', size: '42 KB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'email' },
      { name: 'malicious_redirect_pcap.pcap', size: '2.4 MB', hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b', type: 'network' }
    ],
    iocs: ['hxxps://login-okta-auth-verify[.]net/session', '198.51.100.77', 'SHA256: 9b2d8...'],
    responseActionPlan: [
      'Revoked compromised AWS IAM active sessions',
      'Forced SSO password reset and rotated YubiKey tokens',
      'Pushed DNS sinkhole entry company-wide for phishing domain'
    ]
  },
  {
    id: 'INC-2026-079',
    title: 'Anomalous Data Exfiltration on Staging S3 Bucket',
    severity: 'P2-High',
    status: 'Triaging',
    category: 'Data Breach',
    reporter: 'cloud-guardduty-bot',
    timestamp: '2026-10-04 19:12:00 UTC',
    affectedSystems: ['s3://staging-backup-assets', 'VPC NAT Gateway 02'],
    description: 'CloudTrail identified 80 GB of unexpected outbound traffic to an unclassified external IP address outside maintenance windows.',
    evidenceFiles: [
      { name: 'cloudtrail_audit_log.json', size: '512 KB', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', type: 'log' }
    ],
    iocs: ['203.0.113.195', 's3:GetObject batch anomaly'],
    responseActionPlan: [
      'Applied restrictive S3 bucket policy denying public and external IPs',
      'Initiated forensic memory dump on associated EC2 instance'
    ]
  },
  {
    id: 'INC-2026-062',
    title: 'Distributed Denial of Service (DDoS) Against Public API Gateway',
    severity: 'P2-High',
    status: 'Closed',
    category: 'DDoS',
    reporter: 'monitoring-pagerduty',
    timestamp: '2026-10-02 14:05:22 UTC',
    affectedSystems: ['Cloudflare Edge WAF', 'API Gateway cluster'],
    description: 'Volumetric HTTP/2 flood generating 120,000 requests/sec. Successfully mitigated via automated rate limiting and challenge rules.',
    evidenceFiles: [
      { name: 'waf_blocked_requests.csv', size: '8.1 MB', hash: 'c52ac8136ff96c1417531fd74be88390885e3b5e40632d431c94411131ef3c67', type: 'csv' }
    ],
    iocs: ['SYN flood from 400+ distinct botnet ASN prefixes'],
    responseActionPlan: [
      'Elevated Cloudflare security level to Under Attack mode',
      'Rate-limited /api/v1/auth endpoints to 20 req/min per IP'
    ]
  }
];

export const MOCK_SHOPPING_PRODUCTS: ShoppingProduct[] = [
  {
    id: 'prod-1',
    name: 'AeroCraft Pro Wireless Mechanical Keyboard',
    category: 'Peripherals',
    price: 89.99,
    rating: 4.8,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    badge: 'AI Top Pick for Devs',
    description: 'Hot-swappable tactile switches, programmable OLED knob, aluminum frame, and 200-hour battery life.',
    specs: ['Gateron Yellow Switches', 'RGB Backlit', 'Tri-Mode Bluetooth/2.4G/Wired', 'Sound-dampening foam'],
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'ErgoView 27" 4K IPS Developer Monitor',
    category: 'Monitors',
    price: 329.99,
    rating: 4.9,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Coding Display',
    description: '99% sRGB color accuracy, 90W USB-C Power Delivery, auto-rotation portrait mode for coding files.',
    specs: ['3840x2160 UHD', '60Hz EyeCare', '90W USB-C Hub', 'VESA Mount Included'],
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'NeuroFocus Active Noise Cancelling Headphones',
    category: 'Audio',
    price: 149.50,
    rating: 4.7,
    reviewsCount: 289,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'Deep Work Essential',
    description: 'Hybrid active noise cancellation filtering out 98% of ambient office noise, dual beamforming mics.',
    specs: ['40hr Battery', 'Multipoint Bluetooth 5.3', 'Ultra-soft Memory Foam', 'Fast Charge 10min = 5hr'],
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'ZenithDesk Electric Dual-Motor Standing Desk',
    category: 'Furniture',
    price: 279.00,
    rating: 4.8,
    reviewsCount: 194,
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80',
    badge: 'Ergonomic Choice',
    description: 'Ultra-silent dual motors, 4 memory height presets, anti-collision sensor, and integrated cable tray.',
    specs: ['55" x 28" Solid Walnut Top', 'Height: 28" - 48"', 'Capacity: 120kg', '5-Year Warranty'],
    inStock: true
  }
];
