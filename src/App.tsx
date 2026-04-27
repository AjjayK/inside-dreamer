import "@dev-agents/sdk-client/styles/base";
import { agentQueryClient, call } from "@dev-agents/sdk-client";
import { QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  EyeOff,
  Filter,
  Globe,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Moon,
  Newspaper,
  Pencil,
  Plane,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { getUserTimeZone } from "@dev-agents/sdk-shared";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

dayjs.extend(utc);
dayjs.extend(timezone);
import type {
  createWatch,
  deleteWatch,
  dismissAlert,
  dismissAllAlerts,
  getAlertCounts,
  getAlerts,
  getPersonalizedExamples,
  getUserProfile,
  getWatches,
  initializeProfile,
  markAlertRead,
  markAllAlertsRead,
  runCheckNow,
  saveProfile,
  syncProfileToSidekick,
  updateWatch,
} from "./server";
import Widget from "./Widget";

interface RenderContext {
  type: "widget" | "app" | "feed_item";
  data?: unknown;
}

// ─── TOAST SYSTEM ──────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let toastId = 0;
let globalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

function showToast(message: string, type: "success" | "error" = "success") {
  const id = ++toastId;
  globalSetToasts?.(prev => [...prev, { id, message, type }]);
  setTimeout(() => {
    globalSetToasts?.(prev => prev.filter(t => t.id !== id));
  }, 3000);
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  globalSetToasts = setToasts;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-xl shadow-lg font-['DM_Sans'] text-sm flex items-center gap-2 animate-[slideDown_0.3s_ease-out] ${
            toast.type === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// ─── SHARED DATA HOOKS ──────────────────────────────────────────

function useWatches() {
  return useQuery({
    queryKey: ["watches"],
    queryFn: () => call<typeof getWatches>("getWatches", {}),
  });
}

function useAlertCounts() {
  return useQuery({
    queryKey: ["alertCounts"],
    queryFn: () => call<typeof getAlertCounts>("getAlertCounts", {}),
  });
}

function useProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => call<typeof getUserProfile>("getUserProfile", {}),
  });
}

// ─── SOURCE TYPE ICON ───────────────────────────────────────────

function SourceIcon({ type, className }: { type: string; className?: string }) {
  const cn = className || "w-4 h-4";
  switch (type) {
    case "email": return <Mail className={cn} />;
    case "news": return <Newspaper className={cn} />;
    case "web": return <Globe className={cn} />;
    case "calendar": return <Calendar className={cn} />;
    case "flight": return <Plane className={cn} />;
    case "contacts": return <Users className={cn} />;
    case "slack": return <MessageSquare className={cn} />;
    default: return <Bell className={cn} />;
  }
}

// ─── CONFIDENCE BADGE ───────────────────────────────────────────

function ConfidenceBadge({ confidence }: { confidence: string | null | undefined }) {
  if (!confidence) return null;
  const styles: Record<string, string> = {
    high: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    low: "bg-red-500/20 text-red-600 dark:text-red-400",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-['DM_Sans'] font-medium ${styles[confidence] || styles.medium}`}>
      {confidence}
    </span>
  );
}

// ─── ONBOARDING / PROFILE SETUP ─────────────────────────────────

function ProfileSetup({ onComplete }: { onComplete: () => void }) {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const initMutation = useMutation({
    mutationFn: () => call<typeof initializeProfile>("initializeProfile", {}),
  });

  const saveMutation = useMutation({
    mutationFn: () => call<typeof saveProfile>("saveProfile", {
      location: location || undefined,
      interests: interests.length > 0 ? interests : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      call<typeof syncProfileToSidekick>("syncProfileToSidekick", {
        location: location || undefined,
        interests: interests.length > 0 ? interests : undefined,
      });
      onComplete();
    },
    onError: () => showToast("Failed to save profile", "error"),
  });

  useEffect(() => {
    if (initMutation.isIdle) {
      initMutation.mutate();
    }
  }, [initMutation.isIdle]);

  useEffect(() => {
    if (initMutation.data && !initMutation.data.alreadyInitialized) {
      const profile = initMutation.data.profile;
      if (profile) {
        if ("location" in profile && typeof profile.location === "string" && profile.location) {
          setLocation(profile.location);
        }
        if ("interests" in profile && Array.isArray(profile.interests)) {
          setInterests(profile.interests);
        }
      }
    }
    if (initMutation.data?.alreadyInitialized) {
      onComplete();
    }
  }, [initMutation.data]);

  const suggestedInterests = [
    "Technology", "Finance", "Health", "Sports",
    "Science", "Politics", "Entertainment", "Travel",
    "Real Estate", "Education", "Climate", "AI",
  ];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  if (initMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-muted-foreground font-['DM_Sans']">Getting your profile ready...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Radio className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-foreground font-['DM_Sans']">Welcome to Radar</h1>
        <p className="text-muted-foreground mt-2 font-['DM_Sans']">
          Tell us a bit about yourself so we can set up your monitors.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
            Your location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
            Topics you care about
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedInterests.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-['DM_Sans'] transition-colors cursor-default ${
                  interests.includes(interest)
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
              placeholder="Add your own topic..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={addCustomInterest}
              disabled={!customInterest.trim()}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 cursor-default"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {interests.filter(i => !suggestedInterests.includes(i)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.filter(i => !suggestedInterests.includes(i)).map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full text-sm bg-emerald-500 text-white font-['DM_Sans'] flex items-center gap-1"
                >
                  {interest}
                  <button type="button" onClick={() => toggleInterest(interest)} className="cursor-default">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium font-['DM_Sans'] hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-default"
        >
          {saveMutation.isPending ? "Saving..." : "Get Started"}
        </button>

        <button
          type="button"
          onClick={onComplete}
          className="w-full text-center text-sm text-muted-foreground font-['DM_Sans'] cursor-default"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── CREATE WATCH ───────────────────────────────────────────────

function CreateWatchForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [checkInterval, setCheckInterval] = useState(120);
  const [preferredTime, setPreferredTime] = useState("08:00");
  const [preferredDay, setPreferredDay] = useState("monday");
  const [webUrl, setWebUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [slackChannelsInput, setSlackChannelsInput] = useState("");
  const [contactEmailsInput, setContactEmailsInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: () => call<typeof createWatch>("createWatch", {
      description,
      checkInterval,
      preferredTime: checkInterval >= 1440 ? preferredTime : undefined,
      preferredDay: checkInterval >= 10080 ? preferredDay : undefined,
      webUrl: webUrl || undefined,
      targetPrice: targetPrice || undefined,
      flightNumber: flightNumber || undefined,
      slackChannels: slackChannelsInput.trim() ? slackChannelsInput.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined,
      contactEmails: contactEmailsInput.trim() ? contactEmailsInput.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined,
    }),
    onSuccess: (result) => {
      if (result?.needsClarification && result.clarifyingQuestions) {
        setClarifyingQuestions(result.clarifyingQuestions);
      } else {
        queryClient.invalidateQueries({ queryKey: ["watches"] });
        showToast("Watch created");
        onClose();
      }
    },
    onError: () => showToast("Failed to create watch", "error"),
  });

  const genericExamples = [
    "Alert me when there's news about AI regulation",
    "Track flight UA 2145 for delays and gate changes",
    "Warn me if I have back-to-back meetings tomorrow",
    "Nudge me if I haven't emailed Mom in 2 weeks",
    "Watch #engineering on Slack for outage mentions",
    "Tell me when the Sony WH-1000XM5 drops below $250",
  ];

  const personalizedMutation = useMutation({
    mutationFn: () => call<typeof getPersonalizedExamples>("getPersonalizedExamples", {}),
  });

  useEffect(() => {
    if (personalizedMutation.isIdle) {
      personalizedMutation.mutate();
    }
  }, [personalizedMutation.isIdle]);

  const personalizedExamples = personalizedMutation.data?.suggestions || [];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onClose} className="cursor-default">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground font-['DM_Sans']">New Watch</h2>
      </div>

      {clarifyingQuestions.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-['DM_Sans']">
            To make your watch more precise, could you clarify:
          </p>
          {clarifyingQuestions.map((q, i) => (
            <div key={i} className="p-3 bg-card border border-border rounded-lg">
              <p className="text-sm text-foreground font-['DM_Sans']">{q}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground font-['DM_Sans']">
            Update your description below and try again, or keep the current description.
          </p>
          <button
            type="button"
            onClick={() => {
              setClarifyingQuestions([]);
              createMutation.reset();
            }}
            className="text-sm text-emerald-500 font-['DM_Sans'] cursor-default"
          >
            Edit description
          </button>
          <button
            type="button"
            onClick={() => {
              setClarifyingQuestions([]);
              createMutation.mutate();
            }}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium font-['DM_Sans'] cursor-default"
          >
            Create anyway
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
              What do you want to monitor?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to watch in plain language..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            />
            {!description && (
              <div className="mt-3 space-y-2">
                {personalizedExamples.length > 0 && (
                  <p className="text-xs text-muted-foreground font-['DM_Sans']">For you:</p>
                )}
                {personalizedMutation.isPending && (
                  <>
                    <p className="text-xs text-muted-foreground font-['DM_Sans']">For you:</p>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 rounded-lg bg-secondary/50 animate-pulse" />
                    ))}
                  </>
                )}
                {personalizedExamples.map(example => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setDescription(example)}
                    className="block w-full text-left text-xs px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-foreground font-['DM_Sans'] hover:bg-emerald-500/20 transition-colors cursor-default"
                  >
                    {example}
                  </button>
                ))}
                <p className="text-xs text-muted-foreground font-['DM_Sans'] mt-1">Ideas:</p>
                {(personalizedExamples.length > 0 ? genericExamples.slice(0, 3) : genericExamples).map(example => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setDescription(example)}
                    className="block w-full text-left text-xs px-3 py-2 bg-secondary/50 rounded-lg text-foreground font-['DM_Sans'] hover:bg-secondary transition-colors cursor-default"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
              Check frequency
            </label>
            <select
              value={checkInterval}
              onChange={(e) => setCheckInterval(Number(e.target.value))}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-['DM_Sans'] bg-secondary text-foreground border border-border outline-none focus:ring-1 focus:ring-primary/50 cursor-default"
            >
              <option value={15}>Every 15 min</option>
              <option value={30}>Every 30 min</option>
              <option value={60}>Every 1 hour</option>
              <option value={120}>Every 2 hours</option>
              <option value={240}>Every 4 hours</option>
              <option value={1440}>Daily</option>
              <option value={10080}>Weekly</option>
            </select>
            {checkInterval >= 1440 && (
              <div className="flex items-center gap-2 mt-2">
                {checkInterval >= 10080 && (
                  <select
                    value={preferredDay}
                    onChange={(e) => setPreferredDay(e.target.value)}
                    className="px-2 py-1 bg-secondary text-foreground border border-border rounded-lg text-xs font-['DM_Sans'] outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                )}
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-['DM_Sans']">at</span>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="px-2 py-1 bg-secondary text-foreground border border-border rounded-lg text-xs font-['DM_Sans'] outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
              Specific URL to monitor (optional)
            </label>
            <input
              type="url"
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
              placeholder="https://example.com/page-to-watch"
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Advanced options toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-['DM_Sans'] cursor-default hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 border border-border rounded-xl bg-secondary/30">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-muted-foreground" /> Flight number
                </label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. UA2145, AA100"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Target price
                </label>
                <input
                  type="text"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 250, 99.99"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Alert when a product drops below this price</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" /> Contact emails
                </label>
                <input
                  type="text"
                  value={contactEmailsInput}
                  onChange={(e) => setContactEmailsInput(e.target.value)}
                  placeholder="mom@email.com, friend@email.com"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Get nudged when you haven't been in touch</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /> Slack channels
                </label>
                <input
                  type="text"
                  value={slackChannelsInput}
                  onChange={(e) => setSlackChannelsInput(e.target.value)}
                  placeholder="#engineering, #alerts"
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Monitor specific Slack channels for relevant messages</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={!description.trim() || createMutation.isPending}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium font-['DM_Sans'] hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-default flex items-center justify-center gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Watch"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── EDIT WATCH ─────────────────────────────────────────────────

function EditWatchForm({ watch, onClose }: {
  watch: {
    id: number; description: string; urgency: string; webUrl: string | null;
    targetPrice?: string | null; flightNumber?: string | null;
    slackChannels?: string | null; contactEmails?: string | null;
    digestTime?: string | null; checkInterval?: number | null;
    preferredTime?: string | null; preferredDay?: string | null;
  };
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState(watch.description);
  const [checkInterval, setCheckInterval] = useState(watch.checkInterval || (watch.urgency === "instant" ? 120 : 1440));
  const [preferredTime, setPreferredTime] = useState(watch.preferredTime || watch.digestTime || "08:00");
  const [preferredDay, setPreferredDay] = useState(watch.preferredDay || "monday");
  const [webUrl, setWebUrl] = useState(watch.webUrl || "");
  const [targetPrice, setTargetPrice] = useState(watch.targetPrice || "");
  const [flightNumber, setFlightNumber] = useState(watch.flightNumber || "");
  const [slackChannelsInput, setSlackChannelsInput] = useState(
    watch.slackChannels ? JSON.parse(watch.slackChannels).join(", ") : ""
  );
  const [contactEmailsInput, setContactEmailsInput] = useState(
    watch.contactEmails ? JSON.parse(watch.contactEmails).join(", ") : ""
  );
  const [showAdvanced, setShowAdvanced] = useState(
    !!(watch.targetPrice || watch.flightNumber || watch.slackChannels || watch.contactEmails)
  );

  const editMutation = useMutation({
    mutationFn: () => call<typeof updateWatch>("updateWatch", {
      id: watch.id,
      description: description !== watch.description ? description : undefined,
      checkInterval,
      preferredTime: checkInterval >= 1440 ? preferredTime : undefined,
      preferredDay: checkInterval >= 10080 ? preferredDay : undefined,
      webUrl: webUrl || undefined,
      targetPrice: targetPrice || undefined,
      flightNumber: flightNumber || undefined,
      slackChannels: slackChannelsInput.trim() ? slackChannelsInput.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined,
      contactEmails: contactEmailsInput.trim() ? contactEmailsInput.split(",").map((s: string) => s.trim()).filter(Boolean) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watches"] });
      showToast("Watch updated");
      onClose();
    },
    onError: () => showToast("Failed to update watch", "error"),
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onClose} className="cursor-default">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground font-['DM_Sans']">Edit Watch</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
          {description !== watch.description && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-['DM_Sans']">
              Changing the description will re-analyze topics and sources
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
            Check frequency
          </label>
          <select
            value={checkInterval}
            onChange={(e) => setCheckInterval(Number(e.target.value))}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-['DM_Sans'] bg-secondary text-foreground border border-border outline-none focus:ring-1 focus:ring-primary/50 cursor-default"
          >
            <option value={15}>Every 15 min</option>
            <option value={30}>Every 30 min</option>
            <option value={60}>Every 1 hour</option>
            <option value={120}>Every 2 hours</option>
            <option value={240}>Every 4 hours</option>
            <option value={1440}>Daily</option>
            <option value={10080}>Weekly</option>
          </select>
          {checkInterval >= 1440 && (
            <div className="flex items-center gap-2 mt-2">
              {checkInterval >= 10080 && (
                <select
                  value={preferredDay}
                  onChange={(e) => setPreferredDay(e.target.value)}
                  className="px-2 py-1 bg-secondary text-foreground border border-border rounded-lg text-xs font-['DM_Sans'] outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              )}
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-['DM_Sans']">at</span>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="px-2 py-1 bg-secondary text-foreground border border-border rounded-lg text-xs font-['DM_Sans'] outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">
            URL to monitor (optional)
          </label>
          <input
            type="url"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            placeholder="https://example.com/page-to-watch"
            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Advanced options toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-['DM_Sans'] cursor-default hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 border border-border rounded-xl bg-secondary/30">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-muted-foreground" /> Flight number
              </label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g. UA2145, AA100"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Target price
              </label>
              <input
                type="text"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 250, 99.99"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Alert when a product drops below this price</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" /> Contact emails
              </label>
              <input
                type="text"
                value={contactEmailsInput}
                onChange={(e) => setContactEmailsInput(e.target.value)}
                placeholder="mom@email.com, friend@email.com"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Get nudged when you haven't been in touch</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-['DM_Sans'] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /> Slack channels
              </label>
              <input
                type="text"
                value={slackChannelsInput}
                onChange={(e) => setSlackChannelsInput(e.target.value)}
                placeholder="#engineering, #alerts"
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-muted-foreground mt-1 font-['DM_Sans']">Monitor specific Slack channels for relevant messages</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => editMutation.mutate()}
          disabled={!description.trim() || editMutation.isPending}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium font-['DM_Sans'] hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-default flex items-center justify-center gap-2"
        >
          {editMutation.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── SNOOZE PICKER ──────────────────────────────────────────────

function SnoozePicker({ watchId, onClose }: { watchId: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [showCustom, setShowCustom] = useState(false);
  const [customDateTime, setCustomDateTime] = useState(() => {
    // Default to tomorrow same time, formatted for datetime-local input
    return dayjs().tz(getUserTimeZone()).add(1, "day").format("YYYY-MM-DDTHH:mm");
  });

  const snoozeMutation = useMutation({
    mutationFn: (snoozeUntilIso: string) => {
      return call<typeof updateWatch>("updateWatch", {
        id: watchId,
        snoozeUntil: snoozeUntilIso,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watches"] });
      showToast("Watch snoozed");
      onClose();
    },
    onError: () => showToast("Failed to snooze watch", "error"),
  });

  const handlePreset = (duration: string) => {
    let snoozeUntil: string;
    switch (duration) {
      case "1h": snoozeUntil = dayjs().tz(getUserTimeZone()).add(1, "hour").toISOString(); break;
      case "1d": snoozeUntil = dayjs().tz(getUserTimeZone()).add(1, "day").toISOString(); break;
      case "3d": snoozeUntil = dayjs().tz(getUserTimeZone()).add(3, "day").toISOString(); break;
      case "1w": snoozeUntil = dayjs().tz(getUserTimeZone()).add(1, "week").toISOString(); break;
      case "2w": snoozeUntil = dayjs().tz(getUserTimeZone()).add(2, "week").toISOString(); break;
      default: snoozeUntil = dayjs().tz(getUserTimeZone()).add(1, "day").toISOString();
    }
    snoozeMutation.mutate(snoozeUntil);
  };

  const handleCustomSnooze = () => {
    const parsed = dayjs(customDateTime).tz(getUserTimeZone());
    if (!parsed.isValid() || parsed.isBefore(dayjs().tz(getUserTimeZone()))) {
      showToast("Please pick a future date and time", "error");
      return;
    }
    snoozeMutation.mutate(parsed.toISOString());
  };

  const options = [
    { label: "1 hour", value: "1h" },
    { label: "1 day", value: "1d" },
    { label: "3 days", value: "3d" },
    { label: "1 week", value: "1w" },
    { label: "2 weeks", value: "2w" },
  ];

  // Minimum value for the datetime picker (now)
  const minDateTime = dayjs().tz(getUserTimeZone()).format("YYYY-MM-DDTHH:mm");

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="bg-card border border-border rounded-t-2xl w-full max-w-lg p-4 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground font-['DM_Sans']">Snooze watch for...</h3>
          <button type="button" onClick={onClose} className="p-1 cursor-default">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handlePreset(opt.value)}
              disabled={snoozeMutation.isPending}
              className="py-3 px-4 bg-secondary text-secondary-foreground rounded-xl text-sm font-['DM_Sans'] hover:bg-secondary/80 transition-colors cursor-default disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            disabled={snoozeMutation.isPending}
            className={`py-3 px-4 rounded-xl text-sm font-['DM_Sans'] transition-colors cursor-default disabled:opacity-50 flex items-center justify-center gap-2 ${showCustom ? "bg-foreground/10 text-foreground ring-1 ring-foreground/20" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            <Calendar className="w-4 h-4" />
            Pick date & time
          </button>
        </div>
        {showCustom && (
          <div className="mt-3 flex gap-2">
            <input
              type="datetime-local"
              value={customDateTime}
              min={minDateTime}
              onChange={e => setCustomDateTime(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-secondary text-foreground border border-border rounded-xl text-sm font-['DM_Sans'] outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <button
              type="button"
              onClick={handleCustomSnooze}
              disabled={snoozeMutation.isPending}
              className="px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold font-['DM_Sans'] hover:opacity-90 transition-opacity cursor-default disabled:opacity-50"
            >
              Snooze
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DISMISS FEEDBACK MODAL ─────────────────────────────────────

function DismissFeedbackModal({ alertId, onClose }: { alertId: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");

  const dismissMutation = useMutation({
    mutationFn: () => call<typeof dismissAlert>("dismissAlert", { id: alertId, feedback: feedback || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
      showToast("Alert dismissed");
      onClose();
    },
    onError: () => showToast("Failed to dismiss alert", "error"),
  });

  const quickReasons = [
    "Not relevant to my watch",
    "Already aware of this",
    "Too generic / low quality",
    "Wrong topic",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="bg-card border border-border rounded-t-2xl w-full max-w-lg p-4 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground font-['DM_Sans']">Why are you dismissing this?</h3>
          <button type="button" onClick={onClose} className="p-1 cursor-default">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3 font-['DM_Sans']">
          Your feedback helps reduce false alerts in the future.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReasons.map(reason => (
            <button
              key={reason}
              type="button"
              onClick={() => setFeedback(reason)}
              className={`px-3 py-1.5 rounded-full text-xs font-['DM_Sans'] transition-colors cursor-default ${
                feedback === reason
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Or type your own reason..."
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground text-sm font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-3"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => dismissMutation.mutate()}
            disabled={dismissMutation.isPending}
            className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-['DM_Sans'] cursor-default disabled:opacity-50"
          >
            {dismissMutation.isPending ? "Dismissing..." : "Dismiss"}
          </button>
          <button
            type="button"
            onClick={() => { setFeedback(""); dismissMutation.mutate(); }}
            disabled={dismissMutation.isPending}
            className="py-2.5 px-4 bg-secondary text-secondary-foreground rounded-xl text-sm font-['DM_Sans'] cursor-default disabled:opacity-50"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TIME HELPERS ───────────────────────────────────────────────

function formatTimeAgo(date: Date | string | number | null | undefined): string {
  if (date === null || date === undefined) return "Never";
  const tz = getUserTimeZone();
  const now = dayjs().tz(tz);
  let then: dayjs.Dayjs;
  if (typeof date === "number") {
    const ms = date > 1e12 ? date : date * 1000;
    then = dayjs(ms).tz(tz);
  } else {
    then = dayjs(date).tz(tz);
  }
  if (!then.isValid()) return "Never";
  const diffMins = now.diff(then, "minute");
  if (diffMins < 0) return "Just now";
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = now.diff(then, "hour");
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = now.diff(then, "day");
  return `${diffDays}d ago`;
}

function getFrequencyLabel(checkInterval?: number | null, preferredTime?: string | null, preferredDay?: string | null, urgency?: string): string {
  const interval = checkInterval || (urgency === "digest" ? 1440 : 120);
  if (interval >= 10080) {
    const day = preferredDay ? preferredDay.charAt(0).toUpperCase() + preferredDay.slice(1) : "Monday";
    const time = preferredTime || "08:00";
    const [hh, mm] = time.split(":");
    const formatted = dayjs().tz(getUserTimeZone()).hour(Number(hh)).minute(Number(mm)).format("h:mm A");
    return `Weekly · ${day} ${formatted}`;
  }
  if (interval >= 1440) {
    const time = preferredTime || "08:00";
    const [hh, mm] = time.split(":");
    const formatted = dayjs().tz(getUserTimeZone()).hour(Number(hh)).minute(Number(mm)).format("h:mm A");
    return `Daily · ${formatted}`;
  }
  if (interval >= 60) return `Every ${interval / 60}h`;
  return `Every ${interval}m`;
}

function getNextCheckTime(
  lastCheckedAt: Date | string | number | null,
  checkInterval?: number | null,
  preferredTime?: string | null,
  preferredDay?: string | null,
  urgency?: string,
  digestTime?: string | null,
): string {
  const tz = getUserTimeZone();
  const now = dayjs().tz(tz);
  const interval = checkInterval || (urgency === "digest" ? 1440 : 120);

  // Daily watches: next check at preferred time
  if (interval >= 1440 && interval < 10080) {
    const [hh, mm] = (preferredTime || digestTime || "08:00").split(":");
    const todayCheck = now.hour(Number(hh)).minute(Number(mm)).second(0);
    const nextCheck = todayCheck.isAfter(now) ? todayCheck : todayCheck.add(1, "day");
    return `at ${nextCheck.format("h:mm A")}`;
  }

  // Weekly watches: next check at preferred day + time
  if (interval >= 10080) {
    const [hh, mm] = (preferredTime || "08:00").split(":");
    const dayMap: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    const targetDay = dayMap[preferredDay || "monday"] ?? 1;
    let nextCheck = now.day(targetDay).hour(Number(hh)).minute(Number(mm)).second(0);
    if (nextCheck.isBefore(now) || nextCheck.isSame(now)) {
      nextCheck = nextCheck.add(1, "week");
    }
    return `${nextCheck.format("ddd")} at ${nextCheck.format("h:mm A")}`;
  }

  // Sub-daily watches: check every N minutes
  if (!lastCheckedAt) {
    return "soon";
  }

  const lastCheck = dayjs(lastCheckedAt).tz(tz);
  const next = lastCheck.add(interval, "minute");

  if (next.isBefore(now) || next.isSame(now)) {
    return "soon";
  }

  const diffMins = next.diff(now, "minute");
  if (diffMins < 60) return `in ${diffMins}m`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
}

function formatSnoozeUntil(date: Date | string | number | null | undefined): string | null {
  if (!date) return null;
  let d: dayjs.Dayjs;
  if (typeof date === "number") {
    const ms = date > 1e12 ? date : date * 1000;
    d = dayjs(ms).tz(getUserTimeZone());
  } else {
    d = dayjs(date).tz(getUserTimeZone());
  }
  if (!d.isValid()) return null;
  const now = dayjs().tz(getUserTimeZone());
  if (d.isBefore(now)) return null;
  const diffHours = d.diff(now, "hour");
  if (diffHours < 1) return `${d.diff(now, "minute")}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${d.diff(now, "day")}d`;
}

// ─── WATCH LIST ─────────────────────────────────────────────────

function WatchCard({ watch, onSelect, onEdit, onSnooze, unreadCount }: {
  watch: { id: number; description: string; urgency: string; status: string; sourceTypes: string; lastCheckedAt: Date | string | number | null; snoozeUntil?: Date | string | number | null; digestTime?: string | null; checkInterval?: number | null; preferredTime?: string | null; preferredDay?: string | null; createdAt: Date };
  onSelect: () => void;
  onEdit: () => void;
  onSnooze: () => void;
  unreadCount?: number;
}) {
  const queryClient = useQueryClient();
  const sources: string[] = JSON.parse(watch.sourceTypes);
  const snoozeLabel = formatSnoozeUntil(watch.snoozeUntil);

  const toggleMutation = useMutation({
    mutationFn: () => {
      if (watch.status === "paused" && watch.snoozeUntil) {
        // Clear snooze when manually resuming
        return call<typeof updateWatch>("updateWatch", {
          id: watch.id,
          snoozeUntil: "null",
        });
      }
      return call<typeof updateWatch>("updateWatch", {
        id: watch.id,
        status: watch.status === "active" ? "paused" : "active",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watches"] }),
    onError: () => showToast("Failed to update watch", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => call<typeof deleteWatch>("deleteWatch", { id: watch.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watches"] });
      showToast("Watch deleted");
    },
    onError: () => showToast("Failed to delete watch", "error"),
  });

  return (
    <div
      className={`p-4 border border-border rounded-xl bg-card transition-opacity ${
        watch.status === "paused" || watch.status === "completed" ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onSelect} className="flex-1 text-left cursor-default">
          <p className="text-sm font-medium text-foreground font-['DM_Sans'] line-clamp-2">
            {watch.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {sources.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs text-muted-foreground">
                <SourceIcon type={s} className="w-3 h-3" /> {s}
              </span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
              {getFrequencyLabel(watch.checkInterval, watch.preferredTime, watch.preferredDay, watch.urgency)}
            </span>
            {watch.status === "completed" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Completed
              </span>
            )}
            {!!unreadCount && unreadCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-['DM_Sans'] font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {watch.status === "active" && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-['DM_Sans']">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last: {formatTimeAgo(watch.lastCheckedAt)}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span>Next: {getNextCheckTime(watch.lastCheckedAt, watch.checkInterval, watch.preferredTime, watch.preferredDay, watch.urgency, watch.digestTime)}</span>
            </div>
          )}
          {watch.status === "paused" && snoozeLabel && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 dark:text-amber-400 font-['DM_Sans']">
              <Moon className="w-3 h-3" />
              Snoozed — resumes in {snoozeLabel}
            </div>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-default"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {watch.status === "active" ? (
            <button
              type="button"
              onClick={onSnooze}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-default"
              title="Snooze"
            >
              <Moon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleMutation.mutate()}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-default"
              title="Resume"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-default"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MARKDOWN RENDERER ──────────────────────────────────────────

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-base font-bold mb-2 text-foreground">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-sm font-semibold mb-2 mt-3 text-foreground">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-sm font-semibold mb-1 mt-2 text-foreground">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className="text-xs text-foreground mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-4 mb-2 text-xs text-foreground">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-4 mb-2 text-xs text-foreground">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="mb-0.5 text-xs leading-relaxed">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline cursor-pointer">
      {children}
    </a>
  ),
};

// ─── TIMELINE REPORT CARD ───────────────────────────────────────

function TimelineReportCard({ alert, onDismiss }: {
  alert: {
    id: number; title: string; snippet: string; explanation: string;
    sourceType: string; sourceUrl: string | null; sourceName: string | null;
    fullContent: string | null; confidence?: string | null; read: boolean; createdAt: Date | string | number;
  };
  onDismiss: (id: number) => void;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const readMutation = useMutation({
    mutationFn: () => call<typeof markAlertRead>("markAlertRead", { id: alert.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
    },
  });

  const hasFullContent = !!alert.fullContent;
  const timeLabel = formatTimeAgo(alert.createdAt);

  return (
    <div className="relative pl-6">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
          !alert.read ? "bg-emerald-500" : "bg-muted-foreground/30"
        }`} />
        <div className="w-px flex-1 bg-border mt-1" />
      </div>

      <div className={`ml-2 mb-4 border border-border rounded-xl bg-card ${!alert.read ? "border-l-2 border-l-emerald-500" : ""}`}>
        {/* Header */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <SourceIcon type={alert.sourceType} className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-['DM_Sans']">
                  {alert.sourceName || alert.sourceType}
                </span>
                <span className="text-xs text-muted-foreground/50 font-['DM_Sans']">&middot;</span>
                <span className="text-xs text-muted-foreground font-['DM_Sans']">{timeLabel}</span>
                <ConfidenceBadge confidence={alert.confidence} />
              </div>
              <h3 className="text-sm font-medium text-foreground font-['DM_Sans'] line-clamp-2">{alert.title}</h3>
              {!expanded && (
                <p className="text-xs text-muted-foreground mt-1 font-['DM_Sans'] line-clamp-2">{alert.snippet}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(alert.id)}
              className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-default flex-shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded full report */}
        {expanded && hasFullContent && (
          <div className="px-3 pb-3 border-t border-border pt-3">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground font-['DM_Sans']">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {alert.fullContent!}
              </ReactMarkdown>
            </div>
            {alert.sourceUrl && (
              <a
                href={alert.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary mt-2 inline-block font-['DM_Sans'] cursor-pointer underline"
              >
                View original source
              </a>
            )}
          </div>
        )}

        {/* Expand/collapse */}
        {hasFullContent && (
          <button
            type="button"
            onClick={() => {
              setExpanded(!expanded);
              if (!alert.read) readMutation.mutate();
            }}
            className="w-full py-2 border-t border-border flex items-center justify-center gap-1 text-xs text-muted-foreground font-['DM_Sans'] hover:bg-secondary/50 transition-colors cursor-default rounded-b-xl"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Read full report</>
            )}
          </button>
        )}

        {!hasFullContent && alert.sourceUrl && (
          <div className="px-3 pb-2">
            <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary inline-block font-['DM_Sans'] cursor-pointer underline">
              View source
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WATCH TIMELINE VIEW ────────────────────────────────────────

function WatchTimeline({ watchId, onBack, onEdit }: { watchId: number; onBack: () => void; onEdit: () => void }) {
  const { data: watchList } = useWatches();
  const queryClient = useQueryClient();
  const watch = watchList?.find(w => w.id === watchId);
  const [dismissingAlertId, setDismissingAlertId] = useState<number | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [showReadAlerts, setShowReadAlerts] = useState(true);

  const { data: alertList, isLoading } = useQuery({
    queryKey: ["watchAlerts", watchId],
    queryFn: () => call<typeof getAlerts>("getAlerts", { watchId, includeRead: true, limit: 50 }),
  });

  const checkNowMutation = useMutation({
    mutationFn: () => call<typeof runCheckNow>("runCheckNow", {}),
    onSuccess: () => {
      showToast("Checking watches...");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["watchAlerts", watchId] });
        queryClient.invalidateQueries({ queryKey: ["watches"] });
        queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
      }, 5000);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => call<typeof markAllAlertsRead>("markAllAlertsRead", { watchId }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["watchAlerts", watchId] });
      queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
      showToast(`Marked ${(result as { count?: number })?.count || 0} alerts as read`);
    },
    onError: () => showToast("Failed to mark all as read", "error"),
  });

  const dismissAllMutation = useMutation({
    mutationFn: () => call<typeof dismissAllAlerts>("dismissAllAlerts", { watchId }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["watchAlerts", watchId] });
      queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
      showToast(`Dismissed ${(result as { count?: number })?.count || 0} alerts`);
    },
    onError: () => showToast("Failed to dismiss all", "error"),
  });

  if (!watch) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-muted-foreground font-['DM_Sans'] cursor-default mb-4">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <p className="text-sm text-muted-foreground font-['DM_Sans']">Watch not found.</p>
      </div>
    );
  }

  const sources: string[] = JSON.parse(watch.sourceTypes);

  // Filter alerts
  let filteredAlerts = alertList || [];
  if (filterSource) {
    filteredAlerts = filteredAlerts.filter(a => a.sourceType === filterSource);
  }
  if (!showReadAlerts) {
    filteredAlerts = filteredAlerts.filter(a => !a.read);
  }

  const unreadCount = alertList?.filter(a => !a.read).length || 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {dismissingAlertId !== null && (
        <DismissFeedbackModal alertId={dismissingAlertId} onClose={() => setDismissingAlertId(null)} />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-1">
        <button type="button" onClick={onBack} className="mt-0.5 cursor-default">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground font-['DM_Sans'] leading-snug">
            {watch.description}
          </h2>
        </div>
        <button type="button" onClick={onEdit} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary cursor-default" title="Edit watch">
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Watch meta */}
      <div className="ml-9 mb-5">
        <div className="flex items-center gap-2 mt-1.5">
          {sources.map(s => (
            <span key={s} className="flex items-center gap-1 text-xs text-muted-foreground">
              <SourceIcon type={s} className="w-3 h-3" /> {s}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
            {getFrequencyLabel(watch.checkInterval, watch.preferredTime, watch.preferredDay, watch.urgency)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-['DM_Sans']">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last checked: {formatTimeAgo(watch.lastCheckedAt)}
          </span>
          <span className="text-muted-foreground/50">&middot;</span>
          <span>Next: {getNextCheckTime(watch.lastCheckedAt, watch.checkInterval, watch.preferredTime, watch.preferredDay, watch.urgency, watch.digestTime)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            type="button"
            onClick={() => checkNowMutation.mutate()}
            disabled={checkNowMutation.isPending}
            className="px-3 py-1.5 text-xs font-['DM_Sans'] bg-emerald-500 text-white rounded-lg cursor-default flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${checkNowMutation.isPending ? "animate-spin" : ""}`} />
            {checkNowMutation.isPending ? "Checking..." : "Check now"}
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="px-3 py-1.5 text-xs font-['DM_Sans'] bg-secondary text-secondary-foreground rounded-lg cursor-default flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
          )}
          {(alertList?.length || 0) > 0 && (
            <button
              type="button"
              onClick={() => dismissAllMutation.mutate()}
              disabled={dismissAllMutation.isPending}
              className="px-3 py-1.5 text-xs font-['DM_Sans'] bg-secondary text-secondary-foreground rounded-lg cursor-default flex items-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" /> Dismiss all
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {alertList && alertList.length > 0 && (
        <div className="ml-4 mb-3 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowReadAlerts(!showReadAlerts)}
            className={`px-2.5 py-1 text-xs rounded-lg font-['DM_Sans'] cursor-default flex items-center gap-1 ${
              !showReadAlerts ? "bg-emerald-500 text-white" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <Filter className="w-3 h-3" /> {showReadAlerts ? "All" : "Unread only"}
          </button>
          {sources.length > 1 && sources.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterSource(filterSource === s ? null : s)}
              className={`px-2.5 py-1 text-xs rounded-lg font-['DM_Sans'] cursor-default flex items-center gap-1 ${
                filterSource === s ? "bg-emerald-500 text-white" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <SourceIcon type={s} className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="ml-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground font-['DM_Sans'] mb-3 ml-2 uppercase tracking-wide font-medium">
              Reports ({filteredAlerts.length})
            </p>
            {filteredAlerts.map(alert => (
              <TimelineReportCard key={alert.id} alert={alert} onDismiss={(id) => setDismissingAlertId(id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-['DM_Sans']">
              {alertList && alertList.length > 0 ? "No matching reports" : "No reports yet"}
            </p>
            <p className="text-xs text-muted-foreground/60 font-['DM_Sans'] mt-1">
              {alertList && alertList.length > 0 ? "Try adjusting your filters" : "Reports will appear here after each check"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ──────────────────────────────────────────────

function SettingsView({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (profile && !initialized) {
      setLocation(profile.location || "");
      setInterests(profile.interests ? JSON.parse(profile.interests) : []);
      setInitialized(true);
    }
  }, [profile, initialized]);

  const saveMutation = useMutation({
    mutationFn: () => call<typeof saveProfile>("saveProfile", {
      location: location || undefined,
      interests: interests.length > 0 ? interests : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      call<typeof syncProfileToSidekick>("syncProfileToSidekick", {
        location: location || undefined,
        interests: interests.length > 0 ? interests : undefined,
      });
      showToast("Settings saved");
      onClose();
    },
    onError: () => showToast("Failed to save settings", "error"),
  });

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const addCustom = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onClose} className="cursor-default">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground font-['DM_Sans']">Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2 font-['DM_Sans']">Interests</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map(interest => (
              <span key={interest} className="px-3 py-1 rounded-full text-sm bg-emerald-500 text-white font-['DM_Sans'] flex items-center gap-1">
                {interest}
                <button type="button" onClick={() => toggleInterest(interest)} className="cursor-default"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
              placeholder="Add topic..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground text-sm font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button type="button" onClick={addCustom} disabled={!customInterest.trim()} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg disabled:opacity-50 cursor-default">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium font-['DM_Sans'] hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-default"
        >
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP VIEW ──────────────────────────────────────────────

type AppView =
  | { type: "home" }
  | { type: "createWatch" }
  | { type: "editWatch"; watch: { id: number; description: string; urgency: string; webUrl: string | null; targetPrice?: string | null; flightNumber?: string | null; slackChannels?: string | null; contactEmails?: string | null; digestTime?: string | null; checkInterval?: number | null; preferredTime?: string | null; preferredDay?: string | null } }
  | { type: "settings" }
  | { type: "watchTimeline"; watchId: number };

function MainApp() {
  const [view, setView] = useState<AppView>({ type: "home" });
  const { data: watchList, isLoading: watchesLoading } = useWatches();
  const { data: counts } = useAlertCounts();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [snoozeWatchId, setSnoozeWatchId] = useState<number | null>(null);

  const checkNowMutation = useMutation({
    mutationFn: () => call<typeof runCheckNow>("runCheckNow", {}),
    onSuccess: () => {
      showToast("Checking all watches...");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["watches"] });
        queryClient.invalidateQueries({ queryKey: ["alertCounts"] });
      }, 5000);
    },
  });

  if (view.type === "createWatch") {
    return <CreateWatchForm onClose={() => setView({ type: "home" })} />;
  }

  if (view.type === "editWatch") {
    return <EditWatchForm watch={view.watch} onClose={() => setView({ type: "home" })} />;
  }

  if (view.type === "settings") {
    return <SettingsView onClose={() => setView({ type: "home" })} />;
  }

  if (view.type === "watchTimeline") {
    return (
      <WatchTimeline
        watchId={view.watchId}
        onBack={() => setView({ type: "home" })}
        onEdit={() => {
          const w = watchList?.find(w => w.id === view.watchId);
          if (w) {
            setView({ type: "editWatch", watch: { id: w.id, description: w.description, urgency: w.urgency, webUrl: w.webUrl, targetPrice: w.targetPrice, flightNumber: w.flightNumber, slackChannels: w.slackChannels, contactEmails: w.contactEmails, digestTime: w.digestTime, checkInterval: w.checkInterval, preferredTime: w.preferredTime, preferredDay: w.preferredDay } });
          }
        }}
      />
    );
  }

  const perWatch = (counts as { unreadCount: number; perWatch: Record<number, number> } | undefined)?.perWatch ?? {};

  // Filter and search watches
  let filteredWatches = watchList || [];
  if (statusFilter !== "all") {
    filteredWatches = filteredWatches.filter(w => w.status === statusFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredWatches = filteredWatches.filter(w => w.description.toLowerCase().includes(q));
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {snoozeWatchId !== null && (
        <SnoozePicker watchId={snoozeWatchId} onClose={() => setSnoozeWatchId(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-6 h-6 text-emerald-500" />
          <h1 className="text-xl font-bold text-foreground font-['DM_Sans']">Radar</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => checkNowMutation.mutate()}
            disabled={checkNowMutation.isPending}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-default"
            title="Check all watches now"
          >
            <RefreshCw className={`w-5 h-5 ${checkNowMutation.isPending ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setView({ type: "settings" })}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-default"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {watchList && watchList.length > 3 && (
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search watches..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground text-sm font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-default">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Status filter pills */}
      {watchList && watchList.length > 3 && (
        <div className="flex items-center gap-2 mb-4">
          {(["all", "active", "paused", "completed"] as const).map(status => {
            const count = status === "all" ? watchList.length : watchList.filter(w => w.status === status).length;
            if (count === 0 && status !== "all") return null;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs rounded-full font-['DM_Sans'] cursor-default transition-colors ${
                  statusFilter === status
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Watch list */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setView({ type: "createWatch" })}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground font-['DM_Sans'] hover:border-emerald-500/50 hover:text-emerald-500 transition-colors cursor-default flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add a new watch
        </button>

        {watchesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        ) : filteredWatches.length > 0 ? (
          filteredWatches.map(watch => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onSelect={() => setView({ type: "watchTimeline", watchId: watch.id })}
              onEdit={() => setView({ type: "editWatch", watch: { id: watch.id, description: watch.description, urgency: watch.urgency, webUrl: watch.webUrl, targetPrice: watch.targetPrice, flightNumber: watch.flightNumber, slackChannels: watch.slackChannels, contactEmails: watch.contactEmails, digestTime: watch.digestTime, checkInterval: watch.checkInterval, preferredTime: watch.preferredTime, preferredDay: watch.preferredDay } })}
              onSnooze={() => setSnoozeWatchId(watch.id)}
              unreadCount={perWatch[watch.id]}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <EyeOff className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-['DM_Sans']">
              {watchList && watchList.length > 0
                ? "No watches match your filters"
                : "No watches yet. Create one to start monitoring."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ───────────────────────────────────────────────────

function AppContent() {
  const { data: profile, isLoading } = useProfile();
  const [setupComplete, setSetupComplete] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!profile?.id && !setupComplete) {
    return <ProfileSetup onComplete={() => setSetupComplete(true)} />;
  }

  return <MainApp />;
}

export default function App({ renderContext }: { renderContext: RenderContext }) {
  return (
    <QueryClientProvider client={agentQueryClient}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {renderContext.type === "widget" ? (
        <Widget />
      ) : (
        <div className="pt-safe pb-safe min-h-screen bg-background">
          <ToastContainer />
          <AppContent />
        </div>
      )}
    </QueryClientProvider>
  );
}
