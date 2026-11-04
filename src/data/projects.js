// Featured project metadata. Demo components are attached in Projects.jsx.
export const FEATURED = [
  {
    id: 'stingysplitter',
    title: 'StingySplitter',
    tags: [{ label: 'Live at stingysplitter.com', kind: 'live' }, 'React 19', 'TypeScript', 'Express 5', 'Claude vision', 'Firebase'],
    description:
      'Snap a photo of a receipt, let a vision model turn it into line items, tap who had what, and get a penny-perfect "who owes whom" you can share with a link. No sign-in.',
    stats: [
      { value: '99', label: 'Vitest cases' },
      { value: '3-pass', label: 'vision pipeline' },
      { value: '0¢', label: 'rounding drift' },
    ],
    facts: [
      'Extract → verify → reconcile pipeline streams progress to the client as NDJSON.',
      'Integer-cent split engine with largest-remainder allocation, so every split sums exactly.',
      'Share links carry the whole split in the URL (deflate + base64url, 3–4× smaller than JSON).',
      'Per-IP token-bucket rate limits and an origin allow-list keep the paid parser safe.',
    ],
    links: [
      { label: 'Open the app ↗', href: 'https://stingysplitter.com', primary: true },
      { label: 'Source', href: 'https://github.com/AntonIlin17/StingySplitter' },
    ],
  },
  {
    id: 'warehouse-robot',
    title: 'Autonomous Warehouse Robot',
    tags: [{ label: '5-person team · my parts below', kind: 'team' }, 'ROS 2 Jazzy', 'Nav2', 'Gazebo', 'Python · C++', 'Mistral'],
    description:
      'A LiDAR robot navigates a custom Gazebo warehouse between seven named destinations. Type a plain-English request; a keyword parser or an allow-listed Mistral resolver picks the destination and Nav2 drives there.',
    role: 'My parts: the Gazebo environment, manual mapping with SLAM Toolbox, and the Mistral natural-language resolver (built after the course, verified end to end).',
    stats: [
      { value: '7', label: 'destinations' },
      { value: '24', label: 'pytest cases' },
      { value: '0.05 m', label: 'costmap resolution' },
    ],
    facts: [
      'One canonical locations.csv shared by the C++ menu and both Python nodes.',
      'LLM output is validated against the allow-list; anything else falls back to deterministic matching.',
      'NavFn global planner + Regulated Pure Pursuit controller + AMCL localization; CI builds the ROS workspace.',
    ],
    links: [{ label: 'Source & case study ↗', href: 'https://github.com/AntonIlin17/autonomous-warehouse-robot', primary: true }],
  },
  {
    id: 'ml-coursework',
    title: 'Neural networks & machine learning',
    tags: ['COMP 258 Neural Networks', 'COMP 257 Unsupervised ML', 'COMP 247', 'TensorFlow / Keras', 'scikit-learn'],
    description:
      'Course assignments where I implemented the models myself rather than calling a library: a perceptron and ADALINE in NumPy, a manual MLP with hand-derived backprop (gradient-checked), Keras MLPs on CIFAR-10 and the hepatitis dataset, plus PCA, K-Means, DBSCAN and Gaussian mixtures on faces and MNIST.',
    stats: [
      { value: '100%', label: 'Iris test acc. (manual MLP)' },
      { value: '95%', label: 'Olivetti SVM on PCA' },
      { value: '47.0%', label: 'CIFAR-10 MLP (no conv)' },
    ],
    facts: [
      'Noise-robustness study: ADALINE stays at 100% with 20 missing pixels where the perceptron drops to 97%.',
      'Model selection done on validation only; the CIFAR test set was touched once, after selection.',
      'GMM anomaly detection on faces: rotated images flagged with ROC-AUC 1.00 at a 5th-percentile threshold.',
    ],
    links: [],
    note: 'Each notebook card below links to the Colab notebook. The demo on the right re-creates Assignment 1 in JavaScript.',
  },
]

export const EARLIER = [
  {
    title: 'RSS Aggregator',
    description:
      'Built a feed aggregator that parses multiple RSS sources, normalizes entries, and renders a searchable UI using React.',
    imageKeys: ['rssFeedMain', 'rssFeed1'],
  },
  {
    title: 'TourConnect',
    description:
      'Full‑stack prototype connecting local tour guides with travelers; React front end with simple Node API mock.',
    imageKeys: ['systemDiagram'],
  },
  {
    title: 'QA Automation Examples',
    description:
      'Quality Assurance focus with targeted test suites: crafted boundary and negative test cases for the User API (CRUD validation, pagination, error handling, and rate‑limiting) and for user account authentication (signup/login/logout flows, password hashing & salting, JWT/refresh token handling, session expiry, and lockout after repeated failures). Each scenario includes reproducible steps, expected/actual results, and assertions covering success, error, and security edge cases.',
    imageKeys: [],
  },
]
