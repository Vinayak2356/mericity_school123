import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLocation, Link, NavLink, useNavigate, Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2, toast as toast$1 } from "sonner";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, Menu, Phone, Facebook, Youtube, Instagram, Twitter, Linkedin, Mail, MapPin, LogIn, Sun, Moon, Search as Search$1, PlayCircle, QrCode, Sparkles, Atom, Stethoscope, ArrowRight, CheckCircle, Trophy, Star, ExternalLink, Monitor, FlaskConical, BookOpen, Shield, Home, Users, Wallet, Music, Building2, BadgeCheck, Loader2, Radio, UserRound, Award, HeartHandshake, GraduationCap, Rocket, Brain, ClipboardCheck, HelpCircle, Zap, Wifi, LogOut, KeyRound, Send, Clock, Briefcase, ShieldAlert, Trash2, ChevronRight, Info, FileText, ShieldCheck, School2, Download, CreditCard, Smartphone, Receipt, Banknote, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { createClient } from "@supabase/supabase-js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { z } from "zod";
import * as TabsPrimitive from "@radix-ui/react-tabs";
const Toaster$1 = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t)
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(ToastPrimitives.Root, { ref, className: cn(toastVariants({ variant }), className), ...props });
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Title, { ref, className: cn("text-sm font-semibold", className), ...props }));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(ToastPrimitives.Description, { ref, className: cn("text-sm opacity-90", className), ...props }));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const SITE_URL$1 = "https://merrycityschool.in";
const ORG_BASE = {
  name: "Merry City School & Hostel",
  url: SITE_URL$1,
  logo: `${SITE_URL$1}/logo.png`,
  image: `${SITE_URL$1}/og-image.jpg`,
  telephone: "+91-9450536536",
  email: "info@merrycityschool.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Susuwahi",
    addressLocality: "Varanasi",
    addressRegion: "Uttar Pradesh",
    postalCode: "221011",
    addressCountry: "IN"
  },
  sameAs: [
    "https://www.facebook.com/merrycityschool",
    "https://www.instagram.com/merrycityschool",
    "https://www.youtube.com/@merrycityschool"
  ]
};
const SchoolSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization", "LocalBusiness"],
    "@id": `${SITE_URL$1}/#school`,
    ...ORG_BASE,
    description: "Merry City School & Hostel is a top CBSE-affiliated co-educational school in Susuwahi, Varanasi offering quality education from Pre-Primary to Senior Secondary with hostel facility.",
    foundingDate: "2005",
    priceRange: "₹₹",
    openingHours: "Mo-Sa 07:30-15:00",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2677",
      longitude: "82.9913"
    },
    areaServed: { "@type": "City", name: "Varanasi" }
  };
  return /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(data) }) });
};
const WebsiteSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL$1}/#website`,
    url: SITE_URL$1,
    name: ORG_BASE.name,
    publisher: { "@id": `${SITE_URL$1}/#school` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL$1}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  return /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(data) }) });
};
const BreadcrumbSchema = ({ items: items2 }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items2.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: i.url.startsWith("http") ? i.url : `${SITE_URL$1}${i.url}`
    }))
  };
  return /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(data) }) });
};
const schoolLogo = "/assets/school-logo-Dls8VSrI.png";
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "JEE/NEET", to: "/foundation" },
  { label: "Leadership", to: "/leadership" },
  { label: "Admissions", to: "/admissions" },
  { label: "Fee Payment", to: "/fee-payment" },
  { label: "Affiliation", to: "/affiliation" },
  { label: "MPD", to: "/cbse-mpd" },
  { label: "Gallery", to: "/gallery" },
  { label: "Live Classes", to: "/live-classes" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" }
];
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const handleClose = () => setOpen(false);
  return /* @__PURE__ */ jsxs("nav", { className: "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex items-center justify-between gap-4 px-4 py-3", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-3 min-w-0", onClick: handleClose, children: [
        /* @__PURE__ */ jsx("img", { src: schoolLogo, alt: "Merry City School Logo", className: "h-11 w-auto shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:block min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground leading-tight", children: "Merry City School & Hostel" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Varanasi" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center gap-2 xl:gap-3", children: navLinks.map((link) => /* @__PURE__ */ jsx(
        NavLink,
        {
          to: link.to,
          end: link.to === "/",
          className: ({ isActive }) => `text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`,
          children: link.label
        },
        link.label
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex lg:hidden items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/live-classes", className: "rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground", children: "Live Classes" }),
        /* @__PURE__ */ jsx("a", { href: "tel:9765773798", className: "rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground", children: "Call" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setOpen(!open), className: "lg:hidden text-foreground", "aria-label": "Toggle menu", children: open ? /* @__PURE__ */ jsx(X, { size: 24 }) : /* @__PURE__ */ jsx(Menu, { size: 24 }) })
    ] }),
    open && /* @__PURE__ */ jsxs("div", { className: "lg:hidden border-t border-border bg-background px-4 pb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-1 py-3", children: navLinks.map((link) => {
        const active = location.pathname === link.to;
        return /* @__PURE__ */ jsx(
          Link,
          {
            to: link.to,
            onClick: handleClose,
            className: `rounded-md px-2 py-2 text-sm font-medium ${active ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary"}`,
            children: link.label
          },
          link.label
        );
      }) }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "tel:9765773798",
          onClick: handleClose,
          className: "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
          children: [
            /* @__PURE__ */ jsx(Phone, { size: 18 }),
            " Call Now"
          ]
        }
      )
    ] })
  ] });
};
const NAMESPACE = "merrycityschool-in";
const KEY = "visitors";
const ENDPOINT = `https://abacus.jasoncameron.dev`;
const SESSION_FLAG = "mcs_visitor_counted";
const formatNumber = (n) => n.toLocaleString("en-IN");
const VisitorCounter = () => {
  const [count2, setCount] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const alreadyCounted = typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_FLAG) === "1";
        const url = alreadyCounted ? `${ENDPOINT}/get/${NAMESPACE}/${KEY}` : `${ENDPOINT}/hit/${NAMESPACE}/${KEY}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && typeof data.value === "number") {
          setCount(data.value);
          if (!alreadyCounted) {
            window.sessionStorage.setItem(SESSION_FLAG, "1");
          }
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: "inline-flex items-center gap-2 rounded-md border border-footer-gold-foreground/30 bg-background px-3 py-1 font-mono text-sm font-bold tracking-wider text-foreground shadow-sm",
      "aria-live": "polite",
      "aria-label": "Total website visitors",
      title: "Total website visitors",
      children: [
        /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500" }),
        count2 !== null ? formatNumber(count2) : error ? "—" : "…"
      ]
    }
  );
};
const footerColumns = [
  {
    title: "About",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Leadership", to: "/leadership" },
      { label: "Principal", to: "/principal" },
      { label: "Vice Principal", to: "/vice-principal" },
      { label: "Director", to: "/director" },
      { label: "Affiliation", to: "/affiliation" },
      { label: "Mandatory Disclosure", to: "/cbse-mpd" }
    ]
  },
  {
    title: "Academics",
    links: [
      { label: "Academics", to: "/academics" },
      { label: "Admissions", to: "/admissions" },
      { label: "Live Classes", to: "/live-classes" }
    ]
  },
  {
    title: "Fees",
    links: [
      { label: "Online Fee Payment", to: "/fee-payment" },
      { label: "Facilities", to: "/facilities" }
    ]
  },
  {
    title: "Quick Links",
    links: [
      { label: "Gallery", to: "/gallery" },
      { label: "Careers", to: "/careers" },
      { label: "Contact Us", to: "/contact" }
    ]
  }
];
const socialLinks = [
  {
    label: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/merrycityschool/",
    external: true
  },
  {
    label: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@merrycityschool",
    external: true
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "/contact",
    external: false
  },
  {
    label: "Twitter",
    icon: Twitter,
    href: "/contact",
    external: false
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "/contact",
    external: false
  }
];
const Footer = () => {
  return /* @__PURE__ */ jsxs(
    "footer",
    {
      id: "contact",
      className: "scroll-mt-24 border-t border-footer-gold-foreground/20 bg-footer-gold text-footer-gold-foreground",
      children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-footer-gold-foreground/20 py-4", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex flex-col gap-4 px-4 text-sm font-semibold md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsx("p", { children: "This website is managed by Merry City School & Hostel — IT Cell" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-bold", children: [
            /* @__PURE__ */ jsx("span", { children: "Follow us:" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: socialLinks.map(
              ({ label, icon: Icon, href, external }) => external ? /* @__PURE__ */ jsx(
                "a",
                {
                  href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition-opacity hover:opacity-85",
                  "aria-label": label,
                  title: label,
                  children: /* @__PURE__ */ jsx(Icon, { size: 14 })
                },
                label
              ) : /* @__PURE__ */ jsx(
                Link,
                {
                  to: href,
                  className: "flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition-opacity hover:opacity-85",
                  "aria-label": label,
                  title: label,
                  children: /* @__PURE__ */ jsx(Icon, { size: 14 })
                },
                label
              )
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "py-10", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto grid gap-8 px-4 sm:grid-cols-2 lg:grid-cols-5", children: [
          footerColumns.map((column) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-bold underline underline-offset-2", children: column.title }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2 text-sm", children: column.links.map((link) => /* @__PURE__ */ jsx(Link, { to: link.to, className: "block font-medium hover:underline", children: link.label }, link.label)) })
          ] }, column.title)),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-3 text-sm font-bold underline underline-offset-2", children: "Contact & Info" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm font-medium", children: [
              /* @__PURE__ */ jsxs("a", { href: "tel:9765773798", className: "flex items-center gap-2 hover:underline", children: [
                /* @__PURE__ */ jsx(Phone, { size: 14 }),
                " 9765773798"
              ] }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "mailto:mcsvns@gmail.com",
                  className: "flex items-center gap-2 break-all hover:underline",
                  children: [
                    /* @__PURE__ */ jsx(Mail, { size: 14 }),
                    " mcsvns@gmail.com"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 14, className: "mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsx("span", { children: "Merry City School & Hostel, Varanasi, U.P. – 221005" })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-footer-gold-foreground/20 py-4 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 font-semibold", children: [
              /* @__PURE__ */ jsx(Link, { to: "/privacy-policy", className: "hover:underline", children: "Privacy Policy" }),
              /* @__PURE__ */ jsx("span", { children: "|" }),
              /* @__PURE__ */ jsx(Link, { to: "/terms-conditions", className: "hover:underline", children: "Terms & Conditions" }),
              /* @__PURE__ */ jsx("span", { children: "|" }),
              /* @__PURE__ */ jsx(Link, { to: "/contact", className: "hover:underline", children: "Contact" }),
              /* @__PURE__ */ jsx("span", { children: "|" }),
              /* @__PURE__ */ jsx(Link, { to: "/cbse-mpd", className: "hover:underline", children: "Mandatory Disclosure" })
            ] }),
            /* @__PURE__ */ jsx("p", { children: "© 2026 Merry City School & Hostel, Varanasi. All rights reserved." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-left font-semibold md:text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex flex-wrap items-center gap-2 md:justify-end", children: [
              /* @__PURE__ */ jsx("span", { children: "Visitor No.:" }),
              /* @__PURE__ */ jsx(VisitorCounter, {})
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2", children: "Last Updated on: 12 May 2026, 21:24" })
          ] })
        ] }) })
      ]
    }
  );
};
const SUPABASE_URL = "https://placeholder.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "placeholder-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : void 0,
    persistSession: true,
    autoRefreshToken: true
  }
});
const AuthContext = createContext(void 0);
const getDisplayName = (user) => user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "School User";
const ensureProfile = async (user) => {
  const displayName = getDisplayName(user);
  const { data, error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      display_name: displayName,
      account_type: "parent"
    },
    { onConflict: "user_id", ignoreDuplicates: true }
  ).select().single();
  if (error) throw error;
  return data;
};
const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      setProfile(data);
      return;
    }
    const created = await ensureProfile(user);
    setProfile(created);
  };
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      window.setTimeout(() => {
        loadProfile(nextSession?.user ?? null).finally(() => setLoading(false));
      }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user ?? null).finally(() => setLoading(false));
    });
    return () => subscription.subscription.unsubscribe();
  }, []);
  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
      },
      refreshProfile: async () => loadProfile(session?.user ?? null)
    }),
    [session, profile, loading]
  );
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
const applyGoogleTranslate = (targetLang) => {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return false;
  select.value = targetLang === "hi" ? "hi" : "en";
  select.dispatchEvent(new Event("change"));
  return true;
};
const TopUtilityBar = () => {
  const { user, signOut } = useAuth();
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState("md");
  const [lang, setLang] = useState("en");
  useEffect(() => {
    const savedDark = localStorage.getItem("mcs-theme") === "dark";
    const savedSize = localStorage.getItem("mcs-font") || "md";
    const savedLang = localStorage.getItem("mcs-lang") || "en";
    setDark(savedDark);
    setFontSize(savedSize);
    setLang(savedLang);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("mcs-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-size-sm", "text-size-md", "text-size-lg");
    root.classList.add(`text-size-${fontSize}`);
    localStorage.setItem("mcs-font", fontSize);
  }, [fontSize]);
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("mcs-lang", lang);
    applyGoogleTranslate(lang);
  }, [lang]);
  useEffect(() => {
    if (!document.getElementById("google_translate_element")) {
      const container = document.createElement("div");
      container.id = "google_translate_element";
      container.className = "hidden";
      document.body.appendChild(container);
    }
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi",
          autoDisplay: false
        },
        "google_translate_element"
      );
      const savedLang = localStorage.getItem("mcs-lang") || "en";
      window.setTimeout(() => applyGoogleTranslate(savedLang), 500);
    };
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  const handleLanguageToggle = () => {
    setLang((current) => current === "en" ? "hi" : "en");
  };
  const btn = "inline-flex items-center justify-center h-7 px-2 text-xs font-semibold border-l border-primary-foreground/20 hover:bg-primary-foreground/10 transition-colors";
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-primary text-primary-foreground text-xs", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex items-center justify-between px-2 sm:px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-3 py-1.5 opacity-90", children: [
      /* @__PURE__ */ jsx("a", { href: "#main-content", className: "hover:underline", children: "Skip to Main Content" }),
      /* @__PURE__ */ jsx("span", { className: "opacity-60", children: "|" }),
      /* @__PURE__ */ jsx(Link, { to: "/accessibility", className: "hover:underline", children: "Screen Reader Access" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center ml-auto border-l border-primary-foreground/20", children: [
      user ? /* @__PURE__ */ jsxs("button", { className: btn, "aria-label": "Logout", onClick: signOut, children: [
        /* @__PURE__ */ jsx(LogIn, { size: 12, className: "mr-1" }),
        " Logout"
      ] }) : /* @__PURE__ */ jsxs(Link, { className: btn, "aria-label": "Login", to: "/login", children: [
        /* @__PURE__ */ jsx(LogIn, { size: 12, className: "mr-1" }),
        " Login"
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: btn,
          "aria-label": "Increase font size",
          onClick: () => setFontSize("lg"),
          "aria-pressed": fontSize === "lg",
          children: "A+"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: btn,
          "aria-label": "Default font size",
          onClick: () => setFontSize("md"),
          "aria-pressed": fontSize === "md",
          children: "A"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: btn,
          "aria-label": "Decrease font size",
          onClick: () => setFontSize("sm"),
          "aria-pressed": fontSize === "sm",
          children: "A-"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: btn,
          "aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
          onClick: () => setDark((d) => !d),
          "aria-pressed": dark,
          title: dark ? "Light mode" : "Dark mode",
          children: [
            dark ? /* @__PURE__ */ jsx(Sun, { size: 14 }) : /* @__PURE__ */ jsx(Moon, { size: 14 }),
            /* @__PURE__ */ jsx("span", { className: "ml-1 hidden sm:inline", children: dark ? "Light" : "Dark" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: btn,
          "aria-label": "Switch language",
          onClick: handleLanguageToggle,
          children: lang === "en" ? "हिंदी" : "English"
        }
      ),
      /* @__PURE__ */ jsx(Link, { className: btn, "aria-label": "Search", to: "/search", children: /* @__PURE__ */ jsx(Search$1, { size: 14 }) })
    ] })
  ] }) });
};
const SITE_URL = "https://merrycityschool.in";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const SEO = ({
  title,
  description = "Merry City School & Hostel — Best CBSE School in Susuwahi, Varanasi with hostel facility, smart classrooms, science labs and holistic education.",
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = "Best school in Varanasi, CBSE school in Susuwahi, school with hostel in Varanasi, Merry City School, top school Varanasi, residential school Varanasi",
  noindex = false
}) => {
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname}`;
  const fullTitle = `${title} | Merry City School & Hostel`;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    noindex ? /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex,nofollow" }) : /* @__PURE__ */ jsx("meta", { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Merry City School & Hostel" }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: image }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_IN" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: image }),
    /* @__PURE__ */ jsx("meta", { name: "author", content: "Merry City School & Hostel" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "IN-UP" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Varanasi" })
  ] });
};
const PageLayout = ({ title, description, image, keywords, noindex, children }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(SEO, { title, description, image, keywords, noindex }),
    /* @__PURE__ */ jsx(TopUtilityBar, {}),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "flex-1", children }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const heroBg = "/assets/hero-school-poster-Co_oc_d9.png";
const staffSlideOne = "/assets/hero-slide-staff-1-BSNrVQNE.png";
const staffSlideTwo = "/assets/hero-slide-staff-2-CBCIS-hR.png";
const stageSlide = "/assets/hero-slide-stage-DyRP4dEK.png";
const staffSlideThree = "/assets/hero-slide-staff-3-BtyZ-UdP.png";
const heroSlides = [heroBg, staffSlideOne, staffSlideTwo, stageSlide, staffSlideThree];
const HeroSection = () => {
  return /* @__PURE__ */ jsxs("section", { id: "home", className: "relative flex min-h-[440px] items-center justify-center overflow-hidden bg-background scroll-mt-24 md:min-h-[520px]", children: [
    heroSlides.map((slide, index) => /* @__PURE__ */ jsx(
      "img",
      {
        src: slide,
        alt: "Merry City School & Hostel campus and school community",
        className: "hero-slide absolute inset-0 h-full w-full object-cover",
        style: { animationDelay: `${index * 6}s` },
        width: 1920,
        height: 1080
      },
      slide
    )),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-foreground/45" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/40" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto max-w-3xl px-4 py-12 text-center md:py-16", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-3 text-2xl font-extrabold leading-tight text-primary-foreground drop-shadow-lg md:text-3xl lg:text-4xl", children: "Merry City School & Hostel" }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-bold text-primary-foreground drop-shadow md:text-lg", children: "Building Bright Futures with Strong Values" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mb-6 max-w-xl text-sm font-medium leading-relaxed text-primary-foreground/95 drop-shadow md:text-base", children: "Strong academics, safe campus life, caring teachers, hostel support, and activities that help every child grow with confidence." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/admissions", className: "btn-accent", children: [
          /* @__PURE__ */ jsx(Phone, { size: 20 }),
          " Apply for Admission"
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/live-classes", className: "btn-outline-light", children: [
          /* @__PURE__ */ jsx(PlayCircle, { size: 20 }),
          " Live Classes"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 text-sm font-medium text-primary-foreground/95 drop-shadow", children: [
        "Call us: ",
        /* @__PURE__ */ jsx("a", { href: "tel:9765773798", className: "font-bold text-primary-foreground", children: "9765773798" })
      ] })
    ] })
  ] });
};
const steps = [
  { num: 1, label: "Visit the school" },
  { num: 2, label: "Fill the admission form" },
  { num: 3, label: "Student interaction" },
  { num: 4, label: "Admission confirmation" }
];
const AdmissionsSection = () => {
  const formLink = "https://forms.gle/jC5E3ydeB7QHJQhPA";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(formLink)}`;
  return /* @__PURE__ */ jsx("section", { id: "admissions", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-4", children: "Admissions Open Now" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg mb-10", children: "Give your child the right start with quality education and strong values." }),
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground mb-8", children: "Simple Admission Process:" }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10", children: steps.map(({ num, label }) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-primary-foreground font-bold text-xl", children: num }) }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: label })
    ] }, num)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-secondary/50 to-secondary/20 rounded-2xl p-8 mb-8 border border-border", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground mb-8", children: "Fill Admission Form Online" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-xl shadow-lg", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: qrCodeUrl,
            alt: "Admission Form QR Code",
            className: "w-72 h-72 rounded-lg"
          }
        ) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-2", children: "Scan QR or click below to apply" }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: formLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "relative group inline-block",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-accent via-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" }),
                /* @__PURE__ */ jsxs("button", { className: "relative px-8 py-4 bg-background text-foreground font-bold text-lg rounded-xl shadow-2xl transform transition duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-primary/50 hover:border-accent", children: [
                  /* @__PURE__ */ jsx(QrCode, { size: 24 }),
                  /* @__PURE__ */ jsx("span", { children: "Apply Now Online" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Quick & Easy Registration" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-accent font-semibold text-lg mb-6", children: "Limited seats available. Apply now." }),
    /* @__PURE__ */ jsxs("a", { href: "tel:9765773798", className: "btn-accent", children: [
      /* @__PURE__ */ jsx(Phone, { size: 20 }),
      " Apply / Call Now"
    ] })
  ] }) });
};
const FoundationPromo = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-14", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-6xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-xl md:p-12", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-accent/20 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative grid items-center gap-8 md:grid-cols-[1fr_auto]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
          " New Launch"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-2xl font-extrabold leading-tight md:text-3xl lg:text-4xl", children: "IIT-JEE & NEET Foundation" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-sm text-primary-foreground/90 md:text-base", children: "Start early preparation with structured coaching support inside school. Expert faculty, study material, regular tests, and daily doubt sessions — all under one roof." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap gap-3 text-xs font-medium md:text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5", children: [
            /* @__PURE__ */ jsx(Atom, { size: 14 }),
            " JEE Foundation"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5", children: [
            /* @__PURE__ */ jsx(Stethoscope, { size: 14 }),
            " NEET Foundation"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/foundation",
          className: "btn-accent w-full justify-center md:w-auto",
          children: [
            "Read More ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
          ]
        }
      )
    ] })
  ] }) }) });
};
const leftItems = [
  "Recognized & Trusted School",
  "Safe & Secure Campus with CCTV",
  "Experienced & Dedicated Teachers",
  "Focus on Discipline & Strong Basics"
];
const rightItems = [
  "Your Child is Safe & Cared For Every Day",
  "Trusted by Parents for Quality Education",
  "Personal Attention for Every Student",
  "Strong Basics for a Bright Future"
];
const TrustBadges = () => {
  return /* @__PURE__ */ jsx("section", { id: "parents-corner", className: "py-12 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx("div", { className: "section-blue rounded-xl p-6 text-center mb-8", children: /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-bold", children: "Since 2005 | Safe Campus | Hostel Facility Available" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "section-blue rounded-xl p-6 space-y-4", children: leftItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "text-accent shrink-0", size: 22 }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: item })
      ] }, item)) }),
      /* @__PURE__ */ jsx("div", { className: "section-blue rounded-xl p-6 space-y-4", children: rightItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "text-accent shrink-0", size: 22 }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: item })
      ] }, item)) })
    ] })
  ] }) });
};
const WhyParentsTrust = () => {
  return /* @__PURE__ */ jsx("section", { id: "about", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: "Why Parents Trust Merry City School?" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg mb-4 leading-relaxed", children: "Merry City School & Hostel is not just a school, it is a place where children grow with confidence, discipline, and strong values. Since 2005, we have been helping students build a strong academic base while also developing character and life skills." }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg mb-8 leading-relaxed", children: "We focus on simple teaching so that every child understands clearly, not just memorizes. Our goal is to prepare students for both exams and real life." }),
    /* @__PURE__ */ jsxs("a", { href: "tel:9765773798", className: "btn-accent", children: [
      /* @__PURE__ */ jsx(Phone, { size: 20 }),
      " Visit Our School Today"
    ] })
  ] }) });
};
const stats = [
  { value: "100%", label: "CBSE Result", sub: "(Last Academic Year)" },
  { value: "96%", label: "Highest Score", sub: "in Class 12" },
  { value: "🏆", label: "CBSE Cluster Sports", sub: "Award Winner" },
  { value: "✅", label: "Students working", sub: "in top companies" }
];
const ResultsSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "affiliation", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-10 text-center", children: "Results That Build Confidence" }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: stats.map(({ value, label, sub }) => /* @__PURE__ */ jsxs("div", { className: "section-blue rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold mb-2", children: value }),
      /* @__PURE__ */ jsx("div", { className: "font-semibold text-lg", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-sm opacity-80", children: sub })
    ] }, label)) }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-primary font-semibold text-lg", children: "Consistent improvement in student performance every year" }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground mt-2", children: "We don't just promise, we deliver real results." })
  ] }) });
};
const imgAnjali = "data:image/jpeg;base64,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";
const imgSaumya = "data:image/jpeg;base64,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";
const imgParakh = "data:image/jpeg;base64,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";
const imgPriya = "data:image/jpeg;base64,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";
const imgJay = "data:image/jpeg;base64,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";
const imgNaumit = "data:image/jpeg;base64,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";
const imgUtkarsh = "data:image/jpeg;base64,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";
const imgMuskan = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABoAEsDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAcIBQYDBAkC/8QAMxAAAQMDAgQEBQMEAwAAAAAAAQIDBAAFEQYSBwghMRNBUWEUInGBoRUykRcjM7E0QmL/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAwQFBgIB/8QAIBEAAwEAAgICAwAAAAAAAAAAAAECAwQRBRJBUTEyYf/aAAwDAQACEQMRAD8AuXSlKAUpSgFKUoBSlKAUpSgFKUoBULcf+Pto4byV2K3wlXXUJaC/C3bWWN37fEV3zjrtA7EeoqQuKuq0aJ4fXjU5ZS+uDHKmmlHAccJ2oB9txGfaqD2aPN1ZqCXqC+PmXPnPqdecWMblE98DoAOwA9Ki11Wa7ZNhjW1dI2S48x/GF24JuX6hFjMbvljNRR4X0Oep7etSrwk5sI8+W3bdf29mCpWAJ8QHZn/02ckD3BP06VGMrSbJirSrHQfKD2qKtb2dUBW8JKeuMp7VXx5s6Pplzfx1ZT7HqFAlxZ8JmbCkNSIz6Atp1tQUlaT2IIrnqpHIVxBlPO3DQFxklxtLZlW8KUSUYIDiBny7K/mrb1dM0UpSgFKUoCJubiI9L4F3hDBUCh1hZAHceIAf95+1VbsiJttU0zDtSnm28BTinQjJAGcA9TVy+NsJVw4WX2MlrxVFgKCfotJz+M1Vx/S8KQ4JbqnlOIcDiQlRx0HY48vPFZ3OtT0mbHis3XbR2n7pHXa1qXGeS4BgIIzk+mRUbah+KlIWZFncDGcFQWFYHrgVuVwlOx4qUgAIL/n7Vj7hpxLjhmsPvMlQSVIBO3AB/wB561mZ1MV2be2bqOjCcrcZ+FzI6fYZSoYcd3Y6fJ4K8k/yK9DapjyvWZ57mDRcmkZYjQXQ6QnsSCB+audW/jXtCZyW8emjQpSlSkIpSlAcU2O3KhvRXRlt5tSFfQjFVf1TGXpy6zbfKSltLSyAT22+RFWlqFeZWBCaXa7msp8V8qjuI2/vAG4H7dR96o87JXn7fRpeL3eevr8Mgm7zIr0TwPGbU2HCogJB/Nc8i5syLdmPggJ25Fd6bb4JgFxDiNpGSkY6fisVpV6KdYWppbZ+CRMb3lAwM7vl/OKxs1N0kdJvfpHaLIcvXD9GkdOquktJ/VbokOPZx/bR3Sjp9vXr2qUK+GFNrZQpkpLZSCjb2x5Yr7rpYlRKlHGXbunTFKUr0eBSlaZxvZvD3Cy/GwvOtTmoxdT4Wdy0p6rSMeZSCKA7Op+I2itONLXddRQW1I6FttzxF59Nqckfeoe4q3n+oehGdWaebedZt8vxm28fMtpBKV9B7FRqnM6VLlzFuSH3HVlWVFRJq1/JxOMvQVxtr2FiJOUQFdRtcSFAYPlnPT3qHkLuOizxa9NEzWGnYq7es7W1BaQUk486w8S1TLzIaslpCm5MhwKU8gf4EAglwnywOg9Tit/4l6Fj2zULcm2zGY0SavBjuOhHhKJ6kZ/6k/wRW86c0zbtL2Q/C7X5D6Qp2QMEudOmD6egrGx4tK19G/rzJeX9NVt/MHb9Eayk6U1ay+7BShDrMtnClNbt2QpPp0ByPWpv0brzSGr2A5p2/wAGeojJaQ4A6Pqg/N+K85+MdzTeOI96moOW0PeAgg9w30z9M5rYOV/T1z1FxnsDFudfaahyEzZbraiNrTRyQT6KO1PvW+v1OZf5PRylKUPIoQCCCMg0pQFIeavg9I0jfJGqrHGKtPz3itxLaf8AiOKySk+iSclJ8s4+va5Pr58HfrtZSMqmsIdaB7BSCQfr0UD9qubPhxZ8J6FOjtSYz6Ch1pxIUlaT3BB71CyOXy2WHiBB1Zou4qt7bLpU9bnwVtlCgQpKFd0+wOcYrxS7XRJnST7ZFfNNYrjB1Jb9QKAmxJrJjPZbJKHEAkAEHIBGe3mK5eFeoZFs4FXO8XCW+YTfjrhJecK1NJAICQT1IK+wPbNSrx50TrTUtlhQNNwmHlIWpbqnJKWyDjAwSevQn+ajWw8vvEudpJ7Sd4ulrtNqdmJkEpdL7iEjqUAAAdVYPeopksXon8lVocW4Xe5NQIUZ6bcJLm1DTSdy3XCewHmSTV/+V3hKnhjo1a7iG3NQ3Pa7OcT2bA/a0PZPmfM1leDnBfR/DRov21hc67OJCXbjKALuPRA7IT7CpJqwVGKUpQ+ClKUApSlAKUpQClKUApSlAf/Z";
const toppers = [
  { rank: 1, name: "Anjali Patel", percentage: "95.6%", img: imgAnjali },
  { rank: 2, name: "RG Saumya", percentage: "93.2%", img: imgSaumya },
  { rank: 3, name: "Parakh Yaduvansh", percentage: "92.4%", img: imgParakh },
  { rank: 4, name: "Priya Sonkar", percentage: "91.0%", img: imgPriya },
  { rank: 5, name: "Jay Singh", percentage: "90.0%", img: imgJay },
  { rank: 6, name: "Naumit Singh", percentage: "88.8%", img: imgNaumit },
  { rank: 7, name: "Utkarsh Singh", percentage: "83.6%", img: imgUtkarsh },
  { rank: 8, name: "Muskan Tripathi", percentage: "83.4%", img: imgMuskan }
];
const getRankBorder = (rank) => {
  if (rank === 1) return "ring-4 ring-yellow-400 shadow-yellow-400/30";
  if (rank === 2) return "ring-4 ring-gray-400 shadow-gray-400/30";
  if (rank === 3) return "ring-4 ring-amber-600 shadow-amber-600/30";
  return "ring-2 ring-primary/30";
};
const getRankBadge = (rank) => {
  if (rank === 1) return "bg-yellow-500 text-white";
  if (rank === 2) return "bg-gray-400 text-white";
  if (rank === 3) return "bg-amber-600 text-white";
  return "bg-primary text-primary-foreground";
};
const ToppersSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 section-alt", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold text-sm mb-4", children: [
        /* @__PURE__ */ jsx(Trophy, { size: 18 }),
        " CBSE Class 10 Board Exam Results 2025-26"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: "Congratulations to Our Toppers 🎉" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Proudly Celebrating Academic Excellence" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-8 mb-12", children: [toppers[1], toppers[0], toppers[2]].map((t) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex flex-col items-center text-center w-full sm:w-52 ${t.rank === 1 ? "order-first sm:order-none sm:-mt-8" : ""}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative mb-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: t.img,
                alt: t.name,
                className: `w-24 h-24 ${t.rank === 1 ? "sm:w-32 sm:h-32" : ""} rounded-full object-cover bg-muted shadow-lg ${getRankBorder(t.rank)}`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow ${getRankBadge(t.rank)}`, children: t.rank === 1 ? /* @__PURE__ */ jsx(Star, { size: 16, fill: "white" }) : t.rank })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-lg mt-2", children: t.name }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-extrabold text-primary", children: t.percentage }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground mt-1", children: t.rank === 1 ? "🥇 School Topper" : t.rank === 2 ? "🥈 2nd Rank" : "🥉 3rd Rank" })
        ]
      },
      t.rank
    )) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10", children: toppers.slice(3).map((t) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-background rounded-xl p-5 text-center shadow-sm border border-border hover:shadow-md transition-shadow",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-fit mb-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: t.img,
                alt: t.name,
                className: `w-16 h-16 rounded-full object-cover bg-muted shadow ${getRankBorder(t.rank)}`
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow ${getRankBadge(t.rank)}`, children: t.rank })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: t.name }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-primary", children: t.percentage })
        ]
      },
      t.rank
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-accent text-accent-foreground rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold text-lg mb-1", children: "🌟 Special Scholarship Offer: 50% OFF" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: "On admission for all students with 90% & above (as validated by the CBSE Topper list)!" }),
      /* @__PURE__ */ jsx("p", { className: "font-semibold mt-2", children: "Admission Open for 2026-27 Session!" })
    ] })
  ] }) });
};
const reasons = [
  "Safe and secure environment",
  "Experienced teachers with personal attention",
  "Strong discipline and values",
  "Focus on overall development",
  "Supportive hostel life"
];
const WhyChooseSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 section-alt", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-3xl text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-8", children: "Why Parents Choose Merry City School" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8 text-left max-w-md mx-auto", children: reasons.map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "check-icon shrink-0", size: 22 }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: r })
    ] }, r)) }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Your child's future is safe with us." })
  ] }) });
};
const MessageSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "blog", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-3xl text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-6", children: "Message for Parents" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed mb-4", children: "At Merry City School & Hostel, we focus on building not just academic success but also strong values and character. Our goal is to help every child grow into a confident and responsible individual." }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed", children: "With experienced teachers, modern facilities, and a caring environment, we ensure your child gets the right guidance at every step." })
  ] }) });
};
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Index = () => {
  const [openModal, setOpenModal] = useState(true);
  const formLink = "https://forms.gle/jC5E3ydeB7QHJQhPA";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(formLink)}`;
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "Home",
      description: "Merry City School & Hostel, Varanasi — CBSE-affiliated school building bright futures with strong values since 2010.",
      children: [
        /* @__PURE__ */ jsx(HeroSection, {}),
        /* @__PURE__ */ jsx(AdmissionsSection, {}),
        /* @__PURE__ */ jsx(Dialog, { open: openModal, onOpenChange: setOpenModal, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "Admissions Open Now!" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Scan QR or click button to apply" }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg shadow-lg", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: qrCodeUrl,
              alt: "Admission Form QR Code",
              className: "w-56 h-56"
            }
          ) }) }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: formLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "relative group inline-block w-full mb-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-accent via-primary to-accent rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" }),
                /* @__PURE__ */ jsxs("button", { className: "relative w-full px-6 py-3 bg-background text-foreground font-bold rounded-lg shadow-xl transform transition duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-primary/50 hover:border-accent", children: [
                  /* @__PURE__ */ jsx(ExternalLink, { size: 20 }),
                  /* @__PURE__ */ jsx("span", { children: "Apply Now" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Limited seats available - Apply today!" })
        ] }) }) }),
        /* @__PURE__ */ jsx(FoundationPromo, {}),
        /* @__PURE__ */ jsx(TrustBadges, {}),
        /* @__PURE__ */ jsx(WhyParentsTrust, {}),
        /* @__PURE__ */ jsx(ResultsSection, {}),
        /* @__PURE__ */ jsx(ToppersSection, {}),
        /* @__PURE__ */ jsx(WhyChooseSection, {}),
        /* @__PURE__ */ jsx(MessageSection, {})
      ]
    }
  );
};
const About = () => /* @__PURE__ */ jsxs(
  PageLayout,
  {
    title: "About Us",
    description: "Learn about Merry City School & Hostel — our mission, values, and approach to nurturing students since 2010.",
    children: [
      /* @__PURE__ */ jsx(WhyParentsTrust, {}),
      /* @__PURE__ */ jsx(WhyChooseSection, {}),
      /* @__PURE__ */ jsx(MessageSection, {})
    ]
  }
);
const items = [
  "Concept-based learning",
  "Regular tests and progress tracking",
  "Personal attention for every child",
  "Focus on basics and discipline",
  "Doubt clearing sessions for better understanding",
  "Activity-based learning to make studies interesting"
];
const AcademicsSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "academics", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-8 text-center", children: "Strong Academics, Clear Understanding" }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4 mb-6", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-3", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "check-icon shrink-0 mt-0.5", size: 22 }),
      /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: item })
    ] }, item)) }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground text-lg", children: "We make sure your child understands every subject with confidence." })
  ] }) });
};
const Academics = () => /* @__PURE__ */ jsxs(
  PageLayout,
  {
    title: "Academics",
    description: "Strong academics, clear understanding — concept-based learning, regular tests, and personal attention at Merry City School.",
    children: [
      /* @__PURE__ */ jsx(AcademicsSection, {}),
      /* @__PURE__ */ jsx(ResultsSection, {}),
      /* @__PURE__ */ jsx(ToppersSection, {})
    ]
  }
);
const Admissions = () => {
  const [openModal, setOpenModal] = useState(false);
  const formLink = "https://forms.gle/jC5E3ydeB7QHJQhPA";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(formLink)}`;
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "Admissions",
      description: "Admissions open at Merry City School & Hostel, Varanasi. Simple 4-step process for Nursery to Class XII.",
      children: [
        /* @__PURE__ */ jsx(AdmissionsSection, {}),
        /* @__PURE__ */ jsx("section", { id: "enquiry", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-3xl text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: "Apply for Admission" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center mb-8", children: "Fill the form online using QR code or direct link" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setOpenModal(true),
              className: "btn-accent mb-8",
              children: "Open Admission Form"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(Dialog, { open: openModal, onOpenChange: setOpenModal, children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-2", children: "Admissions Open Now!" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Scan QR or click button to apply" }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-lg shadow-lg", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: qrCodeUrl,
              alt: "Admission Form QR Code",
              className: "w-56 h-56"
            }
          ) }) }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: formLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "relative group inline-block w-full mb-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-accent via-primary to-accent rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" }),
                /* @__PURE__ */ jsxs("button", { className: "relative w-full px-6 py-3 bg-background text-foreground font-bold rounded-lg shadow-xl transform transition duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-primary/50 hover:border-accent", children: [
                  /* @__PURE__ */ jsx(ExternalLink, { size: 20 }),
                  /* @__PURE__ */ jsx("span", { children: "Apply Now" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Limited seats available - Apply today!" })
        ] }) }) }),
        /* @__PURE__ */ jsx(TrustBadges, {})
      ]
    }
  );
};
const facilities = [
  { icon: Monitor, label: "Smart classrooms" },
  { icon: FlaskConical, label: "Science & computer labs" },
  { icon: BookOpen, label: "Library for reading and learning" },
  { icon: Trophy, label: "Playground & sports activities" },
  { icon: Shield, label: "CCTV security for safety" },
  { icon: Home, label: "Hostel facility with care and discipline" }
];
const FacilitiesSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "facilities", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-5xl", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-10 text-center", children: "Safe & Modern Facilities for Your Child" }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: facilities.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("div", { className: "bg-background rounded-xl p-6 shadow-sm border flex items-center gap-4 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: "text-primary", size: 24 }) }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: label })
    ] }, label)) }),
    /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground text-lg mt-8", children: "Everything your child needs for better learning and growth." })
  ] }) });
};
const overview = [
  { label: "Established", value: "2010" },
  { label: "Type", value: "Co-Ed, Private" },
  { label: "Board", value: "CBSE (Sr. Sec.)" },
  { label: "Campus Area", value: "6,070 sq. m" }
];
const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI",
  "Class XII"
];
const admissionFees = [
  { range: "Class NUR to UKG", fee: "₹8,000/-" },
  { range: "Class I to V", fee: "₹8,000/-" },
  { range: "Class VI to VIII", fee: "₹8,000/-" },
  { range: "Class IX", fee: "₹10,000/-" },
  { range: "Class XI", fee: "₹12,000/-" }
];
const monthlyFees = [
  { range: "Play Group to UKG", fee: "₹1,900/-" },
  { range: "Class I to III", fee: "₹1,900/-" },
  { range: "Class IV & V", fee: "₹2,300/-" },
  { range: "Class VI to VIII", fee: "₹2,300/-" },
  { range: "Class IX", fee: "₹2,000/-" },
  { range: "Class X", fee: "₹1,600/-" },
  { range: "Class XI", fee: "₹2,000/-" },
  { range: "Class XII", fee: "₹2,000/-" }
];
const additionalCharges = [
  { label: "Annual Charge (Class Nur to XII)", fee: "₹4,800/-" },
  { label: "Development / Maintenance Fees (Class PG to XII)", fee: "₹1,900/-" },
  { label: "Annual Function Fees", fee: "₹900/-" },
  { label: "Exam Fees (Class NUR to VIII)", fee: "₹500 × 4 = ₹2,000/-" },
  { label: "Admission Form Fees", fee: "₹500/-" }
];
const feeNotes = [
  "School fees should be paid before the 12th of every month.",
  "Fine on late payment: 1 month ₹150/-, 2 months ₹350/-, 3 months ₹1,000/-",
  "All fees (Tuition and Transport) will be charged for the full session (12 months).",
  "Fees once paid will not be refunded or adjusted in any case.",
  "Fees can be paid in advance on quarterly basis."
];
const facilityGroups = [
  {
    icon: BookOpen,
    title: "Library",
    items: ["1,650+ Books", "400+ Reference Books", "Quiet reading area"]
  },
  {
    icon: FlaskConical,
    title: "Laboratories",
    items: ["Physics, Chemistry, Biology", "Computer & Maths Lab", "Composite Science & Home Science"]
  },
  {
    icon: Music,
    title: "Activity Rooms",
    items: ["Art & Craft Room", "Music & Dance Room", "Yoga Room"]
  },
  {
    icon: Building2,
    title: "Other Rooms",
    items: ["Smart Classrooms", "Audio-Visual Room", "Conference Room", "Medical Aid Room"]
  },
  {
    icon: Trophy,
    title: "Sports",
    items: ["Indoor: Table Tennis, Volleyball, Karate", "Outdoor: Badminton & open ground"]
  },
  {
    icon: Home,
    title: "Hostel",
    items: ["Separate Boys Hostel", "Separate Girls Hostel", "Safe & supervised stay"]
  }
];
const CampusDetailsSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "campus-details", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground mb-4", children: [
        /* @__PURE__ */ jsx(Users, { size: 16 }),
        " Campus & Fees"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: "Campus Details, Classes & Fee Structure" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg max-w-2xl mx-auto", children: "A complete look at what Merry City School & Hostel offers — from classes and fees to facilities and hostel." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-10", children: overview.map((o) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-4 text-center shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1", children: o.label }),
      /* @__PURE__ */ jsx("p", { className: "text-foreground font-bold text-lg", children: o.value })
    ] }, o.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-6 shadow-sm mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "text-primary", size: 20 }),
        " Classes Offered"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: classes.map((c) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground",
          children: c
        },
        c
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-4", children: "From Nursery to Class XII (Senior Secondary) under CBSE curriculum." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-6 shadow-sm mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 mb-1", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Wallet, { className: "text-primary", size: 20 }),
          " Fee Structure"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground", children: "SESSION 2026 – 2027" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Official fee structure for the academic session 2026 – 2027." }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-secondary px-4 py-2", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary-foreground uppercase tracking-wide", children: "Admission Fees (One-time)" }) }),
          /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: admissionFees.map((f, i) => /* @__PURE__ */ jsxs("tr", { className: i % 2 ? "bg-secondary/30" : "", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-foreground font-medium", children: f.range }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-right text-foreground font-semibold whitespace-nowrap", children: f.fee })
          ] }, f.range)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-secondary px-4 py-2", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary-foreground uppercase tracking-wide", children: "Monthly Tuition Fees" }) }),
          /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: monthlyFees.map((f, i) => /* @__PURE__ */ jsxs("tr", { className: i % 2 ? "bg-secondary/30" : "", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-foreground font-medium", children: f.range }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-right text-foreground font-semibold whitespace-nowrap", children: f.fee })
          ] }, f.range)) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 overflow-hidden rounded-lg border border-border", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-secondary px-4 py-2", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary-foreground uppercase tracking-wide", children: "Additional Charges (Annual / One-time)" }) }),
        /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: additionalCharges.map((c, i) => /* @__PURE__ */ jsxs("tr", { className: i % 2 ? "bg-secondary/30" : "", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-foreground font-medium", children: c.label }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-right text-foreground font-semibold whitespace-nowrap", children: c.fee })
        ] }, c.label)) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-lg border border-border bg-secondary/30 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-foreground mb-2", children: "Important Notes:" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm text-muted-foreground", children: feeNotes.map((n) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }),
          /* @__PURE__ */ jsx("span", { children: n })
        ] }, n)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: facilityGroups.map(({ icon: Icon, title, items: items2 }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(Icon, { className: "text-primary", size: 20 }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground", children: title })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1.5 text-sm text-muted-foreground", children: items2.map((it) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }),
        /* @__PURE__ */ jsx("span", { children: it })
      ] }, it)) })
    ] }, title)) })
  ] }) });
};
const Facilities = () => /* @__PURE__ */ jsxs(
  PageLayout,
  {
    title: "Facilities & Campus",
    description: "Explore Merry City School's campus — labs, library, smart classrooms, sports, hostel, and more.",
    children: [
      /* @__PURE__ */ jsx(FacilitiesSection, {}),
      /* @__PURE__ */ jsx(CampusDetailsSection, {})
    ]
  }
);
const affiliationImg = "/assets/cbse-affiliation-Drwuyytp.png";
const details = [
  { label: "Name of Institution", value: "MERRY CITY SCHOOL & HOSTEL" },
  { label: "Affiliation Number", value: "2132932" },
  { label: "Board", value: "Central Board of Secondary Education (CBSE)" },
  { label: "State", value: "Uttar Pradesh" },
  { label: "District", value: "Varanasi" },
  { label: "Postal Address", value: "BHU Bypass Road, Narayanpur, Dafi" },
  { label: "Pin Code", value: "221011" },
  { label: "Website", value: "www.merrycityschool.in" },
  { label: "Year of Foundation", value: "2010" },
  { label: "Date of First Opening", value: "02 Apr 2010" },
  { label: "Principal / Head", value: "Ashutosh Kumar Rai (B.Tech, B.Ed)" },
  { label: "Status of School", value: "Senior Secondary Level" },
  { label: "School Type", value: "Independent" },
  { label: "Affiliation Period", value: "01/04/2027 to 31/03/2032" },
  { label: "Managing Trust", value: "Sri Shiv Shankar Shiksha Samiti" },
  { label: "Teaching Experience", value: "15 Years" }
];
const AffiliationSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "affiliation", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground mb-4", children: [
        /* @__PURE__ */ jsx(BadgeCheck, { size: 16 }),
        " CBSE Affiliated"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: "School Affiliation Details" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg max-w-2xl mx-auto", children: "Merry City School & Hostel is officially affiliated with the Central Board of Secondary Education (CBSE), New Delhi." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border", children: details.map((d, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `p-4 ${i % 2 === 0 ? "sm:border-r" : ""} border-b border-border`,
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1", children: d.label }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium break-words", children: d.value })
            ]
          },
          d.label
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-secondary/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Source: CBSE SARAS 7.0 (School Affiliation Re-engineered Automation System)" }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://saras.cbse.gov.in/",
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline",
              children: [
                "Verify on CBSE ",
                /* @__PURE__ */ jsx(ExternalLink, { size: 14 })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-background shadow-sm", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: affiliationImg,
          alt: "Official CBSE affiliation details for Merry City School & Hostel",
          className: "w-full h-auto object-contain",
          loading: "lazy"
        }
      ) })
    ] })
  ] }) });
};
const Affiliation = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "CBSE Affiliation",
    description: "Merry City School & Hostel — official CBSE affiliation details (Affiliation No. 2132932).",
    children: /* @__PURE__ */ jsx(AffiliationSection, {})
  }
);
const imgEntrance = "/assets/gallery-school-entrance-BE0HBNFF.png";
const imgHoliStudents = "/assets/gallery-holi-students-B7pLKQcS.png";
const imgHoliGroup = "/assets/gallery-holi-group-DU6IXMCh.png";
const imgCurriculum = "/assets/gallery-curriculum-93YCJKh4.png";
const imgAwardBoy = "/assets/gallery-award-boy-CccTVaL5.png";
const imgAwardGirl = "/assets/gallery-award-girl-CG8ULJu3.png";
const imgAwardStage = "/assets/gallery-award-stage-BqGVwKu2.png";
const imgSportsBanner = "/assets/gallery-sports-banner-Dh7Zce8x.png";
const imgKabaddiGirls = "/assets/gallery-kabaddi-girls-BCexLXVO.png";
const imgKabaddiBoys = "/assets/gallery-kabaddi-boys-DgDa5jcF.png";
const imgSportsGround = "/assets/gallery-sports-ground-BLiU-R0F.png";
const imgCulturalGroup = "/assets/gallery-cultural-group-Dx62d4Ik.png";
const imgSportsAwards = "/assets/gallery-sports-awards-DpY2_RPz.png";
const images = [
  { src: imgEntrance, label: "School Entrance" },
  { src: imgHoliStudents, label: "Holi Celebration with Students" },
  { src: imgHoliGroup, label: "Holi Group Celebration" },
  { src: imgCurriculum, label: "World-Class Curriculum" },
  { src: imgAwardBoy, label: "Student Award Ceremony" },
  { src: imgAwardGirl, label: "Achievement Recognition" },
  { src: imgAwardStage, label: "Prize Distribution Ceremony" },
  { src: imgSportsBanner, label: "Annual Sports Competition" },
  { src: imgKabaddiGirls, label: "Girls Kabaddi Match" },
  { src: imgKabaddiBoys, label: "Boys Kabaddi Match" },
  { src: imgSportsGround, label: "Sports Ground Activity" },
  { src: imgCulturalGroup, label: "Cultural Program Group" },
  { src: imgSportsAwards, label: "Sports Achievement Celebration" }
];
const GallerySection = () => {
  return /* @__PURE__ */ jsx("section", { id: "gallery", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-4 text-center", children: "Life at Merry City School" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-center mb-10", children: "Real moments of learning, activities, and student life." }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: images.map(({ src, label }) => /* @__PURE__ */ jsxs("div", { className: "group rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ jsx("div", { className: "aspect-[4/3] overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt: label,
          loading: "lazy",
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "bg-background p-4", children: /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm", children: label }) })
    ] }, label)) })
  ] }) });
};
const Gallery = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "Gallery",
    description: "Photos from Merry City School & Hostel — campus life, events, sports, and cultural activities.",
    children: /* @__PURE__ */ jsx(GallerySection, {})
  }
);
const CHANNEL_HANDLE = "merrycityschool";
const CHANNEL_ID = "UC37Kg4AOJ_Y4TG1yEdF2P7A";
const CHANNEL_URL = `https://www.youtube.com/@${CHANNEL_HANDLE}`;
const CHANNEL_LIVE_URL = `${CHANNEL_URL}/live`;
const fallbackLiveStream = {
  videoId: "channel-live",
  title: "YouTube Live Class",
  thumbnail: `https://yt3.googleusercontent.com/ytc/AIdro_m4=s160-c-k-c0x00ffffff-no-rj`,
  embedUrl: `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`,
  watchUrl: CHANNEL_LIVE_URL
};
const features$1 = [
  "Auto-detects every live class on our YouTube channel",
  "If multiple classes are live, you can pick which one to join",
  "Works on mobile, tablet, and desktop — no app needed"
];
const LiveClassesSection = () => {
  const [loading, setLoading] = useState(true);
  const [streams, setStreams] = useState([]);
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("youtube-live");
        if (error) throw error;
        if (cancelled) return;
        const list = data?.streams ?? [];
        setStreams(list);
        setActiveId((cur) => cur && list.some((s) => s.videoId === cur) ? cur : list[0]?.videoId ?? null);
      } catch {
        if (!cancelled) {
          setStreams([fallbackLiveStream]);
          setActiveId("channel-live");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    check();
    const interval = setInterval(check, 6e4);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  const isLive = streams.length > 0;
  const activeStream = streams.find((s) => s.videoId === activeId) ?? streams[0];
  return /* @__PURE__ */ jsx("section", { id: "live-classes", className: "py-16 section-alt scroll-mt-24", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1fr,1.05fr] lg:items-start", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground mb-4", children: [
        /* @__PURE__ */ jsx(PlayCircle, { size: 16 }),
        " Live Classes"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        loading && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin" }),
          /* @__PURE__ */ jsx("span", { children: "Checking live status…" })
        ] }, "status-loading"),
        !loading && isLive && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md animate-pulse", children: [
          /* @__PURE__ */ jsx(Radio, { size: 12 }),
          /* @__PURE__ */ jsx("span", { children: streams.length > 1 ? `${streams.length} CLASSES LIVE NOW` : "LIVE NOW" })
        ] }, "status-live"),
        !loading && !isLive && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-muted-foreground/60" }),
          /* @__PURE__ */ jsx("span", { children: "Offline — no live class right now" })
        ] }, "status-offline")
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-foreground mb-4", children: isLive ? "We are LIVE on YouTube!" : "Learn from home with our Live Classes" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg leading-relaxed mb-6", children: isLive ? streams.length > 1 ? `${streams.length} live classes are streaming right now. Choose one below to start watching.` : `Now streaming: "${activeStream?.title}". Tap the player to join the live class.` : "Whenever the school starts a live broadcast on YouTube, this page automatically detects it and lets you join instantly." }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-8", children: features$1.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" }),
        /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium", children: f })
      ] }, f)) }),
      streams.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Choose a live class:" }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-2", children: streams.map((s) => {
          const active = s.videoId === activeId;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveId(s.videoId),
              className: `flex items-center gap-3 rounded-lg border p-2 text-left transition ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-background hover:bg-secondary"}`,
              children: [
                /* @__PURE__ */ jsx("img", { src: s.thumbnail, alt: "", className: "h-12 w-20 rounded object-cover" }),
                /* @__PURE__ */ jsx("span", { className: "flex-1 text-sm font-medium text-foreground line-clamp-2", children: s.title }),
                active && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white", children: [
                  /* @__PURE__ */ jsx(Radio, { size: 9 }),
                  " LIVE"
                ] })
              ]
            },
            s.videoId
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: activeStream?.watchUrl ?? CHANNEL_URL,
            target: "_blank",
            rel: "noreferrer",
            className: "btn-accent",
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { size: 18 }),
              isLive ? "Open on YouTube" : "Visit Our YouTube Channel"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "tel:9765773798",
            className: "btn-outline-light !border-primary !text-primary hover:!bg-secondary",
            children: [
              /* @__PURE__ */ jsx(Phone, { size: 18 }),
              " Ask for Live Class Access"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-lg border border-border bg-background shadow-sm relative", children: [
      isLive && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow animate-pulse", children: [
        /* @__PURE__ */ jsx(Radio, { size: 11 }),
        " LIVE"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "aspect-video w-full bg-secondary flex items-center justify-center", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary", size: 32 }) : activeStream ? /* @__PURE__ */ jsx(
        "iframe",
        {
          title: activeStream.title,
          src: activeStream.embedUrl,
          className: "w-full h-full",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true
        },
        activeStream.videoId
      ) : /* @__PURE__ */ jsxs("div", { className: "max-w-md p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background border border-border", children: /* @__PURE__ */ jsx(PlayCircle, { className: "text-primary", size: 28 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground mb-2", children: "No Live Class Right Now" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: "The video player will appear here automatically the moment our school goes live on YouTube." })
      ] }) })
    ] })
  ] }) }) });
};
const LiveClasses = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "Live Classes",
    description: "Join Merry City School live classes on YouTube — learn, revise, and stay connected from anywhere.",
    children: /* @__PURE__ */ jsx(LiveClassesSection, {})
  }
);
const Contact = () => {
  const formLink = "https://forms.gle/jC5E3ydeB7QHJQhPA";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formLink)}`;
  return /* @__PURE__ */ jsx(
    PageLayout,
    {
      title: "Contact Us",
      description: "Get in touch with Merry City School & Hostel, Varanasi. Call, email, or visit our campus.",
      children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-foreground mb-3", children: "Contact Us" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base md:text-lg", children: "We'd love to hear from you. Reach out for admissions, queries, or a campus visit." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-3 mb-10", children: [
          /* @__PURE__ */ jsxs("a", { href: "tel:9765773798", className: "rounded-xl border border-border bg-background p-6 text-center shadow-sm hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(Phone, { className: "text-primary", size: 20 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1", children: "Call" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground font-bold", children: "9765773798" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "mailto:mcsvns@gmail.com", className: "rounded-xl border border-border bg-background p-6 text-center shadow-sm hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(Mail, { className: "text-primary", size: 20 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1", children: "Email" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground font-bold break-all text-sm", children: "mcsvns@gmail.com" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-6 text-center shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(MapPin, { className: "text-primary", size: 20 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1", children: "Address" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground font-medium text-sm", children: "BHU Bypass Road, Narayanpur, Dafi, Varanasi - 221011" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-secondary/50 to-secondary/20 rounded-2xl p-8 mb-10 border border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white p-3 rounded-lg shadow-lg", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: qrCodeUrl,
              alt: "Quick Application QR Code",
              className: "w-40 h-40 rounded"
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground text-center", children: "Quick Admission Apply" }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: formLink,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "relative group inline-block",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-accent via-primary to-accent rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" }),
                  /* @__PURE__ */ jsxs("button", { className: "relative px-6 py-3 bg-background text-foreground font-bold rounded-lg shadow-xl transform transition duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-primary/50 hover:border-accent", children: [
                    /* @__PURE__ */ jsx(QrCode, { size: 20 }),
                    /* @__PURE__ */ jsx("span", { children: "Apply Now" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Scan or tap to fill form" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border shadow-sm", children: /* @__PURE__ */ jsx(
          "iframe",
          {
            title: "Merry City School location",
            src: "https://www.google.com/maps?q=Narayanpur,+Dafi,+Varanasi&output=embed",
            className: "w-full h-[360px] border-0",
            loading: "lazy"
          }
        ) })
      ] }) })
    }
  );
};
const directorPhoto = "/assets/director-photo-DK-fPyWj.png";
const principalPhoto = "/assets/principal-photo-new-DBpWDyga.png";
const vicePrincipalPhoto = "/assets/vice-principal-photo-proper-DqGPvuLw.png";
const defaultLeaders = [
  {
    role: "Director",
    name: "Director, Merry City School & Hostel",
    photo: directorPhoto,
    description: "The Director provides the overall vision for Merry City School & Hostel, ensuring quality education, moral guidance, and a safe environment for every child.",
    message: "Dear students and parents, our aim is to build confidence, discipline, and strong values along with academic excellence. Together, we can help every child grow into a responsible and successful person."
  },
  {
    role: "Principal",
    name: "Principal, Merry City School & Hostel",
    photo: principalPhoto,
    description: "The Principal leads the academic and administrative environment of the school with discipline, care, and continuous focus on learning outcomes.",
    message: "Dear students, keep learning with honesty and hard work. Dear parents, your support and trust help us create a positive learning atmosphere where children feel guided, safe, and motivated."
  },
  {
    role: "Vice Principal",
    name: "Vice Principal, Merry City School & Hostel",
    photo: vicePrincipalPhoto,
    description: "Our Vice Principal leads study and education with dedication, while also guiding students in cultural activities, co-curricular events, and personal development at Merry City School & Hostel.",
    message: "Dear students, education is not only about books — it is about learning values, creativity, and confidence. At Merry City School & Hostel, we focus on strong academics along with cultural activities, sports, and life skills, so every child grows into a well-rounded, responsible, and happy individual. Dear parents, your trust inspires us to give our very best every day."
  }
];
const defaultFocus = [
  "Student discipline and confidence",
  "Quality education standards",
  "Parent communication and trust",
  "Safe and caring campus life"
];
const LeadershipPage = ({ title = "School Leadership", description, leaders = defaultLeaders, focus = defaultFocus }) => {
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title,
      description: description ?? "Director, Principal, and Vice Principal messages at Merry City School & Hostel, Varanasi.",
      children: [
        /* @__PURE__ */ jsx("section", { className: "section-alt py-16 md:py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-10 max-w-3xl text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm font-semibold uppercase tracking-wide text-primary", children: "Merry City School & Hostel" }),
            /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-foreground md:text-5xl", children: "School Leadership" }),
            /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed text-muted-foreground md:text-lg", children: "Messages from our Director, Principal, and Vice Principal for students and parents." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-3", children: leaders.map((leader) => /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-xl border border-border bg-background shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-secondary", children: leader.photo ? /* @__PURE__ */ jsx(
              "img",
              {
                src: leader.photo,
                alt: `${leader.role} of Merry City School & Hostel`,
                className: "h-full w-full object-cover object-top",
                loading: "lazy"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsx(UserRound, { className: "h-24 w-24 text-primary", "aria-hidden": "true" }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-2 text-sm font-semibold uppercase tracking-wide text-primary", children: leader.role }),
              /* @__PURE__ */ jsx("h2", { className: "mb-3 text-xl font-bold text-foreground", children: leader.name }),
              /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm leading-relaxed text-muted-foreground", children: leader.description }),
              /* @__PURE__ */ jsx("blockquote", { className: "border-l-4 border-primary pl-4 text-sm font-medium leading-relaxed text-foreground", children: leader.message })
            ] })
          ] }, leader.role)) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-10 max-w-3xl text-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "mb-3 text-3xl font-bold text-foreground md:text-4xl", children: "Vision & Responsibilities" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Guiding students with discipline, care, strong academics, and value-based education." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-5 md:grid-cols-2 lg:grid-cols-4", children: focus.map((item, index) => {
            const icons = [Award, BookOpen, HeartHandshake, GraduationCap];
            const Icon = icons[index % icons.length];
            return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-6 shadow-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 text-primary", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: item })
            ] }, item);
          }) })
        ] }) })
      ]
    }
  );
};
const Leadership = () => /* @__PURE__ */ jsx(LeadershipPage, {});
const Director = () => /* @__PURE__ */ jsx(LeadershipPage, {});
const Principal = () => /* @__PURE__ */ jsx(LeadershipPage, {});
const VicePrincipal = () => /* @__PURE__ */ jsx(LeadershipPage, {});
const features = [
  {
    icon: Brain,
    title: "Integrated Learning",
    desc: "School syllabus + JEE/NEET concepts taught together — no extra coaching needed outside school.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    desc: "Experienced mentors from top engineering & medical backgrounds guide every student personally.",
    color: "bg-accent/15 text-accent-foreground"
  },
  {
    icon: BookOpen,
    title: "Study Material",
    desc: "Carefully designed booklets, practice sheets, and previous-year question banks for every chapter.",
    color: "bg-emerald-100 text-emerald-700"
  },
  {
    icon: ClipboardCheck,
    title: "Regular Tests",
    desc: "Weekly chapter tests, monthly mock exams, and detailed performance reports for parents.",
    color: "bg-orange-100 text-orange-700"
  },
  {
    icon: HelpCircle,
    title: "Doubt Sessions",
    desc: "Daily one-on-one doubt clearing so no concept is ever left unclear.",
    color: "bg-blue-100 text-blue-700"
  },
  {
    icon: Trophy,
    title: "Competitive Environment",
    desc: "Healthy peer learning, ranks, and rewards that keep students motivated to perform their best.",
    color: "bg-purple-100 text-purple-700"
  }
];
const whyUs = [
  {
    icon: Rocket,
    title: "Early Preparation Advantage",
    desc: "Starting from Class 6–10 gives your child years of practice before the actual JEE/NEET exam."
  },
  {
    icon: Users,
    title: "Coaching-like Structure Inside School",
    desc: "Get the discipline & rigour of a coaching institute without sending your child to a separate centre."
  },
  {
    icon: Award,
    title: "School + Competitive Together",
    desc: "Your child stays strong in board exams while building a powerful foundation for future success."
  },
  {
    icon: Atom,
    title: "Concept-First Approach",
    desc: "We focus on understanding, not memorising — the only way to crack JEE & NEET."
  }
];
const Foundation = () => {
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "IIT-JEE & NEET Foundation Program",
      description: "Integrated IIT-JEE & NEET Foundation Program at Merry City School & Hostel — expert faculty, study material, regular tests, and doubt sessions inside school.",
      children: [
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/85 py-20 text-primary-foreground", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", style: { backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "60px 60px" } }),
          /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto max-w-4xl px-4 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-block rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground", children: "New Launch • 2026" }),
            /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-extrabold leading-tight md:text-5xl", children: "IIT-JEE & NEET Foundation Program" }),
            /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-base text-primary-foreground/90 md:text-lg", children: "Strong foundation for future success in competitive exams — built right inside your child's school day." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
              /* @__PURE__ */ jsxs(Link, { to: "/admissions", className: "btn-accent", children: [
                /* @__PURE__ */ jsx(Rocket, { size: 20 }),
                " Enroll Now"
              ] }),
              /* @__PURE__ */ jsx("a", { href: "#about", className: "btn-outline-light", children: "Learn More" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("section", { id: "about", className: "py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4 text-center", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground md:text-4xl", children: "About the Program" }),
          /* @__PURE__ */ jsx("div", { className: "mx-auto mt-3 h-1 w-20 rounded-full bg-accent" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-relaxed text-muted-foreground", children: "Our IIT-JEE & NEET Foundation Program blends school academics with structured competitive exam preparation from Class 6 onwards. Students learn Physics, Chemistry, Mathematics and Biology through a deeper, concept-driven approach — so by the time they reach Class 11 & 12, they're already ahead of the curve. No extra coaching. No long travel. Just one focused, well-planned journey under one roof." })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "section-alt py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground md:text-4xl", children: "Key Features" }),
            /* @__PURE__ */ jsx("div", { className: "mx-auto mt-3 h-1 w-20 rounded-full bg-accent" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted-foreground", children: "Everything your child needs to crack JEE & NEET — under one roof." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: features.map((f) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              children: [
                /* @__PURE__ */ jsx("div", { className: `inline-flex h-12 w-12 items-center justify-center rounded-lg ${f.color}`, children: /* @__PURE__ */ jsx(f.icon, { size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-bold text-foreground", children: f.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: f.desc })
              ]
            },
            f.title
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-6xl px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground", children: [
              /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
              " Tech-Enabled Learning"
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "mt-4 text-3xl font-bold text-foreground md:text-4xl", children: "Smart Classes & Smart Lab for JEE Teaching" }),
            /* @__PURE__ */ jsx("div", { className: "mx-auto mt-3 h-1 w-20 rounded-full bg-accent" }),
            /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-muted-foreground", children: "Our digital classrooms and dedicated Smart Lab make IIT-JEE concepts visual, interactive and easy to master — helping students score extra marks in board as well as competitive exams." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-6 lg:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/10 p-7 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(Monitor, { size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: "Smart Classes" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: "Interactive digital boards bring Physics, Chemistry & Maths to life with 3D animations, live problem solving and recorded revisions — perfect for JEE-level concept clarity." }),
              /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2 text-sm text-foreground", children: [
                "HD smart boards in every classroom",
                "Animated visuals for tough JEE concepts",
                "Recorded lectures for unlimited revision",
                "Live MCQ practice during class"
              ].map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Zap, { size: 16, className: "mt-0.5 shrink-0 text-primary" }),
                /* @__PURE__ */ jsx("span", { children: it })
              ] }, it)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-blue-50 p-7 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white", children: /* @__PURE__ */ jsx(FlaskConical, { size: 24 }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: "Smart Lab" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: "A dedicated JEE-focused lab where students perform virtual experiments, simulations and practical problem-solving — building deep understanding that earns extra marks." }),
              /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2 text-sm text-foreground", children: [
                "Virtual physics & chemistry simulations",
                "Hands-on JEE numerical practice",
                "High-speed Wi-Fi & individual workstations",
                "Mentor-led experiment sessions"
              ].map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(Wifi, { size: 16, className: "mt-0.5 shrink-0 text-emerald-600" }),
                /* @__PURE__ */ jsx("span", { children: it })
              ] }, it)) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-xl border border-accent/30 bg-accent/10 p-5 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-foreground md:text-base", children: [
            "⭐ Students using our Smart Classes & Smart Lab consistently score",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "extra marks" }),
            " in school exams and JEE mock tests."
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "section-alt py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-5xl px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground md:text-4xl", children: "Why Choose Us" }),
            /* @__PURE__ */ jsx("div", { className: "mx-auto mt-3 h-1 w-20 rounded-full bg-accent" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-6 md:grid-cols-2", children: whyUs.map((w) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(w.icon, { size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: w.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: w.desc })
                ] })
              ]
            },
            w.title
          )) })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "section-blue py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold md:text-4xl", children: "Give Your Child the Early Edge" }),
            /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-xl text-primary-foreground/90", children: "Limited seats available for the 2026 batch. Talk to our counsellor today and secure your child's future." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center bg-primary/20 rounded-2xl p-8 mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white p-4 rounded-xl shadow-lg", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent("https://forms.gle/jC5E3ydeB7QHJQhPA")}`,
                alt: "Foundation Program QR Code",
                className: "w-64 h-64 rounded-lg"
              }
            ) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-primary-foreground text-center", children: "Quick Application" }),
              /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-center", children: "Scan or tap to apply for Foundation Program" }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "https://forms.gle/jC5E3ydeB7QHJQhPA",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "relative group inline-block",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 -z-10" }),
                    /* @__PURE__ */ jsxs("button", { className: "relative px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-2xl transform transition duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-yellow-300/50 hover:border-yellow-400", children: [
                      /* @__PURE__ */ jsx(QrCode, { size: 24 }),
                      /* @__PURE__ */ jsx("span", { children: "Enroll Now" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-primary-foreground/70 mt-2", children: "Instant registration" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/admissions", className: "btn-accent", children: [
              /* @__PURE__ */ jsx(Rocket, { size: 20 }),
              " Main Admission Form"
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/contact", className: "btn-outline-light", children: [
              /* @__PURE__ */ jsx(Phone, { size: 20 }),
              " Contact Us"
            ] })
          ] })
        ] }) })
      ]
    }
  );
};
const PrivacyPolicy = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "Privacy Policy",
    description: "Privacy policy for Merry City School & Hostel website visitors, students, and parents.",
    children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-foreground md:text-4xl", children: "Privacy Policy" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "Merry City School & Hostel respects the privacy of students, parents, guardians, and website visitors. Information shared through calls, emails, admission enquiries, or contact forms is used only for school-related communication." }),
        /* @__PURE__ */ jsx("p", { children: "We do not sell or misuse personal information. Contact details may be used by the school office to respond to enquiries, admissions, academic communication, transport, hostel, or campus visit requests." }),
        /* @__PURE__ */ jsx("p", { children: "For any privacy-related question, please contact the school office through the contact page." })
      ] })
    ] }) })
  }
);
const TermsConditions = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "Terms & Conditions",
    description: "Terms and conditions for using Merry City School & Hostel website information and services.",
    children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-foreground md:text-4xl", children: "Terms & Conditions" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "The information on this website is provided for students, parents, and visitors of Merry City School & Hostel. Details about admissions, facilities, classes, and activities may be updated by the school from time to time." }),
        /* @__PURE__ */ jsx("p", { children: "Visitors should contact the school office for final confirmation of fees, admissions, schedules, hostel availability, documents, and official notices." }),
        /* @__PURE__ */ jsx("p", { children: "By using this website, you agree to use its content respectfully and only for genuine school-related purposes." })
      ] })
    ] }) })
  }
);
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast: toast2 } = useToast();
  const [mode, setMode] = useState("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);
  const handleEmailAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    const result = mode === "signup" ? await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: trimmedName || trimmedEmail.split("@")[0] }
      }
    }) : await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
    setLoading(false);
    if (result.error) {
      toast2({ title: "Login problem", description: result.error.message, variant: "destructive" });
      return;
    }
    if (mode === "signup" && !result.data.session) {
      toast2({ title: "Check your email", description: "Please verify your email, then login." });
      setMode("login");
      return;
    }
    navigate("/profile");
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await supabase.auth.signInWithOAuth("google", { redirectTo: window.location.origin });
    setLoading(false);
    if (result.error) {
      toast2({ title: "Google login problem", description: result.error.message, variant: "destructive" });
      return;
    }
    if (!result.data.url) navigate("/profile");
  };
  return /* @__PURE__ */ jsx(PageLayout, { title: "Login", description: "Login or create an account for Merry City School & Hostel.", children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-md px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-2 text-3xl font-bold text-foreground", children: mode === "login" ? "Login" : "Create Account" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-muted-foreground", children: "Access school updates and parent/student services." }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleEmailAuth, children: [
      mode === "signup" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "displayName", children: "Name" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "displayName",
            value: displayName,
            onChange: (event) => setDisplayName(event.target.value),
            placeholder: "Parent or student name",
            maxLength: 80
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (event) => setEmail(event.target.value),
            placeholder: "you@example.com",
            autoComplete: "email",
            required: true,
            maxLength: 255
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            value: password,
            onChange: (event) => setPassword(event.target.value),
            placeholder: "Minimum 6 characters",
            autoComplete: mode === "login" ? "current-password" : "new-password",
            required: true,
            minLength: 6,
            maxLength: 72
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
        loading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Mail, {}),
        mode === "login" ? "Login with Email" : "Sign Up with Email"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "my-5 flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
      " or ",
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", className: "w-full", onClick: handleGoogleLogin, disabled: loading, children: [
      /* @__PURE__ */ jsx(LogIn, {}),
      " Continue with Google"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "font-semibold text-primary hover:underline", onClick: () => setMode(mode === "login" ? "signup" : "login"), children: mode === "login" ? "Create new account" : "Already have account?" }),
      /* @__PURE__ */ jsx(Link, { to: "/forgot-password", className: "font-semibold text-primary hover:underline", children: "Forgot password?" })
    ] })
  ] }) }) }) });
};
const Profile = () => {
  const { user, profile, loading, signOut } = useAuth();
  if (!loading && !user) return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
  return /* @__PURE__ */ jsx(PageLayout, { title: "My Profile", description: "Account profile for Merry City School & Hostel users.", children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-3xl px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-6 text-3xl font-bold text-foreground md:text-4xl", children: "My Profile" }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground", children: /* @__PURE__ */ jsx(UserRound, { size: 26 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-foreground", children: profile?.display_name || user?.email || "School User" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user?.email }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-semibold uppercase text-primary", children: profile?.account_type || "parent" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: signOut, children: [
          /* @__PURE__ */ jsx(LogOut, {}),
          " Logout"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-border pt-5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "Your account is ready. More parent and student features can be added here later." }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: "mt-3 inline-block font-semibold text-primary hover:underline", children: "Contact school office" })
      ] })
    ] })
  ] }) }) });
};
const ForgotPassword = () => {
  const { toast: toast2 } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (error) {
      toast2({ title: "Reset problem", description: error.message, variant: "destructive" });
      return;
    }
    toast2({ title: "Reset email sent", description: "Please check your email for the password reset link." });
  };
  return /* @__PURE__ */ jsx(PageLayout, { title: "Forgot Password", description: "Reset your Merry City School account password.", children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-md px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-2 text-3xl font-bold text-foreground", children: "Forgot Password" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-muted-foreground", children: "Enter your email to receive a reset link." }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (event) => setEmail(event.target.value),
            required: true,
            maxLength: 255
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading, children: [
        /* @__PURE__ */ jsx(Mail, {}),
        " Send Reset Link"
      ] })
    ] })
  ] }) }) }) });
};
const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast: toast2 } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isRecovery = useMemo(() => window.location.hash.includes("type=recovery"), []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast2({ title: "Password problem", description: error.message, variant: "destructive" });
      return;
    }
    toast2({ title: "Password updated", description: "You can now continue using your account." });
    navigate("/profile");
  };
  return /* @__PURE__ */ jsx(PageLayout, { title: "Reset Password", description: "Set a new password for your Merry City School account.", children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-md px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background p-6 shadow-sm", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-2 text-3xl font-bold text-foreground", children: "Reset Password" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-sm text-muted-foreground", children: isRecovery ? "Enter a new secure password." : "Open this page from the reset email link." }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "New Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            value: password,
            onChange: (event) => setPassword(event.target.value),
            required: true,
            minLength: 6,
            maxLength: 72
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "w-full", disabled: loading || !isRecovery, children: [
        /* @__PURE__ */ jsx(KeyRound, {}),
        " Update Password"
      ] })
    ] })
  ] }) }) }) });
};
const quickLinks = [
  { label: "Admissions", to: "/admissions" },
  { label: "Academics", to: "/academics" },
  { label: "Facilities", to: "/facilities" },
  { label: "Gallery", to: "/gallery" },
  { label: "Live Classes", to: "/live-classes" },
  { label: "Contact", to: "/contact" }
];
const Search = () => /* @__PURE__ */ jsx(PageLayout, { title: "Search", description: "Find important pages on Merry City School & Hostel website.", children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4", children: [
  /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground", children: /* @__PURE__ */ jsx(Search$1, { size: 22 }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground md:text-4xl", children: "Search" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Choose a quick link to visit the page." })
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: quickLinks.map((link) => /* @__PURE__ */ jsx(Link, { to: link.to, className: "rounded-lg border border-border bg-background p-5 font-semibold text-foreground shadow-sm transition-shadow hover:shadow-md", children: link.label }, link.to)) })
] }) }) });
const Accessibility = () => /* @__PURE__ */ jsx(
  PageLayout,
  {
    title: "Accessibility",
    description: "Accessibility support information for Merry City School & Hostel website visitors.",
    children: /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-foreground md:text-4xl", children: "Accessibility" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 text-muted-foreground", children: [
        /* @__PURE__ */ jsx("p", { children: "Merry City School & Hostel aims to keep this website simple, readable, and easy to use for students, parents, and visitors." }),
        /* @__PURE__ */ jsx("p", { children: "You can use the top bar controls to change text size, switch language, and use dark or light mode. Keyboard users can use the skip link to move directly to the main page content." }),
        /* @__PURE__ */ jsx("p", { children: "For help accessing any information, please contact the school office through the contact page." })
      ] })
    ] }) })
  }
);
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
const WHATSAPP_NUMBER = "919765773798";
const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  qualification: z.string().trim().min(2, "Enter qualification").max(120),
  experience: z.string().trim().max(40).optional().or(z.literal("")),
  coverNote: z.string().trim().max(600).optional().or(z.literal(""))
});
const initial = {
  fullName: "",
  phone: "",
  email: "",
  qualification: "",
  experience: "",
  coverNote: ""
};
const CareerApplyForm = ({ position, onClose }) => {
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const update = (k) => (e) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((i) => {
        const key = i.path[0];
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const v = result.data;
    const { error: dbError } = await supabase.from("career_applications").insert({
      position,
      full_name: v.fullName,
      phone: v.phone,
      email: v.email || null,
      qualification: v.qualification,
      experience: v.experience || null,
      cover_note: v.coverNote || null
    });
    if (dbError) console.error("DB save failed", dbError);
    const lines = [
      "*New Career Application*",
      "_Merry City School & Hostel_",
      "",
      `*Position:* ${position}`,
      `*Name:* ${v.fullName}`,
      `*Phone:* ${v.phone}`,
      v.email ? `*Email:* ${v.email}` : null,
      `*Qualification:* ${v.qualification}`,
      v.experience ? `*Experience:* ${v.experience}` : null,
      v.coverNote ? `*Cover Note:* ${v.coverNote}` : null
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast({ title: "Application saved & opening WhatsApp", description: "Tap Send in WhatsApp to confirm." });
    setData(initial);
    onClose?.();
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "grid gap-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { children: "Position" }),
      /* @__PURE__ */ jsx(Input, { value: position, readOnly: true, className: "bg-muted" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "fullName", children: "Full Name *" }),
        /* @__PURE__ */ jsx(Input, { id: "fullName", value: data.fullName, onChange: update("fullName"), maxLength: 80 }),
        errors.fullName && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive mt-1", children: errors.fullName })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: "Phone *" }),
        /* @__PURE__ */ jsx(Input, { id: "phone", type: "tel", value: data.phone, onChange: update("phone"), maxLength: 15 }),
        errors.phone && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive mt-1", children: errors.phone })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(Input, { id: "email", type: "email", value: data.email, onChange: update("email"), maxLength: 120 }),
        errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive mt-1", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "experience", children: "Experience" }),
        /* @__PURE__ */ jsx(Input, { id: "experience", placeholder: "e.g. 3 years", value: data.experience, onChange: update("experience"), maxLength: 40 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "qualification", children: "Qualification *" }),
      /* @__PURE__ */ jsx(Input, { id: "qualification", value: data.qualification, onChange: update("qualification"), maxLength: 120 }),
      errors.qualification && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive mt-1", children: errors.qualification })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "coverNote", children: "Cover Note" }),
      /* @__PURE__ */ jsx(Textarea, { id: "coverNote", rows: 4, value: data.coverNote, onChange: update("coverNote"), maxLength: 600 })
    ] }),
    /* @__PURE__ */ jsxs("button", { type: "submit", className: "btn-accent justify-center", children: [
      /* @__PURE__ */ jsx(Send, { size: 18 }),
      " Apply via WhatsApp"
    ] })
  ] });
};
const jobs = [
  {
    id: "pgt-math",
    title: "PGT - Mathematics",
    type: "Teaching",
    qualification: "M.Sc. (Maths) + B.Ed.",
    experience: "Min. 3 years (CBSE preferred)",
    location: "Varanasi (Main Campus)",
    description: "Teach Mathematics to senior secondary classes (XI–XII). Strong concept clarity and CBSE board experience required."
  },
  {
    id: "tgt-science",
    title: "TGT - Science",
    type: "Teaching",
    qualification: "B.Sc. + B.Ed.",
    experience: "1–4 years",
    location: "Varanasi",
    description: "Handle Science (Physics/Chemistry/Biology) for classes VI–X with engaging, activity-based teaching."
  }
];
const Careers = () => {
  const [active, setActive] = useState(null);
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "Careers",
      description: "Join the Merry City School & Hostel team. Current teaching and non-teaching openings in Varanasi.",
      children: [
        /* @__PURE__ */ jsx("section", { className: "bg-primary text-primary-foreground py-14", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl font-extrabold mb-3", children: "Careers @ Merry City" }),
          /* @__PURE__ */ jsx("p", { className: "max-w-2xl mx-auto opacity-95", children: "Be part of a school that values teachers, nurtures students, and grows every year. Explore current openings below." })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-foreground mb-6 text-center", children: "Current Openings" }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: jobs.map((job) => /* @__PURE__ */ jsxs(
            "article",
            {
              className: "bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: job.title }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-xs font-semibold px-2 py-1 rounded-full ${job.type === "Teaching" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`,
                      children: job.type
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: job.description }),
                /* @__PURE__ */ jsxs("ul", { className: "grid gap-2 text-sm mb-5", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-foreground", children: [
                    /* @__PURE__ */ jsx(GraduationCap, { size: 16, className: "text-primary" }),
                    " ",
                    job.qualification
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-foreground", children: [
                    /* @__PURE__ */ jsx(Clock, { size: 16, className: "text-primary" }),
                    " ",
                    job.experience
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-foreground", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary" }),
                    " ",
                    job.location
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setActive(job),
                    className: "btn-accent justify-center mt-auto",
                    children: [
                      /* @__PURE__ */ jsx(Briefcase, { size: 18 }),
                      " Apply Now"
                    ]
                  }
                )
              ]
            },
            job.id
          )) })
        ] }) }),
        /* @__PURE__ */ jsx(Dialog, { open: !!active, onOpenChange: (o) => !o && setActive(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
            "Apply: ",
            active?.title
          ] }) }),
          active && /* @__PURE__ */ jsx(CareerApplyForm, { position: active.title, onClose: () => setActive(null) })
        ] }) })
      ]
    }
  );
};
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className), ...props }));
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("h3", { ref, className: cn("text-2xl font-semibold leading-none tracking-tight", className), ...props })
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    (async () => {
      const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      const admin = !!roleRow;
      setIsAdmin(admin);
      if (admin) {
        const [a, c] = await Promise.all([
          supabase.from("admission_enquiries").select("*").order("created_at", { ascending: false }),
          supabase.from("career_applications").select("*").order("created_at", { ascending: false })
        ]);
        setAdmissions(a.data || []);
        setCareers(c.data || []);
      }
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);
  if (authLoading || loading) {
    return /* @__PURE__ */ jsx(PageLayout, { title: "Admin", description: "Submissions dashboard", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsx(PageLayout, { title: "Admin", description: "Submissions dashboard", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-20 max-w-xl text-center", children: [
      /* @__PURE__ */ jsx(ShieldAlert, { className: "mx-auto mb-4 text-destructive", size: 48 }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "Admin access required" }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-4", children: [
        "Your account doesn't have admin access yet. Ask the site owner to grant the ",
        /* @__PURE__ */ jsx("code", { children: "admin" }),
        " role to your user id:"
      ] }),
      /* @__PURE__ */ jsx("code", { className: "block bg-muted p-3 rounded text-sm break-all", children: user?.id })
    ] }) });
  }
  return /* @__PURE__ */ jsx(PageLayout, { title: "Admin", description: "View admission and career submissions", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-6", children: "Submissions" }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "admissions", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "admissions", children: [
          "Admissions (",
          admissions.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "careers", children: [
          "Careers (",
          careers.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "admissions", className: "grid gap-4 mt-6", children: [
        admissions.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No admission enquiries yet." }),
        admissions.map((a) => /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-semibold", children: [
              a.student_name,
              " — ",
              a.class_applying
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: new Date(a.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm grid gap-1", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Parent:" }),
              " ",
              a.parent_name
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Phone:" }),
              " ",
              /* @__PURE__ */ jsx("a", { href: `tel:${a.phone}`, className: "text-primary", children: a.phone })
            ] }),
            a.email && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Email:" }),
              " ",
              a.email
            ] }),
            a.message && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Note:" }),
              " ",
              a.message
            ] })
          ] })
        ] }, a.id))
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "careers", className: "grid gap-4 mt-6", children: [
        careers.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No career applications yet." }),
        careers.map((c) => /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-semibold", children: [
              c.full_name,
              " — ",
              c.position
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: new Date(c.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm grid gap-1", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Phone:" }),
              " ",
              /* @__PURE__ */ jsx("a", { href: `tel:${c.phone}`, className: "text-primary", children: c.phone })
            ] }),
            c.email && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Email:" }),
              " ",
              c.email
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Qualification:" }),
              " ",
              c.qualification
            ] }),
            c.experience && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Experience:" }),
              " ",
              c.experience
            ] }),
            c.cover_note && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Cover Note:" }),
              " ",
              c.cover_note
            ] })
          ] })
        ] }, c.id))
      ] })
    ] })
  ] }) });
};
const BASE = "http://localhost:5000";
async function handle(res) {
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
const api = {
  base: BASE,
  get: (path) => fetch(`${BASE}${path}`).then(handle),
  postJson: (path, body) => fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(handle),
  putJson: (path, body) => fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(handle),
  postForm: (path, form) => fetch(`${BASE}${path}`, { method: "POST", body: form }).then(handle),
  del: (path) => fetch(`${BASE}${path}`, { method: "DELETE" }).then(handle)
};
function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE}${path}`;
}
function useList(path, dep) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  useEffect(() => {
    setLoading(true);
    api.get(path).then((d) => setRows(Array.isArray(d) ? d : [])).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  }, [path, dep]);
  return { rows, loading, err };
}
function ListPanel({
  title,
  path,
  fields,
  refresh,
  onDelete,
  render
}) {
  const { rows, loading, err } = useList(path, refresh);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: title }),
    loading && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
    err && /* @__PURE__ */ jsxs("p", { className: "text-destructive text-sm", children: [
      "⚠ ",
      err
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
      rows.map((r) => /* @__PURE__ */ jsxs(Card, { className: "p-3 flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: render ? render(r) : fields.map((f) => /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            f.label,
            ": "
          ] }),
          /* @__PURE__ */ jsx("span", { className: "break-words", children: String(r[f.name] ?? "") })
        ] }, f.name)) }),
        /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => onDelete(r.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] }, r.id)),
      !loading && rows.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No entries yet." })
    ] })
  ] });
}
function JsonForm({
  fields,
  onSubmit,
  submitLabel = "Add"
}) {
  const [data, setData] = useState({});
  const [busy, setBusy] = useState(false);
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "grid gap-3 mb-4",
      onSubmit: async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await onSubmit(data);
          setData({});
        } finally {
          setBusy(false);
        }
      },
      children: [
        fields.map((f) => /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsx(Label, { children: f.label }),
          f.textarea ? /* @__PURE__ */ jsx(
            Textarea,
            {
              value: data[f.name] || "",
              onChange: (e) => setData({ ...data, [f.name]: e.target.value })
            }
          ) : /* @__PURE__ */ jsx(
            Input,
            {
              type: f.type || "text",
              value: data[f.name] || "",
              onChange: (e) => setData({ ...data, [f.name]: e.target.value })
            }
          )
        ] }, f.name)),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: busy, children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : submitLabel })
      ]
    }
  );
}
function FileForm({
  textFields,
  fileField,
  accept,
  onSubmit
}) {
  const [busy, setBusy] = useState(false);
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "grid gap-3 mb-4",
      onSubmit: async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setBusy(true);
        try {
          await onSubmit(form);
          e.currentTarget.reset();
        } finally {
          setBusy(false);
        }
      },
      children: [
        textFields.map((f) => /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsx(Label, { children: f.label }),
          f.textarea ? /* @__PURE__ */ jsx(Textarea, { name: f.name }) : /* @__PURE__ */ jsx(Input, { name: f.name })
        ] }, f.name)),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "File" }),
          /* @__PURE__ */ jsx(Input, { type: "file", name: fileField, accept, required: true })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: busy, children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Upload" })
      ]
    }
  );
}
function KvEditor({ path, keys }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api.get(path).then((d) => setData(d || {})).finally(() => setLoading(false));
  }, [path]);
  if (loading) return /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" });
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
    keys.map((k) => /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
      /* @__PURE__ */ jsx(Label, { className: "capitalize", children: k.replace(/_/g, " ") }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          value: data[k] || "",
          onChange: (e) => setData({ ...data, [k]: e.target.value })
        }
      )
    ] }, k)),
    /* @__PURE__ */ jsx(
      Button,
      {
        disabled: busy,
        onClick: async () => {
          setBusy(true);
          try {
            await api.putJson(path, data);
            toast$1.success("Saved");
          } catch (e) {
            toast$1.error(e.message);
          } finally {
            setBusy(false);
          }
        },
        children: busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Save"
      }
    )
  ] });
}
function AdminLocal() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);
  return /* @__PURE__ */ jsxs(PageLayout, { title: "Admin Panel — Merry City School", description: "Manage school content locally.", noindex: true, children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx("title", { children: "Admin Panel — Merry City School" }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-2", children: "Admin Panel" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
        "Local backend at ",
        /* @__PURE__ */ jsx("code", { children: api.base }),
        " — make sure the Express server is running."
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "notices", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "flex flex-wrap h-auto", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "notices", children: "Notices" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "events", children: "Events" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "gallery", children: "Gallery" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "teachers", children: "Teachers" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "pdfs", children: "PDFs" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "mpd", children: "CBSE MPD" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "homepage", children: "Homepage" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "contact", children: "Contact" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "notices", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            JsonForm,
            {
              fields: [
                { name: "title", label: "Title" },
                { name: "body", label: "Body", textarea: true }
              ],
              onSubmit: async (d) => {
                await api.postJson("/api/notices", d);
                toast$1.success("Notice added");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "All Notices",
              path: "/api/notices",
              refresh: tick,
              fields: [
                { name: "title", label: "Title" },
                { name: "body", label: "Body" },
                { name: "date", label: "Date" }
              ],
              onDelete: async (id) => {
                await api.del(`/api/notices/${id}`);
                toast$1.success("Deleted");
                refresh();
              }
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "events", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            FileForm,
            {
              textFields: [
                { name: "title", label: "Title" },
                { name: "event_date", label: "Date (YYYY-MM-DD)" },
                { name: "description", label: "Description", textarea: true }
              ],
              fileField: "image",
              accept: "image/*",
              onSubmit: async (f) => {
                await api.postForm("/api/events", f);
                toast$1.success("Event added");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "All Events",
              path: "/api/events",
              refresh: tick,
              fields: [],
              onDelete: async (id) => {
                await api.del(`/api/events/${id}`);
                toast$1.success("Deleted");
                refresh();
              },
              render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                r.image_url && /* @__PURE__ */ jsx("img", { src: fileUrl(r.image_url), alt: "", className: "w-20 h-20 object-cover rounded" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold", children: r.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: r.event_date }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm", children: r.description })
                ] })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "gallery", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            FileForm,
            {
              textFields: [{ name: "caption", label: "Caption" }],
              fileField: "image",
              accept: "image/*",
              onSubmit: async (f) => {
                await api.postForm("/api/gallery", f);
                toast$1.success("Image uploaded");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "Gallery",
              path: "/api/gallery",
              refresh: tick,
              fields: [],
              onDelete: async (id) => {
                await api.del(`/api/gallery/${id}`);
                toast$1.success("Deleted");
                refresh();
              },
              render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                /* @__PURE__ */ jsx("img", { src: fileUrl(r.image_url), alt: "", className: "w-20 h-20 object-cover rounded" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm", children: r.caption })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "teachers", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            FileForm,
            {
              textFields: [
                { name: "name", label: "Name" },
                { name: "designation", label: "Designation" },
                { name: "subject", label: "Subject" }
              ],
              fileField: "photo",
              accept: "image/*",
              onSubmit: async (f) => {
                await api.postForm("/api/teachers", f);
                toast$1.success("Teacher added");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "Teachers",
              path: "/api/teachers",
              refresh: tick,
              fields: [],
              onDelete: async (id) => {
                await api.del(`/api/teachers/${id}`);
                toast$1.success("Deleted");
                refresh();
              },
              render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                r.photo_url && /* @__PURE__ */ jsx("img", { src: fileUrl(r.photo_url), alt: "", className: "w-16 h-16 object-cover rounded-full" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold", children: r.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    r.designation,
                    " · ",
                    r.subject
                  ] })
                ] })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "pdfs", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            FileForm,
            {
              textFields: [
                { name: "title", label: "Title" },
                { name: "category", label: "Category" }
              ],
              fileField: "file",
              accept: "application/pdf",
              onSubmit: async (f) => {
                await api.postForm("/api/pdfs", f);
                toast$1.success("PDF uploaded");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "PDFs",
              path: "/api/pdfs",
              refresh: tick,
              fields: [],
              onDelete: async (id) => {
                await api.del(`/api/pdfs/${id}`);
                toast$1.success("Deleted");
                refresh();
              },
              render: (r) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("a", { href: fileUrl(r.file_url), target: "_blank", rel: "noreferrer", className: "font-semibold text-primary underline", children: r.title }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: r.category })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "mpd", children: /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
          /* @__PURE__ */ jsx(
            JsonForm,
            {
              fields: [
                { name: "label", label: "Label" },
                { name: "value", label: "Value", textarea: true }
              ],
              onSubmit: async (d) => {
                await api.postJson("/api/mpd", d);
                toast$1.success("Added");
                refresh();
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ListPanel,
            {
              title: "CBSE Mandatory Public Disclosure",
              path: "/api/mpd",
              refresh: tick,
              fields: [
                { name: "label", label: "Label" },
                { name: "value", label: "Value" }
              ],
              onDelete: async (id) => {
                await api.del(`/api/mpd/${id}`);
                toast$1.success("Deleted");
                refresh();
              }
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "homepage", children: /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsx(
          KvEditor,
          {
            path: "/api/homepage",
            keys: ["hero_title", "hero_subtitle", "hero_cta", "about_short", "announcement"]
          }
        ) }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "contact", children: /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsx(
          KvEditor,
          {
            path: "/api/contact",
            keys: ["address", "phone", "email", "whatsapp", "map_url"]
          }
        ) }) })
      ] })
    ] })
  ] });
}
const sections = [
  { id: "general", title: "General Information", icon: Info },
  { id: "affiliation", title: "CBSE Affiliation", icon: BadgeCheck },
  { id: "documents", title: "Mandatory Documents", icon: FileText },
  { id: "safety", title: "Safety Certificates", icon: ShieldCheck },
  { id: "faculty", title: "Faculty Details", icon: Users },
  { id: "infrastructure", title: "Infrastructure", icon: Building2 },
  { id: "academics", title: "Academic Information", icon: GraduationCap },
  { id: "contact", title: "Contact Information", icon: Phone }
];
const documents = [
  { name: "Affiliation / Upgradation Letter (CBSE)", section: "documents" },
  { name: "Trust / Society / Company Registration Certificate", section: "documents" },
  { name: "No Objection Certificate (NOC) issued by State Govt.", section: "documents" },
  { name: "Recognition Certificate under RTE Act, 2009", section: "documents" },
  { name: "Building Safety Certificate", section: "safety" },
  { name: "Fire Safety Certificate", section: "safety" },
  { name: "DEO Certificate for Affiliation", section: "documents" },
  { name: "Water, Health & Sanitation Certificate", section: "safety" },
  { name: "Fee Structure of the School", section: "documents" },
  { name: "Annual Academic Calendar", section: "academics" },
  { name: "List of School Management Committee (SMC)", section: "documents" },
  { name: "List of Parents Teachers Association (PTA) Members", section: "documents" },
  { name: "Last 3-Year Board Result (Self Attested)", section: "academics" }
];
const generalInfo = [
  { label: "Name of the School", value: "Merry City School & Hostel" },
  { label: "Affiliation No.", value: "2132932" },
  { label: "School Code", value: "—" },
  { label: "Complete Address with Pin", value: "BHU Bypass Road, Narayanpur, Dafi, Susuwahi, Varanasi, UP — 221011" },
  { label: "Principal Name", value: "Mr. Ashutosh Kumar Rai (B.Tech, B.Ed)" },
  { label: "Principal Qualification", value: "B.Tech, B.Ed" },
  { label: "School Email", value: "info@merrycityschool.in" },
  { label: "Contact Number", value: "+91-9450536536" }
];
const affiliationInfo = [
  { label: "Affiliation Granted By", value: "CBSE, New Delhi" },
  { label: "Affiliation Number", value: "2132932" },
  { label: "Affiliation With", value: "CBSE" },
  { label: "Affiliation Period", value: "01/04/2027 to 31/03/2032" },
  { label: "Status of Affiliation", value: "Senior Secondary" },
  { label: "Year of First Opening", value: "02 Apr 2010" },
  { label: "Name of Trust / Society", value: "Sri Shiv Shankar Shiksha Samiti" },
  { label: "Society Registration Date", value: "Registered" }
];
const faculty = [
  { label: "Principal", value: "1" },
  { label: "Vice Principal", value: "1" },
  { label: "PGT", value: "12" },
  { label: "TGT", value: "18" },
  { label: "PRT", value: "20" },
  { label: "PRT (NPRT)", value: "6" },
  { label: "Health Wellness Teacher", value: "1" },
  { label: "Librarian", value: "1" },
  { label: "Physical Education Teacher", value: "2" },
  { label: "Art & Craft Teacher", value: "2" },
  { label: "Music Teacher", value: "1" },
  { label: "Counsellor & Special Educator", value: "1" }
];
const infra = [
  { label: "Total Campus Area (sq. mtrs)", value: "8,000+" },
  { label: "No. and Size of Class Rooms", value: "40+ (avg. 500 sq. ft.)" },
  { label: "No. and Size of Labs (Science / Computer)", value: "6 well-equipped labs" },
  { label: "Internet Facility", value: "Yes (High-speed Wi-Fi)" },
  { label: "Library Facility", value: "Yes (5,000+ books)" },
  { label: "Indoor Games", value: "Chess, Carrom, Table Tennis" },
  { label: "Outdoor Games", value: "Cricket, Football, Kabaddi, Athletics" },
  { label: "Smart Classrooms", value: "Yes — All sections" },
  { label: "Hostel Facility", value: "Yes (Boys & Girls)" },
  { label: "Transport Facility", value: "Yes (GPS-tracked buses)" },
  { label: "CCTV Surveillance", value: "Yes (Full campus)" },
  { label: "Medical Room", value: "Yes" }
];
const MandatoryDisclosure = () => {
  const [query, setQuery] = useState("");
  const filteredDocs = useMemo(
    () => documents.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "Mandatory Public Disclosure (MPD)",
      description: "CBSE Mandatory Public Disclosure for Merry City School & Hostel — affiliation, documents, safety certificates, faculty, infrastructure and academic information.",
      keywords: "CBSE Mandatory Public Disclosure, MPD Merry City School, CBSE 2132932, Varanasi CBSE school disclosure",
      children: [
        /* @__PURE__ */ jsx(
          BreadcrumbSchema,
          {
            items: [
              { name: "Home", url: "/" },
              { name: "Mandatory Disclosure", url: "/cbse-mpd" }
            ]
          }
        ),
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-border bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,hsl(var(--accent))_0,transparent_45%),radial-gradient(circle_at_80%_60%,hsl(var(--accent))_0,transparent_40%)]" }),
          /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto px-4 py-14 md:py-20", children: [
            /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "mb-6 flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/80", children: [
              /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 hover:text-[hsl(var(--accent))]", children: [
                /* @__PURE__ */ jsx(Home, { size: 14 }),
                " Home"
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { size: 14 }),
              /* @__PURE__ */ jsx("span", { className: "text-[hsl(var(--accent))]", children: "Mandatory Disclosure" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-6 md:flex-row md:items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md shadow-xl", children: /* @__PURE__ */ jsx("img", { src: schoolLogo, alt: "Merry City School & Hostel", className: "h-20 w-20 object-contain" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur", children: [
                  /* @__PURE__ */ jsx(BadgeCheck, { size: 14, className: "text-[hsl(var(--accent))]" }),
                  " CBSE Affiliated · 2132932"
                ] }),
                /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl font-extrabold leading-tight md:text-5xl", children: "Mandatory Public Disclosure" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm text-[hsl(var(--primary-foreground))]/80 md:text-base", children: "As per CBSE Affiliation Bye-Laws, all required documents and disclosures are published transparently for parents, students and the public." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "container mx-auto px-4 py-10 md:py-14", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[260px,1fr]", children: [
          /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-24 lg:self-start", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card/70 p-3 shadow-sm backdrop-blur", children: [
            /* @__PURE__ */ jsx("p", { className: "px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "On this page" }),
            /* @__PURE__ */ jsx("nav", { className: "grid gap-1", children: sections.map((s) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: `#${s.id}`,
                className: "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary hover:translate-x-0.5",
                children: [
                  /* @__PURE__ */ jsx(s.icon, { size: 16, className: "text-[hsl(var(--accent))]" }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: s.title })
                ]
              },
              s.id
            )) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-10", children: [
            /* @__PURE__ */ jsx(SectionCard, { id: "general", icon: Info, title: "A. General Information", children: /* @__PURE__ */ jsx(InfoTable, { rows: generalInfo }) }),
            /* @__PURE__ */ jsx(SectionCard, { id: "affiliation", icon: BadgeCheck, title: "B. Documents & Affiliation Details", children: /* @__PURE__ */ jsx(InfoTable, { rows: affiliationInfo }) }),
            /* @__PURE__ */ jsxs(SectionCard, { id: "documents", icon: FileText, title: "C. Mandatory Documents", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 shadow-sm", children: [
                /* @__PURE__ */ jsx(Search$1, { size: 16, className: "text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "search",
                    value: query,
                    onChange: (e) => setQuery(e.target.value),
                    placeholder: "Search documents…",
                    className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                    "aria-label": "Search documents"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(DocGrid, { docs: filteredDocs })
            ] }),
            /* @__PURE__ */ jsx(SectionCard, { id: "safety", icon: ShieldCheck, title: "D. Safety Certificates", children: /* @__PURE__ */ jsx(DocGrid, { docs: documents.filter((d) => d.section === "safety") }) }),
            /* @__PURE__ */ jsx(SectionCard, { id: "faculty", icon: Users, title: "E. Faculty / Staff Details", children: /* @__PURE__ */ jsx(InfoTable, { rows: faculty }) }),
            /* @__PURE__ */ jsx(SectionCard, { id: "infrastructure", icon: Building2, title: "F. School Infrastructure", children: /* @__PURE__ */ jsx(InfoTable, { rows: infra }) }),
            /* @__PURE__ */ jsx(SectionCard, { id: "academics", icon: GraduationCap, title: "G. Academic Information", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              { label: "Medium of Instruction", value: "English" },
              { label: "Curriculum", value: "CBSE (Class I to XII)" },
              { label: "Streams Offered (XI–XII)", value: "Science, Commerce, Humanities" },
              { label: "Working Days per Week", value: "6 (Mon–Sat)" },
              { label: "Annual Academic Calendar", value: "Published every April" },
              { label: "Continuous Assessment", value: "As per CBSE guidelines" }
            ].map((r) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-xl border border-border bg-background/70 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md",
                children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: r.label }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold text-foreground", children: r.value })
                ]
              },
              r.label
            )) }) }),
            /* @__PURE__ */ jsx(SectionCard, { id: "contact", icon: Phone, title: "H. Contact Information", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(ContactCard, { icon: MapPin, title: "Address", value: "BHU Bypass Road, Narayanpur, Dafi, Susuwahi, Varanasi — 221011" }),
              /* @__PURE__ */ jsx(ContactCard, { icon: Phone, title: "Phone", value: "+91-9450536536", href: "tel:+919450536536" }),
              /* @__PURE__ */ jsx(ContactCard, { icon: Mail, title: "Email", value: "info@merrycityschool.in", href: "mailto:info@merrycityschool.in" }),
              /* @__PURE__ */ jsx(ContactCard, { icon: School2, title: "Principal", value: "Mr. Ashutosh Kumar Rai" })
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground", children: "Note: All documents above are made available as per CBSE Affiliation Bye-Laws. PDFs will open in a new tab. For any clarification, please contact the school office." })
          ] })
        ] }) })
      ]
    }
  );
};
const SectionCard = ({
  id,
  icon: Icon,
  title,
  children
}) => /* @__PURE__ */ jsx("section", { id, className: "scroll-mt-28", children: /* @__PURE__ */ jsxs("div", { className: "group rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-lg md:p-7", children: [
  /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center gap-3 border-b border-border pb-4", children: [
    /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))] shadow-md", children: /* @__PURE__ */ jsx(Icon, { size: 18 }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground md:text-2xl", children: title })
  ] }),
  children
] }) });
const InfoTable = ({ rows }) => /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border", children: /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxs(
  "tr",
  {
    className: `${i % 2 === 0 ? "bg-background" : "bg-muted/40"} transition-colors hover:bg-secondary/60`,
    children: [
      /* @__PURE__ */ jsx("th", { scope: "row", className: "w-1/2 border-b border-border px-4 py-3 text-left font-semibold text-foreground sm:w-2/5", children: r.label }),
      /* @__PURE__ */ jsx("td", { className: "border-b border-border px-4 py-3 text-foreground/90", children: r.value })
    ]
  },
  r.label
)) }) }) });
const DocGrid = ({ docs }) => {
  if (docs.length === 0) {
    return /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground", children: "No documents match your search." });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: docs.map((d) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: d.url ?? "#",
      target: d.url ? "_blank" : void 0,
      rel: "noreferrer",
      className: "group flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[hsl(var(--accent))] hover:shadow-md",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[hsl(var(--accent))]/15 text-[hsl(var(--primary))]", children: /* @__PURE__ */ jsx(FileText, { size: 18 }) }),
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-foreground", children: d.name })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-xs font-semibold text-[hsl(var(--primary-foreground))] transition-colors group-hover:bg-[hsl(var(--accent))] group-hover:text-[hsl(var(--accent-foreground))]", children: [
          /* @__PURE__ */ jsx(Download, { size: 14 }),
          " PDF"
        ] })
      ]
    },
    d.name
  )) });
};
const ContactCard = ({
  icon: Icon,
  title,
  value,
  href
}) => {
  const content = /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border bg-background/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md", children: [
    /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--accent))]", children: /* @__PURE__ */ jsx(Icon, { size: 18 }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm font-semibold text-foreground break-words", children: value })
    ] })
  ] });
  return href ? /* @__PURE__ */ jsx("a", { href, className: "block", children: content }) : content;
};
const qrImage = "/assets/fee-payment-qr-BESY-k2L.jpeg";
const UPI_ID = "9765773798.eazypay@icici";
const UPI_LINK = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
  "Merry City School & Hostel"
)}&cu=INR`;
const feeStructure = [
  { class: "Pre-Primary (Nursery – UKG)", tuition: "₹1,200 / month", admission: "₹3,500", annual: "₹2,500" },
  { class: "Primary (I – V)", tuition: "₹1,600 / month", admission: "₹4,000", annual: "₹3,000" },
  { class: "Middle (VI – VIII)", tuition: "₹2,000 / month", admission: "₹4,500", annual: "₹3,500" },
  { class: "Secondary (IX – X)", tuition: "₹2,400 / month", admission: "₹5,000", annual: "₹4,000" },
  { class: "Senior Secondary (XI – XII)", tuition: "₹2,800 / month", admission: "₹6,000", annual: "₹4,500" }
];
const FeePayment = () => {
  return /* @__PURE__ */ jsxs(
    PageLayout,
    {
      title: "Online Fee Payment",
      description: "Pay Merry City School & Hostel fees online via UPI, BHIM, Google Pay, iMobile Pay or CRED. Scan & Pay using the school's official ICICI Bank QR code.",
      keywords: "Merry City School fee payment, online school fees Varanasi, CBSE school fees, UPI fee payment, ICICI eazypay school",
      children: [
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-border bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-20 [background:radial-gradient(circle_at_15%_20%,hsl(var(--accent))_0,transparent_45%),radial-gradient(circle_at_85%_70%,hsl(var(--accent))_0,transparent_45%)]" }),
          /* @__PURE__ */ jsxs("div", { className: "container relative mx-auto px-4 py-14 md:py-20", children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 14, className: "text-[hsl(var(--accent))]" }),
              " Secure · Official ICICI Bank Channel"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-extrabold leading-tight md:text-5xl", children: "Online Fee Payment" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-sm text-[hsl(var(--primary-foreground))]/85 md:text-base", children: "Pay your child's school fees instantly using UPI, BHIM, Google Pay, iMobile Pay or CRED. Quick, contactless and 100% secure." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: UPI_LINK,
                  className: "inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-5 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))] shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl",
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { size: 18 }),
                    " Pay Fees Now"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `#qr`,
                  className: "inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20",
                  children: [
                    /* @__PURE__ */ jsx(QrCode, { size: 18 }),
                    " Scan QR Code"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("section", { id: "qr", className: "container mx-auto px-4 py-12 md:py-16 scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-[1fr,1.1fr] lg:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-full max-w-md", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-3 rounded-3xl bg-gradient-to-br from-[hsl(var(--accent))]/40 to-[hsl(var(--primary))]/30 blur-2xl" }),
            /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: qrImage,
                alt: "Merry City School & Hostel — ICICI Bank Scan & Pay QR Code (UPI: 9765773798.eazypay@icici)",
                className: "block h-auto w-full object-contain",
                loading: "eager",
                decoding: "async",
                fetchPriority: "high"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground md:text-3xl", children: "Scan & Pay — Official School QR" }),
            /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
              "Open any UPI app, scan the QR or pay directly to our verified UPI ID. Always verify that the payee name reads ",
              /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "M/S Merry City School Hostel" }),
              " before confirming."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "UPI ID" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 select-all text-lg font-bold text-foreground break-all", children: UPI_ID }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4", children: [
                { label: "BHIM UPI", icon: Smartphone },
                { label: "Google Pay", icon: Wallet },
                { label: "iMobile Pay", icon: Smartphone },
                { label: "CRED", icon: CreditCard }
              ].map((m) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground",
                  children: [
                    /* @__PURE__ */ jsx(m.icon, { size: 14, className: "text-[hsl(var(--accent))]" }),
                    m.label
                  ]
                },
                m.label
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: UPI_LINK,
                  className: "inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))] shadow-md transition-transform hover:-translate-y-0.5",
                  children: [
                    /* @__PURE__ */ jsx(CreditCard, { size: 16 }),
                    " Pay Fees Now"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: qrImage,
                  download: "merry-city-school-upi-qr.jpeg",
                  className: "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary",
                  children: [
                    /* @__PURE__ */ jsx(Download, { size: 16 }),
                    " Save QR"
                  ]
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "bg-[hsl(var(--section-alt))] py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-end justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-[hsl(var(--accent))]", children: "Transparency" }),
              /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold text-foreground md:text-3xl", children: "Fee Structure (2026–27)" })
            ] }),
            /* @__PURE__ */ jsx(Receipt, { className: "hidden h-10 w-10 text-[hsl(var(--accent))] sm:block" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]", children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Class" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Tuition Fee" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Admission Fee" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Annual Charges" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: feeStructure.map((row, i) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: `${i % 2 === 0 ? "bg-background" : "bg-muted/40"} transition-colors hover:bg-secondary/60`,
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: row.class }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-foreground/90", children: row.tuition }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-foreground/90", children: row.admission }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-foreground/90", children: row.annual })
                  ]
                },
                row.class
              )) })
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground", children: "* Indicative figures. Final amounts and concessions are confirmed by the school office at the time of admission." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "container mx-auto px-4 py-12 md:py-16", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]", children: /* @__PURE__ */ jsx(Banknote, { size: 18 }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: "Bank Account Details" })
            ] }),
            /* @__PURE__ */ jsx("dl", { className: "grid gap-3 text-sm", children: [
              { k: "Account Name", v: "M/S Merry City School Hostel" },
              { k: "Bank", v: "ICICI Bank" },
              { k: "UPI ID", v: UPI_ID },
              { k: "Branch", v: "Varanasi" },
              { k: "Mode", v: "UPI / NEFT / IMPS" }
            ].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 rounded-lg bg-background p-3 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: r.k }),
              /* @__PURE__ */ jsx("dd", { className: "font-semibold text-foreground break-all", children: r.v })
            ] }, r.k)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]", children: /* @__PURE__ */ jsx(AlertCircle, { size: 18 }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: "Important Instructions" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-sm text-foreground/90", children: [
              "Always verify the payee name as 'M/S Merry City School Hostel' before paying.",
              "Mention your child's full name, class & section in the payment remarks.",
              "Save the payment receipt / screenshot and share it with the school office.",
              "Fees are payable on or before the 10th of every month.",
              "For NEFT/IMPS or installments, please contact the accounts office.",
              "Do not share OTPs or bank details with anyone — the school will never ask for them."
            ].map((tip) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "mt-0.5 shrink-0 text-[hsl(var(--accent))]" }),
              /* @__PURE__ */ jsx("span", { children: tip })
            ] }, tip)) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("section", { className: "bg-[hsl(var(--primary))] py-12 text-[hsl(var(--primary-foreground))] md:py-16", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-[1.1fr,1fr] md:items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold md:text-3xl", children: "Need help with your fee payment?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xl text-sm text-[hsl(var(--primary-foreground))]/85 md:text-base", children: "Our accounts team is available Monday to Saturday, 9:00 AM – 3:00 PM. Reach out and we'll be happy to assist you." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "tel:+919765773798",
                  className: "inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-5 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))] shadow-lg transition-transform hover:-translate-y-0.5",
                  children: [
                    /* @__PURE__ */ jsx(Phone, { size: 16 }),
                    " Call Accounts Office"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "mailto:mcsvns@gmail.com",
                  className: "inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20",
                  children: [
                    /* @__PURE__ */ jsx(Mail, { size: 16 }),
                    " Email Support"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            { icon: Phone, label: "Phone", value: "+91-9765773798" },
            { icon: Mail, label: "Email", value: "mcsvns@gmail.com" },
            { icon: Banknote, label: "Bank", value: "ICICI Bank" },
            { icon: ShieldCheck, label: "Hours", value: "Mon–Sat, 9 AM – 3 PM" }
          ].map((c) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur transition-transform hover:-translate-y-0.5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]", children: [
                  /* @__PURE__ */ jsx(c.icon, { size: 14 }),
                  " ",
                  c.label
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-semibold break-words", children: c.value })
              ]
            },
            c.label
          )) })
        ] }) }) })
      ]
    }
  );
};
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-muted", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4 text-xl text-muted-foreground", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-primary underline hover:text-primary/90", children: "Return to Home" })
  ] }) });
};
const SideRibbons = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/careers",
        "aria-label": "Opportunities at Merry City School",
        className: "group fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 xl:flex",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-primary text-primary-foreground shadow-lg rounded-r-md overflow-hidden hover:pl-1 transition-all", children: [
          /* @__PURE__ */ jsx("div", { className: "px-1 py-3 bg-primary/80 group-hover:bg-primary", children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "px-2 py-4 font-bold tracking-wider text-xs",
              style: { writingMode: "vertical-rl", transform: "rotate(180deg)" },
              children: "OPPORTUNITIES @ MERRY CITY"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/admissions",
        "aria-label": "Admission Enquiry",
        className: "group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 xl:flex",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center shadow-lg rounded-l-md overflow-hidden hover:pr-1 transition-all",
            style: { backgroundColor: "hsl(var(--footer-gold))", color: "hsl(var(--footer-gold-foreground))" },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "px-2 py-4 font-bold tracking-wider text-xs",
                  style: { writingMode: "vertical-rl" },
                  children: "ADMISSION ENQUIRY"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "px-1 py-3 opacity-80 group-hover:opacity-100", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }) })
            ]
          }
        )
      }
    )
  ] });
};
const queryClient = new QueryClient();
const App = () => /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
  /* @__PURE__ */ jsx(SchoolSchema, {}),
  /* @__PURE__ */ jsx(WebsiteSchema, {}),
  /* @__PURE__ */ jsx(Toaster, {}),
  /* @__PURE__ */ jsx(Toaster$1, {}),
  /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/academics", element: /* @__PURE__ */ jsx(Academics, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admissions", element: /* @__PURE__ */ jsx(Admissions, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/facilities", element: /* @__PURE__ */ jsx(Facilities, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/affiliation", element: /* @__PURE__ */ jsx(Affiliation, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/gallery", element: /* @__PURE__ */ jsx(Gallery, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/live-classes", element: /* @__PURE__ */ jsx(LiveClasses, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/leadership", element: /* @__PURE__ */ jsx(Leadership, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/director", element: /* @__PURE__ */ jsx(Director, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/principal", element: /* @__PURE__ */ jsx(Principal, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/vice-principal", element: /* @__PURE__ */ jsx(VicePrincipal, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/foundation", element: /* @__PURE__ */ jsx(Foundation, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy-policy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terms-conditions", element: /* @__PURE__ */ jsx(TermsConditions, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(Login, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/profile", element: /* @__PURE__ */ jsx(Profile, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsx(ForgotPassword, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsx(ResetPassword, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/search", element: /* @__PURE__ */ jsx(Search, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/accessibility", element: /* @__PURE__ */ jsx(Accessibility, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/careers", element: /* @__PURE__ */ jsx(Careers, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(Admin, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin-panel", element: /* @__PURE__ */ jsx(AdminLocal, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cbse-mpd", element: /* @__PURE__ */ jsx(MandatoryDisclosure, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/fee-payment", element: /* @__PURE__ */ jsx(FeePayment, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
    ] }),
    /* @__PURE__ */ jsx(SideRibbons, {})
  ] }) })
] }) }) });
function ClientApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return /* @__PURE__ */ jsx(App, {});
}
export {
  ClientApp as C
};
