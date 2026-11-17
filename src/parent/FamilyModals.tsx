import { useEffect, useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Button, DemoQr, Modal, useToast } from '../components/ui';
import { useStore } from '../lib/store';
import { PLAN_LIMITS, type Plan } from '../types';
import { cx } from '../lib/utils';

export function QrModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { connectKid, state } = useStore();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (open) setConnected(false);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Connect your teen" description="Ask your teen to scan this code with their phone camera.">
      <div className="flex flex-col items-center pb-2">
        {connected ? (
          <div className="flex h-[260px] animate-pop flex-col items-center justify-center text-center" role="status">
            <CheckCircle2 className="size-20 text-ok" aria-hidden />
            <p className="mt-4 text-[28px] font-semibold tracking-tight">Kid connected!</p>
            <p className="mt-1 text-[15px] text-ink-2">{state.teen.name} can now see their quests.</p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                connectKid();
                setConnected(true);
              }}
              className="rounded-[28px] bg-white p-5 shadow-card ring-1 ring-black/5 transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
              aria-label="Family QR code. Demo: click to simulate your teen scanning it"
            >
              <DemoQr seed={state.parentName} />
            </button>
            <p className="mt-4 text-[13px] text-ink-3">Demo: click the code to simulate a scan.</p>
          </>
        )}
        <p className="mt-4 text-[13px] text-ink-2">
          {state.plan === 'free' ? 'Free Plan: 1 Parent and 1 Teen.' : `Premium: up to ${PLAN_LIMITS.premium.parents} Parents and ${PLAN_LIMITS.premium.teens} Teens.`}
        </p>
      </div>
    </Modal>
  );
}

export function PlanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, setPlan, slotsUsed } = useStore();
  const toast = useToast();

  const choose = (plan: Plan) => {
    if (plan === state.plan) return;
    if (plan === 'free' && slotsUsed > PLAN_LIMITS.free.questSlots) {
      toast(`Finish or delete quests until only ${PLAN_LIMITS.free.questSlots} are active first`);
      return;
    }
    setPlan(plan);
    toast(plan === 'premium' ? 'Switched to Premium (demo)' : 'Switched to Free Plan');
    onClose();
  };

  const plans: { id: Plan; name: string; price: string; sub: string }[] = [
    { id: 'free', name: 'Free', price: 'Rp0', sub: 'forever' },
    { id: 'premium', name: 'Premium', price: 'Rp200.000/year', sub: 'or Rp20.833/month' },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Your plan" description={`${slotsUsed} of ${PLAN_LIMITS[state.plan].questSlots} quest slots in use.`} wide>
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => {
          const limits = PLAN_LIMITS[p.id];
          const current = p.id === state.plan;
          return (
            <div key={p.id} className={cx('flex flex-col rounded-3xl border p-5', current ? 'border-accent ring-1 ring-accent' : 'border-hairline')}>
              <div className="flex items-center justify-between">
                <p className="text-[20px] font-semibold">{p.name}</p>
                {current && <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[12px] font-semibold text-accent">Current plan</span>}
              </div>
              <p className="mt-2 text-[22px] font-semibold tracking-tight">{p.price}</p>
              <p className="text-[13px] text-ink-2">{p.sub}</p>
              <ul className="mt-4 mb-5 space-y-2 text-[15px]">
                {[`${limits.parents} ${limits.parents === 1 ? 'Parent' : 'Parents'}`, `${limits.teens} ${limits.teens === 1 ? 'Teen' : 'Teens'}`, `${limits.questSlots} active quest slots`].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-ok" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-auto" variant={current ? 'secondary' : 'primary'} disabled={current} onClick={() => choose(p.id)}>
                {current ? 'Current Plan' : p.id === 'premium' ? 'Switch to Premium (demo)' : 'Switch to Free'}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[12px] text-ink-3">Prices are placeholders. No payment is taken in this prototype.</p>
    </Modal>
  );
}
