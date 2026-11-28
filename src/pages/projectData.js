const projects = [
  {
    title: 'Autonomous Warehouse Robot',
    description: 'A ROS 2 simulation that sends a mobile robot to named destinations in a custom warehouse.',
    approach: 'Gazebo simulates the robot and LiDAR. Nav2 plans routes on an occupancy map and executes goals from a keyword parser or an optional Mistral command layer.',
    contribution: 'On a five-person team, I built and mapped the Gazebo warehouse, debugged and tested the robot model in it, and prototyped the Mistral connection.',
    stack: ['ROS 2', 'Gazebo', 'Nav2', 'Python', 'C++'],
    links: [
      { label: 'Watch demo', url: '/demos/warehouse-navigation.webm' },
      { label: 'Case study', url: 'https://github.com/AntonIlin17/autonomous-warehouse-robot/blob/main/showcase/case-study.md' },
      { label: 'Source code', url: 'https://github.com/AntonIlin17/autonomous-warehouse-robot' },
    ],
    images: [
      { src: '/projects/warehouse/gazebo.webp', alt: 'Gazebo view of the robot and obstacles in a simulated warehouse', caption: 'The warehouse in Gazebo' },
      { src: '/projects/warehouse/rviz-route.webp', alt: 'RViz occupancy map with a planned route through the warehouse', caption: 'Nav2 route in RViz' },
      { src: '/projects/warehouse/command-interface.webp', alt: 'Sanitized terminal output from the Mistral destination and Nav2 goal verification', caption: 'Verified command and navigation result' },
    ],
  },
  {
    title: 'Dither Cabinet',
    description: 'An offline graphics playground that turns 58 sculptural objects into interactive fields of dots.',
    approach: 'WebGL2 renders the artwork on the GPU, with a Canvas fallback. The studio exposes relief, 3D, and drag modes with controls for patterns, ink, lighting, and motion.',
    stack: ['JavaScript', 'WebGL2', 'Canvas'],
    links: [
      { label: 'Try the demo', url: '/demos/dither-cabinet/index.html' },
      { label: 'Demo source', url: 'https://github.com/AntonIlin17/webAppDev_portfolio/tree/main/public/demos/dither-cabinet' },
    ],
    images: [
      { src: '/projects/dither/dither-initial.webp', alt: 'Dithered dahlia on a dark canvas with print studio controls', caption: 'Dahlia in the print studio' },
      { src: '/projects/dither/dither-three-dimensional.webp', alt: 'Calla Lily rendered in the studio’s 3D form mode', caption: 'Calla Lily in 3D form mode' },
      { src: '/projects/dither/dither-collection.webp', alt: 'A grid of sculptural studies in the Dither Cabinet collection', caption: 'The collection browser' },
    ],
  },
  {
    title: 'OpenClaw Desktop',
    description: 'A Windows workspace for chatting with a local assistant, attaching files, and collecting daily market data.',
    approach: 'An Electron and React client connects to OpenClaw in WSL and runs Qwen through Ollama. It supports file analysis, voice dictation, and chat exports. A separate workspace schedules market-data collection, stores it in SQLite, and exports CSV.',
    stack: ['Electron', 'TypeScript', 'React', 'SQLite', 'Ollama'],
    links: [
      { label: 'Watch demo', url: '/demos/openclaw-desktop.webm' },
      { label: 'Source code', url: 'https://github.com/AntonIlin17/openclawUI' },
    ],
    images: [
      { src: '/projects/openclaw/conversation.webp', alt: 'Complete Qwen conversation with an attached warehouse CSV, a finished file read, a results table, and an 8.2% follow-up calculation', caption: 'Full local conversation with CSV analysis' },
      { src: '/projects/openclaw/working.webp', alt: 'The assistant has accepted a follow-up request and displays the live run status and stop control', caption: 'Live run progress and stop control' },
      { src: '/projects/openclaw/voice-input.webp', alt: 'Windows speech recognition has added a dictated phrase to the existing chat draft', caption: 'Windows dictation in the chat composer' },
      { src: '/projects/openclaw/connection.webp', alt: 'Connection settings show Ollama available, the Qwen model selected, and OpenClaw connected', caption: 'Connected Ollama and OpenClaw services' },
      { src: '/projects/openclaw/stocks.webp', alt: 'Market workspace shows 753 collected price records, a real price chart, and a saved collection schedule', caption: 'Live market data and collection schedule' },
    ],
  },
  {
    title: 'Neural Networks from Scratch and CIFAR-10',
    description: 'Two Colab experiments that explore backpropagation and measure how design choices affect image classification.',
    approach: 'I implemented an Iris network in NumPy and compared eight Keras multilayer perceptrons on a fixed CIFAR-10 split. The validation-selected network scored 46.96% on 10,000 held-out test images.',
    stack: ['NumPy', 'TensorFlow', 'Keras', 'Colab'],
    links: [
      { label: 'Open in Colab', url: 'https://colab.research.google.com/github/AntonIlin17/machine-learning-portfolio/blob/main/notebooks/manual-backprop-and-cifar10.ipynb' },
      { label: 'Source code', url: 'https://github.com/AntonIlin17/machine-learning-portfolio#neural-networks-from-scratch-and-cifar-10' },
    ],
    images: [
      { src: '/projects/neural-networks/cifar10-baseline-comparison.webp', alt: 'Accuracy and loss curves comparing the baseline and selected CIFAR-10 networks', caption: 'CIFAR-10 baseline versus selected model' },
      { src: '/projects/neural-networks/cifar10-confusion-matrix.webp', alt: 'Ten-class CIFAR-10 confusion matrix for the selected multilayer perceptron', caption: 'Held-out test confusion matrix' },
      { src: '/projects/neural-networks/iris-backprop-loss.webp', alt: 'Iris training loss falling over epochs for a manually implemented network', caption: 'NumPy backpropagation training loss' },
    ],
  },
  {
    title: 'Clustering and Anomaly Detection',
    description: 'An unsupervised learning study of clustering and anomaly scores on the Olivetti benchmark.',
    approach: 'I used PCA features with K-means, DBSCAN, Ward clustering, and Gaussian mixtures. In the saved run, the likelihood threshold caught every 30° rotation and performed much worse on flips and darkening.',
    stack: ['Python', 'scikit-learn', 'PCA', 'Matplotlib'],
    links: [
      { label: 'Open in Colab', url: 'https://colab.research.google.com/github/AntonIlin17/machine-learning-portfolio/blob/main/notebooks/olivetti-gmm-anomaly-detection.ipynb' },
      { label: 'Source code', url: 'https://github.com/AntonIlin17/machine-learning-portfolio#clustering-and-anomaly-detection' },
    ],
    images: [
      { src: '/projects/clustering/gmm-anomaly-scores.webp', alt: 'Box plots comparing original and transformed image likelihoods against a validation threshold', caption: 'Sensitivity to three image transformations' },
      { src: '/projects/clustering/kmeans-silhouette.webp', alt: 'Silhouette scores across candidate K-means cluster counts', caption: 'K-means cluster-count sweep' },
      { src: '/projects/clustering/gmm-model-selection.webp', alt: 'AIC and BIC curves across Gaussian mixture sizes and covariance types', caption: 'Gaussian mixture model selection' },
    ],
  },
]

export default projects
