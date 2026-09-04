import { Check, Minus } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { comparison } from '../data/siteData';

type CellValue = boolean | string;

type CellProps = {
  value: CellValue;
  featured?: boolean;
};

function Cell({ value, featured = false }: CellProps) {
  if (value === true) {
    return (
      <span className={`inline-flex items-center gap-2 font-semibold ${featured ? 'text-success' : 'text-silver'}`}>
        <Check className="h-4 w-4" aria-hidden="true" /> Yes
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="inline-flex items-center gap-2 text-text-muted">
        <Minus className="h-4 w-4" aria-hidden="true" /> No
      </span>
    );
  }

  return <span className="text-text-secondary">{value}</span>;
}

export default function Comparison() {
  return (
    <section className="py-24">
      <div className="container-page">
        <SectionHeader
          eyebrow="Platform Comparison"
          title="A modern alternative to legacy trading platform stacks."
          copy="Teams evaluating a MetaTrader alternative or cTrader alternative often need stronger API coverage, copy trading flexibility, risk workflows, and white label control. VTX Prime is built around those requirements."
        />
        <div className="mt-12 overflow-hidden rounded-xl border border-border-light">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="px-5 py-4 text-sm font-semibold text-silver">Capability</th>
                  <th scope="col" className="px-5 py-4 text-sm font-semibold text-primary-light">VTX Prime</th>
                  <th scope="col" className="px-5 py-4 text-sm font-semibold text-silver">Legacy terminals</th>
                  <th scope="col" className="px-5 py-4 text-sm font-semibold text-silver">Generic SaaS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card/55">
                {comparison.map((row) => (
                  <tr key={row.capability} className="transition hover:bg-card-hover">
                    <th scope="row" className="px-5 py-4 text-sm font-semibold text-white">{row.capability}</th>
                    <td className="px-5 py-4 text-sm"><Cell value={row.vtx} featured /></td>
                    <td className="px-5 py-4 text-sm"><Cell value={row.legacy} /></td>
                    <td className="px-5 py-4 text-sm"><Cell value={row.generic} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
