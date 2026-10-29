import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CareerSkill, PortfolioProject, JobApplication } from '../../types';
import {
  Briefcase,
  Plus,
  Target,
  ArrowRight,
  Award,
  Layers,
  Calendar,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

export const CareerView: React.FC = () => {
  const {
    careerSkills,
    updateCareerSkill,
    portfolioProjects,
    addPortfolioProject,
    jobApplications,
    addJobApplication,
    updateJobApplication,
    goals,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'skills' | 'portfolio' | 'pipeline'>('skills');
  const [isNewAppOpen, setIsNewAppOpen] = useState(false);

  // New Application Form
  const [role, setRole] = useState('');
  const [org, setOrg] = useState('');
  const [salary, setSalary] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [appNotes, setAppNotes] = useState('');

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !org.trim()) return;

    addJobApplication({
      role: role.trim(),
      organization: org.trim(),
      stage: 'applied',
      salaryTarget: salary.trim() || undefined,
      nextFollowUp: followUp.trim() || undefined,
      notes: appNotes.trim() || undefined,
    });

    setRole('');
    setOrg('');
    setSalary('');
    setFollowUp('');
    setAppNotes('');
    setIsNewAppOpen(false);
  };

  const skillLevels: CareerSkill['level'][] = ['learning', 'practicing', 'proficient', 'mastering'];

  const pipelineStages: JobApplication['stage'][] = ['saved', 'applied', 'interview', 'offer'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E1DA]/70">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B1A19]">
            Career & Professional Mastery
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Architecting leverage, craft competence, and high-agency opportunities
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#F2EFEB] p-1 rounded-xl text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'skills'
                ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs font-semibold'
                : 'text-[#78716C]'
            }`}
          >
            Skills Roadmap
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs font-semibold'
                : 'text-[#78716C]'
            }`}
          >
            Portfolio & Works
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs font-semibold'
                : 'text-[#78716C]'
            }`}
          >
            Opportunities
          </button>
        </div>
      </div>

      {/* 1. Skills Roadmap */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Core Competencies & Mastery Progression
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {careerSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F4] text-[#78716C] border border-[#E7E1DA]">
                    {skill.category}
                  </span>
                  <span className="text-xs font-bold capitalize text-[#B85C3B]">
                    {skill.level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1B1A19]">{skill.name}</h3>

                {skill.targetMilestone && (
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    <strong className="text-[#1B1A19]">Target milestone:</strong> {skill.targetMilestone}
                  </p>
                )}

                {/* Level selector buttons */}
                <div className="pt-2 border-t border-[#E7E1DA]/60 flex gap-1">
                  {skillLevels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateCareerSkill(skill.id, { level: lvl })}
                      className={`flex-1 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                        skill.level === lvl
                          ? 'bg-[#1B1A19] text-[#FAF8F4] font-semibold'
                          : 'bg-[#F2EFEB] text-[#78716C] hover:bg-[#E7E1DA]'
                      }`}
                    >
                      {lvl.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Portfolio Projects */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Landmark Case Studies & Artifacts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolioProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8EDE8] text-[#B85C3B]">
                    Stage: {proj.stage}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1B1A19] tracking-tight">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Job & Client Opportunities Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Active Opportunities & Dialogues
            </span>
            <button
              onClick={() => setIsNewAppOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1A19] text-[#FAF8F4] text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Opportunity</span>
            </button>
          </div>

          {/* Kanban / Stage Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pipelineStages.map((stage) => {
              const items = jobApplications.filter((a) => a.stage === stage);
              return (
                <div key={stage} className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E1DA]">
                    <span className="text-xs font-bold uppercase tracking-wider capitalize text-[#1B1A19]">
                      {stage}
                    </span>
                    <span className="text-[11px] font-mono text-[#8F877F]">{items.length}</span>
                  </div>

                  <div className="space-y-2">
                    {items.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E7E1DA] shadow-2xs space-y-1.5 text-xs"
                      >
                        <h4 className="font-bold text-[#1B1A19]">{app.role}</h4>
                        <p className="text-[#78716C]">{app.organization}</p>
                        {app.salaryTarget && (
                          <span className="text-[10px] text-[#B85C3B] font-semibold block">
                            {app.salaryTarget}
                          </span>
                        )}
                        {app.nextFollowUp && (
                          <p className="text-[10px] text-[#8F877F] bg-[#FAF8F4] p-1.5 rounded">
                            Next: {app.nextFollowUp}
                          </p>
                        )}

                        {/* Stage Mover */}
                        <div className="pt-1 flex justify-between gap-1">
                          {stage !== 'offer' && (
                            <button
                              onClick={() => {
                                const nextIdx = pipelineStages.indexOf(stage) + 1;
                                updateJobApplication(app.id, { stage: pipelineStages[nextIdx] });
                              }}
                              className="text-[10px] text-[#B85C3B] hover:underline"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="py-6 text-center text-[11px] text-[#DDD7CB]">
                        None in {stage}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Opportunity Modal */}
      {isNewAppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F4] border border-[#E7E1DA] rounded-2xl shadow-2xl p-6 text-[#1B1A19]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
              <h2 className="text-sm font-bold text-[#1B1A19]">Add Career Opportunity</h2>
              <button onClick={() => setIsNewAppOpen(false)} className="p-1 rounded-lg hover:bg-[#EBE5DB]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Principal Systems Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Organization / Studio</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Craft Studio / Independent Venture"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Target Retainer / Compensation</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3,50,000 / mo"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Next Follow-Up Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Thursday 15:00 Architecture review"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E1DA]">
                <button
                  type="button"
                  onClick={() => setIsNewAppOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B85C3B] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
