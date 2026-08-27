"use client";

import React, { useState, useEffect } from "react";
import { 
  getPlatformStats, 
  getAllResources, 
  getAllSubmissions, 
  getAllReports, 
  getAllCategories,
  createResource,
  deleteResource,
  updateSubmissionStatus,
  updateReportStatus
} from "@/lib/db/store";
import { validateAndParseUrl } from "@/lib/validation/urlChecker";
import { Resource, Submission, Report, Category, PricingType, PlatformType } from "@/lib/types";
import { 
  Shield, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles,
  BarChart3,
  Eye,
  MousePointerClick
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "submissions" | "reports">("overview");
  const [resources, setResources] = useState<Resource[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);

  // New Resource Form state
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newPricing, setNewPricing] = useState<PricingType>("free");
  const [newPlatforms, setNewPlatforms] = useState<PlatformType[]>(["web"]);
  const [newTags, setNewTags] = useState("");
  const [newVerified, setNewVerified] = useState(true);
  const [newFeatured, setNewFeatured] = useState(false);
  const [autoFavicon, setAutoFavicon] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState("");

  const refreshData = () => {
    setResources(getAllResources());
    setSubmissions(getAllSubmissions());
    setReports(getAllReports());
    setCategories(getAllCategories());
    setStats(getPlatformStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUrlBlur = () => {
    if (!newUrl.trim()) return;
    const res = validateAndParseUrl(newUrl);
    if (res.isValid) {
      setNewUrl(res.normalizedUrl);
      setAutoFavicon(res.faviconUrl);
    }
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim() || !newCategoryId) return;

    const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);

    createResource({
      name: newName.trim(),
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tagline: newTagline.trim() || newDescription.slice(0, 80),
      description: newDescription.trim() || newTagline.trim(),
      url: newUrl.trim(),
      logoUrl: autoFavicon || undefined,
      categoryId: newCategoryId || categories[0]?.id || "dev-tools",
      pricingType: newPricing,
      license: newPricing === "open-source" ? "mit" : "proprietary",
      platforms: newPlatforms,
      tags: tagsArray.length > 0 ? tagsArray : ["Tool"],
      features: ["Easy to use", "Fast performance"],
      safetyStatus: "verified",
      verified: newVerified,
      featured: newFeatured,
      communityRating: 5.0,
    });

    // Reset form
    setNewName("");
    setNewUrl("");
    setNewTagline("");
    setNewDescription("");
    setNewTags("");
    setAutoFavicon(null);
    refreshData();
    alert("Resource added successfully!");
  };

  const handleDeleteResource = (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      deleteResource(id);
      refreshData();
    }
  };

  const handleApproveSubmission = (sub: Submission) => {
    createResource({
      name: sub.name,
      slug: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tagline: sub.description.slice(0, 80),
      description: sub.description,
      url: sub.url,
      logoUrl: validateAndParseUrl(sub.url).faviconUrl,
      categoryId: sub.categoryId,
      subcategoryId: sub.subcategoryId,
      pricingType: sub.pricingType,
      license: sub.pricingType === "open-source" ? "mit" : "proprietary",
      platforms: sub.platforms,
      tags: sub.tags.length > 0 ? sub.tags : ["Community"],
      features: ["Community Recommended"],
      safetyStatus: "verified",
      verified: true,
      featured: false,
      communityRating: 5.0,
    });

    updateSubmissionStatus(sub.id, "approved", "Approved and published to index");
    refreshData();
  };

  const handleRejectSubmission = (id: string) => {
    updateSubmissionStatus(id, "rejected", "Declined based on directory guidelines");
    refreshData();
  };

  const filteredResourcesList = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.categoryId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4">
      {/* Admin Top Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/25">
            <Shield className="w-3.5 h-3.5" />
            FreeInternetStuff Admin Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary">
            Platform Operations &amp; Moderation
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-surface-secondary border border-surface-border rounded-xl self-start sm:self-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "resources", label: `Resources (${resources.length})` },
            { id: "submissions", label: `Submissions (${stats?.pendingSubmissions || 0})` },
            { id: "reports", label: `Reports (${stats?.openReports || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-content-muted block mb-1">Indexed Resources</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">
                {stats.totalResources}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">100% Verified</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-content-muted block mb-1">Total Categories</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-400">
                {stats.totalCategories}
              </div>
              <span className="text-[11px] text-content-subtle">Active taxonomies</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-content-muted block mb-1">Pending Submissions</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {stats.pendingSubmissions}
              </div>
              <span className="text-[11px] text-content-subtle">Awaiting review</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-content-muted block mb-1">Open Reports</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400">
                {stats.openReports}
              </div>
              <span className="text-[11px] text-content-subtle">User reported flags</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-4">
            <h3 className="font-bold text-lg text-content-primary">Quick Navigation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("resources")}
                className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-sm text-content-primary">Manage Resources</div>
                <div className="text-xs text-content-muted mt-1">Add, edit, or remove indexed tools.</div>
              </button>

              <button
                onClick={() => setActiveTab("submissions")}
                className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-sm text-content-primary">Review Submissions</div>
                <div className="text-xs text-content-muted mt-1">Approve or decline community links.</div>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className="p-4 rounded-xl bg-surface-secondary hover:bg-surface-hover border border-surface-border text-left transition-colors"
              >
                <div className="font-semibold text-sm text-content-primary">Triage Reports</div>
                <div className="text-xs text-content-muted mt-1">Fix dead links and safety issues.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCES CRUD */}
      {activeTab === "resources" && (
        <div className="space-y-8">
          
          {/* Add New Resource Form */}
          <form onSubmit={handleCreateResource} className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-5">
            <h3 className="text-lg font-bold text-content-primary flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-400" />
              Add New Resource to Index
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-content-muted block mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tool Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-content-muted block mb-1">Website URL *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {autoFavicon && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                <img src={autoFavicon} alt="Favicon" className="w-4 h-4 rounded" />
                <span>Auto-resolved website logo &amp; favicon</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-content-muted block mb-1">Tagline / Short Summary *</label>
              <input
                type="text"
                required
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                placeholder="A concise 1-sentence value proposition..."
                className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-content-muted block mb-1">Category</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-content-muted block mb-1">Pricing</label>
                <select
                  value={newPricing}
                  onChange={(e) => setNewPricing(e.target.value as PricingType)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
                >
                  <option value="free" className="bg-surface">Free</option>
                  <option value="open-source" className="bg-surface">Open Source</option>
                  <option value="freemium" className="bg-surface">Freemium</option>
                  <option value="paid" className="bg-surface">Paid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-content-muted block mb-1">Tags</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="AI, Code, FOSS"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-secondary border border-surface-border text-sm text-content-primary outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-content-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={newVerified}
                  onChange={(e) => setNewVerified(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <span>Mark Verified Safe</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-content-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="rounded text-brand-500"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
            >
              Publish to Directory
            </button>
          </form>

          {/* Resources Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-content-primary">
                Existing Directory Entries ({resources.length})
              </h3>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter table..."
                className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs text-content-primary outline-none focus:border-brand-500 w-48"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-surface-border bg-surface">
              <table className="w-full text-left text-xs text-content-secondary">
                <thead className="bg-surface-secondary border-b border-surface-border text-content-muted uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Pricing</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/40">
                  {filteredResourcesList.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-secondary/40">
                      <td className="p-3.5 font-semibold text-content-primary flex items-center gap-2">
                        {r.logoUrl && <img src={r.logoUrl} alt="" className="w-4 h-4 rounded" />}
                        <a href={`/resource/${r.slug}`} target="_blank" className="hover:text-brand-400">
                          {r.name}
                        </a>
                      </td>
                      <td className="p-3.5 capitalize">{r.categoryId}</td>
                      <td className="p-3.5 capitalize">{r.pricingType}</td>
                      <td className="p-3.5 text-amber-400">⭐ {Number(r.communityRating || 4.5).toFixed(1)}</td>
                      <td className="p-3.5">
                        {r.verified ? (
                          <span className="text-emerald-400 font-semibold">✓ Verified</span>
                        ) : (
                          <span className="text-amber-400">Pending</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteResource(r.id)}
                          className="p-1 text-content-muted hover:text-red-400 transition-colors"
                          title="Delete resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SUBMISSIONS QUEUE */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-content-primary">
            Community Submissions Moderation Queue ({submissions.length})
          </h3>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-content-primary">{sub.name}</span>
                    <span className="text-xs text-content-muted capitalize px-2 py-0.5 rounded bg-surface-secondary border border-surface-border">
                      {sub.categoryId}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      sub.status === "pending" ? "bg-amber-500/20 text-amber-300" : sub.status === "approved" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-content-muted">{sub.description}</p>
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <span>{sub.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {sub.status === "pending" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveSubmission(sub)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve &amp; Index
                    </button>
                    <button
                      onClick={() => handleRejectSubmission(sub.id)}
                      className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-red-500/20 text-content-muted hover:text-red-400 border border-surface-border text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS QUEUE */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-content-primary">
            User Reports &amp; Flags ({reports.length})
          </h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-content-primary">{rep.resourceName}</span>
                    <span className="text-xs font-semibold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 capitalize">
                      {rep.reason.replace("-", " ")}
                    </span>
                    <span className="text-[10px] text-content-muted uppercase">
                      Status: {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-content-secondary mt-1">{rep.details}</p>
                  {rep.reporterEmail && (
                    <span className="text-[11px] text-content-muted block">Reporter: {rep.reporterEmail}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      updateReportStatus(rep.id, "resolved");
                      refreshData();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-emerald-500/20 text-emerald-400 border border-surface-border text-xs font-semibold transition-colors"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => {
                      updateReportStatus(rep.id, "dismissed");
                      refreshData();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-hover text-content-muted text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
