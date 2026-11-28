// The colours of the chosen build, for code that draws on a canvas.
// portfolio.css holds the same values as custom properties: change both together.
export const theme = {
  ground: '#262121', // page background
  ink: '#ba081a', // the dots, and the accent
  heading: '#fdfcfc',
  body: '#adaba4',
  quiet: '#837f7c',
}

// The dither settings of the chosen build: surface, grain, pointer and motion.
export const look = {
  mode: 'dither',
  cell: 3,
  pointer: 'disperse',
  air: 'drift',
}

// The two recordings of the signature being written over the 3D name.
// `still` is the moment the signature is complete, in seconds.
export const signature = {
  mp4: '/build-art/sig/sig-b.mp4',
  webm: '/build-art/sig/sig-b.webm',
  poster: '/build-art/sig/sig-b.webp',
  still: 8.8,
}
