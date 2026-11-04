// COMP 257 Labs 1–2: PCA and K-Means with silhouette-based model selection.
import { NOTEBOOK_CODE as C } from '../../data/notebookCode.js'
import { IRIS_FEATURES, IRIS_SPECIES, IRIS_X, IRIS_Y } from '../../data/iris.js'
import { fitStandardizer, kmeans, pca, silhouetteScore } from '../../lib/ml.js'
import { nextFrame } from './frame.js'
import { DataTable, LineChart, Scatter, Stream } from './outputs.jsx'

function ensurePca(k) {
  if (!k.pca) {
    const Z = fitStandardizer(IRIS_X).transform(IRIS_X)
    const model = pca(Z, 2)
    k.pca = { model, P: model.transform(Z) }
  }
  return k.pca
}

export const lab2 = {
  id: 'lab2',
  file: 'anton_COMP257_lab_assignment2.ipynb',
  subtitle: 'Unsupervised learning: PCA, K-Means, silhouette selection · scikit-learn in the notebook',
  url: 'https://colab.research.google.com/drive/1W0IciiR3-0fWFxSKk2N0w6x-cYbc9m3-',
  note: 'The notebook runs on 400 Olivetti face images (4096 pixels each) and Lab 1 on 70,000 MNIST digits, too heavy for a browser. These cells run the same pipeline on Iris: PCA by eigen-decomposition, k-means++ seeding, Lloyd iterations and the silhouette score, all implemented from scratch in JavaScript.',
  cells: [
    {
      id: 'pca',
      heading: 'PCA — keep the first two principal components and report the variance they explain',
      short: `pca = PCA(n_components=2, random_state=42)
x_pca = pca.fit_transform(x)                       # fit on the training rows, project everything
print("PCA explained variance ratio:", pca.explained_variance_ratio_)
print("combined variance retained:", pca.explained_variance_ratio_.sum())

plt.scatter(x_pca[:, 0], x_pca[:, 1], c=y, cmap="tab10", s=5, alpha=0.5)
plt.xlabel("First Principal Component"); plt.ylabel("Second principal component")`,
      full: C.l1_pca,
      run: async (k) => {
        const { model, P } = ensurePca(k)
        const evr = model.explainedVarianceRatio
        return (
          <>
            <Stream lines={[
              `PCA explained variance ratio: [${evr.map((v) => v.toFixed(4)).join(' ')}]`,
              `combined variance retained: ${(evr[0] + evr[1]).toFixed(4)}`,
              `Shape after PCA: (150, 2)`,
            ]} />
            <div className="nb-row">
              <Scatter points={P.map((p, i) => ({ x: p[0], y: p[1], c: IRIS_Y[i] }))} classNames={IRIS_SPECIES} title="Iris projected onto the first two principal components" xLabel="first principal component" yLabel="second principal component" />
              <DataTable columns={['feature', 'PC1 loading', 'PC2 loading']} rows={IRIS_FEATURES.map((f, j) => [f, model.components[0][j].toFixed(3), model.components[1][j].toFixed(3)])} caption="Component loadings" />
            </div>
          </>
        )
      },
    },
    {
      id: 'kmeans',
      heading: 'K-Means — watch Lloyd\'s iterations, then pick k by silhouette score',
      short: `silhouette_scores = []
for k in k_values:
    kmeans = KMeans(n_clusters=k, n_init=10, random_state=42).fit(x_pca)
    score  = silhouette_score(x_pca, kmeans.labels_)        # (b - a) / max(a, b), averaged
    silhouette_scores.append(score)
    print(f"k = {k}: silhouette score = {score:.4f}")

best_k = k_values[np.argmax(silhouette_scores)]
plt.plot(k_values, silhouette_scores, marker="o"); plt.axvline(best_k, color="red", linestyle="--")`,
      full: C.l2_kmeans,
      run: async (k, emit) => {
        const { P } = ensurePca(k)
        const km = kmeans(P, 3, { seed: 7 })
        for (let it = 0; it < km.history.length; it++) {
          const h = km.history[it]
          emit(
            <>
              <Stream lines={[`k = 3 · iteration ${it + 1}/${km.history.length} · inertia = ${h.inertia.toFixed(2)}`]} />
              <Scatter points={P.map((p, i) => ({ x: p[0], y: p[1], c: h.labels[i] }))} centroids={h.centroids} title="K-Means assignments and centroids (k = 3)" xLabel="PC1" yLabel="PC2" />
            </>,
          )
          await nextFrame()
          await new Promise((r) => setTimeout(r, 260))
        }
        const ks = [2, 3, 4, 5, 6, 7, 8]
        const scores = []
        const lines = []
        for (const kk of ks) {
          const s = silhouetteScore(P, kmeans(P, kk, { seed: 7 }).labels)
          scores.push(s)
          lines.push(`k = ${kk}: silhouette score = ${s.toFixed(4)}`)
        }
        const bestK = ks[scores.indexOf(Math.max(...scores))]
        const last = km.history[km.history.length - 1]
        return (
          <>
            <Stream lines={[`k = 3 converged after ${km.history.length} iterations · inertia = ${km.inertia.toFixed(2)}`, ...lines, `Best number of clusters: ${bestK}`, `Best silhouette score: ${Math.max(...scores).toFixed(4)}`]} />
            <div className="nb-row">
              <Scatter points={P.map((p, i) => ({ x: p[0], y: p[1], c: last.labels[i] }))} centroids={last.centroids} title="Final K-Means assignments (k = 3)" xLabel="PC1" yLabel="PC2" />
              <LineChart series={[{ name: 'silhouette', values: scores, x: ks }]} title="Silhouette score for each K-Means model" xLabel="number of clusters (k)" xTicks={ks} markX={bestK} marker />
            </div>
          </>
        )
      },
    },
  ],
}
