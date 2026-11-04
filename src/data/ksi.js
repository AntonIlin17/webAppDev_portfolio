// Collision-level counts from the COMP 247 KSI notebook
// (Anton_KSI_data_quality_and_visual_analysis_executed.ipynb).
export const KSI_BY_HOUR = {
  labels: Array.from({ length: 24 }, (_, h) => `${h}:00`),
  collisions: [206, 162, 178, 152, 71, 117, 228, 231, 260, 293, 289, 297, 306, 309, 377, 407, 385, 449, 480, 410, 370, 339, 300, 247],
  fatal: [39, 28, 26, 28, 15, 28, 38, 28, 28, 47, 45, 41, 42, 39, 51, 42, 42, 46, 68, 45, 59, 49, 41, 40],
}

export const KSI_BY_YEAR = {
  labels: Array.from({ length: 18 }, (_, i) => String(2006 + i)),
  collisions: [481, 453, 417, 438, 400, 399, 453, 431, 350, 350, 386, 392, 422, 366, 269, 270, 290, 296],
  fatal: [57, 47, 51, 45, 42, 34, 44, 63, 51, 65, 76, 62, 66, 63, 40, 58, 48, 43],
}
