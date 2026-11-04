// Notebook metadata: one figure, two headline metrics, a Colab link each.
import robustness from '../assets/notebooks/perceptron-robustness.webp'
import cifar from '../assets/notebooks/cifar-predictions.webp'
import mnist from '../assets/notebooks/mnist-pca.webp'
import kmeans from '../assets/notebooks/kmeans-silhouette.webp'
import gmm from '../assets/notebooks/gmm-anomalies.webp'

export const NOTEBOOKS = [
  {
    course: 'COMP 258 · Assignment 1',
    title: 'Perceptron, ADALINE & a Keras ANN',
    image: robustness,
    alt: 'Average accuracy of the perceptron and ADALINE under wrong and missing pixels',
    metrics: ['21 letter patterns · 3 fonts · 100% clean accuracy', 'Hepatitis ANN: scaled inputs + Adam, 80.6% validation'],
    url: 'https://colab.research.google.com/drive/1vuoii2_AYniLs2NBuriSqMfOTB_UF96f',
  },
  {
    course: 'COMP 258 · Assignment 2',
    title: 'Manual MLP + CIFAR-10 MLP study',
    image: cifar,
    alt: 'First 12 CIFAR-10 test images with predicted class and confidence',
    metrics: ['Hand-coded backprop, gradient-checked · Iris 100% test', '6 configurations compared, 394k params · 47.0% test'],
    url: 'https://colab.research.google.com/drive/1QuYylCA8NYo_XGLM3pFwXbiMdTlpUg1P',
  },
  {
    course: 'COMP 257 · Lab 1',
    title: 'PCA, Incremental PCA, Kernel PCA',
    image: mnist,
    alt: 'MNIST projected onto its first two principal components',
    metrics: ['MNIST 784 → 154 components', 'Swiss roll kPCA grid search: rbf γ=0.01, 76.6% CV'],
    url: 'https://colab.research.google.com/drive/1tco3tQaoBqUzw-wFTGw2NLd7bOEyDaZj',
  },
  {
    course: 'COMP 257 · Lab 2',
    title: 'Olivetti faces: PCA, K-Means, DBSCAN, SVM',
    image: kmeans,
    alt: 'Silhouette score for each K-Means model on PCA-reduced faces',
    metrics: ['99% variance PCA · best k=80 (silhouette .225)', 'Linear SVM on PCA 95.0% test vs K-Means features 82.5%'],
    url: 'https://colab.research.google.com/drive/1W0IciiR3-0fWFxSKk2N0w6x-cYbc9m3-',
  },
  {
    course: 'COMP 257 · Lab 3',
    title: 'Hierarchical clustering & GMM anomalies',
    image: gmm,
    alt: 'GMM log-density of normal, rotated, flipped and darkened faces',
    metrics: ['Ward dendrogram ARI 0.468 · BIC model selection', 'Rotated faces: detection 100%, ROC-AUC 1.00'],
    url: 'https://colab.research.google.com/drive/1ga0jRWjQ_3HR_hMKbjZ9hC58gO6lpU8Q',
  },
  {
    course: 'COMP 247 · KSI group project',
    title: 'Toronto collision data quality & EDA',
    chart: true,
    metrics: ['18,938 person rows → 6,863 collisions · 13.9% fatal', "Cramér's V association, missingness by year, 17 charts"],
    url: 'https://colab.research.google.com/drive/1z7MIAkONTCMrrOr1AWJBntugjIisNhQG',
  },
]

