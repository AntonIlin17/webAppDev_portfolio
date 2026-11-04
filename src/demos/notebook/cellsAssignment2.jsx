// COMP 258 Assignment 2: a manual MLP with hand-derived backprop on Iris.
import { NOTEBOOK_CODE as C } from '../../data/notebookCode.js'
import { IRIS_FEATURES, IRIS_SPECIES, IRIS_X, IRIS_Y } from '../../data/iris.js'
import { accuracy, confusionMatrix, createMlp, fitStandardizer, mlpEpoch, mlpForward, mlpPredict, oneHot, stratifiedSplit } from '../../lib/ml.js'
import { nextFrame } from './frame.js'
import { DataTable, DecisionRegions, LineChart, Stream } from './outputs.jsx'

const EPOCHS = 3000
const LR = 0.5

function ensureData(k) {
  if (!k.iris) {
    const { train, test } = stratifiedSplit(IRIS_X, IRIS_Y, 10, 42)
    const scaler = fitStandardizer(train.X)
    k.iris = { train, test, scaler, Xtr: scaler.transform(train.X), Xte: scaler.transform(test.X), T: oneHot(train.y, 3) }
  }
  return k.iris
}

async function trainModel(k, emit) {
  const d = ensureData(k)
  const net = createMlp({ inputs: 4, hidden: 5, outputs: 3, seed: 42 })
  const lines = []
  for (let e = 1; e <= EPOCHS; e++) {
    const loss = mlpEpoch(net, d.Xtr, d.T, LR)
    if (e === 1 || e % 500 === 0) lines.push(`Iris epoch ${String(e).padStart(4)}/${EPOCHS}: loss=${loss.toFixed(6)}`)
    if (e % 60 === 0) {
      emit(
        <>
          <Stream lines={lines} />
          <LineChart series={[{ name: 'loss', values: net.lossHistory, x: net.lossHistory.map((_, i) => i + 1) }]} title="Training loss (½ SSE, mean over records)" xLabel="epoch" yMin={0} yMax={net.lossHistory[0]} xTicks={[1, 1000, 2000, 3000]} />
        </>,
      )
      await nextFrame()
    }
  }
  k.mlp = net
  k.mlpLines = lines
  return net
}

export const assignment2 = {
  id: 'a2',
  file: 'AntonIlin_COMP258_Assignment2.ipynb',
  subtitle: 'Manual forward and backward propagation on Iris · gradients derived by hand',
  url: 'https://colab.research.google.com/drive/1QuYylCA8NYo_XGLM3pFwXbiMdTlpUg1P',
  note: 'The notebook used a supplied train/test JSON; here the same network trains on a stratified 120/30 split of Fisher\'s Iris, live in your browser.',
  cells: [
    {
      id: 'load',
      heading: 'Load Iris and standardize with training statistics only',
      short: `FEATURES = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
X_train, y_train = load_iris_json("training.json")
X_test,  y_test  = load_iris_json("test.json")

scaler  = StandardScaler().fit(X_train)       # fit on training rows only
X_train = scaler.transform(X_train); X_test = scaler.transform(X_test)
targets = np.eye(3)[y_train]                  # one-hot outputs
print(pd.DataFrame(train_records).head())`,
      full: C.a2_load,
      run: async (k) => {
        const d = ensureData(k)
        const head = d.train.X.slice(0, 6).map((r, i) => [...r.map((v) => v.toFixed(1)), IRIS_SPECIES[d.train.y[i]]])
        const counts = IRIS_SPECIES.map((s, c) => `${s}: ${d.train.y.filter((v) => v === c).length}`).join(', ')
        return (
          <>
            <DataTable columns={[...IRIS_FEATURES, 'species']} rows={head} caption="First training records" />
            <Stream lines={[
              `Training records: ${d.train.X.length}`,
              `Testing records: ${d.test.X.length}`,
              `Training class counts: {${counts}}`,
              `Feature means (train): [${d.scaler.mean.map((v) => v.toFixed(2)).join(', ')}]`,
              `Feature stds  (train): [${d.scaler.std.map((v) => v.toFixed(2)).join(', ')}]`,
              'Training shapes: (120, 4) (120, 3)',
            ]} />
          </>
        )
      },
    },
    {
      id: 'train',
      heading: 'ManualIrisMLP — 4 → 5 → 3 sigmoid network, batch backprop, 3000 epochs at lr 0.5',
      short: `class ManualIrisMLP:
    def forward(self, X):
        hidden = sigmoid(X @ self.W1 + self.b1)
        output = sigmoid(hidden @ self.W2 + self.b2)
        return hidden, output

    def backward(self, X, targets, hidden, output):
        output_delta = (targets - output) * output * (1 - output)       # dL/dz at the output
        hidden_delta = (output_delta @ self.W2.T) * hidden * (1 - hidden)
        return {"W1": X.T @ hidden_delta / n, "b1": hidden_delta.mean(0),
                "W2": hidden.T @ output_delta / n, "b2": output_delta.mean(0)}

    def train(self, X, targets, epochs, learning_rate):
        for epoch in range(epochs):
            hidden, output = self.forward(X)
            for name, grad in self.backward(X, targets, hidden, output).items():
                setattr(self, name, getattr(self, name) + learning_rate * grad)   # ADD, deltas use (t - o)`,
      full: `${C.a2_mlp}\n\n${C.a2_train}`,
      run: async (k, emit) => {
        const d = ensureData(k)
        const net = await trainModel(k, emit)
        const trAcc = accuracy(net, d.Xtr, d.train.y)
        const teAcc = accuracy(net, d.Xte, d.test.y)
        return (
          <>
            <Stream lines={[...k.mlpLines, '', `Iris training accuracy: ${(trAcc * 100).toFixed(2)}%`, `Iris held-out test accuracy: ${(teAcc * 100).toFixed(2)}%`]} />
            <LineChart series={[{ name: 'loss', values: net.lossHistory, x: net.lossHistory.map((_, i) => i + 1) }]} title="Training loss (½ SSE, mean over records)" xLabel="epoch" yMin={0} yMax={net.lossHistory[0]} xTicks={[1, 1000, 2000, 3000]} />
          </>
        )
      },
    },
    {
      id: 'predict',
      heading: 'Predict the held-out records and paint the decision regions',
      short: `predictions = iris_model.predict(X_test)
print(f"test accuracy: {np.mean(predictions == y_test):.2%}")
print(confusion_matrix(y_test, predictions))

# decision regions over petal length x petal width (other inputs at their mean)
grid = np.c_[xx.ravel(), yy.ravel()]
regions = iris_model.predict(scaler.transform(grid_with_means)).reshape(xx.shape)
plt.contourf(xx, yy, regions, alpha=0.3); plt.scatter(X_test[:, 2], X_test[:, 3], c=y_test)`,
      full: C.a2_train,
      run: async (k, emit) => {
        const d = ensureData(k)
        const net = k.mlp || (await trainModel(k, emit))
        const cm = confusionMatrix(net, d.Xte, d.test.y, 3)
        const rows = d.test.X.slice(0, 8).map((x, i) => {
          const z = d.Xte[i]
          const { o } = mlpForward(net, z)
          const pred = mlpPredict(net, z)
          return [i + 1, IRIS_SPECIES[d.test.y[i]], IRIS_SPECIES[pred], pred === d.test.y[i] ? 'True' : 'False', `[${o.map((v) => v.toFixed(3)).join(', ')}]`]
        })
        const mean = d.scaler.mean
        const predict = (pl, pw) => mlpPredict(net, d.scaler.transform([[mean[0], mean[1], pl, pw]])[0])
        const points = d.test.X.map((x, i) => ({ x: x[2], y: x[3], c: d.test.y[i], wrong: mlpPredict(net, d.Xte[i]) !== d.test.y[i] }))
        return (
          <>
            <DataTable columns={['Record', 'Actual', 'Predicted', 'Correct', 'Output scores [setosa, versicolor, virginica]']} rows={rows} caption="First 8 of 30 held-out records" />
            <div className="nb-row">
              <DataTable columns={['actual \\ predicted', ...IRIS_SPECIES]} rows={cm.map((r, i) => [IRIS_SPECIES[i], ...r])} caption="Confusion matrix (30 test records)" />
              <Stream lines={[`Held-out accuracy: ${(accuracy(net, d.Xte, d.test.y) * 100).toFixed(2)}%`, 'Sigmoid scores are not a softmax', 'distribution and need not sum to 1.']} />
            </div>
            <DecisionRegions predict={predict} xRange={[0.5, 7.5]} yRange={[0, 2.8]} points={points} xLabel="petal length (cm)" yLabel="petal width (cm)" classNames={IRIS_SPECIES} />
          </>
        )
      },
    },
  ],
}
