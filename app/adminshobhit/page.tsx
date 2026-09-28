"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  getPlatformStats, 
  getAllResources, 
  getAllSubmissions, 
  getAllReports, 
  getAllCategories,
  createResource,
  updateResource,
  deleteResource,
  updateSubmissionStatus,
  updateReportStatus
} from "@/lib/db/store";
import { validateAndParseUrl } from "@/lib/validation/urlChecker";
import { Resource, Submission, Report, Category, PricingType, PlatformType } from "@/lib/types";
import { 
  Shield, 
  ShieldCheck,
  Lock, 
  Unlock, 
  KeyRound, 
  LogOut, 
  RefreshCw, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Search, 
  Sparkles,
  BarChart3,
  Eye,
  EyeOff,
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  AlertCircle,
  Clock, 
  Database,
  Layers, 
  Check, 
  Copy, 
  Activity,
  SlidersHorizontal,
  FolderTree,
  Send,
  HelpCircle,
  Server,
  Crown,
  ArrowUp,
  ArrowDown,
  Globe,
  Award
} from "lucide-react";
import { TopSupporter } from "@/lib/db/siteConfig";

const ADMIN_PASSWORD_SECRET = "shobhitverma8115591448admin";
const AUTH_STORAGE_KEY = "fwsf_admin_shobhit_session_token";
const SESSION_TOKEN_VALUE = "shobhit_authorized_admin_session_valid";

export default function AdminShobhitPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "submissions" | "reports" | "database" | "supporters">("overview");
  const [resources, setResources] = useState<Resource[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Supporters Management State
  const [supporters, setSupporters] = useState<TopSupporter[]>([]);
  const [isLoadingSupporters, setIsLoadingSupporters] = useState(false);
  const [isSavingSupporters, setIsSavingSupporters] = useState(false);
  const [editingSupporter, setEditingSupporter] = useState<TopSupporter | null>(null);
  const [showSupporterModal, setShowSupporterModal] = useState(false);

  // Supporter Form Inputs
  const [supName, setSupName] = useState("");
  const [supAmount, setSupAmount] = useState("");
  const [supTier, setSupTier] = useState("Crown Backer");
  const [supDate, setSupDate] = useState("");
  const [supWebsite, setSupWebsite] = useState("");
  const [supWebsiteName, setSupWebsiteName] = useState("");
  const [supMessage, setSupMessage] = useState("");
  const [supIsTop1, setSupIsTop1] = useState(false);

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified">("all");

  // New Resource Form State
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
  const [isSubmittingResource, setIsSubmittingResource] = useState(false);

  // Edit Resource Modal State
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPricing, setEditPricing] = useState<PricingType>("free");
  const [editTags, setEditTags] = useState("");
  const [editVerified, setEditVerified] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check saved session on mount
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (session === SESSION_TOKEN_VALUE) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Refresh DB state
  const refreshData = () => {
    setResources(getAllResources());
    setSubmissions(getAllSubmissions());
    setReports(getAllReports());
    const cats = getAllCategories();
    setCategories(cats);
    setStats(getPlatformStats());
    if (!newCategoryId && cats.length > 0) {
      setNewCategoryId(cats[0].id);
    }
    refreshSupporters();
  };

  const refreshSupporters = async () => {
    setIsLoadingSupporters(true);
    try {
      const res = await fetch("/api/admin/supporters");
      const data = await res.json();
      if (Array.isArray(data.supporters)) {
        setSupporters(data.supporters);
      }
    } catch (err) {
      console.error("Failed to load supporters:", err);
    } finally {
      setIsLoadingSupporters(false);
    }
  };

  const handleSaveAndPublishSupporters = async (newList: TopSupporter[]) => {
    setIsSavingSupporters(true);
    try {
      const res = await fetch("/api/admin/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supporters: newList }),
      });
      const data = await res.json();
      if (data.success) {
        setSupporters(data.supporters || newList);
        showToast("One-Click Published! Supporters updated live on website", "success");
      } else {
        showToast("Failed to publish: " + (data.error || "Unknown error"), "error");
      }
    } catch (err: any) {
      showToast("Network error publishing supporters: " + err.message, "error");
    } finally {
      setIsSavingSupporters(false);
    }
  };

  const openNewSupporterModal = () => {
    setEditingSupporter(null);
    setSupName("");
    setSupAmount("");
    setSupTier("Crown Backer");
    setSupDate(new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }));
    setSupWebsite("");
    setSupWebsiteName("");
    setSupMessage("");
    setSupIsTop1(supporters.length === 0);
    setShowSupporterModal(true);
  };

  const openEditSupporterModal = (s: TopSupporter) => {
    setEditingSupporter(s);
    setSupName(s.name);
    setSupAmount(s.amount);
    setSupTier(s.tier || "Crown Backer");
    setSupDate(s.date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }));
    setSupWebsite(s.website || "");
    setSupWebsiteName(s.websiteName || "");
    setSupMessage(s.message || "");
    setSupIsTop1(Boolean(s.isTop1));
    setShowSupporterModal(true);
  };

  const handleSaveSupporterForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supAmount.trim()) {
      showToast("Supporter Name and Contribution Amount are required", "error");
      return;
    }

    const updated = [...supporters];
    if (editingSupporter) {
      const idx = updated.findIndex((s) => s.id === editingSupporter.id);
      if (idx !== -1) {
        updated[idx] = {
          ...editingSupporter,
          name: supName.trim(),
          amount: supAmount.trim(),
          tier: supTier.trim(),
          date: supDate.trim() || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          website: supWebsite.trim() || undefined,
          websiteName: supWebsiteName.trim() || undefined,
          message: supMessage.trim() || undefined,
          isTop1: supIsTop1,
        };
      }
    } else {
      const newId = `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      updated.push({
        id: newId,
        rank: updated.length + 1,
        name: supName.trim(),
        amount: supAmount.trim(),
        tier: supTier.trim(),
        date: supDate.trim() || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        website: supWebsite.trim() || undefined,
        websiteName: supWebsiteName.trim() || undefined,
        message: supMessage.trim() || undefined,
        isTop1: supIsTop1,
      });
    }

    if (supIsTop1) {
      const targetId = editingSupporter ? editingSupporter.id : updated[updated.length - 1].id;
      updated.forEach((s) => {
        s.isTop1 = s.id === targetId;
      });
    }

    updated.forEach((s, i) => {
      s.rank = i + 1;
    });

    setShowSupporterModal(false);
    handleSaveAndPublishSupporters(updated);
  };

  const handleDeleteSupporter = (id: string, name: string) => {
    if (confirm(`Remove supporter "${name}" from directory leaderboard?`)) {
      const filtered = supporters.filter((s) => s.id !== id);
      filtered.forEach((s, i) => {
        s.rank = i + 1;
      });
      if (filtered.length > 0 && !filtered.some((s) => s.isTop1)) {
        filtered[0].isTop1 = true;
      }
      handleSaveAndPublishSupporters(filtered);
    }
  };

  const handleMoveSupporter = (index: number, direction: "up" | "down") => {
    const list = [...supporters];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    list.forEach((s, i) => {
      s.rank = i + 1;
    });
    handleSaveAndPublishSupporters(list);
  };

  const handleToggleTop1 = (id: string) => {
    const list = supporters.map((s) => ({
      ...s,
      isTop1: s.id === id ? !s.isTop1 : false,
    }));
    handleSaveAndPublishSupporters(list);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => setLockoutTimer(lockoutTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLockedOut) {
      setIsLockedOut(false);
      setFailedAttempts(0);
    }
  }, [lockoutTimer, isLockedOut]);

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setIsAuthenticating(true);
    setAuthError("");

    setTimeout(() => {
      if (passwordInput === ADMIN_PASSWORD_SECRET) {
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, SESSION_TOKEN_VALUE);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, SESSION_TOKEN_VALUE);
        }
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        setPasswordInput("");
        setFailedAttempts(0);
        showToast("Authenticated as Shobhit (Master Admin)", "success");
      } else {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        setIsAuthenticating(false);
        if (attempts >= 5) {
          setIsLockedOut(true);
          setLockoutTimer(30);
          setAuthError("Too many failed attempts. Console locked for 30 seconds.");
        } else {
          setAuthError(`Invalid master passcode. (${5 - attempts} attempts remaining)`);
        }
      }
    }, 400);
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setPasswordInput("");
    showToast("Admin session terminated securely", "info");
  };

  // Auto URL check on blur
  const handleUrlBlur = () => {
    if (!newUrl.trim()) return;
    const res = validateAndParseUrl(newUrl);
    if (res.isValid) {
      setNewUrl(res.normalizedUrl);
      setAutoFavicon(res.faviconUrl);
    }
  };

  // Add Resource
  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim() || !newCategoryId) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmittingResource(true);
    const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
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
      showToast(`Added "${newName.trim()}" to directory`, "success");
    } catch (err) {
      showToast("Error creating resource", "error");
    } finally {
      setIsSubmittingResource(false);
    }
  };

  // Edit Resource Actions
  const openEditModal = (r: Resource) => {
    setEditingResource(r);
    setEditName(r.name);
    setEditUrl(r.url);
    setEditTagline(r.tagline);
    setEditDescription(r.description);
    setEditCategoryId(r.categoryId);
    setEditPricing(r.pricingType);
    setEditTags(r.tags?.join(", ") || "");
    setEditVerified(Boolean(r.verified));
    setEditFeatured(Boolean(r.featured));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    const tagsArray = editTags.split(",").map((t) => t.trim()).filter(Boolean);

    updateResource(editingResource.id, {
      name: editName.trim(),
      url: editUrl.trim(),
      tagline: editTagline.trim(),
      description: editDescription.trim(),
      categoryId: editCategoryId,
      pricingType: editPricing,
      tags: tagsArray,
      verified: editVerified,
      featured: editFeatured,
    });

    setEditingResource(null);
    refreshData();
    showToast(`Updated "${editName.trim()}" successfully`, "success");
  };

  const handleDeleteResource = (id: string, name: string) => {
    if (confirm(`Delete "${name}" from directory? This action cannot be undone.`)) {
      deleteResource(id);
      refreshData();
      showToast(`Deleted "${name}"`, "info");
    }
  };

  // Submission Moderation
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

    updateSubmissionStatus(sub.id, "approved", "Approved and published to index by Shobhit");
    refreshData();
    showToast(`Approved & Indexed: ${sub.name}`, "success");
  };

  const handleRejectSubmission = (id: string, name: string) => {
    updateSubmissionStatus(id, "rejected", "Declined based on directory quality standards");
    refreshData();
    showToast(`Declined submission: ${name}`, "info");
  };

  // Export database as JSON
  const handleExportDatabase = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      admin: "Shobhit Verma",
      platform: "FreeWebStuff (FWSF)",
      stats: getPlatformStats(),
      resources: getAllResources(),
      submissions: getAllSubmissions(),
      reports: getAllReports(),
      categories: getAllCategories()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freewebstuff-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full database backup downloaded", "success");
  };

  // Filtered resources list
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch = 
        r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.tagline?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.tags?.some(t => t.toLowerCase().includes(searchFilter.toLowerCase())) ||
        r.url.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || r.categoryId === categoryFilter;
      const matchesPricing = pricingFilter === "all" || r.pricingType === pricingFilter;
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "verified" ? r.verified : !r.verified;

      return matchesSearch && matchesCategory && matchesPricing && matchesStatus;
    });
  }, [resources, searchFilter, categoryFilter, pricingFilter, statusFilter]);

  // Loading screen while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Checking Authorization...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MATTE FINISH LOGIN INTERFACE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        {/* Subtle Matte Ambient Gradient Backdrop */}
        <div className="w-full max-w-md relative">
          
          {/* Outer Matte Slate Shell */}
          <div className="relative rounded-3xl bg-[#0b0e14] border border-[#1d222e] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.06)]">
            
            {/* Header Badge */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-[#121620] border border-[#232a3b] shadow-inner text-zinc-300">
                <ShieldCheck className="w-7 h-7 text-emerald-400/90" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[#141923] text-zinc-400 border border-[#242c3d] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SHOBHIT ADMIN ACCESS
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-heading">
                  Root Control Terminal
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Authenticate with your master passkey to access moderation &amp; index management.
                </p>
              </div>
            </div>

            {/* Error Notification Alert */}
            {authError && (
              <div className="mb-6 p-3.5 rounded-2xl bg-[#1f1315] border border-red-900/60 flex items-start gap-2.5 text-xs text-red-300 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{authError}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                    Admin Passkey
                  </label>
                  {capsLockOn && (
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> CAPS LOCK ON
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState("CapsLock"))}
                    disabled={isLockedOut || isAuthenticating}
                    placeholder="Enter master password..."
                    autoFocus
                    required
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#0e121a] border border-[#222838] text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-zinc-400 focus:bg-[#111622] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] font-mono disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLockedOut || isAuthenticating}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#121620] border-[#252c3c] text-zinc-300 focus:ring-0 focus:ring-offset-0 accent-zinc-500 cursor-pointer"
                  />
                  <span>Remember on this device</span>
                </label>
                <span className="text-[11px] font-mono text-zinc-600">Route: /adminshobhit</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLockedOut || isAuthenticating || !passwordInput.trim()}
                className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-all duration-200 shadow-[0_4px_16px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-900" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : isLockedOut ? (
                  <>
                    <Lock className="w-4 h-4 text-red-600" />
                    <span>Locked ({lockoutTimer}s)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </form>

            {/* Matte Footer Info */}
            <div className="mt-8 pt-6 border-t border-[#1a1f2b] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                TLS 1.3 Encrypted
              </span>
              <span>v2.4.0-stable</span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED MATTE FINISH ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 py-6 max-w-[1400px] mx-auto px-2 sm:px-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#10141e] border border-[#263044] text-xs font-medium text-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-slide-up">
          {toastMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toastMessage.type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
          {toastMessage.type === "info" && <Shield className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Bar Header - Matte Slate Aesthetic */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Title & Operator Badge */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#141a24] text-emerald-400 border border-[#232c3d]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SECURE ROOT SESSION
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono text-zinc-400 bg-[#121620] border border-[#1e2535]">
              Operator: Shobhit Verma
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 font-heading">
            FreeWebStuff Admin Console
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time directory operations, instant indexing, community submission reviews, and platform telemetry.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={refreshData}
            className="px-3.5 py-2 rounded-xl bg-[#121622] hover:bg-[#181d2c] border border-[#22293b] text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Reload live dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportDatabase}
            className="px-3.5 py-2 rounded-xl bg-[#121622] hover:bg-[#181d2c] border border-[#22293b] text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Download JSON Snapshot"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DB</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-[#1f1315] hover:bg-[#2b191c] border border-red-900/50 text-xs font-medium text-red-300 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Lock terminal and logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock &amp; Exit</span>
          </button>
        </div>
      </div>

      {/* Matte Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0a0d13] border border-[#191f2c] rounded-2xl overflow-x-auto">
        {[
          { id: "overview", label: "Overview & Telemetry", icon: BarChart3, count: null },
          { id: "resources", label: "Directory Resources", icon: Layers, count: resources.length },
          { id: "supporters", label: "Top Supporters", icon: Crown, count: supporters.length },
          { id: "submissions", label: "Submissions Queue", icon: Send, count: stats?.pendingSubmissions || 0 },
          { id: "reports", label: "Safety Flags", icon: AlertTriangle, count: stats?.openReports || 0 },
          { id: "database", label: "System & Health", icon: Server, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-[#161c28] text-zinc-100 border border-[#2a3449] shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.06)]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#0e121a]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-200" : "text-zinc-500"}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? "bg-zinc-800 text-zinc-200" : "bg-[#141822] text-zinc-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {/* ============================================================= */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-medium">INDEXED RESOURCES</span>
                <Layers className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-100 font-heading">
                {stats.totalResources.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400/90 font-mono mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Curated &amp; Safe
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-medium">CATEGORIES</span>
                <FolderTree className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-100 font-heading">
                {stats.totalCategories}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1">
                Structured taxonomies
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-medium">PENDING QUEUE</span>
                <Send className="w-4 h-4 text-amber-500/80" />
              </div>
              <div className="text-3xl font-extrabold text-amber-300 font-heading">
                {stats.pendingSubmissions}
              </div>
              <div className="text-[11px] text-amber-400/80 font-mono mt-1">
                Awaiting moderator review
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono font-medium">SAFETY FLAGS</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-extrabold text-red-400 font-heading">
                {stats.openReports}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1">
                Open user reports
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="p-6 rounded-3xl bg-[#0c0f16] border border-[#1b212f] space-y-4">
            <h3 className="font-bold text-base text-zinc-200 font-heading">Fast Operations Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("resources")}
                className="p-5 rounded-2xl bg-[#10141e] hover:bg-[#151a27] border border-[#20283a] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white">Publish New Resource</div>
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">Directly inject verified tools with automatic favicon resolution.</div>
              </button>

              <button
                onClick={() => setActiveTab("submissions")}
                className="p-5 rounded-2xl bg-[#10141e] hover:bg-[#151a27] border border-[#20283a] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white">Review Submissions</div>
                  <Send className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">Triage and approve suggested entries submitted by the community.</div>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className="p-5 rounded-2xl bg-[#10141e] hover:bg-[#151a27] border border-[#20283a] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white">Resolve Flags</div>
                  <AlertTriangle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">Audit dead URLs, malformed metadata, or safety disputes.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: RESOURCES CRUD */}
      {/* ============================================================= */}
      {activeTab === "resources" && (
        <div className="space-y-8">
          
          {/* Add New Resource Form */}
          <form onSubmit={handleCreateResource} className="p-6 sm:p-8 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_8px_24px_rgba(0,0,0,0.6)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-4">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-heading">
                <Plus className="w-4 h-4 text-zinc-400" />
                Publish Resource to Directory
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">Live Instant Commit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tool / Project Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. VS Code, Photopea, OBS Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Website URL *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            {autoFavicon && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-[#0d1c16] p-3 rounded-xl border border-emerald-900/40">
                <img src={autoFavicon} alt="Favicon" className="w-4 h-4 rounded" />
                <span>Auto-resolved website logo &amp; favicon successfully</span>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tagline / Short Summary *</label>
              <input
                type="text"
                required
                value={newTagline}
                onChange={(e) => setNewTagline(e.target.value)}
                placeholder="A concise 1-sentence value proposition..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Category</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#10141e]">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Pricing Model</label>
                <select
                  value={newPricing}
                  onChange={(e) => setNewPricing(e.target.value as PricingType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors"
                >
                  <option value="free" className="bg-[#10141e]">100% Free</option>
                  <option value="open-source" className="bg-[#10141e]">Open Source (FOSS)</option>
                  <option value="freemium" className="bg-[#10141e]">Freemium</option>
                  <option value="paid" className="bg-[#10141e]">Commercial / Paid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="AI, Code, FOSS, Web"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newVerified}
                  onChange={(e) => setNewVerified(e.target.checked)}
                  className="rounded bg-[#10141e] border-[#22293a] text-zinc-200 accent-zinc-500"
                />
                <span>Mark Verified Safe</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newFeatured}
                  onChange={(e) => setNewFeatured(e.target.checked)}
                  className="rounded bg-[#10141e] border-[#22293a] text-zinc-200 accent-zinc-500"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmittingResource}
              className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmittingResource ? "Publishing..." : "Publish to Directory"}
            </button>
          </form>

          {/* Resources Table & Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-100 font-heading">
                  All Directory Resources ({filteredResources.length} / {resources.length})
                </h3>
                <p className="text-xs text-zinc-400">Search, edit, or purge indexed records.</p>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search tools, URLs, tags..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0c0f16] border border-[#1b212f] text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 w-56"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0c0f16] border border-[#1b212f] text-xs text-zinc-300 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={pricingFilter}
                  onChange={(e) => setPricingFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0c0f16] border border-[#1b212f] text-xs text-zinc-300 outline-none"
                >
                  <option value="all">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="open-source">Open Source</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#1b212f] bg-[#0c0f16]">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#10141e] border-b border-[#1b212f] text-zinc-500 uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Pricing</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171c29]">
                  {filteredResources.slice(0, 100).map((r) => (
                    <tr key={r.id} className="hover:bg-[#10141e]/70 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          {r.logoUrl ? (
                            <img src={r.logoUrl} alt="" className="w-5 h-5 rounded object-contain shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-[#181e2b] flex items-center justify-center text-[10px] text-zinc-400 font-bold shrink-0">
                              {r.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <a
                              href={`/resource/${r.slug}`}
                              target="_blank"
                              className="font-semibold text-zinc-100 hover:text-white hover:underline block truncate max-w-[200px] sm:max-w-[280px]"
                            >
                              {r.name}
                            </a>
                            <span className="text-[11px] text-zinc-500 block truncate max-w-[200px] sm:max-w-[280px]">
                              {r.tagline}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-[#121620] border border-[#1e2535] text-zinc-400 capitalize">
                          {r.categoryId}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize text-zinc-400">{r.pricingType}</span>
                      </td>
                      <td className="p-3.5">
                        {r.verified ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-400">Unverified</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-[#181d2a] rounded-lg transition-colors"
                            title="Edit Resource"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(r.id, r.name)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: SUBMISSIONS MODERATION QUEUE */}
      {/* ============================================================= */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-zinc-100 font-heading">
                Community Submissions ({submissions.length})
              </h3>
              <p className="text-xs text-zinc-400">Review, verify and publish links submitted by users.</p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-zinc-500 text-xs">
              Queue is completely empty! All submissions have been processed.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100">{sub.name}</span>
                      <span className="text-[11px] text-zinc-400 capitalize px-2 py-0.5 rounded bg-[#121620] border border-[#1e2535]">
                        {sub.categoryId}
                      </span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                        sub.status === "pending"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : sub.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/15 text-red-300 border border-red-500/30"
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">{sub.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-white hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <span>{sub.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {sub.submitterEmail && (
                        <span className="text-[11px] text-zinc-500">By: {sub.submitterEmail}</span>
                      )}
                    </div>
                  </div>

                  {sub.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveSubmission(sub)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Index</span>
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(sub.id, sub.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1f1315] hover:bg-[#2e181c] text-red-300 border border-red-900/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: SAFETY REPORTS QUEUE */}
      {/* ============================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-zinc-100 font-heading">
              Safety Flags &amp; Problem Reports ({reports.length})
            </h3>
            <p className="text-xs text-zinc-400">Handle dead links, malware advisories, and copyright requests.</p>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-zinc-500 text-xs">
              Zero active flags. All reported issues have been resolved.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-3xl bg-[#0c0f16] border border-[#1b212f] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100">{rep.resourceName}</span>
                      <span className="text-xs font-medium text-red-400 px-2 py-0.5 rounded bg-red-950/40 border border-red-900/40 capitalize">
                        {rep.reason.replace("-", " ")}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        Status: {rep.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">{rep.details}</p>
                    {rep.reporterEmail && (
                      <span className="text-[11px] text-zinc-500 block">Reporter: {rep.reporterEmail}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        updateReportStatus(rep.id, "resolved");
                        refreshData();
                        showToast(`Flag marked resolved: ${rep.resourceName}`, "success");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#10141e] hover:bg-emerald-950/40 text-emerald-400 border border-[#20283a] text-xs font-semibold transition-colors"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(rep.id, "dismissed");
                        refreshData();
                        showToast(`Flag dismissed: ${rep.resourceName}`, "info");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#10141e] hover:bg-[#181d2c] text-zinc-400 text-xs font-semibold transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: SYSTEM & DATABASE HEALTH */}
      {/* ============================================================= */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0c0f16] border border-[#1b212f] space-y-4">
            <h3 className="font-bold text-lg text-zinc-100 font-heading flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-400" />
              Database Backup &amp; Storage Telemetry
            </h3>
            <p className="text-xs text-zinc-400">
              Download JSON dumps of all registered resources, collections, categories, and moderation logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#10141e] border border-[#20283a] space-y-2">
                <span className="text-xs font-mono text-zinc-400 block uppercase">Instant Full Dump</span>
                <div className="text-sm font-semibold text-zinc-200">Export All Directory Records</div>
                <p className="text-xs text-zinc-500">Download formatted JSON including all {resources.length} resources.</p>
                <button
                  onClick={handleExportDatabase}
                  className="mt-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.json)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#10141e] border border-[#20283a] space-y-2">
                <span className="text-xs font-mono text-zinc-400 block uppercase">System Health</span>
                <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> All Systems Operational
                </div>
                <p className="text-xs text-zinc-500">In-memory state cache active. Zero memory leak detected.</p>
                <div className="text-[11px] font-mono text-zinc-400 pt-1">
                  Latency: ~0.4ms | Cache Status: Warm
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB: TOP SUPPORTERS & WALL OF HONOR */}
      {/* ============================================================= */}
      {activeTab === "supporters" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0f16] border border-[#1b212f] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#141a24] text-zinc-300 border border-[#232c3d]">
                <Crown className="w-3.5 h-3.5 text-zinc-300" />
                <span>DONATIONS &amp; WALL OF HONOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-heading">
                Top Supporters Management
              </h2>
              <p className="text-xs text-zinc-400">
                Manage the live donor leaderboard, assign #1 Crown Spotlight, add project backlinks, and sync to the website in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={openNewSupporterModal}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-all duration-150 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Supporter</span>
              </button>

              <button
                type="button"
                disabled={isSavingSupporters}
                onClick={() => handleSaveAndPublishSupporters(supporters)}
                className="px-4 py-2.5 rounded-xl bg-[#121622] hover:bg-[#181d2c] border border-[#2a344a] text-zinc-200 font-bold text-xs transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span className={`w-2 h-2 rounded-full ${isSavingSupporters ? "bg-amber-400 animate-spin" : "bg-emerald-400 animate-pulse"}`} />
                <span>{isSavingSupporters ? "Publishing..." : "One-Click Publish Live"}</span>
              </button>
            </div>
          </div>

          {/* Quick Info & Telemetry Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0c0f16] border border-[#1b212f]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Live Supporters Count</div>
              <div className="text-2xl font-bold text-zinc-100 mt-1">{supporters.length}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {supporters.length === 0 ? "Places are currently blank on website" : "Active on public Wall of Honor"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0f16] border border-[#1b212f]">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">#1 Spotlight Backer</div>
              <div className="text-base font-bold text-zinc-200 mt-1 truncate">
                {supporters.find(s => s.isTop1)?.name || supporters[0]?.name || "None (Claimable Spotlight)"}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                {supporters.find(s => s.isTop1) ? `${supporters.find(s => s.isTop1)?.amount} (${supporters.find(s => s.isTop1)?.tier})` : "Displays open spot callout on website"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0f16] border border-[#1b212f] flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase">Live Page Preview</div>
                <div className="text-xs text-zinc-300 mt-1 font-mono">/donate &bull; /support</div>
              </div>
              <a
                href="/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1 mt-2 font-medium"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Supporters List or Blank State */}
          {supporters.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#0c0f16] border border-[#1b212f] text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#121622] border border-[#232a3b] text-zinc-400 flex items-center justify-center mx-auto">
                <Crown className="w-7 h-7 text-zinc-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-bold text-zinc-200 font-heading">
                  All Ranking Places Are Blank
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The website currently shows an open invitation (&ldquo;Claim the #1 Crown Spot&rdquo;) with reserved slots. When someone sends a contribution via Ko-fi, PayPal, or Crypto, add their details here to feature them live.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewSupporterModal}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Supporter</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
                <span>RANK &bull; SUPPORTER</span>
                <span>ACTIONS</span>
              </div>

              <div className="space-y-2.5">
                {supporters.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      s.isTop1
                        ? "bg-[#10141e] border-[#2e394e] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                        : "bg-[#0c0f16] border-[#1b212f] hover:border-[#252d40]"
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        s.isTop1
                          ? "bg-zinc-100 text-zinc-950 font-black shadow-md"
                          : "bg-[#141824] text-zinc-300 border border-[#232b3d]"
                      }`}>
                        #{s.rank || idx + 1}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">{s.name}</span>
                          {s.isTop1 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-200 border border-zinc-700">
                              <Crown className="w-3 h-3 text-zinc-300" />
                              #1 Spotlight
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#141822] text-zinc-400 border border-[#202738]">
                            {s.tier || "Crown Backer"}
                          </span>
                          <span className="font-bold text-xs text-emerald-400 font-mono">
                            {s.amount}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                          {s.date && <span className="font-mono text-[11px] text-zinc-500">{s.date}</span>}
                          {s.website && (
                            <a
                              href={s.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-300 hover:text-white inline-flex items-center gap-1 truncate max-w-xs"
                            >
                              <Globe className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span className="underline decoration-zinc-600 truncate">{s.websiteName || s.website}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                            </a>
                          )}
                          {s.message && (
                            <span className="italic text-zinc-400 truncate max-w-md">
                              &ldquo;{s.message}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1a202c]">
                      {/* Move up / down */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSupporter(idx, "up")}
                        className="p-1.5 rounded-lg bg-[#141822] hover:bg-[#1a202c] border border-[#22293b] text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === supporters.length - 1}
                        onClick={() => handleMoveSupporter(idx, "down")}
                        className="p-1.5 rounded-lg bg-[#141822] hover:bg-[#1a202c] border border-[#22293b] text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle #1 Spotlight */}
                      <button
                        type="button"
                        onClick={() => handleToggleTop1(s.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                          s.isTop1
                            ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                            : "bg-[#141822] text-zinc-400 border-[#22293b] hover:text-zinc-200"
                        }`}
                        title="Toggle #1 Spotlight"
                      >
                        <Crown className="w-3 h-3" />
                        <span>{s.isTop1 ? "#1 Active" : "Set #1"}</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEditSupporterModal(s)}
                        className="p-1.5 rounded-lg bg-[#141822] hover:bg-[#1a202c] border border-[#22293b] text-zinc-300 hover:text-white"
                        title="Edit Supporter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSupporter(s.id, s.name)}
                        className="p-1.5 rounded-lg bg-[#1f1315] hover:bg-[#2b191c] border border-red-900/50 text-red-400 hover:text-red-300"
                        title="Remove Supporter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* ADD / EDIT SUPPORTER MODAL */}
      {/* ============================================================= */}
      {showSupporterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0c0f16] border border-[#222a3d] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-zinc-300" />
                {editingSupporter ? `Edit Supporter: ${editingSupporter.name}` : "Add New Supporter"}
              </h3>
              <button
                onClick={() => setShowSupporterModal(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupporterForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Supporter Name / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera or CyberTool"
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Contribution Amount *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $100 or ₹3,500 or 50 USDT"
                    value={supAmount}
                    onChange={(e) => setSupAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Tier Label
                  </label>
                  <select
                    value={supTier}
                    onChange={(e) => setSupTier(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  >
                    <option value="Crown Backer">Crown Backer (Premier)</option>
                    <option value="Diamond Supporter">Diamond Supporter</option>
                    <option value="Gold Supporter">Gold Supporter</option>
                    <option value="Silver Supporter">Silver Supporter</option>
                    <option value="Coffee Supporter">Coffee Supporter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Contribution Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sep 2026"
                    value={supDate}
                    onChange={(e) => setSupDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Promoted Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={supWebsite}
                    onChange={(e) => setSupWebsite(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Website Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Example AI Suite"
                    value={supWebsiteName}
                    onChange={(e) => setSupWebsiteName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">
                  Personal Backer Quote / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Great mission to preserve free web tools! Proud to support."
                  value={supMessage}
                  onChange={(e) => setSupMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400 resize-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer p-3 rounded-xl bg-[#10141e] border border-[#22293a]">
                  <input
                    type="checkbox"
                    checked={supIsTop1}
                    onChange={(e) => setSupIsTop1(e.target.checked)}
                    className="rounded bg-[#141824] border-[#22293a] text-zinc-200 accent-zinc-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-zinc-100 block">👑 Set as #1 Top Supporter Spotlight</span>
                    <span className="text-[11px] text-zinc-400">Features this supporter prominently in the large top hero card on /donate</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1b212f]">
                <button
                  type="button"
                  onClick={() => setShowSupporterModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#10141e] hover:bg-[#181d2a] text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSupporters}
                  className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {isSavingSupporters ? "Publishing..." : "Save & Publish Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EDIT RESOURCE MODAL */}
      {/* ============================================================= */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0c0f16] border border-[#222a3d] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5 animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-[#1b212f] pb-3">
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-zinc-400" />
                Edit Resource: {editingResource.name}
              </h3>
              <button
                onClick={() => setEditingResource(null)}
                className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">URL</label>
                  <input
                    type="text"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Pricing</label>
                  <select
                    value={editPricing}
                    onChange={(e) => setEditPricing(e.target.value as PricingType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  >
                    <option value="free">Free</option>
                    <option value="open-source">Open Source</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Tags</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#10141e] border border-[#22293a] text-sm text-zinc-100 outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editVerified}
                    onChange={(e) => setEditVerified(e.target.checked)}
                    className="rounded bg-[#10141e] border-[#22293a] text-zinc-200 accent-zinc-500"
                  />
                  <span>Mark Verified</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="rounded bg-[#10141e] border-[#22293a] text-zinc-200 accent-zinc-500"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1b212f]">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl bg-[#10141e] hover:bg-[#181d2a] text-zinc-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
