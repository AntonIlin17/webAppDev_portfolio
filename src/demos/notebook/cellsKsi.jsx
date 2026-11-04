// COMP 247 KSI project: data-quality checks and exploratory charts on Toronto collisions.
import { NOTEBOOK_CODE as C } from '../../data/notebookCode.js'
import { KSI_BY_HOUR, KSI_BY_YEAR } from '../../data/ksi.js'
import KsiChart from '../KsiChart.jsx'
import { BarChart, DataTable, Stream } from './outputs.jsx'

export const ksi = {
  id: 'ksi',
  file: 'Anton_KSI_data_quality_and_visual_analysis.ipynb',
  subtitle: 'Toronto KSI collisions · my data-quality and EDA section of the COMP 247 group project',
  url: 'https://colab.research.google.com/drive/1z7MIAkONTCMrrOr1AWJBntugjIisNhQG',
  note: 'The 18,938-row source CSV is not shipped with the page; these cells use the aggregated tables the notebook produced.',
  cells: [
    {
      id: 'target',
      heading: 'One row per collision, then the fatal / non-fatal balance',
      short: `# the source CSV is person-level; several rows can describe one collision
collision_df = (binary_df.sort_values("INJURY_RANK", ascending=False)
                          .drop_duplicates("collision_id"))
target = collision_df["collision_class"].value_counts()
print(target, "\\nNon-fatal-to-fatal ratio:", round(target[0] / target[1], 2), "to 1")`,
      full: C.ksi_target,
      run: async () => (
        <>
          <Stream lines={['person records in the binary analysis: 18,938', 'unique collision events: 6,863  (≈ 2.76 person rows per collision)', '', 'collision_class    collision_count  percentage', 'Non-Fatal Injury              5908       86.08', 'Fatal                          955       13.92', '', 'Non-fatal-to-fatal ratio: 6.19 to 1']} />
          <BarChart items={[{ label: 'Non-Fatal Injury', value: 5908, color: 'var(--chart-1)' }, { label: 'Fatal', value: 955, color: 'var(--chart-2)' }]} title="Collision-level target distribution" valueLabel={(i) => `${i.value.toLocaleString()} (${((i.value / 6863) * 100).toFixed(1)}%)`} />
        </>
      ),
    },
    {
      id: 'hour',
      heading: 'Fatality percentage by hour of day (and by year)',
      short: `hour_summary = (collision_df.groupby("HOUR")["fatal_flag"]
                .agg(collisions="size", fatal_collisions="sum", fatality_rate="mean"))
hour_summary["fatality_percentage"] = hour_summary["fatality_rate"] * 100
display(hour_summary.round(3))

plt.plot(hour_summary.index, hour_summary["fatality_percentage"], marker="o")
plt.title("Fatality Percentage by Hour of Day")`,
      full: C.ksi_hour,
      run: async () => {
        const rows = KSI_BY_HOUR.labels.map((h, i) => [h, KSI_BY_HOUR.collisions[i], KSI_BY_HOUR.fatal[i], ((KSI_BY_HOUR.fatal[i] / KSI_BY_HOUR.collisions[i]) * 100).toFixed(2)])
        const peak = rows.reduce((a, r) => (Number(r[3]) > Number(a[3]) ? r : a))
        const yearPeak = KSI_BY_YEAR.labels.reduce((a, y, i) => {
          const p = (KSI_BY_YEAR.fatal[i] / KSI_BY_YEAR.collisions[i]) * 100
          return p > a.p ? { y, p } : a
        }, { y: '', p: 0 })
        return (
          <>
            <DataTable columns={['HOUR', 'collisions', 'fatal_collisions', 'fatality_percentage']} rows={rows.slice(0, 8)} caption="hour_summary (first 8 of 24 rows)" />
            <div className="nb-ksi"><KsiChart /></div>
            <Stream lines={[`Highest hourly fatality share: ${peak[0]} at ${peak[3]}% (${peak[2]} of ${peak[1]} collisions)`, `Highest annual fatality share: ${yearPeak.y} at ${yearPeak.p.toFixed(2)}%`, 'Descriptive only: small-denominator hours (e.g. 4:00 with 71 collisions) are noisy.']} />
          </>
        )
      },
    },
  ],
}
