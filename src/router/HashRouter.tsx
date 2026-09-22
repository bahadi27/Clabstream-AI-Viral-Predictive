import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export type RouteTab =
  | "overview"
  | "report"
  | "upload"
  | "samples"
  | "glossary"
  | "trends"
  | "prompt-studio";

export interface HashLocation {
  tab: RouteTab;
  reportId: string | null;
  params: Record<string, string>;
  rawHash: string;
}

interface HashRouterContextType {
  location: HashLocation;
  currentTab: RouteTab;
  reportId: string | null;
  navigate: (
    tab: RouteTab,
    options?: {
      reportId?: string | null;
      params?: Record<string, string>;
      replace?: boolean;
    }
  ) => void;
  navigateToReport: (reportId: string, replace?: boolean) => void;
  getHref: (
    tab: RouteTab,
    options?: { reportId?: string | null; params?: Record<string, string> }
  ) => string;
}

const VALID_TABS: RouteTab[] = [
  "overview",
  "report",
  "upload",
  "samples",
  "glossary",
  "trends",
  "prompt-studio",
];

export function parseHash(hashStr: string): HashLocation {
  // Strip initial '#' and trim
  const clean = hashStr.replace(/^#\/?/, "").trim();

  // Also support query params in URL search as fallback on initial load if hash is empty
  const urlParams = new URLSearchParams(window.location.search);
  const searchReport = urlParams.get("report") || urlParams.get("id");

  if (!clean) {
    if (searchReport) {
      return {
        tab: "report",
        reportId: searchReport,
        params: { report: searchReport },
        rawHash: "",
      };
    }
    return {
      tab: "overview",
      reportId: null,
      params: {},
      rawHash: "",
    };
  }

  // format examples:
  // #/report?id=sample-1
  // #/report/sample-1
  // #/trends
  // #/prompt-studio
  // #report
  const [pathPart, queryPart] = clean.split("?");
  const pathSegments = pathPart.split("/").filter(Boolean);

  const rawTab = pathSegments[0] || "overview";
  const matchedTab = VALID_TABS.includes(rawTab as RouteTab)
    ? (rawTab as RouteTab)
    : "overview";

  const params: Record<string, string> = {};
  if (queryPart) {
    const search = new URLSearchParams(queryPart);
    search.forEach((value, key) => {
      params[key] = value;
    });
  }

  // Report ID can be path segment (#/report/sample-1) or query param (#/report?id=sample-1 or ?report=sample-1)
  let reportId: string | null = null;
  if (pathSegments.length > 1) {
    reportId = decodeURIComponent(pathSegments.slice(1).join("/"));
  } else if (params.report) {
    reportId = params.report;
  } else if (params.id) {
    reportId = params.id;
  } else if (searchReport) {
    reportId = searchReport;
  }

  return {
    tab: matchedTab,
    reportId,
    params,
    rawHash: clean,
  };
}

export function buildHash(
  tab: RouteTab,
  options?: { reportId?: string | null; params?: Record<string, string> }
): string {
  const parts: string[] = [`#/${tab}`];
  if (options?.reportId && tab === "report") {
    parts.push(`/${encodeURIComponent(options.reportId)}`);
  }

  const queryParams = new URLSearchParams();
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (key !== "report" && key !== "id") {
        queryParams.set(key, value);
      }
    });
  }

  const queryString = queryParams.toString();
  return parts.join("") + (queryString ? `?${queryString}` : "");
}

const HashRouterContext = createContext<HashRouterContextType | null>(null);

export interface HashRouterProviderProps {
  children: ReactNode;
}

export const HashRouterProvider: React.FC<HashRouterProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<HashLocation>(() => {
    if (typeof window !== "undefined") {
      return parseHash(window.location.hash);
    }
    return {
      tab: "overview",
      reportId: null,
      params: {},
      rawHash: "",
    };
  });

  // Listen to browser hash changes (back/forward button, manual URL changes)
  useEffect(() => {
    const handleHashChange = () => {
      setLocation(parseHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    // Initial check: if there is no hash but there is a search param or default, normalize
    if (!window.location.hash && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const searchReport = searchParams.get("report") || searchParams.get("id");
      if (searchReport) {
        window.location.hash = `#/report/${encodeURIComponent(searchReport)}`;
      }
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigate = useCallback(
    (
      tab: RouteTab,
      options?: {
        reportId?: string | null;
        params?: Record<string, string>;
        replace?: boolean;
      }
    ) => {
      const targetHash = buildHash(tab, options);
      if (window.location.hash === targetHash) return;

      if (options?.replace) {
        const url = new URL(window.location.href);
        url.hash = targetHash;
        window.history.replaceState(null, "", url.toString());
        setLocation(parseHash(targetHash));
      } else {
        window.location.hash = targetHash;
      }
    },
    []
  );

  const navigateToReport = useCallback(
    (reportId: string, replace = false) => {
      navigate("report", { reportId, replace });
    },
    [navigate]
  );

  const getHref = useCallback(
    (
      tab: RouteTab,
      options?: { reportId?: string | null; params?: Record<string, string> }
    ) => {
      return buildHash(tab, options);
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      location,
      currentTab: location.tab,
      reportId: location.reportId,
      navigate,
      navigateToReport,
      getHref,
    }),
    [location, navigate, navigateToReport, getHref]
  );

  return (
    <HashRouterContext.Provider value={contextValue}>
      {children}
    </HashRouterContext.Provider>
  );
};

export function useHashRouter(): HashRouterContextType {
  const ctx = useContext(HashRouterContext);
  if (!ctx) {
    throw new Error("useHashRouter must be used within a HashRouterProvider");
  }
  return ctx;
}
