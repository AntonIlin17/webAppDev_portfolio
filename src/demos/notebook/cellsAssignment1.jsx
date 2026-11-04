// COMP 258 Assignment 1: perceptron and ADALINE on 7x9 letter patterns.
import { NOTEBOOK_CODE as C } from '../../data/notebookCode.js'
import { LETTERS, PATTERNS, corrupt, makeRng, randomPositions, robustnessExperiment, trainAdaline, trainPerceptron } from '../../lib/neuralnets.js'
import { nextFrame } from './frame.js'
import { GlyphRow, Heatmap, LineChart, Stream, DataTable } from './outputs.jsx'

const TARGET = 'A'
const X = PATTERNS.map((p) => p.v)
const T = PATTERNS.map((p) => (p.letter === TARGET ? 1 : -1))

function ensurePerceptron(k) {
  if (!k.perceptron) k.perceptron = trainPerceptron(X, T)
  return k.perceptron
}
function ensureAdaline(k) {
  if (!k.adaline) k.adaline = trainAdaline(X, T)
  return k.adaline
}
const pct = (model) => {
  let c = 0
  X.forEach((x, i) => {
    if (model.predict(x) === T[i]) c++
  })
  return `${c}/${X.length} = ${((100 * c) / X.length).toFixed(2)}%`
}

export const assignment1 = {
  id: 'a1',
  file: 'AntonIlin_COMP258_Assignment1.ipynb',
  subtitle: 'Perceptron and ADALINE on letter patterns · NumPy, no frameworks',
  url: 'https://colab.research.google.com/drive/1vuoii2_AYniLs2NBuriSqMfOTB_UF96f',
  note: 'The cells run a JavaScript port of the notebook on a simplified 7×9 font (three variants of A, B, C, D, E, J, K). Expand a cell to read the original Python.',
  cells: [
    {
      id: 'patterns',
      heading: 'Convert the 7×9 letters to bipolar vectors (+1 on, −1 off)',
      short: `def convert_to_bipolar(pattern_rows):
    pixels = [2 if p == "#" else 0 for row in pattern_rows for p in row]
    return np.array(pixels) - 1            # 2 -> +1, 0 -> -1

letter_inputs  = np.array([convert_to_bipolar(rows) for rows in letter_patterns.values()])
letter_targets = np.array([1 if name.endswith("A") else -1 for name in pattern_names])
print("Input shape:", letter_inputs.shape)`,
      full: C.a1_patterns,
      run: async () => (
        <>
          <Stream lines={[
            `Input shape: (${X.length}, ${X[0].length})`,
            `First 10 values of Font 1 A : [${X[0].slice(0, 10).join(' ')}]`,
            `Targets: [${T.join(' ')}]`,
            `Number of A patterns: ${T.filter((t) => t === 1).length}`,
            `Number of other patterns: ${T.filter((t) => t === -1).length}`,
          ]} />
          <GlyphRow items={PATTERNS.map((p) => ({ vector: p.v, label: `Font ${p.font} ${p.letter}`, tone: p.letter === TARGET ? 'is-target' : '' }))} />
        </>
      ),
    },
    {
      id: 'perceptron',
      heading: 'Exercise 1.1 — the Perceptron learning rule (weights change only on mistakes)',
      short: `class Perceptron:
    def predict(self, x):  return np.where(x @ self.w[1:] + self.w[0] >= 0, 1, -1)
    def train(self, X, targets):
        for epoch in range(self.epochs):
            updates = 0
            for x, t in zip(X, targets):
                error = t - self.predict(x)        # 0, +2 or -2
                if error != 0:
                    self.w[1:] += self.lr * error * x; self.w[0] += self.lr * error; updates += 1
            if updates == 0: break                 # converged

perceptron = Perceptron(no_of_inputs=63, epochs=100, learning_rate=1.0)
perceptron.train(letter_inputs, letter_targets)`,
      full: `${C.a1_perceptron}\n\n${C.a1_perceptron_train}`,
      run: async (k, emit) => {
        const p = ensurePerceptron(k)
        const lines = []
        for (let e = 0; e < p.updatesPerEpoch.length; e++) {
          lines.push(`epoch ${e + 1}: ${p.updatesPerEpoch[e]} weight update${p.updatesPerEpoch[e] === 1 ? '' : 's'}`)
          emit(<Stream lines={lines} />)
          await nextFrame()
          await new Promise((r) => setTimeout(r, 120))
        }
        return (
          <>
            <Stream lines={[...lines, `Weight updates in each epoch: [${p.updatesPerEpoch.join(', ')}]`, `Epochs needed: ${p.epochs}`, '', `Perceptron accuracy on the clean patterns: ${pct(p)}`]} />
            <div className="nb-row">
              <Heatmap values={Array.from(p.weights.slice(1))} title="Learned weights reshaped to 7×9 (red +, blue −)" />
              <DataTable columns={['Pattern', 'Target', 'Net input', 'Prediction']} rows={PATTERNS.filter((x) => x.font === 1).map((x) => [`Font 1 ${x.letter}`, T[PATTERNS.indexOf(x)], p.net(x.v).toFixed(1), p.predict(x.v)])} />
            </div>
          </>
        )
      },
    },
    {
      id: 'adaline',
      heading: 'Exercise 1.2 — ADALINE, batch delta rule on the linear output',
      short: `class Adaline:
    def net_input(self, X): return X @ self.w[1:] + self.w[0]      # linear, no threshold
    def train(self, X, targets):
        for epoch in range(self.epochs):
            errors = targets - self.net_input(X)
            self.w[1:] += self.lr * X.T @ errors; self.w[0] += self.lr * errors.sum()
            self.cost.append((errors ** 2).sum() / 2)

adaline = Adaline(no_of_inputs=63, epochs=300, learning_rate=0.001)
adaline.train(letter_inputs, letter_targets)
plt.plot(adaline.cost)`,
      full: `${C.a1_adaline}\n\n${C.a1_adaline_train}`,
      run: async (k, emit) => {
        const a = ensureAdaline(k)
        for (let n = 10; n <= a.cost.length; n += 15) {
          emit(<LineChart series={[{ name: 'cost', values: a.cost.slice(0, n), x: a.cost.slice(0, n).map((_, i) => i + 1) }]} title="ADALINE cost (sum of squared errors)" xLabel="epoch" yMin={0} yMax={a.cost[0]} xTicks={[1, 75, 150, 225, 300]} />)
          await nextFrame()
        }
        return (
          <>
            <Stream lines={[`Cost at epoch 1: ${a.cost[0].toFixed(4)}`, `Cost at epoch 300: ${a.cost[a.cost.length - 1].toFixed(4)}`, '', `ADALINE accuracy on the clean patterns: ${pct(a)}`]} />
            <div className="nb-row">
              <LineChart series={[{ name: 'cost', values: a.cost, x: a.cost.map((_, i) => i + 1) }]} title="ADALINE cost (sum of squared errors)" xLabel="epoch" yMin={0} yMax={a.cost[0]} xTicks={[1, 75, 150, 225, 300]} />
              <Heatmap values={Array.from(a.weights.slice(1))} title="ADALINE weights (7×9)" />
            </div>
          </>
        )
      },
    },
    {
      id: 'robustness',
      heading: 'Exercise 1.3 — robustness to wrong and missing pixels (100 random trials per level)',
      short: `def corrupt_patterns(patterns, positions, n, kind):
    corrupted = patterns.astype(float).copy()
    for i in range(len(corrupted)):
        chosen = positions[i][:n]
        corrupted[i, chosen] = -corrupted[i, chosen] if kind == "wrong" else 0
    return corrupted

for kind in ["wrong", "missing"]:
    for n in [0, 5, 10, 15, 20]:
        accuracy = mean over 100 trials of (model.predict(corrupted) == targets)`,
      full: C.a1_robustness,
      run: async (k, emit) => {
        const models = { X, T, perceptron: ensurePerceptron(k), adaline: ensureAdaline(k) }
        const results = {}
        const levels = [0, 5, 10, 15, 20]
        for (const type of ['wrong', 'missing']) {
          results[type] = []
          for (const n of levels) {
            results[type].push(robustnessExperiment(models, type, { levels: [n], trials: 100, seed: 42 + n })[0])
            emit(render(results, false))
            await nextFrame()
          }
        }
        return render(results, true)
        function render(res, done) {
          const chart = (type, title) => res[type] && res[type].length > 1 && (
            <LineChart
              key={type}
              series={[
                { name: 'Perceptron', values: res[type].map((r) => r.perceptron), x: res[type].map((r) => r.pixels) },
                { name: 'ADALINE', values: res[type].map((r) => r.adaline), x: res[type].map((r) => r.pixels) },
              ]}
              title={title} xLabel="affected pixels (out of 63)" yLabel="accuracy %" yMin={60} yMax={100} xTicks={levels} marker
            />
          )
          const rng = makeRng(99)
          const pos = randomPositions(rng, 10)
          return (
            <>
              <div className="nb-row">{chart('wrong', 'Wrong pixels')}{chart('missing', 'Missing pixels')}</div>
              {done && (
                <>
                  <DataTable
                    columns={['Affected pixels', 'Perceptron wrong %', 'ADALINE wrong %', 'Perceptron missing %', 'ADALINE missing %']}
                    rows={levels.map((n, i) => [n, res.wrong[i].perceptron.toFixed(2), res.wrong[i].adaline.toFixed(2), res.missing[i].perceptron.toFixed(2), res.missing[i].adaline.toFixed(2)])}
                  />
                  <GlyphRow items={LETTERS.map((l) => {
                    const p = PATTERNS.find((x) => x.letter === l && x.font === 1)
                    const v = corrupt(p.v, pos, 'wrong')
                    const i = PATTERNS.indexOf(p)
                    const ok = models.perceptron.predict(v) === T[i] && models.adaline.predict(v) === T[i]
                    return { vector: v, label: `${l} · 10 wrong`, tone: ok ? 'is-ok' : 'is-bad' }
                  })} />
                </>
              )}
            </>
          )
        }
      },
    },
  ],
}
