import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import RecommendIcon from "./icons/RecommendIcon.svg";
import { useHeaderStore } from "../../stores/headerStore";
import AllProductsSection from "./components/AllProductsSection";
import RecommendationsSection from "./components/RecommendationsSection";
import PreferenceEditorSheet from "./components/PreferenceEditorSheet";
import ComparePage from "./components/ComparePage";
import ProductDetailSheet from "./components/ProductDetailSheet";
import * as S from "./ProductStyle";

const FILTER_CONFIG = {
  bank: {
    key: "bank",
    label: "Bank",
    options: [
      { id: "sunny", label: "Sunny Bank" },
      { id: "greenTree", label: "GreenTree Bank" },
      { id: "deepBlue", label: "DeepBlue Bank" },
      { id: "sky", label: "SkyBank" },
      { id: "others", label: "Others" },
    ],
  },
  productType: {
    key: "productType",
    label: "Product Type",
    options: [
      { id: "card", label: "Card" },
      { id: "deposit", label: "Deposit" },
      { id: "installment", label: "Installment Savings" },
    ],
  },
  interest: {
    key: "interest",
    label: "Interest Rate",
    options: [
      { id: "upTo1", label: "Up to 1%", min: 0, max: 1 },
      { id: "1to3", label: "1% to 3%", min: 1, max: 3 },
      { id: "3to5", label: "3% to 5%", min: 3, max: 5 },
      { id: "5to7", label: "5% to 7%", min: 5, max: 7 },
      { id: "above7", label: "Above 7%", min: 7, max: Infinity },
    ],
  },
  period: {
    key: "period",
    label: "Period",
    options: [
      { id: "short", label: "Short-term (~1 year)" },
      { id: "mid", label: "Mid-term (~3 year)" },
      { id: "long", label: "Long-term (3+ year)" },
    ],
  },
};

const PRODUCT_CATALOG = [
  {
    id: "prod-1",
    bankId: "sunny",
    bankName: "Sunny Bank",
    name: "Savings Plus",
    type: "deposit",
    period: "short",
    interestRange: { min: 2.5, max: 4.5 },
    termLabel: "12-month",
    tags: ["Fixed deposit", "Auto renewal"],
    highlight: "4.5% APY",
    description:
      "Flexible deposit with competitive rates and auto-renewal. Ideal for short-term saving goals.",
    keyFeatures: "Flexible deposit amounts ideal for beginners, preferential rates when monthly goals are met, and optional automatic renewal.",
    detailSections: [
      {
        title: "Interest Rate",
        rows: [
          { label: "Base Rate", value: "2.5% APY" },
          { label: "Preferential Rate", value: "Up to 4.5% APY" },
        ],
      },
      {
        title: "Deposit Details",
        rows: [
          { label: "Deposit Term", value: "12 months" },
          { label: "Minimum Deposit", value: "₩100,000" },
          { label: "Monthly Limit", value: "₩500,000" },
        ],
      },
      {
        title: "Eligibility",
        rows: [
          { label: "Age", value: "18+ years" },
          { label: "Documents", value: "Valid ID, Proof of residence" },
        ],
      },
    ],
    heroNote: "Consistent rate boosts when you complete monthly savings goals.",
    website: "https://sunnybank.com",
  },
  {
    id: "prod-2",
    bankId: "greenTree",
    bankName: "GreenTree Bank",
    name: "Flexible Plus",
    type: "installment",
    period: "mid",
    interestRange: { min: 3.6, max: 5.8 },
    termLabel: "24-month",
    tags: ["Installment", "Goal tracker"],
    highlight: "5.8% APY",
    description:
      "Automated installment savings account designed to help you reach medium-term financial goals.",
    keyFeatures: "Bonus interest rewards consistent contributions, in-app goal tracking with reminders, and a flexible skip-one-month benefit twice a year.",
    detailSections: [
      {
        title: "Interest Rate",
        rows: [
          { label: "Base Rate", value: "3.6% APY" },
          { label: "Maximum Rate", value: "Up to 5.8% APY" },
        ],
      },
      {
        title: "Saving Details",
        rows: [
          { label: "Saving Term", value: "24 months" },
          { label: "Monthly Limit", value: "₩1,000,000" },
        ],
      },
      {
        title: "Eligibility",
        rows: [
          { label: "Income", value: "Any (proof required)" },
          { label: "Documents", value: "Valid ID, Employment certificate" },
        ],
      },
    ],
    heroNote: "Keep your streak to unlock the top tier interest rate every quarter.",
    website: "https://greentreebank.com",
  },
  {
    id: "prod-3",
    bankId: "deepBlue",
    bankName: "DeepBlue Bank",
    name: "Dream Big Savings",
    type: "deposit",
    period: "mid",
    interestRange: { min: 2.8, max: 4.8 },
    termLabel: "18-month",
    tags: ["Bonus interest", "Travel saver"],
    highlight: "4.8% APY",
    description:
      "Designed for long-term savers, with quarterly bonuses and travel perks for loyal customers.",
    keyFeatures: "Earn travel mileage for every ₩300,000 saved, unlock quarterly booster rates when deposits grow, and enjoy penalty-free partial withdrawals twice annually.",
    detailSections: [
      {
        title: "Interest Rate",
        rows: [
          { label: "Base Rate", value: "2.8% APY" },
          { label: "Bonus Rate", value: "Up to 4.8% APY" },
        ],
      },
      {
        title: "Deposit Details",
        rows: [
          { label: "Deposit Term", value: "18 months" },
          { label: "Minimum Deposit", value: "₩300,000" },
          { label: "Partial Withdrawal", value: "Up to twice / year" },
        ],
      },
      {
        title: "Benefits",
        rows: [
          { label: "Travel Miles", value: "Earn 200 miles / ₩300,000" },
          { label: "Loyalty Perks", value: "Upgrade to Premium service desk" },
        ],
      },
    ],
    heroNote: "Save for your next adventure and unlock travel perks along the way.",
    website: "https://deepbluebank.com",
  },
  {
    id: "prod-4",
    bankId: "sunny",
    bankName: "Sunny Bank",
    name: "Travel Plus Card",
    type: "card",
    period: "short",
    interestRange: { min: 0, max: 0 },
    termLabel: "Revolving",
    tags: ["Travel perks", "Cashback"],
    highlight: "No annual fee (Year 1)",
    description:
      "Earn rewards on travel bookings and dining world-wide. Includes lounge access vouchers every quarter.",
    keyFeatures: "Earn 3% cashback on overseas spend, receive two complimentary lounge visits per year, and stay protected with travel insurance up to ₩100,000,000.",
    detailSections: [
      {
        title: "Annual Fee",
        rows: [
          { label: "Domestic", value: "₩15,000" },
          { label: "International", value: "₩25,000" },
        ],
      },
      {
        title: "Travel Benefits",
        rows: [
          { label: "Lounge Access", value: "2 visits / year" },
          { label: "Travel Insurance", value: "Up to ₩100,000,000" },
          { label: "Airline Partners", value: "5 global alliances" },
        ],
      },
      {
        title: "Rewards",
        rows: [
          { label: "Overseas Spend", value: "3% cashback" },
          { label: "Domestic Dining", value: "2% cashback" },
          { label: "Other Spend", value: "0.8% cashback" },
        ],
      },
    ],
    heroNote: "Perfect for frequent flyers looking for lounge comfort and strong cashback.",
    website: "https://sunnybank.com/travel-plus",
  },
  {
    id: "prod-5",
    bankId: "sky",
    bankName: "SkyBank",
    name: "Future Builder",
    type: "installment",
    period: "long",
    interestRange: { min: 4.1, max: 6.9 },
    termLabel: "36-month",
    tags: ["Long-term", "Goal based"],
    highlight: "6.9% APY",
    description:
      "Long-term installment savings with flexible pause options and milestone bonus payouts.",
    keyFeatures: "Receive milestone bonuses every six months, pause contributions up to three months without losing your base rate, and stay motivated with an integrated goal tracker.",
    detailSections: [
      {
        title: "Interest Rate",
        rows: [
          { label: "Base Rate", value: "4.1% APY" },
          { label: "Maximum Rate", value: "Up to 6.9% APY" },
        ],
      },
      {
        title: "Saving Details",
        rows: [
          { label: "Saving Term", value: "36 months" },
          { label: "Monthly Deposit", value: "₩300,000 – ₩1,500,000" },
        ],
      },
      {
        title: "Milestone Bonus",
        rows: [
          { label: "6 Months", value: "₩20,000 bonus" },
          { label: "12 Months", value: "₩50,000 bonus" },
          { label: "24 Months", value: "₩80,000 bonus" },
        ],
      },
    ],
    heroNote: "Stay on track toward big goals with milestone bonuses and pause flexibility.",
    website: "https://skybank.com/future-builder",
  },
  {
    id: "prod-6",
    bankId: "others",
    bankName: "Global Finance",
    name: "Cashback Platinum",
    type: "card",
    period: "short",
    interestRange: { min: 0, max: 0 },
    termLabel: "Revolving",
    tags: ["Premium", "Rewards"],
    highlight: "5% cashback",
    description:
      "Premium credit card that rewards lifestyle spending with airport lounge passes and concierge services.",
    keyFeatures: "Get 5% cashback on rotating lifestyle categories, unlock unlimited lounge access with qualifying spend, and rely on dedicated concierge support with purchase protection.",
    detailSections: [
      {
        title: "Annual Fee",
        rows: [
          { label: "Domestic", value: "₩40,000" },
          { label: "International", value: "₩55,000" },
        ],
      },
      {
        title: "Lifestyle Rewards",
        rows: [
          { label: "Dining", value: "5% cashback" },
          { label: "Cafes", value: "5% cashback" },
          { label: "Groceries", value: "3% cashback" },
        ],
      },
      {
        title: "Protection",
        rows: [
          { label: "Purchase Protection", value: "Up to ₩3,000,000 per claim" },
          { label: "Extended Warranty", value: "+12 months" },
        ],
      },
    ],
    heroNote: "Maximize your lifestyle rewards with rotating 5% categories and premium perks.",
    website: "https://globalfinance.com/cashback-platinum",
  },
];

const RECOMMENDED_MOCK = [
  { id: "rec-1", productId: "prod-1", bankName: "Sunny Bank", name: "Low-Fee Credit Card", description: "Enjoy 0% APR for 12 months and no annual fee.", action: "Learn More" },
  { id: "rec-2", productId: "prod-2", bankName: "DeepBlue Bank", name: "Flexible Savings Account", description: "Boost your savings with flexible monthly targets.", action: "Learn More" },
  { id: "rec-3", productId: "prod-3", bankName: "SkyBank", name: "Travel Rewards Card", description: "2x miles on every purchase, plus lounge access.", action: "Learn More" },
];

const INITIAL_FILTERS = {
  bank: null,
  productType: null,
  interest: null,
  period: null,
};

const FILTER_SEQUENCE = ["bank", "productType", "interest", "period"];

const matchesProductFilters = (product, activeFilters) => {
  const matchBank = !activeFilters.bank || product.bankId === activeFilters.bank;
  const matchType = !activeFilters.productType || product.type === activeFilters.productType;
  const matchPeriod = !activeFilters.period || product.period === activeFilters.period;

  let matchInterest = true;
  if (activeFilters.interest) {
    const option = FILTER_CONFIG.interest.options.find((opt) => opt.id === activeFilters.interest);
    if (option) {
      const midValue = product.interestRange.max || product.interestRange.min;
      matchInterest = midValue >= option.min && midValue <= option.max;
    }
  }

  return matchBank && matchType && matchPeriod && matchInterest;
};

const EMPTY_PREFERENCES = {
  productTypes: [],
  savingsPeriods: [],
  savingsPurpose: "",
  cardPurpose: "",
  incomeLevel: "",
  preferredBank: "",
  savingsPeriod: "",
};

export default function Product() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);

  const isCompareRoute = productId === "compare";
  const detailProduct = !isCompareRoute && productId ? PRODUCT_CATALOG.find((item) => item.id === productId) : null;
  const isDetailRoute = Boolean(productId && detailProduct);

  useEffect(() => {
    if (productId && !detailProduct && !isCompareRoute) {
      navigate("/product", { replace: true });
    }
  }, [productId, detailProduct, isCompareRoute, navigate]);

  useEffect(() => {
    if (isCompareRoute) {
      setHeaderConfig({
        title: "Compare",
        showBackBtn: true,
        showSettingBtn: false,
      });
      return;
    }

    setHeaderConfig({
      title: t("nav.product"),
      showBackBtn: Boolean(productId),
      showSettingBtn: true,
    });
  }, [setHeaderConfig, i18n.language, isCompareRoute, productId, t]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [compareFilters, setCompareFilters] = useState(INITIAL_FILTERS);
  const [compareStage, setCompareStage] = useState("select");
  const [compareSelection, setCompareSelection] = useState([]);
  const [compareBaseType, setCompareBaseType] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [floatingNotice, setFloatingNotice] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aiPreferences, setAiPreferences] = useState(() => ({ ...EMPTY_PREFERENCES }));
  const [isPreferenceSheetOpen, setPreferenceSheetOpen] = useState(false);

  const matchesFilterChips = useCallback((product) => matchesProductFilters(product, filters), [filters]);
  const matchesCompareFilterChips = useCallback(
    (product) => matchesProductFilters(product, compareFilters),
    [compareFilters]
  );

  useEffect(() => {
    if (!isCompareRoute) {
      setCompareStage("select");
      setCompareSelection([]);
      setCompareBaseType(null);
      return;
    }

    setCompareSelection((prev) => {
      const next = prev.filter(
        (item) => savedProducts.some((saved) => saved.id === item.id) && matchesCompareFilterChips(item)
      );
      if (next.length === prev.length) {
        return prev;
      }
      if (next.length === 0) {
        setCompareBaseType(null);
        setCompareStage("select");
      }
      return next;
    });
  }, [isCompareRoute, savedProducts, matchesCompareFilterChips]);

  useEffect(() => {
    if (!floatingNotice) return;
    const timer = setTimeout(() => setFloatingNotice(null), 2400);
    return () => clearTimeout(timer);
  }, [floatingNotice]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCT_CATALOG.filter((product) => {
      const matchSearch =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.bankName.toLowerCase().includes(term);

      return matchSearch && matchesFilterChips(product);
    });
  }, [searchTerm, matchesFilterChips]);

  const compareFilteredSavedProducts = useMemo(
    () => savedProducts.filter((product) => matchesCompareFilterChips(product)),
    [savedProducts, matchesCompareFilterChips]
  );

  const aiRecommendations = useMemo(() => RECOMMENDED_MOCK, []);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value !== null),
    [filters]
  );

  const getFilterLabelFor = useCallback((active, key) => {
    const config = FILTER_CONFIG[key];
    if (!config) return "";
    const value = active[key];
    if (!value) return config.label;
    const option = config.options.find((opt) => opt.id === value);
    return option ? option.label : config.label;
  }, []);

  const getFilterLabel = useCallback((key) => getFilterLabelFor(filters, key), [filters, getFilterLabelFor]);
  const getCompareFilterLabel = useCallback(
    (key) => getFilterLabelFor(compareFilters, key),
    [compareFilters, getFilterLabelFor]
  );

  const handleFilterSelect = (key, optionId) => {
    setFilters((prev) => ({ ...prev, [key]: optionId }));
  };

  const handleFilterReset = (key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleResetAllFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
  };

  const handleCompareFilterSelect = (key, optionId) => {
    setCompareFilters((prev) => ({ ...prev, [key]: optionId }));
  };

  const handleCompareFilterReset = (key) => {
    setCompareFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleNavigateToDetail = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAiPrompt = () => {
    setSelectedTab("ai");
  };

  const handleCompareToggle = () => {
    if (savedProducts.length === 0) {
    }
    setCompareStage("select");
    navigate("/product/compare");
  };

  const handleCompareClose = () => {
    setCompareStage("select");
    setCompareSelection([]);
    setCompareBaseType(null);
    navigate("/product");
  };

  const handleSelectForCompare = (product) => {
    if (!savedProducts.some((item) => item.id === product.id)) {
      setFloatingNotice("Add the product to your list first.");
      return;
    }

    setCompareSelection((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        const next = prev.filter((item) => item.id !== product.id);
        if (next.length === 0) {
          setCompareBaseType(null);
          setCompareStage("select");
        }
        return next;
      }

      if (prev.length >= 2) {
        setFloatingNotice("You can compare 2 products at a time.");
        return prev;
      }

      const effectiveBase = compareBaseType ?? prev[0]?.type ?? null;
      if (effectiveBase && effectiveBase !== product.type) {
        setFloatingNotice("Comparisons are only valid between financial products of the same type.");
        return prev;
      }

      if (compareStage === "result") {
        setCompareStage("select");
      }

      const next = [...prev, product];
      if (!compareBaseType) {
        setCompareBaseType(product.type);
      }
      return next;
    });
  };

  const handleCompareProceed = () => {
    if (compareSelection.length !== 2) {
      setFloatingNotice("Select two products to compare.");
      return;
    }
    setCompareStage("result");
  };

  const handleCompareBackToSelect = () => {
    setCompareStage("select");
  };

  const handleAddToList = (product) => {
    if (!product) return;

    setSavedProducts((prev) => {
      const alreadySaved = prev.some((item) => item.id === product.id);
      if (alreadySaved) {
        setFloatingNotice("Already in your list.");
        return prev;
      }
      setFloatingNotice("Added to your list.");
      return [...prev, product];
    });
  };

  const handleLoginRequest = () => {
    setIsLoggedIn(true);
  };

  const handleEditPreferences = () => {
    setPreferenceSheetOpen(true);
  };

  const handlePreferenceSave = (updated) => {
    const merged = {
      ...EMPTY_PREFERENCES,
      ...(updated ?? {}),
    };
    merged.savingsPeriods = Array.isArray(merged.savingsPeriods) ? merged.savingsPeriods : [];
    merged.savingsPeriod = merged.savingsPeriods[0] || merged.savingsPeriod || "";

    setAiPreferences(merged);
    setPreferenceSheetOpen(false);
  };

  const handleSelectRecommendation = (item) => {
    if (!item) return;
    const targetId = item.productId || item.id;
    const target = PRODUCT_CATALOG.find((product) => product.id === targetId);
    if (target) {
      navigate(`/product/${target.id}`);
    } else {
      setFloatingNotice("Product detail will be available soon.");
    }
  };

  const handleVisitWebsite = (url) => {
    if (!url) {
      setFloatingNotice("Coming soon!");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <S.Container>
        {isCompareRoute ? (
          <ComparePage
            stage={compareStage}
            products={compareFilteredSavedProducts}
            selection={compareSelection}
            baseType={compareBaseType}
            filters={compareFilters}
            filterConfig={FILTER_CONFIG}
            filterOrder={FILTER_SEQUENCE}
            getFilterLabel={getCompareFilterLabel}
            onFilterSelect={handleCompareFilterSelect}
            onFilterReset={handleCompareFilterReset}
            onToggleSelect={handleSelectForCompare}
            onProceed={handleCompareProceed}
            onBackToSelect={handleCompareBackToSelect}
            onClose={handleCompareClose}
            onVisitWebsite={handleVisitWebsite}
          />
        ) : isDetailRoute ? (
          <ProductDetailSheet
            product={detailProduct}
            onVisitWebsite={handleVisitWebsite}
            onAddToList={handleAddToList}
          />
        ) : (
          <S.Content>
            <S.SearchBar>
              <S.SearchInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
              />
              <S.SearchIcon>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                    stroke="url(#gradient)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 17.5L13.875 13.875"
                    stroke="url(#gradient)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="2.5" y1="2.5" x2="18" y2="17.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#009CEA" />
                    </linearGradient>
                  </defs>
                </svg>
              </S.SearchIcon>
            </S.SearchBar>

            <S.TabList>
              <S.TabButton $active={selectedTab === "all"} onClick={() => setSelectedTab("all")}>
                All Products
              </S.TabButton>
              <S.TabButton $active={selectedTab === "ai"} onClick={() => setSelectedTab("ai")}>
                AI Recommended
              </S.TabButton>
            </S.TabList>

            {selectedTab === "all" && (
              <S.AiPromptButton type="button" onClick={handleAiPrompt}>
                <S.AiPromptIcon>
                  <img src={RecommendIcon} alt="" width={24} height={24} />
                </S.AiPromptIcon>
                Ask AI to recommend a product
              </S.AiPromptButton>
            )}

            {selectedTab === "all" ? (
              <AllProductsSection
                filterConfig={FILTER_CONFIG}
                filterOrder={FILTER_SEQUENCE}
                filters={filters}
                getFilterLabel={getFilterLabel}
                onFilterSelect={handleFilterSelect}
                onFilterReset={handleFilterReset}
                hasActiveFilters={hasActiveFilters}
                onResetAllFilters={handleResetAllFilters}
                products={filteredProducts}
                onProductClick={handleNavigateToDetail}
                onCompareToggle={handleCompareToggle}
              />
            ) : (
              <RecommendationsSection
                isLoggedIn={isLoggedIn}
                preferences={aiPreferences}
                recommendations={aiRecommendations}
                onEditPreferences={handleEditPreferences}
                onSelectRecommendation={handleSelectRecommendation}
                onLogin={handleLoginRequest}
              />
            )}
          </S.Content>
        )}
      </S.Container>

      <Navigation />

      <PreferenceEditorSheet
        isOpen={isPreferenceSheetOpen}
        initialValues={aiPreferences}
        onClose={() => setPreferenceSheetOpen(false)}
        onSave={handlePreferenceSave}
      />

      {floatingNotice && <S.FloatingNotice>{floatingNotice}</S.FloatingNotice>}
    </>
  );
}
