import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavingsGoal, FinanceBill, LifeAdminItem } from '../../types';
import {
  DollarSign,
  Plus,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  X,
  Check,
  FileText,
  Users,
  Heart,
  Plane,
  Home,
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

export const FinancesView: React.FC = () => {
  const {
    savingsGoals,
    updateSavingsGoal,
    financeBills,
    toggleBillPaid,
    lifeAdminItems,
    toggleAdminItem,
    addAdminItem,
    showToast,
  } = useApp();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminTitle, setAdminTitle] = useState('');
  const [adminCategory, setAdminCategory] = useState<LifeAdminItem['category']>('documents');
  const [adminDueDate, setAdminDueDate] = useState('');

  const totalMonthlyBills = financeBills
    .filter((b) => b.recurring === 'monthly')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddAdminItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim()) return;

    addAdminItem({
      title: adminTitle.trim(),
      category: adminCategory,
      dueDate: adminDueDate || new Date().toISOString().split('T')[0],
      completed: false,
    });

    setAdminTitle('');
    setAdminDueDate('');
    setIsAdminModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E1DA]/70">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B1A19]">
            Finances & Administration
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Private tracking to ensure freedom runway, timely commitments, and administrative peace
          </p>
        </div>

        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B85C3B]" />
          <span>Add Admin Item</span>
        </button>
      </div>

      {/* 1. Freedom Runway & Savings Goals */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
          Freedom Runway & Reserves
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savingsGoals.map((sg) => {
            const pct = Math.min(100, Math.round((sg.currentAmount / sg.targetAmount) * 100));
            return (
              <div
                key={sg.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B] bg-[#F8EDE8] px-2 py-0.5 rounded">
                    Runway Fund
                  </span>
                  <span className="text-xs font-mono font-bold text-[#1B1A19]">{pct}%</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1B1A19]">{sg.title}</h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Target: ₹{sg.targetAmount.toLocaleString()} by {sg.targetDate}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#E7E1DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B85C3B] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-semibold text-[#1B1A19]">
                    Current: ₹{sg.currentAmount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      const newAmt = prompt('Enter updated current savings amount:', String(sg.currentAmount));
                      if (newAmt && !isNaN(Number(newAmt))) {
                        updateSavingsGoal(sg.id, Number(newAmt));
                      }
                    }}
                    className="text-[11px] text-[#B85C3B] hover:underline font-medium"
                  >
                    Adjust balance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Upcoming Bills & Commitments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
            Upcoming Payments & Renewals
          </span>
          <span className="text-xs text-[#8F877F]">
            Est. Monthly Fixed: ₹{totalMonthlyBills.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {financeBills.map((bill) => (
            <div
              key={bill.id}
              className={`p-4 rounded-xl border transition-all ${
                bill.paidThisMonth
                  ? 'bg-[#EEF2EC] border-[#CFDFD3]'
                  : 'bg-[#FFFFFF] border-[#E7E1DA]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#1B1A19]">{bill.title}</p>
                  <p className="text-sm font-bold text-[#B85C3B] mt-0.5">
                    ₹{bill.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-[#78716C] block mt-1">
                    Due {bill.dueDate} • {bill.recurring}
                  </span>
                </div>

                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`p-1 rounded-md text-xs font-semibold ${
                    bill.paidThisMonth
                      ? 'text-[#6B7A5B] bg-[#FFFFFF] border border-[#CFDFD3]'
                      : 'text-[#78716C] border border-[#E7E1DA] hover:bg-[#F2EFEB]'
                  }`}
                  title={bill.paidThisMonth ? 'Mark unpaid' : 'Mark paid this month'}
                >
                  {bill.paidThisMonth ? 'Paid ✓' : 'Mark Paid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Life Administration Commitments */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
          Life Admin & Family Commitments
        </span>

        <div className="space-y-2">
          {lifeAdminItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                item.completed
                  ? 'bg-[#F4F9F5] border-[#CFDFD3]'
                  : 'bg-[#FFFFFF] border-[#E7E1DA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleAdminItem(item.id)}
                  className="text-[#8F877F] hover:text-[#B85C3B]"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#6B7A5B]" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <p className={`font-semibold ${item.completed ? 'line-through text-[#8F877F]' : 'text-[#1B1A19]'}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[#8F877F]">
                    <span className="capitalize">{item.category}</span>
                    <span>•</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>
              </div>

              {item.completed && (
                <span className="text-[10px] font-bold text-[#6B7A5B] bg-[#EEF2EC] px-2 py-0.5 rounded">
                  Resolved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F4] border border-[#E7E1DA] rounded-2xl shadow-2xl p-6 text-[#1B1A19]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
              <h2 className="text-sm font-bold text-[#1B1A19]">Add Admin Commitment</h2>
              <button onClick={() => setIsAdminModalOpen(false)} className="p-1 rounded-lg hover:bg-[#EBE5DB]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdminItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule passport renewal appointment"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Category</label>
                  <CustomSelect
                    value={adminCategory}
                    onChange={(val) => setAdminCategory(val as LifeAdminItem['category'])}
                    options={[
                      { value: 'documents', label: 'Documents & Legal', icon: <FileText className="w-3.5 h-3.5" /> },
                      { value: 'family', label: 'Family & Relationships', icon: <Users className="w-3.5 h-3.5" /> },
                      { value: 'medical', label: 'Medical & Health', icon: <Heart className="w-3.5 h-3.5" /> },
                      { value: 'travel', label: 'Travel & Logistics', icon: <Plane className="w-3.5 h-3.5" /> },
                      { value: 'home', label: 'Home & Maintenance', icon: <Home className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={adminDueDate}
                    onChange={(e) => setAdminDueDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E1DA]">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B85C3B] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
