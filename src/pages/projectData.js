const projects = [
  {
    title: 'Autonomous Warehouse Robot',
    description: 'A ROS 2 simulation that sends a mobile robot to named destinations in a custom warehouse.',
    approach: 'Gazebo simulates the robot and LiDAR. Nav2 plans routes on an occupancy map and executes goals from a keyword parser or an optional Mistral command layer.',
    contribution: 'I built the Gazebo environment, mapped the warehouse, and prototyped the Mistral parser in a five-person team.',
    stack: ['ROS 2', 'Gazebo', 'Nav2', 'Python', 'C++'],
    links: [
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
    title: 'OpenClaw Desktop',
    description: 'A Windows workspace for chatting with a local assistant, attaching files, and collecting daily market data.',
    approach: 'An Electron and React client connects to an existing OpenClaw installation in WSL. The data collector stores OHLCV history in local SQLite, supports scheduled runs, and exports CSV files.',
    stack: ['Electron', 'TypeScript', 'React', 'SQLite', 'Ollama'],
    links: [{ label: 'Source code', url: 'https://github.com/AntonIlin17/openclawUI' }],
    images: [
      { src: '/projects/openclaw/overview.webp', alt: 'OpenClaw Desktop overview with its local assistant connected', caption: 'Connected assistant workspace' },
      { src: '/projects/openclaw/conversation.webp', alt: 'OpenClaw Desktop conversation showing a local model response', caption: 'Local model conversation' },
      { src: '/projects/openclaw/stocks.webp', alt: 'Market data collection dashboard with a watchlist and price chart', caption: 'Scheduled market data workspace' },
    ],
  },
]

export default projects
