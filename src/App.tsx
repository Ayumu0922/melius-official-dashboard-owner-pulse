import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Filter,
  Home,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeft,
  ReceiptText,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  AppShell,
  Badge,
  BrandMark,
  CardSurface,
  GhostButton,
  IconButton,
  MobileDrawer,
  Overlay,
  PanelSurface,
  PrimaryButton,
  ProgressBar,
  RowButton,
  SearchInput,
  SecondaryButton,
  SidebarHeader,
  SidebarShell,
  StrongBadge,
  TabButton,
  WorkspaceFrame,
  WorkspaceHeader,
} from './components/ui';

type Language = 'ja' | 'en';
type ThemeMode = 'light' | 'dark' | 'system';
type TabId = 'overview' | 'revenue' | 'cashflow' | 'expenses' | 'insights';
type Tone = 'green' | 'amber' | 'red' | 'zinc' | 'stone';
type PanelPresentation = 'inspector' | 'modal';
type RevenueFilter = 'all' | 'services' | 'customers';
type CashflowWindow = '30' | '60' | '90';
type ExpenseFilter = 'all' | 'fixed' | 'variable';

type DetailPanel = {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  tone: Tone;
  meta: Array<{ label: string; value: string }>;
  progress?: number;
  progressLabel?: string;
  primaryLabel: string;
  secondaryLabel: string;
  presentation?: PanelPresentation;
};

type NoticeState = {
  id: number;
  title: string;
  body?: string;
};

const TEMPLATE_ID = 'official-dashboard-owner-pulse';
const THEME_STORAGE_KEY = 'melius-official-dashboard-owner-pulse-theme';
const LANGUAGE_STORAGE_KEY = 'melius-official-dashboard-owner-pulse-language';

const COPY = {
  en: {
    metaTitle: 'Owner Pulse Management Dashboard',
    appName: 'Owner Pulse',
    appSubtitle: 'Management Dashboard',
    search: 'Search customers, invoices...',
    searchLabel: 'Search dashboard records',
    openSidebar: 'Open navigation',
    closeSidebar: 'Close navigation',
    collapseSidebar: 'Toggle sidebar',
    export: 'Export',
    morningReview: 'Morning Review',
    notifications: 'Alerts',
    userName: 'Owner Desk',
    plan: 'Solo',
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      label: 'Language',
      ja: 'JA',
      en: 'EN',
    },
    tabs: {
      overview: 'Overview',
      revenue: 'Revenue',
      cashflow: 'Cashflow',
      expenses: 'Expenses',
      insights: 'Insights',
    },
    sidebar: {
      overview: { title: 'Overview', children: ['Today', 'Monthly KPIs', 'Alerts'] },
      revenue: { title: 'Revenue', badge: '4', children: ['Trend', 'Services', 'Customers'] },
      cashflow: { title: 'Cashflow', badge: '2', children: ['Incoming', 'Payments', 'Runway'] },
      expenses: { title: 'Expenses', children: ['Categories', 'Fixed costs', 'Variable costs'] },
      insights: { title: 'Insights', children: ['Reasons', 'Suggestions', 'Next actions'] },
      settings: 'Settings',
    },
    headers: {
      overview: {
        badge: 'Updated 08:10',
        title: 'Daily owner briefing',
        body: 'Revenue, profit, cash, incoming payments, expenses, and missed follow-ups for the current month.',
        primary: 'Review alerts',
        secondary: 'Update forecast',
      },
      revenue: {
        badge: 'This month',
        title: 'Revenue movement',
        body: 'Track monthly revenue, service mix, and customer concentration before weekly decisions.',
        primary: 'Open revenue plan',
        secondary: 'Filter segments',
      },
      cashflow: {
        badge: '90-day view',
        title: 'Cash runway control',
        body: 'See expected deposits, scheduled payments, and shortfall risk before cash gets tight.',
        primary: 'Review runway',
        secondary: 'Adjust window',
      },
      expenses: {
        badge: 'Cost review',
        title: 'Expense pressure',
        body: 'Separate fixed costs, variable costs, and upcoming payments so budget decisions are clear.',
        primary: 'Review payments',
        secondary: 'Filter costs',
      },
      insights: {
        badge: 'Decision notes',
        title: 'Reasons and next moves',
        body: 'Summarize what changed, what to improve, and the next actions to protect month-end cash.',
        primary: 'Open action list',
        secondary: 'Refresh forecast',
      },
    },
    sections: {
      kpis: 'Key metrics',
      alerts: 'Attention alerts',
      nextActions: 'Next actions',
      cashSnapshot: 'Cash snapshot',
      revenueTrend: 'Revenue trend',
      serviceRevenue: 'Service revenue',
      customerRevenue: 'Customer revenue',
      incoming: 'Incoming schedule',
      outgoing: 'Payment schedule',
      runway: 'Shortfall forecast',
      expenseCategories: 'Expense categories',
      fixedCosts: 'Fixed costs',
      variableCosts: 'Variable costs',
      paymentQueue: 'Payment queue',
      drivers: 'What changed',
      recommendations: 'Improvement ideas',
      outlook: 'This month outlook',
      todos: 'What to do next',
    },
    actions: {
      open: 'Open',
      review: 'Review',
      acknowledge: 'Acknowledge',
      markDone: 'Mark done',
      undo: 'Undo',
      viewAll: 'View all',
      filter: 'Filter',
      sort: 'Sort',
      exportCsv: 'Export CSV',
      reconcile: 'Reconcile',
      sendReminder: 'Send reminder',
      schedule: 'Schedule',
      compare: 'Compare',
    },
    filters: {
      all: 'All',
      services: 'Services',
      customers: 'Customers',
      fixed: 'Fixed',
      variable: 'Variable',
      days30: '30 days',
      days60: '60 days',
      days90: '90 days',
    },
    labels: {
      owner: 'Owner',
      status: 'Status',
      amount: 'Amount',
      due: 'Due',
      customer: 'Customer',
      category: 'Category',
      margin: 'Margin',
      share: 'Share',
      change: 'Change',
      confidence: 'Confidence',
      impact: 'Impact',
      runway: 'Runway',
      expected: 'Expected',
      paid: 'Paid',
      pending: 'Pending',
      risk: 'Risk',
      stable: 'Stable',
      watch: 'Watch',
      urgent: 'Urgent',
      complete: 'Complete',
      incomplete: 'Open',
    },
    emptySearch: 'No matching rows for the current search.',
  },
  ja: {
    metaTitle: 'Owner Pulse 経営ダッシュボード',
    appName: 'Owner Pulse',
    appSubtitle: '経営ダッシュボード',
    search: '顧客・請求・支払いを検索...',
    searchLabel: '経営ダッシュボード内を検索',
    openSidebar: 'ナビゲーションを開く',
    closeSidebar: 'ナビゲーションを閉じる',
    collapseSidebar: 'サイドバーを切り替え',
    export: '書き出し',
    morningReview: '朝の確認',
    notifications: 'アラート',
    userName: 'Owner Desk',
    plan: 'Solo',
    theme: {
      label: '表示テーマ',
      light: 'ライト',
      dark: 'ダーク',
      system: '自動',
    },
    language: {
      label: '言語',
      ja: 'JA',
      en: 'EN',
    },
    tabs: {
      overview: 'Overview',
      revenue: 'Revenue',
      cashflow: 'Cashflow',
      expenses: 'Expenses',
      insights: 'Insights',
    },
    sidebar: {
      overview: { title: 'Overview', children: ['今日', '月次KPI', 'アラート'] },
      revenue: { title: 'Revenue', badge: '4', children: ['推移', 'サービス別', '顧客別'] },
      cashflow: { title: 'Cashflow', badge: '2', children: ['入金予定', '支払い予定', '資金繰り'] },
      expenses: { title: 'Expenses', children: ['カテゴリ', '固定費', '変動費'] },
      insights: { title: 'Insights', children: ['変化理由', '改善提案', '次の行動'] },
      settings: '設定',
    },
    headers: {
      overview: {
        badge: '08:10 更新',
        title: '毎朝の経営確認',
        body: '今月の売上、利益、キャッシュ、入金予定、支出、対応漏れを一画面で確認します。',
        primary: 'アラート確認',
        secondary: '見込み更新',
      },
      revenue: {
        badge: '今月',
        title: '売上の動き',
        body: '月次売上、サービス別構成、顧客集中度を週次判断の前に確認します。',
        primary: '売上計画を見る',
        secondary: 'セグメント絞込',
      },
      cashflow: {
        badge: '90日表示',
        title: '資金繰り管理',
        body: '入金予定、支払い予定、資金ショートの兆候を、厳しくなる前に把握します。',
        primary: '資金繰り確認',
        secondary: '期間を変更',
      },
      expenses: {
        badge: 'コスト確認',
        title: '支出の圧力',
        body: '固定費、変動費、支払い予定を分け、予算判断に必要な情報へ絞ります。',
        primary: '支払い確認',
        secondary: '経費絞込',
      },
      insights: {
        badge: '判断メモ',
        title: '理由と次の一手',
        body: '何が変わったか、何を改善するか、月末キャッシュを守る次の行動を整理します。',
        primary: '行動リストを開く',
        secondary: '見込み更新',
      },
    },
    sections: {
      kpis: '重要KPI',
      alerts: '注意アラート',
      nextActions: '次のアクション',
      cashSnapshot: 'キャッシュ状況',
      revenueTrend: '売上推移',
      serviceRevenue: '商品/サービス別売上',
      customerRevenue: '顧客別売上',
      incoming: '入金予定',
      outgoing: '支払い予定',
      runway: '資金ショート予測',
      expenseCategories: '経費カテゴリ',
      fixedCosts: '固定費',
      variableCosts: '変動費',
      paymentQueue: '支払い予定',
      drivers: '売上変化の理由',
      recommendations: '改善提案',
      outlook: '今月の見込み',
      todos: '次にやること',
    },
    actions: {
      open: '開く',
      review: '確認',
      acknowledge: '確認済みにする',
      markDone: '完了にする',
      undo: '戻す',
      viewAll: 'すべて見る',
      filter: '絞り込み',
      sort: '並び替え',
      exportCsv: 'CSV出力',
      reconcile: '照合',
      sendReminder: '催促',
      schedule: '予定化',
      compare: '比較',
    },
    filters: {
      all: 'すべて',
      services: 'サービス',
      customers: '顧客',
      fixed: '固定費',
      variable: '変動費',
      days30: '30日',
      days60: '60日',
      days90: '90日',
    },
    labels: {
      owner: '担当',
      status: '状態',
      amount: '金額',
      due: '期限',
      customer: '顧客',
      category: 'カテゴリ',
      margin: '粗利',
      share: '構成比',
      change: '変化',
      confidence: '確度',
      impact: '影響',
      runway: '残日数',
      expected: '見込み',
      paid: '支払済',
      pending: '未処理',
      risk: 'リスク',
      stable: '安定',
      watch: '注意',
      urgent: '至急',
      complete: '完了',
      incomplete: '未完了',
    },
    emptySearch: '現在の検索に一致する行はありません。',
  },
} as const;

type AppCopy = (typeof COPY)[Language];

const tabs: TabId[] = ['overview', 'revenue', 'cashflow', 'expenses', 'insights'];

const sidebarItems: Array<{
  id: TabId;
  icon: LucideIcon;
  hasChildren?: boolean;
}> = [
  { id: 'overview', icon: LayoutDashboard, hasChildren: true },
  { id: 'revenue', icon: TrendingUp, hasChildren: true },
  { id: 'cashflow', icon: Wallet, hasChildren: true },
  { id: 'expenses', icon: ReceiptText, hasChildren: true },
  { id: 'insights', icon: Lightbulb, hasChildren: true },
];

const kpis: Array<{
  id: string;
  label: Record<Language, string>;
  value: Record<Language, string>;
  change: string;
  trend: 'up' | 'down' | 'flat';
  tone: Tone;
  icon: LucideIcon;
  detail: Record<Language, string>;
}> = [
  {
    id: 'monthly-revenue',
    label: { en: 'Month revenue', ja: '今月売上' },
    value: { en: '$128.4K', ja: '1,284万円' },
    change: '+12.8%',
    trend: 'up',
    tone: 'green',
    icon: CircleDollarSign,
    detail: { en: 'Retainers and implementation work lifted monthly revenue above plan.', ja: '月額契約と導入支援が伸び、今月売上は計画を上回っています。' },
  },
  {
    id: 'operating-profit',
    label: { en: 'Profit estimate', ja: '利益見込み' },
    value: { en: '$34.7K', ja: '347万円' },
    change: '+6.4%',
    trend: 'up',
    tone: 'green',
    icon: TrendingUp,
    detail: { en: 'Profit remains healthy, but outsourcing costs are moving up.', ja: '利益は良好ですが、外注費の上振れに注意が必要です。' },
  },
  {
    id: 'incoming-payments',
    label: { en: 'Incoming payments', ja: '入金予定' },
    value: { en: '$42.8K', ja: '428万円' },
    change: '8 due',
    trend: 'flat',
    tone: 'amber',
    icon: CalendarClock,
    detail: { en: 'Eight invoices are due within 14 days, including two reminder candidates.', ja: '14日以内に8件の入金予定があり、うち2件は催促候補です。' },
  },
  {
    id: 'monthly-expenses',
    label: { en: 'Expenses booked', ja: '支出予定' },
    value: { en: '$71.2K', ja: '712万円' },
    change: '+9.1%',
    trend: 'down',
    tone: 'amber',
    icon: CreditCard,
    detail: { en: 'Ad testing and subcontractor payments are the biggest cost drivers.', ja: '広告テストと外注支払いが支出増の主因です。' },
  },
  {
    id: 'cash-balance',
    label: { en: 'Cash balance', ja: 'キャッシュ残高' },
    value: { en: '$186.0K', ja: '1,860万円' },
    change: '74 days',
    trend: 'flat',
    tone: 'stone',
    icon: Landmark,
    detail: { en: 'Current cash covers 74 days at the present monthly burn.', ja: '現在の支出ペースでは約74日分の運転資金があります。' },
  },
  {
    id: 'open-followups',
    label: { en: 'Open follow-ups', ja: '対応漏れ' },
    value: { en: '5', ja: '5件' },
    change: '2 urgent',
    trend: 'down',
    tone: 'red',
    icon: ShieldAlert,
    detail: { en: 'Two overdue follow-ups can affect cash collection this week.', ja: '期限超過の2件は今週の入金回収に影響する可能性があります。' },
  },
];

const alerts: Array<{
  id: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  due: Record<Language, string>;
  tone: Tone;
  amount: Record<Language, string>;
  icon: LucideIcon;
}> = [
  {
    id: 'late-invoice-sola',
    title: { en: 'Invoice reminder needed', ja: '入金催促が必要' },
    body: { en: 'Sola Works invoice is three days past due.', ja: 'Sola Works向け請求が3日遅れています。' },
    due: { en: 'Today', ja: '本日' },
    tone: 'red',
    amount: { en: '$8,400', ja: '84万円' },
    icon: AlertTriangle,
  },
  {
    id: 'subcontractor-spike',
    title: { en: 'Subcontractor cost spike', ja: '外注費の上振れ' },
    body: { en: 'Implementation support is 18% above the monthly budget.', ja: '導入支援の外注費が月次予算を18%上回っています。' },
    due: { en: 'This week', ja: '今週' },
    tone: 'amber',
    amount: { en: '$12,900', ja: '129万円' },
    icon: TrendingDown,
  },
  {
    id: 'tax-reserve',
    title: { en: 'Tax reserve review', ja: '納税資金の確認' },
    body: { en: 'Reserve account is slightly below the recommended target.', ja: '納税準備口座が推奨額を少し下回っています。' },
    due: { en: 'May 28', ja: '5月28日' },
    tone: 'amber',
    amount: { en: '$5,200', ja: '52万円' },
    icon: Landmark,
  },
];

const nextActions: Array<{
  id: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  owner: string;
  due: Record<Language, string>;
  tone: Tone;
}> = [
  {
    id: 'send-payment-reminder',
    title: { en: 'Send two payment reminders', ja: '入金催促を2件送る' },
    body: { en: 'Prioritize overdue invoices before 11:00.', ja: '11時までに期限超過の請求を優先して対応します。' },
    owner: 'Owner',
    due: { en: 'Today 11:00', ja: '本日 11:00' },
    tone: 'red',
  },
  {
    id: 'pause-low-margin-ad',
    title: { en: 'Pause low-margin ad test', ja: '低粗利の広告テストを止める' },
    body: { en: 'The current test is producing weak contribution margin.', ja: '現在のテストは貢献利益が低くなっています。' },
    owner: 'Ops',
    due: { en: 'Today', ja: '本日' },
    tone: 'amber',
  },
  {
    id: 'confirm-retainer-renewal',
    title: { en: 'Confirm retainer renewal', ja: '月額契約の更新確認' },
    body: { en: 'A renewal decision can secure next month cash coverage.', ja: '更新確認で来月のキャッシュ見通しを固められます。' },
    owner: 'Sales',
    due: { en: 'Tomorrow', ja: '明日' },
    tone: 'green',
  },
];

const cashSnapshot: Array<{
  id: string;
  label: Record<Language, string>;
  value: Record<Language, string>;
  barClass: string;
  tone: Tone;
}> = [
  { id: 'cash-in-bank', label: { en: 'Bank cash', ja: '銀行残高' }, value: { en: '$186.0K', ja: '1,860万円' }, barClass: 'w-[86%]', tone: 'green' },
  { id: 'expected-in', label: { en: 'Expected in', ja: '入金見込み' }, value: { en: '$42.8K', ja: '428万円' }, barClass: 'w-[64%]', tone: 'green' },
  { id: 'scheduled-out', label: { en: 'Scheduled out', ja: '支払い予定' }, value: { en: '$38.6K', ja: '386万円' }, barClass: 'w-[58%]', tone: 'amber' },
  { id: 'reserve-gap', label: { en: 'Reserve gap', ja: '準備不足' }, value: { en: '$5.2K', ja: '52万円' }, barClass: 'w-[22%]', tone: 'red' },
];

const revenueTrend: Array<{
  month: Record<Language, string>;
  value: Record<Language, string>;
  barClass: string;
  margin: string;
}> = [
  { month: { en: 'Jan', ja: '1月' }, value: { en: '$92K', ja: '920万' }, barClass: 'h-[48%]', margin: '26%' },
  { month: { en: 'Feb', ja: '2月' }, value: { en: '$104K', ja: '1,040万' }, barClass: 'h-[58%]', margin: '28%' },
  { month: { en: 'Mar', ja: '3月' }, value: { en: '$98K', ja: '980万' }, barClass: 'h-[53%]', margin: '25%' },
  { month: { en: 'Apr', ja: '4月' }, value: { en: '$116K', ja: '1,160万' }, barClass: 'h-[72%]', margin: '29%' },
  { month: { en: 'May', ja: '5月' }, value: { en: '$128K', ja: '1,284万' }, barClass: 'h-[86%]', margin: '31%' },
];

const serviceRevenue: Array<{
  id: string;
  name: Record<Language, string>;
  revenue: Record<Language, string>;
  share: string;
  margin: string;
  barClass: string;
  tone: Tone;
}> = [
  { id: 'retainer', name: { en: 'Monthly retainers', ja: '月額顧問/運用' }, revenue: { en: '$52.0K', ja: '520万円' }, share: '41%', margin: '38%', barClass: 'w-[88%]', tone: 'green' },
  { id: 'implementation', name: { en: 'Implementation projects', ja: '導入プロジェクト' }, revenue: { en: '$36.8K', ja: '368万円' }, share: '29%', margin: '27%', barClass: 'w-[66%]', tone: 'stone' },
  { id: 'advisory', name: { en: 'Advisory sessions', ja: '単発相談' }, revenue: { en: '$21.4K', ja: '214万円' }, share: '17%', margin: '46%', barClass: 'w-[42%]', tone: 'green' },
  { id: 'training', name: { en: 'Training packages', ja: '研修パッケージ' }, revenue: { en: '$18.2K', ja: '182万円' }, share: '13%', margin: '32%', barClass: 'w-[36%]', tone: 'amber' },
];

const customerSales: Array<{
  id: string;
  name: string;
  segment: Record<Language, string>;
  revenue: Record<Language, string>;
  change: string;
  status: 'stable' | 'watch' | 'urgent';
}> = [
  { id: 'sola-works', name: 'Sola Works', segment: { en: 'Operations support', ja: '運用支援' }, revenue: { en: '$24.6K', ja: '246万円' }, change: '+18%', status: 'urgent' },
  { id: 'north-lane', name: 'North Lane Studio', segment: { en: 'Retainer', ja: '月額契約' }, revenue: { en: '$19.8K', ja: '198万円' }, change: '+4%', status: 'stable' },
  { id: 'kumo-table', name: 'Kumo Table', segment: { en: 'Launch project', ja: 'ローンチ案件' }, revenue: { en: '$17.2K', ja: '172万円' }, change: '+22%', status: 'stable' },
  { id: 'river-pocket', name: 'River Pocket', segment: { en: 'Advisory', ja: '相談' }, revenue: { en: '$13.4K', ja: '134万円' }, change: '-9%', status: 'watch' },
  { id: 'mori-supply', name: 'Mori Supply', segment: { en: 'Training', ja: '研修' }, revenue: { en: '$10.2K', ja: '102万円' }, change: '+0%', status: 'stable' },
];

const incomingPayments: Array<{
  id: string;
  customer: string;
  amount: Record<Language, string>;
  due: Record<Language, string>;
  status: 'paid' | 'pending' | 'risk';
}> = [
  { id: 'incoming-sola', customer: 'Sola Works', amount: { en: '$8,400', ja: '84万円' }, due: { en: 'May 21', ja: '5月21日' }, status: 'risk' },
  { id: 'incoming-north', customer: 'North Lane Studio', amount: { en: '$12,000', ja: '120万円' }, due: { en: 'May 24', ja: '5月24日' }, status: 'pending' },
  { id: 'incoming-kumo', customer: 'Kumo Table', amount: { en: '$9,600', ja: '96万円' }, due: { en: 'May 27', ja: '5月27日' }, status: 'pending' },
  { id: 'incoming-river', customer: 'River Pocket', amount: { en: '$5,200', ja: '52万円' }, due: { en: 'May 30', ja: '5月30日' }, status: 'paid' },
];

const outgoingPayments: Array<{
  id: string;
  vendor: string;
  category: Record<Language, string>;
  amount: Record<Language, string>;
  due: Record<Language, string>;
  status: 'pending' | 'risk' | 'paid';
}> = [
  { id: 'pay-cloud', vendor: 'Cloud Harbor', category: { en: 'Software', ja: 'ソフトウェア' }, amount: { en: '$2,180', ja: '21.8万円' }, due: { en: 'May 22', ja: '5月22日' }, status: 'pending' },
  { id: 'pay-subcontractor', vendor: 'Mica Partner', category: { en: 'Subcontractor', ja: '外注費' }, amount: { en: '$14,600', ja: '146万円' }, due: { en: 'May 25', ja: '5月25日' }, status: 'risk' },
  { id: 'pay-office', vendor: 'Base Room', category: { en: 'Office', ja: '事務所' }, amount: { en: '$3,800', ja: '38万円' }, due: { en: 'May 28', ja: '5月28日' }, status: 'pending' },
  { id: 'pay-tax', vendor: 'Tax reserve', category: { en: 'Tax', ja: '税金準備' }, amount: { en: '$9,000', ja: '90万円' }, due: { en: 'May 31', ja: '5月31日' }, status: 'pending' },
];

const runwayForecast: Array<{
  id: string;
  date: Record<Language, string>;
  balance: Record<Language, string>;
  barClass: string;
  tone: Tone;
  note: Record<Language, string>;
}> = [
  { id: 'runway-today', date: { en: 'Today', ja: '本日' }, balance: { en: '$186K', ja: '1,860万' }, barClass: 'w-[90%]', tone: 'green', note: { en: 'Healthy', ja: '良好' } },
  { id: 'runway-30', date: { en: '+30 days', ja: '30日後' }, balance: { en: '$153K', ja: '1,530万' }, barClass: 'w-[72%]', tone: 'green', note: { en: 'Stable', ja: '安定' } },
  { id: 'runway-60', date: { en: '+60 days', ja: '60日後' }, balance: { en: '$112K', ja: '1,120万' }, barClass: 'w-[54%]', tone: 'amber', note: { en: 'Watch renewal', ja: '更新確認' } },
  { id: 'runway-90', date: { en: '+90 days', ja: '90日後' }, balance: { en: '$76K', ja: '760万' }, barClass: 'w-[34%]', tone: 'amber', note: { en: 'Tight if ads continue', ja: '広告継続で注意' } },
];

const expenseCategories: Array<{
  id: string;
  name: Record<Language, string>;
  amount: Record<Language, string>;
  change: string;
  type: ExpenseFilter;
  barClass: string;
  tone: Tone;
}> = [
  { id: 'subcontractor', name: { en: 'Subcontractors', ja: '外注費' }, amount: { en: '$28.4K', ja: '284万円' }, change: '+18%', type: 'variable', barClass: 'w-[86%]', tone: 'amber' },
  { id: 'payroll', name: { en: 'Owner draw / payroll', ja: '役員報酬/給与' }, amount: { en: '$18.0K', ja: '180万円' }, change: '+0%', type: 'fixed', barClass: 'w-[62%]', tone: 'stone' },
  { id: 'software', name: { en: 'Software', ja: 'ソフトウェア' }, amount: { en: '$7.2K', ja: '72万円' }, change: '+6%', type: 'fixed', barClass: 'w-[38%]', tone: 'green' },
  { id: 'marketing', name: { en: 'Marketing tests', ja: '広告テスト' }, amount: { en: '$10.6K', ja: '106万円' }, change: '+24%', type: 'variable', barClass: 'w-[48%]', tone: 'red' },
  { id: 'office', name: { en: 'Office and admin', ja: '事務所/管理' }, amount: { en: '$7.0K', ja: '70万円' }, change: '-2%', type: 'fixed', barClass: 'w-[34%]', tone: 'stone' },
];

const fixedCosts: Array<{
  id: string;
  title: Record<Language, string>;
  amount: Record<Language, string>;
  due: Record<Language, string>;
}> = [
  { id: 'owner-payroll', title: { en: 'Owner draw / payroll', ja: '役員報酬/給与' }, amount: { en: '$18,000', ja: '180万円' }, due: { en: 'Monthly', ja: '毎月' } },
  { id: 'office-rent', title: { en: 'Office rent', ja: '事務所家賃' }, amount: { en: '$3,800', ja: '38万円' }, due: { en: 'May 28', ja: '5月28日' } },
  { id: 'saas-stack', title: { en: 'Software stack', ja: '業務ツール' }, amount: { en: '$2,180', ja: '21.8万円' }, due: { en: 'May 22', ja: '5月22日' } },
];

const insights: Array<{
  id: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  impact: Record<Language, string>;
  tone: Tone;
  icon: LucideIcon;
}> = [
  {
    id: 'retainer-growth',
    title: { en: 'Retainers lifted the baseline', ja: '月額契約が底上げ' },
    body: { en: 'Renewed operations retainers added predictable revenue, reducing dependence on one-off projects.', ja: '運用支援の更新により、単発案件への依存が下がっています。' },
    impact: { en: '+$14.2K revenue', ja: '+142万円売上' },
    tone: 'green',
    icon: TrendingUp,
  },
  {
    id: 'ad-cost-drag',
    title: { en: 'Ad tests reduced contribution margin', ja: '広告テストが粗利を圧迫' },
    body: { en: 'Two channels are spending above the current conversion value and should be paused or capped.', ja: '2つのチャネルが成約価値を上回る支出になっており、停止または上限設定が必要です。' },
    impact: { en: '-4.8 pts margin', ja: '粗利 -4.8pt' },
    tone: 'amber',
    icon: TrendingDown,
  },
  {
    id: 'collection-risk',
    title: { en: 'Collection follow-up protects cash', ja: '回収対応がキャッシュを守る' },
    body: { en: 'Overdue and near-due invoices cover the next subcontractor payment if collected this week.', ja: '期限超過と近日入金の請求を今週回収できれば、外注支払いを吸収できます。' },
    impact: { en: '$22.0K cash effect', ja: '220万円の資金影響' },
    tone: 'red',
    icon: ShieldAlert,
  },
];

const outlookCards: Array<{
  id: string;
  label: Record<Language, string>;
  value: Record<Language, string>;
  confidence: string;
  tone: Tone;
}> = [
  { id: 'outlook-revenue', label: { en: 'Revenue forecast', ja: '売上見込み' }, value: { en: '$142K', ja: '1,420万円' }, confidence: '78%', tone: 'green' },
  { id: 'outlook-profit', label: { en: 'Profit forecast', ja: '利益見込み' }, value: { en: '$39K', ja: '390万円' }, confidence: '72%', tone: 'green' },
  { id: 'outlook-cash', label: { en: 'Month-end cash', ja: '月末現金' }, value: { en: '$168K', ja: '1,680万円' }, confidence: '68%', tone: 'amber' },
];

function localized(language: Language, en: string, ja: string) {
  return language === 'ja' ? ja : en;
}

function getPreviewParam(keys: string[]) {
  if (typeof window === 'undefined') {
    return null;
  }

  const params = new URLSearchParams(window.location.search);

  for (const key of keys) {
    const value = params.get(key);

    if (value) {
      return value;
    }
  }

  return null;
}

function getInitialLanguage(): Language {
  const requested = getPreviewParam(['locale', 'lang', 'language', 'melius_locale']);

  if (requested === 'ja' || requested === 'en') {
    return requested;
  }

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (stored === 'ja' || stored === 'en') {
      return stored;
    }
  } catch {
    return 'en';
  }

  return window.navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

function getInitialTheme(): ThemeMode {
  const requested = getPreviewParam(['theme', 'themeMode', 'colorScheme', 'melius_theme']);

  if (requested === 'light' || requested === 'dark' || requested === 'system') {
    return requested;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    return 'system';
  }

  const preference = document.documentElement.dataset.themePreference;
  return preference === 'light' || preference === 'dark' || preference === 'system' ? preference : 'system';
}

function resolveTheme(mode: ThemeMode) {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return mode;
}

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.theme = resolved;
  root.dataset.themePreference = mode;
  root.style.colorScheme = resolved;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Theme persistence is optional for this visual starter.
  }
}

function applyLanguage(language: Language, title: string) {
  document.documentElement.lang = language;
  document.title = title;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Language persistence is optional for this visual starter.
  }
}

function getDefaultPanel(tab: TabId, copy: AppCopy, language: Language): DetailPanel {
  const header = copy.headers[tab];
  const iconMap: Record<TabId, LucideIcon> = {
    overview: LayoutDashboard,
    revenue: TrendingUp,
    cashflow: Wallet,
    expenses: ReceiptText,
    insights: Lightbulb,
  };

  return {
    eyebrow: localized(language, 'Workspace inspector', 'ワークスペース詳細'),
    title: header.title,
    body: header.body,
    icon: iconMap[tab],
    tone: tab === 'expenses' ? 'amber' : tab === 'insights' ? 'green' : 'stone',
    meta: [
      { label: copy.labels.status, value: localized(language, 'Ready', '確認可能') },
      { label: copy.labels.owner, value: copy.userName },
      { label: localized(language, 'View', '表示'), value: copy.tabs[tab] },
    ],
    primaryLabel: header.primary,
    secondaryLabel: header.secondary,
  };
}

function getKpiPanel(kpi: (typeof kpis)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'KPI detail', 'KPI詳細'),
    title: kpi.label[language],
    body: kpi.detail[language],
    icon: kpi.icon,
    tone: kpi.tone,
    meta: [
      { label: copy.labels.amount, value: kpi.value[language] },
      { label: copy.labels.change, value: kpi.change },
      { label: copy.labels.status, value: kpi.tone === 'red' ? copy.labels.urgent : kpi.tone === 'amber' ? copy.labels.watch : copy.labels.stable },
    ],
    progress: kpi.tone === 'red' ? 38 : kpi.tone === 'amber' ? 64 : 82,
    progressLabel: localized(language, 'Operating health', '経営状態'),
    primaryLabel: copy.actions.review,
    secondaryLabel: copy.actions.compare,
    presentation: 'modal',
  };
}

function getAlertPanel(alert: (typeof alerts)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'Attention alert', '注意アラート'),
    title: alert.title[language],
    body: alert.body[language],
    icon: alert.icon,
    tone: alert.tone,
    meta: [
      { label: copy.labels.amount, value: alert.amount[language] },
      { label: copy.labels.due, value: alert.due[language] },
      { label: copy.labels.status, value: alert.tone === 'red' ? copy.labels.urgent : copy.labels.watch },
    ],
    primaryLabel: copy.actions.acknowledge,
    secondaryLabel: copy.actions.schedule,
    presentation: 'modal',
  };
}

function getActionPanel(action: (typeof nextActions)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'Next action', '次のアクション'),
    title: action.title[language],
    body: action.body[language],
    icon: ClipboardList,
    tone: action.tone,
    meta: [
      { label: copy.labels.owner, value: action.owner },
      { label: copy.labels.due, value: action.due[language] },
      { label: copy.labels.status, value: copy.labels.incomplete },
    ],
    primaryLabel: copy.actions.markDone,
    secondaryLabel: copy.actions.schedule,
    presentation: 'modal',
  };
}

function getServicePanel(service: (typeof serviceRevenue)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'Service revenue', 'サービス別売上'),
    title: service.name[language],
    body: localized(language, 'Review revenue share, gross margin, and whether the current mix supports month-end profit.', '売上構成比、粗利、月末利益への影響を確認します。'),
    icon: BriefcaseBusiness,
    tone: service.tone,
    meta: [
      { label: copy.labels.amount, value: service.revenue[language] },
      { label: copy.labels.share, value: service.share },
      { label: copy.labels.margin, value: service.margin },
    ],
    primaryLabel: copy.actions.review,
    secondaryLabel: copy.actions.compare,
    presentation: 'modal',
  };
}

function getCustomerPanel(customer: (typeof customerSales)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'Customer revenue', '顧客別売上'),
    title: customer.name,
    body: localized(language, 'Check revenue contribution, recent movement, and follow-up status before account decisions.', '売上貢献、直近の変化、フォロー状況を確認します。'),
    icon: Users,
    tone: customer.status === 'urgent' ? 'red' : customer.status === 'watch' ? 'amber' : 'green',
    meta: [
      { label: copy.labels.amount, value: customer.revenue[language] },
      { label: copy.labels.change, value: customer.change },
      { label: copy.labels.status, value: copy.labels[customer.status] },
    ],
    primaryLabel: copy.actions.open,
    secondaryLabel: copy.actions.sendReminder,
    presentation: 'modal',
  };
}

function getCashPanel(row: (typeof incomingPayments)[number] | (typeof outgoingPayments)[number], copy: AppCopy, language: Language): DetailPanel {
  const isIncoming = 'customer' in row;
  const title = isIncoming ? row.customer : row.vendor;

  return {
    eyebrow: isIncoming ? localized(language, 'Incoming payment', '入金予定') : localized(language, 'Outgoing payment', '支払い予定'),
    title,
    body: isIncoming
      ? localized(language, 'Confirm invoice status and decide whether a reminder is needed.', '請求状況を確認し、催促が必要か判断します。')
      : localized(language, 'Check scheduled payment timing and cash impact before approval.', '支払い予定日と資金影響を確認してから承認します。'),
    icon: isIncoming ? Banknote : CreditCard,
    tone: row.status === 'risk' ? 'red' : row.status === 'pending' ? 'amber' : 'green',
    meta: [
      { label: copy.labels.amount, value: row.amount[language] },
      { label: copy.labels.due, value: row.due[language] },
      { label: copy.labels.status, value: copy.labels[row.status] },
    ],
    primaryLabel: isIncoming ? copy.actions.reconcile : copy.actions.review,
    secondaryLabel: isIncoming ? copy.actions.sendReminder : copy.actions.schedule,
    presentation: 'modal',
  };
}

function getExpensePanel(expense: (typeof expenseCategories)[number] | (typeof fixedCosts)[number], copy: AppCopy, language: Language): DetailPanel {
  const isCategory = 'change' in expense;
  const title = isCategory ? expense.name[language] : expense.title[language];

  return {
    eyebrow: isCategory ? localized(language, 'Expense category', '経費カテゴリ') : localized(language, 'Fixed cost', '固定費'),
    title,
    body: isCategory
      ? localized(language, 'Inspect the monthly cost movement and decide whether the budget needs a cap.', '月次コストの動きを確認し、予算上限が必要か判断します。')
      : localized(language, 'Review recurring payment timing and whether the cost still supports operations.', '定期支払いの時期と、事業運営に必要な費用かを確認します。'),
    icon: isCategory ? ReceiptText : CalendarClock,
    tone: isCategory ? expense.tone : 'stone',
    meta: [
      { label: copy.labels.amount, value: expense.amount[language] },
      { label: isCategory ? copy.labels.change : copy.labels.due, value: isCategory ? expense.change : expense.due[language] },
      { label: copy.labels.category, value: isCategory ? copy.filters[expense.type] : copy.filters.fixed },
    ],
    primaryLabel: copy.actions.review,
    secondaryLabel: copy.actions.schedule,
    presentation: 'modal',
  };
}

function getInsightPanel(insight: (typeof insights)[number], copy: AppCopy, language: Language): DetailPanel {
  return {
    eyebrow: localized(language, 'Business insight', '経営インサイト'),
    title: insight.title[language],
    body: insight.body[language],
    icon: insight.icon,
    tone: insight.tone,
    meta: [
      { label: copy.labels.impact, value: insight.impact[language] },
      { label: copy.labels.confidence, value: insight.tone === 'red' ? '81%' : insight.tone === 'amber' ? '74%' : '88%' },
      { label: copy.labels.status, value: insight.tone === 'red' ? copy.labels.urgent : insight.tone === 'amber' ? copy.labels.watch : copy.labels.stable },
    ],
    primaryLabel: copy.actions.review,
    secondaryLabel: copy.actions.markDone,
    presentation: 'modal',
  };
}

function getToneIconClass(tone: Tone) {
  switch (tone) {
    case 'green':
      return 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200';
    case 'amber':
      return 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-300/[0.14] dark:text-amber-200';
    case 'red':
      return 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-300/[0.14] dark:text-rose-200';
    case 'stone':
      return 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-stone-200 text-stone-800 dark:bg-stone-300/[0.14] dark:text-stone-200';
    case 'zinc':
    default:
      return 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-200 text-zinc-800 dark:bg-zinc-300/[0.14] dark:text-zinc-200';
  }
}

function getStatusBadgeClass(tone: Tone) {
  switch (tone) {
    case 'green':
      return 'inline-flex w-fit items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200';
    case 'amber':
      return 'inline-flex w-fit items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-300/[0.14] dark:text-amber-200';
    case 'red':
      return 'inline-flex w-fit items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-300/[0.14] dark:text-rose-200';
    case 'stone':
    case 'zinc':
    default:
      return 'inline-flex w-fit items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200';
  }
}

function getBarClass(tone: Tone) {
  switch (tone) {
    case 'green':
      return 'rounded-full bg-emerald-700 dark:bg-emerald-300';
    case 'amber':
      return 'rounded-full bg-amber-600 dark:bg-amber-300';
    case 'red':
      return 'rounded-full bg-rose-700 dark:bg-rose-300';
    case 'stone':
    case 'zinc':
    default:
      return 'rounded-full bg-zinc-800 dark:bg-zinc-200';
  }
}

function ToneIcon({ tone, icon: Icon }: { tone: Tone; icon: LucideIcon }) {
  return (
    <span className={getToneIconClass(tone)}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={getStatusBadgeClass(tone)}>{children}</span>;
}

function TrendBadge({ trend, value }: { trend: 'up' | 'down' | 'flat'; value: string }) {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        {value}
      </span>
    );
  }

  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-300/[0.14] dark:text-amber-200">
        <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-black text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200">
      {value}
    </span>
  );
}

function LanguageSwitcher({
  copy,
  language,
  onLanguageChange,
}: {
  copy: AppCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <div
      data-melius-ui-id="language-switcher"
      data-melius-ui-role="control"
      aria-label={copy.language.label}
      className="hidden h-9 items-center rounded-lg border border-zinc-950/[0.08] bg-white/[0.70] p-1 text-xs font-black text-zinc-600 backdrop-blur dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-zinc-300 sm:inline-flex"
    >
      <LanguageOptionButton selected={language === 'ja'} label={copy.language.ja} onClick={() => onLanguageChange('ja')} />
      <LanguageOptionButton selected={language === 'en'} label={copy.language.en} onClick={() => onLanguageChange('en')} />
    </div>
  );
}

function LanguageOptionButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  if (selected) {
    return (
      <button
        type="button"
        aria-pressed="true"
        onClick={onClick}
        className="h-7 min-w-8 rounded-md bg-zinc-950 px-2.5 text-white dark:bg-white dark:text-zinc-950"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed="false"
      onClick={onClick}
      className="h-7 min-w-8 rounded-md px-2.5 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {label}
    </button>
  );
}

function ThemeSwitcher({
  copy,
  theme,
  onThemeChange,
}: {
  copy: AppCopy;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}) {
  return (
    <div
      data-melius-ui-id="theme-switcher"
      data-melius-ui-role="control"
      aria-label={copy.theme.label}
      className="hidden h-9 items-center rounded-lg border border-zinc-950/[0.08] bg-white/[0.70] p-1 text-xs font-black text-zinc-600 backdrop-blur dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-zinc-300 lg:inline-flex"
    >
      <ThemeOptionButton selected={theme === 'light'} label={copy.theme.light} onClick={() => onThemeChange('light')} icon={Sun} />
      <ThemeOptionButton selected={theme === 'system'} label={copy.theme.system} onClick={() => onThemeChange('system')} icon={PanelLeft} />
      <ThemeOptionButton selected={theme === 'dark'} label={copy.theme.dark} onClick={() => onThemeChange('dark')} icon={Moon} />
    </div>
  );
}

function ThemeOptionButton({
  selected,
  label,
  onClick,
  icon: Icon,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}) {
  if (selected) {
    return (
      <button
        type="button"
        aria-pressed="true"
        title={label}
        onClick={onClick}
        className="inline-flex h-7 min-w-8 items-center justify-center gap-1.5 rounded-md bg-zinc-950 px-2.5 text-white dark:bg-white dark:text-zinc-950"
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden xl:inline">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed="false"
      title={label}
      onClick={onClick}
      className="inline-flex h-7 min-w-8 items-center justify-center gap-1.5 rounded-md px-2.5 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function SidebarContent({
  copy,
  language,
  activeTab,
  expandedItems,
  idPrefix,
  onSelectTab,
  onToggleExpanded,
  onUtilityAction,
  onCloseMobile,
}: {
  copy: AppCopy;
  language: Language;
  activeTab: TabId;
  expandedItems: Record<string, boolean>;
  idPrefix: 'desktop-nav' | 'mobile-nav';
  onSelectTab: (tab: TabId) => void;
  onToggleExpanded: (id: string) => void;
  onUtilityAction: (title: string, body: string, icon?: LucideIcon) => void;
  onCloseMobile?: () => void;
}) {
  return (
    <>
      <SidebarHeader data-melius-ui-id={`${idPrefix}-brand`} data-melius-ui-role="navigation">
        <BrandMark>
          <Wallet className="h-5 w-5" aria-hidden="true" />
        </BrandMark>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">{copy.appName}</div>
          <div className="truncate text-xs font-semibold text-stone-400">{copy.appSubtitle}</div>
        </div>
        {onCloseMobile ? (
          <IconButton dataId={`${idPrefix}-close`} roleName="button" label={copy.closeSidebar} onClick={onCloseMobile}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        ) : null}
      </SidebarHeader>

      <div className="px-3 py-3">
        <div
          data-melius-ui-id={`${idPrefix}-morning-status`}
          data-melius-ui-role="status"
          className="rounded-md border border-white/[0.12] bg-white/[0.06] p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">{copy.morningReview}</div>
            <StatusBadge tone="green">08:10</StatusBadge>
          </div>
          <div className="mt-2 text-sm font-black text-white">{localized(language, 'Cash runway 74 days', '資金残 74日')}</div>
        </div>
      </div>

      <nav data-melius-ui-id={`${idPrefix}-navigation`} data-melius-ui-role="navigation" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const sidebarCopy = copy.sidebar[item.id];
            const Icon = item.icon;
            const selected = item.id === activeTab;
            const children = sidebarCopy.children ?? [];
            const badge = 'badge' in sidebarCopy ? sidebarCopy.badge : null;
            const title = sidebarCopy.title;

            return (
              <div key={item.id}>
                <RowButton
                  dataId={`${idPrefix}-${item.id}`}
                  roleName="navigation-item"
                  selected={selected}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (children.length > 0) {
                      onToggleExpanded(item.id);
                    }
                    onCloseMobile?.();
                  }}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{title}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {badge ? <Badge>{badge}</Badge> : null}
                    {children.length > 0 ? (
                      <ChevronDown
                        className={expandedItems[item.id] ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'}
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </RowButton>

                {children.length > 0 && expandedItems[item.id] ? (
                  <div
                    data-melius-ui-id={`${idPrefix}-${item.id}-children`}
                    data-melius-ui-role="navigation-group"
                    className="ml-5 mt-1 space-y-1 border-l border-white/[0.12] pl-3"
                  >
                    {children.map((child, childIndex) => (
                      <button
                        key={child}
                        type="button"
                        data-melius-ui-id={`${idPrefix}-${item.id}-child-${childIndex + 1}`}
                        data-melius-ui-role="navigation-item"
                        onClick={() => {
                          onSelectTab(item.id);
                          onUtilityAction(
                            `${title} / ${child}`,
                            localized(language, `${child} is ready in the business inspector.`, `${child} を経営インスペクターに表示しました。`),
                            Icon,
                          );
                          onCloseMobile?.();
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-stone-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <div data-melius-ui-id={`${idPrefix}-account`} data-melius-ui-role="account" className="border-t border-white/[0.10] p-3">
        <div className="space-y-1">
          <RowButton
            dataId={`${idPrefix}-settings`}
            roleName="button"
            onClick={() => onUtilityAction(copy.sidebar.settings, localized(language, 'Preference, fiscal month, and alert thresholds are available here.', '表示設定、会計月、アラート閾値をここで確認できます。'), Settings)}
          >
            <span className="flex items-center gap-3">
              <Settings className="h-5 w-5" aria-hidden="true" />
              {copy.sidebar.settings}
            </span>
          </RowButton>
          <RowButton
            dataId={`${idPrefix}-user-plan`}
            roleName="account"
            onClick={() => onUtilityAction(copy.userName, localized(language, 'Profile, role, and sample workspace plan details are ready for review.', 'プロフィール、権限、サンプルワークスペースのプランを確認できます。'), Users)}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-emerald-200 text-xs font-black text-zinc-950">
                OP
              </span>
              <span className="truncate">{copy.userName}</span>
            </span>
            <Badge>{copy.plan}</Badge>
          </RowButton>
        </div>
      </div>
    </>
  );
}

function WorkspaceHero({
  tab,
  copy,
  language,
  onPrimary,
  onSecondary,
}: {
  tab: TabId;
  copy: AppCopy;
  language: Language;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const header = copy.headers[tab];
  const metrics = [
    { id: 'hero-month-revenue', label: localized(language, 'Revenue booked', '売上計上'), value: localized(language, '$128K', '1,284万'), note: '+12.8%' },
    { id: 'hero-cash', label: localized(language, 'Cash runway', '資金残日数'), value: localized(language, '74 days', '74日'), note: localized(language, 'stable', '安定') },
    { id: 'hero-alerts', label: localized(language, 'Today focus', '今日の確認'), value: localized(language, '3 alerts', '3件'), note: localized(language, '2 urgent', '至急2件') },
  ];

  return (
    <section
      data-melius-ui-id="workspace-hero"
      data-melius-ui-role="hero"
      className="hero-panel overflow-hidden rounded-md border border-zinc-950/[0.16] bg-[#fbfaf5] shadow-[0_18px_60px_rgba(24,24,27,0.08)] dark:border-white/[0.10] dark:bg-[#171612]"
    >
      <div className="grid lg:grid-cols-[10rem_minmax(0,1fr)]">
        <div
          data-melius-ui-id="hero-date-strip"
          data-melius-ui-role="status"
          className="flex flex-row items-center justify-between gap-4 border-b border-zinc-950/[0.12] bg-[#191814] px-5 py-4 text-white dark:border-white/[0.10] lg:flex-col lg:items-start lg:justify-start lg:border-b-0 lg:border-r"
        >
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">{localized(language, 'Owner log', '経営日誌')}</div>
            <div className="mt-2 text-3xl font-black leading-none">08:10</div>
          </div>
          <div className="h-px flex-1 bg-white/[0.16] lg:w-full lg:flex-none" />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">{header.badge}</div>
            <div className="mt-1 text-sm font-black">{copy.tabs[tab]}</div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_minmax(20rem,27rem)] 2xl:items-start">
            <div className="space-y-4">
              <StrongBadge>{localized(language, 'Morning operating sheet', '朝の経営シート')}</StrongBadge>
              <div>
                <h2 data-melius-ui-id="hero-title" data-melius-ui-role="heading" className="max-w-2xl text-3xl font-black leading-[1.03] tracking-normal text-zinc-950 dark:text-white sm:text-4xl">
                  {header.title}
                </h2>
                <p data-melius-ui-id="hero-body" data-melius-ui-role="text" className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
                  {header.body}
                </p>
              </div>
              <div data-melius-ui-id="hero-actions" data-melius-ui-role="actions" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  data-melius-ui-id="hero-primary-action"
                  data-melius-ui-role="button"
                  onClick={onPrimary}
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#171612] px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-900 dark:bg-emerald-200 dark:text-zinc-950 dark:hover:bg-emerald-100"
                >
                  {header.primary}
                </button>
                <button
                  type="button"
                  data-melius-ui-id="hero-secondary-action"
                  data-melius-ui-role="button"
                  onClick={onSecondary}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-950/[0.18] bg-transparent px-4 py-2 text-sm font-black text-zinc-900 transition hover:border-emerald-800 hover:bg-emerald-950/[0.05] dark:border-white/[0.18] dark:text-white dark:hover:bg-white/[0.08]"
                >
                  {header.secondary}
                </button>
              </div>
            </div>

            <div data-melius-ui-id="hero-status-panel" data-melius-ui-role="status" className="grid border border-zinc-950/[0.12] dark:border-white/[0.10]">
              {metrics.map((metric, index) => (
                <div key={metric.id} data-melius-ui-id={`hero-metric-${index + 1}`} data-melius-ui-role="metric" className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-zinc-950/[0.10] px-4 py-3 last:border-b-0 dark:border-white/[0.08]">
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-[0.13em] text-zinc-500 dark:text-zinc-400">{metric.label}</div>
                    <div className="mt-1 text-2xl font-black leading-none text-zinc-950 dark:text-white">{metric.value}</div>
                  </div>
                  <div className={index === 2 ? 'self-start rounded-sm bg-rose-100 px-2 py-1 text-xs font-black text-rose-800 dark:bg-rose-300/[0.14] dark:text-rose-200' : 'self-start rounded-sm bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200'}>
                    {metric.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, action, actionId, onAction }: { title: string; action?: string; actionId?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-black tracking-normal text-zinc-950 dark:text-white">{title}</h2>
      {action ? (
        <GhostButton dataId={actionId ?? 'section-action'} roleName="button" onClick={onAction}>
          {action}
        </GhostButton>
      ) : null}
    </div>
  );
}

function KpiCard({
  kpi,
  language,
  onOpen,
}: {
  kpi: (typeof kpis)[number];
  language: Language;
  onOpen: () => void;
}) {
  return (
    <CardSurface data-melius-ui-id={`kpi-card-${kpi.id}`} data-melius-ui-role="metric">
      <button type="button" onClick={onOpen} className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-4 p-4 text-left">
        <div className="flex flex-col items-center gap-3">
          <ToneIcon tone={kpi.tone} icon={kpi.icon} />
          <span className="h-full w-px bg-zinc-950/[0.10] dark:bg-white/[0.10]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{kpi.label[language]}</div>
              <div className="mt-1 whitespace-nowrap text-2xl font-black text-zinc-950 dark:text-white sm:text-3xl">{kpi.value[language]}</div>
            </div>
            <TrendBadge trend={kpi.trend} value={kpi.change} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{kpi.detail[language]}</p>
        </div>
      </button>
    </CardSurface>
  );
}

function AlertRow({
  alert,
  copy,
  language,
  dismissed,
  onOpen,
  onAcknowledge,
}: {
  alert: (typeof alerts)[number];
  copy: AppCopy;
  language: Language;
  dismissed: boolean;
  onOpen: () => void;
  onAcknowledge: () => void;
}) {
  return (
    <div
      data-melius-ui-id={`alert-row-${alert.id}`}
      data-melius-ui-role="alert"
      className={dismissed ? 'grid gap-3 border-t border-zinc-950/[0.08] p-4 opacity-55 dark:border-white/[0.08] md:grid-cols-[auto_minmax(0,1fr)_auto]' : 'grid gap-3 border-t border-zinc-950/[0.08] p-4 dark:border-white/[0.08] md:grid-cols-[auto_minmax(0,1fr)_auto]'}
    >
      <ToneIcon tone={alert.tone} icon={alert.icon} />
      <button type="button" onClick={onOpen} className="min-w-0 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-black text-zinc-950 dark:text-white">{alert.title[language]}</h3>
          <StatusBadge tone={alert.tone}>{alert.due[language]}</StatusBadge>
        </div>
        <p className="mt-1 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{alert.body[language]}</p>
      </button>
      <div className="flex items-center gap-2 md:justify-end">
        <div className="text-sm font-black text-zinc-950 dark:text-white">{alert.amount[language]}</div>
        <GhostButton dataId={`acknowledge-alert-${alert.id}`} roleName="button" onClick={onAcknowledge}>
          {dismissed ? copy.actions.undo : copy.actions.acknowledge}
        </GhostButton>
      </div>
    </div>
  );
}

function ActionRow({
  action,
  copy,
  language,
  completed,
  onToggle,
  onOpen,
}: {
  action: (typeof nextActions)[number];
  copy: AppCopy;
  language: Language;
  completed: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div data-melius-ui-id={`next-action-${action.id}`} data-melius-ui-role="list-item" className="flex items-start gap-3 border-t border-zinc-950/[0.08] p-4 dark:border-white/[0.08]">
      <button
        type="button"
        data-melius-ui-id={`complete-action-${action.id}`}
        data-melius-ui-role="button"
        aria-pressed={completed}
        onClick={onToggle}
        className={completed ? 'mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-700 text-white dark:bg-emerald-300 dark:text-zinc-950' : 'mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-zinc-950/[0.16] bg-white text-zinc-500 transition hover:border-emerald-700 hover:text-emerald-700 dark:border-white/[0.14] dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:border-emerald-300 dark:hover:text-emerald-200'}
      >
        {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
      </button>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className={completed ? 'font-black text-zinc-500 line-through dark:text-zinc-500' : 'font-black text-zinc-950 dark:text-white'}>{action.title[language]}</div>
        <p className="mt-1 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{action.body[language]}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{action.owner}</Badge>
          <StatusBadge tone={action.tone}>{action.due[language]}</StatusBadge>
        </div>
      </button>
    </div>
  );
}

function MeterRow({
  id,
  label,
  value,
  barClass,
  tone,
  onOpen,
}: {
  id: string;
  label: string;
  value: string;
  barClass: string;
  tone: Tone;
  onOpen?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-zinc-700 dark:text-zinc-200">{label}</span>
        <span className="font-black text-zinc-950 dark:text-white">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-zinc-950/[0.08] dark:bg-white/[0.10]">
        <div className={`${barClass} h-2 ${getBarClass(tone)}`} />
      </div>
    </>
  );

  if (onOpen) {
    return (
      <button type="button" data-melius-ui-id={`meter-row-${id}`} data-melius-ui-role="metric" onClick={onOpen} className="block w-full rounded-lg p-3 text-left transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045]">
        {content}
      </button>
    );
  }

  return (
    <div data-melius-ui-id={`meter-row-${id}`} data-melius-ui-role="metric" className="rounded-lg p-3">
      {content}
    </div>
  );
}

function RevenueChart({ language }: { language: Language }) {
  return (
    <PanelSurface data-melius-ui-id="revenue-trend-chart" data-melius-ui-role="chart">
      <div className="p-4">
        <div className="flex h-64 items-end gap-3">
          {revenueTrend.map((item) => (
            <div key={item.month.en} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <div className={`${item.barClass} w-full rounded-t-lg bg-zinc-900 transition dark:bg-zinc-100`} />
              <div className="text-center">
                <div className="text-xs font-black text-zinc-950 dark:text-white">{item.value[language]}</div>
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item.month[language]}</div>
              </div>
            </div>
          ))}
        </div>
        <div data-melius-ui-id="revenue-margin-strip" data-melius-ui-role="status" className="mt-4 grid grid-cols-5 gap-2">
          {revenueTrend.map((item) => (
            <div key={item.month.en} className="rounded-md bg-emerald-100 px-2 py-1 text-center text-xs font-black text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
              {item.margin}
            </div>
          ))}
        </div>
      </div>
    </PanelSurface>
  );
}

function CustomerTable({
  rows,
  copy,
  language,
  onOpen,
}: {
  rows: typeof customerSales;
  copy: AppCopy;
  language: Language;
  onOpen: (customer: (typeof customerSales)[number]) => void;
}) {
  if (rows.length === 0) {
    return (
      <PanelSurface data-melius-ui-id="customer-revenue-empty" data-melius-ui-role="empty-state">
        <div className="p-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400">{copy.emptySearch}</div>
      </PanelSurface>
    );
  }

  return (
    <PanelSurface data-melius-ui-id="customer-revenue-table" data-melius-ui-role="table">
      <div className="hidden grid-cols-12 gap-3 border-b border-zinc-950/[0.08] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-zinc-500 dark:border-white/[0.08] dark:text-zinc-400 md:grid">
        <div className="col-span-5">{copy.labels.customer}</div>
        <div className="col-span-3">{copy.labels.category}</div>
        <div className="col-span-2">{copy.labels.amount}</div>
        <div className="col-span-2">{copy.labels.status}</div>
      </div>
      {rows.map((customer) => {
        const tone: Tone = customer.status === 'urgent' ? 'red' : customer.status === 'watch' ? 'amber' : 'green';

        return (
          <button
            key={customer.id}
            type="button"
            data-melius-ui-id={`customer-row-${customer.id}`}
            data-melius-ui-role="table-row"
            onClick={() => onOpen(customer)}
            className="grid w-full gap-3 border-b border-zinc-950/[0.08] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-zinc-950/[0.035] dark:border-white/[0.08] dark:hover:bg-white/[0.045] md:grid-cols-12 md:items-center"
          >
            <div className="min-w-0 md:col-span-5">
              <div className="truncate font-black text-zinc-950 dark:text-white">{customer.name}</div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{customer.change}</div>
            </div>
            <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 md:col-span-3">{customer.segment[language]}</div>
            <div className="text-sm font-black text-zinc-950 dark:text-white md:col-span-2">{customer.revenue[language]}</div>
            <div className="md:col-span-2">
              <StatusBadge tone={tone}>{copy.labels[customer.status]}</StatusBadge>
            </div>
          </button>
        );
      })}
    </PanelSurface>
  );
}

function PaymentTable({
  id,
  rows,
  copy,
  language,
  onOpen,
}: {
  id: string;
  rows: typeof incomingPayments | typeof outgoingPayments;
  copy: AppCopy;
  language: Language;
  onOpen: (row: (typeof incomingPayments)[number] | (typeof outgoingPayments)[number]) => void;
}) {
  return (
    <PanelSurface data-melius-ui-id={id} data-melius-ui-role="table">
      {rows.map((row) => {
        const tone: Tone = row.status === 'risk' ? 'red' : row.status === 'pending' ? 'amber' : 'green';
        const title = 'customer' in row ? row.customer : row.vendor;
        const subtitle = 'category' in row ? row.category[language] : copy.labels.expected;

        return (
          <button
            key={row.id}
            type="button"
            data-melius-ui-id={`payment-row-${row.id}`}
            data-melius-ui-role="table-row"
            onClick={() => onOpen(row)}
            className="grid w-full gap-3 border-b border-zinc-950/[0.08] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-zinc-950/[0.035] dark:border-white/[0.08] dark:hover:bg-white/[0.045] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
          >
            <div className="min-w-0">
              <div className="truncate font-black text-zinc-950 dark:text-white">{title}</div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{subtitle}</div>
            </div>
            <div className="font-black text-zinc-950 dark:text-white">{row.amount[language]}</div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{row.due[language]}</Badge>
              <StatusBadge tone={tone}>{copy.labels[row.status]}</StatusBadge>
            </div>
          </button>
        );
      })}
    </PanelSurface>
  );
}

function InspectorPanel({
  panel,
  copy,
  onPrimary,
  onSecondary,
}: {
  panel: DetailPanel;
  copy: AppCopy;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <aside
      data-melius-ui-id="right-inspector"
      data-melius-ui-role="inspector"
      className="inspector-enter sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-hidden rounded-md border border-zinc-950/[0.14] bg-[#ebe4d5]/[0.94] shadow-[0_1px_0_rgba(24,24,27,0.08)] dark:border-white/[0.10] dark:bg-[#1b1915] xl:block"
    >
      <div className="thin-scrollbar max-h-[calc(100vh-6rem)] overflow-y-auto p-4">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-zinc-950/[0.14] pb-4 dark:border-white/[0.10]">
          <ToneIcon tone={panel.tone} icon={panel.icon} />
          <Badge>{panel.eyebrow}</Badge>
        </div>
        <h2 className="text-2xl font-black leading-tight text-zinc-950 dark:text-white">{panel.title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">{panel.body}</p>

        <div data-melius-ui-id="inspector-meta" data-melius-ui-role="details" className="mt-4 space-y-2">
          {panel.meta.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex items-center justify-between gap-3 border-b border-zinc-950/[0.10] px-1 py-2 last:border-b-0 dark:border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm font-black text-zinc-950 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>

        {panel.progress !== undefined && panel.progressLabel ? (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-300">
              <span>{panel.progressLabel}</span>
              <span>{panel.progress}%</span>
            </div>
            <ProgressBar dataId="inspector-progress" value={panel.progress} />
          </div>
        ) : null}

        <div data-melius-ui-id="inspector-actions" data-melius-ui-role="actions" className="mt-5 grid gap-2">
          <PrimaryButton dataId="inspector-primary-action" roleName="button" onClick={onPrimary}>
            {panel.primaryLabel}
          </PrimaryButton>
          <SecondaryButton dataId="inspector-secondary-action" roleName="button" onClick={onSecondary}>
            {panel.secondaryLabel}
          </SecondaryButton>
        </div>
      </div>
    </aside>
  );
}

function DetailModal({
  panel,
  copy,
  onClose,
  onPrimary,
  onSecondary,
}: {
  panel: DetailPanel;
  copy: AppCopy;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <div data-melius-ui-id="detail-modal-overlay" data-melius-ui-role="dialog" className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <div className="modal-enter w-full max-w-3xl overflow-hidden rounded-md border border-zinc-950/[0.16] bg-[#fbfaf5] shadow-2xl shadow-zinc-950/25 dark:border-white/[0.10] dark:bg-[#171612]">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-950/[0.12] bg-[#ebe4d5] p-5 dark:border-white/[0.08] dark:bg-white/[0.04]">
          <div className="flex min-w-0 items-start gap-3">
            <ToneIcon tone={panel.tone} icon={panel.icon} />
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{panel.eyebrow}</div>
              <h2 className="mt-1 text-xl font-black text-zinc-950 dark:text-white">{panel.title}</h2>
            </div>
          </div>
          <IconButton dataId="detail-modal-close" roleName="button" label="Close" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="p-5">
          <p className="text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">{panel.body}</p>
          <div data-melius-ui-id="detail-modal-meta" data-melius-ui-role="details" className="mt-5 grid gap-3 sm:grid-cols-3">
            {panel.meta.map((item) => (
              <div key={`${item.label}-${item.value}`} className="rounded-md border border-zinc-950/[0.12] bg-white/[0.56] p-3 dark:border-white/[0.08] dark:bg-white/[0.05]">
                <div className="text-xs font-bold uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{item.label}</div>
                <div className="mt-1 font-black text-zinc-950 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
          {panel.progress !== undefined && panel.progressLabel ? (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-300">
                <span>{panel.progressLabel}</span>
                <span>{panel.progress}%</span>
              </div>
              <ProgressBar dataId="detail-modal-progress" value={panel.progress} />
            </div>
          ) : null}
        </div>
        <div data-melius-ui-id="detail-modal-actions" data-melius-ui-role="actions" className="flex flex-wrap justify-end gap-2 border-t border-zinc-950/[0.08] p-5 dark:border-white/[0.08]">
          <SecondaryButton dataId="detail-modal-secondary-action" roleName="button" onClick={onSecondary}>
            {panel.secondaryLabel}
          </SecondaryButton>
          <PrimaryButton dataId="detail-modal-primary-action" roleName="button" onClick={onPrimary}>
            {panel.primaryLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function OverviewView({
  copy,
  language,
  dismissedAlertIds,
  completedActionIds,
  onOpenPanel,
  onToggleAlert,
  onToggleAction,
  onUtility,
}: {
  copy: AppCopy;
  language: Language;
  dismissedAlertIds: string[];
  completedActionIds: string[];
  onOpenPanel: (panel: DetailPanel) => void;
  onToggleAlert: (id: string) => void;
  onToggleAction: (id: string) => void;
  onUtility: (title: string, body: string, icon?: LucideIcon) => void;
}) {
  return (
    <div data-melius-ui-id="overview-workspace" data-melius-ui-role="workspace" className="content-rise space-y-5">
      <SectionTitle title={copy.sections.kpis} action={copy.actions.exportCsv} actionId="overview-export-csv" onAction={() => onUtility(copy.actions.exportCsv, localized(language, 'The current KPI summary is prepared for export.', '現在のKPIサマリーを書き出す準備ができました。'), Download)} />
      <div data-melius-ui-id="overview-kpi-grid" data-melius-ui-role="metrics-grid" className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} language={language} onOpen={() => onOpenPanel(getKpiPanel(kpi, copy, language))} />
        ))}
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <PanelSurface data-melius-ui-id="overview-alerts-panel" data-melius-ui-role="panel">
          <div className="p-4">
            <SectionTitle title={copy.sections.alerts} action={copy.actions.viewAll} actionId="overview-alerts-view-all" onAction={() => onUtility(copy.sections.alerts, localized(language, 'All attention alerts are available in the inspector.', 'すべての注意アラートをインスペクターで確認できます。'), AlertTriangle)} />
          </div>
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              copy={copy}
              language={language}
              dismissed={dismissedAlertIds.includes(alert.id)}
              onOpen={() => onOpenPanel(getAlertPanel(alert, copy, language))}
              onAcknowledge={() => onToggleAlert(alert.id)}
            />
          ))}
        </PanelSurface>

        <PanelSurface data-melius-ui-id="overview-actions-panel" data-melius-ui-role="panel">
          <div className="p-4">
            <SectionTitle title={copy.sections.nextActions} action={copy.actions.sort} actionId="overview-actions-sort" onAction={() => onUtility(copy.actions.sort, localized(language, 'Next actions are sorted by cash impact and due time.', '次のアクションを資金影響と期限順に並び替えました。'), SlidersHorizontal)} />
          </div>
          {nextActions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              copy={copy}
              language={language}
              completed={completedActionIds.includes(action.id)}
              onToggle={() => onToggleAction(action.id)}
              onOpen={() => onOpenPanel(getActionPanel(action, copy, language))}
            />
          ))}
        </PanelSurface>
      </div>

      <PanelSurface data-melius-ui-id="overview-cash-snapshot-panel" data-melius-ui-role="panel">
        <div className="p-4">
          <SectionTitle title={copy.sections.cashSnapshot} action={copy.actions.reconcile} actionId="overview-cash-reconcile" onAction={() => onUtility(copy.actions.reconcile, localized(language, 'Bank balance, incoming payments, and scheduled payments are ready to reconcile.', '銀行残高、入金予定、支払い予定を照合できます。'), Landmark)} />
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {cashSnapshot.map((item) => (
              <MeterRow key={item.id} id={item.id} label={item.label[language]} value={item.value[language]} barClass={item.barClass} tone={item.tone} />
            ))}
          </div>
        </div>
      </PanelSurface>
    </div>
  );
}

function RevenueView({
  copy,
  language,
  filter,
  searchTerm,
  onFilter,
  onOpenPanel,
  onUtility,
}: {
  copy: AppCopy;
  language: Language;
  filter: RevenueFilter;
  searchTerm: string;
  onFilter: (filter: RevenueFilter) => void;
  onOpenPanel: (panel: DetailPanel) => void;
  onUtility: (title: string, body: string, icon?: LucideIcon) => void;
}) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleServices = serviceRevenue.filter((service) => {
    if (filter === 'customers') {
      return false;
    }
    return service.name.en.toLowerCase().includes(normalizedSearch) || service.name.ja.toLowerCase().includes(normalizedSearch);
  });
  const visibleCustomers = customerSales.filter((customer) => {
    if (filter === 'services') {
      return false;
    }
    return customer.name.toLowerCase().includes(normalizedSearch) || customer.segment.en.toLowerCase().includes(normalizedSearch) || customer.segment.ja.toLowerCase().includes(normalizedSearch);
  });

  return (
    <div data-melius-ui-id="revenue-workspace" data-melius-ui-role="workspace" className="content-rise space-y-5">
      <div data-melius-ui-id="revenue-filter-bar" data-melius-ui-role="filters" className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={copy.sections.revenueTrend} />
        <div className="flex flex-wrap gap-2">
          <FilterButton dataId="revenue-filter-all" selected={filter === 'all'} onClick={() => onFilter('all')}>{copy.filters.all}</FilterButton>
          <FilterButton dataId="revenue-filter-services" selected={filter === 'services'} onClick={() => onFilter('services')}>{copy.filters.services}</FilterButton>
          <FilterButton dataId="revenue-filter-customers" selected={filter === 'customers'} onClick={() => onFilter('customers')}>{copy.filters.customers}</FilterButton>
          <SecondaryButton dataId="revenue-export-csv" roleName="button" onClick={() => onUtility(copy.actions.exportCsv, localized(language, 'Revenue rows are ready for CSV export.', '売上一覧をCSV出力できます。'), Download)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {copy.actions.exportCsv}
          </SecondaryButton>
        </div>
      </div>

      <RevenueChart language={language} />

      {filter !== 'customers' ? (
        <div>
          <SectionTitle title={copy.sections.serviceRevenue} />
          <div data-melius-ui-id="service-revenue-list" data-melius-ui-role="list" className="mt-3 grid gap-3 lg:grid-cols-2">
            {visibleServices.map((service) => (
              <CardSurface key={service.id} data-melius-ui-id={`service-revenue-card-${service.id}`} data-melius-ui-role="card">
                <button type="button" onClick={() => onOpenPanel(getServicePanel(service, copy, language))} className="block w-full p-4 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-black text-zinc-950 dark:text-white">{service.name[language]}</h3>
                      <div className="mt-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">{service.revenue[language]} / {service.share}</div>
                    </div>
                    <StatusBadge tone={service.tone}>{service.margin}</StatusBadge>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-zinc-950/[0.08] dark:bg-white/[0.10]">
                    <div className={`${service.barClass} h-2 ${getBarClass(service.tone)}`} />
                  </div>
                </button>
              </CardSurface>
            ))}
          </div>
        </div>
      ) : null}

      {filter !== 'services' ? (
        <div>
          <SectionTitle title={copy.sections.customerRevenue} action={copy.actions.sendReminder} actionId="revenue-send-reminder" onAction={() => onUtility(copy.actions.sendReminder, localized(language, 'Reminder candidates are highlighted in the customer list.', '催促候補を顧客一覧で確認できます。'), Bell)} />
          <div className="mt-3">
            <CustomerTable rows={visibleCustomers} copy={copy} language={language} onOpen={(customer) => onOpenPanel(getCustomerPanel(customer, copy, language))} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CashflowView({
  copy,
  language,
  windowValue,
  onWindow,
  onOpenPanel,
  onUtility,
}: {
  copy: AppCopy;
  language: Language;
  windowValue: CashflowWindow;
  onWindow: (windowValue: CashflowWindow) => void;
  onOpenPanel: (panel: DetailPanel) => void;
  onUtility: (title: string, body: string, icon?: LucideIcon) => void;
}) {
  return (
    <div data-melius-ui-id="cashflow-workspace" data-melius-ui-role="workspace" className="content-rise space-y-5">
      <div data-melius-ui-id="cashflow-window-filter" data-melius-ui-role="filters" className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={copy.sections.runway} />
        <div className="flex flex-wrap gap-2">
          <FilterButton dataId="cashflow-window-30" selected={windowValue === '30'} onClick={() => onWindow('30')}>{copy.filters.days30}</FilterButton>
          <FilterButton dataId="cashflow-window-60" selected={windowValue === '60'} onClick={() => onWindow('60')}>{copy.filters.days60}</FilterButton>
          <FilterButton dataId="cashflow-window-90" selected={windowValue === '90'} onClick={() => onWindow('90')}>{copy.filters.days90}</FilterButton>
        </div>
      </div>

      <PanelSurface data-melius-ui-id="cashflow-runway-panel" data-melius-ui-role="panel">
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-2">
            {runwayForecast.map((item) => (
              <MeterRow
                key={item.id}
                id={item.id}
                label={`${item.date[language]} / ${item.note[language]}`}
                value={item.balance[language]}
                barClass={item.barClass}
                tone={item.tone}
                onOpen={() => onUtility(item.date[language], localized(language, 'Cash runway is calculated from sample incoming and outgoing schedules.', '資金残はサンプルの入金予定と支払い予定から算出しています。'), Wallet)}
              />
            ))}
          </div>
        </div>
      </PanelSurface>

      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <SectionTitle title={copy.sections.incoming} action={copy.actions.reconcile} actionId="cashflow-reconcile-incoming" onAction={() => onUtility(copy.actions.reconcile, localized(language, 'Incoming payments are ready for bank reconciliation.', '入金予定を銀行入金と照合できます。'), Banknote)} />
          <div className="mt-3">
            <PaymentTable id="incoming-payments-table" rows={incomingPayments} copy={copy} language={language} onOpen={(row) => onOpenPanel(getCashPanel(row, copy, language))} />
          </div>
        </div>
        <div>
          <SectionTitle title={copy.sections.outgoing} action={copy.actions.schedule} actionId="cashflow-schedule-payments" onAction={() => onUtility(copy.actions.schedule, localized(language, 'Payment dates are ready for schedule review.', '支払い予定日を確認できます。'), CalendarClock)} />
          <div className="mt-3">
            <PaymentTable id="outgoing-payments-table" rows={outgoingPayments} copy={copy} language={language} onOpen={(row) => onOpenPanel(getCashPanel(row, copy, language))} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpensesView({
  copy,
  language,
  filter,
  onFilter,
  onOpenPanel,
  onUtility,
}: {
  copy: AppCopy;
  language: Language;
  filter: ExpenseFilter;
  onFilter: (filter: ExpenseFilter) => void;
  onOpenPanel: (panel: DetailPanel) => void;
  onUtility: (title: string, body: string, icon?: LucideIcon) => void;
}) {
  const visibleExpenses = expenseCategories.filter((expense) => filter === 'all' || expense.type === filter);

  return (
    <div data-melius-ui-id="expenses-workspace" data-melius-ui-role="workspace" className="content-rise space-y-5">
      <div data-melius-ui-id="expenses-filter-bar" data-melius-ui-role="filters" className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={copy.sections.expenseCategories} />
        <div className="flex flex-wrap gap-2">
          <FilterButton dataId="expense-filter-all" selected={filter === 'all'} onClick={() => onFilter('all')}>{copy.filters.all}</FilterButton>
          <FilterButton dataId="expense-filter-fixed" selected={filter === 'fixed'} onClick={() => onFilter('fixed')}>{copy.filters.fixed}</FilterButton>
          <FilterButton dataId="expense-filter-variable" selected={filter === 'variable'} onClick={() => onFilter('variable')}>{copy.filters.variable}</FilterButton>
        </div>
      </div>

      <PanelSurface data-melius-ui-id="expense-category-panel" data-melius-ui-role="panel">
        <div className="p-4">
          <div className="grid gap-2">
            {visibleExpenses.map((expense) => (
              <MeterRow
                key={expense.id}
                id={`expense-${expense.id}`}
                label={`${expense.name[language]} / ${expense.change}`}
                value={expense.amount[language]}
                barClass={expense.barClass}
                tone={expense.tone}
                onOpen={() => onOpenPanel(getExpensePanel(expense, copy, language))}
              />
            ))}
          </div>
        </div>
      </PanelSurface>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <PanelSurface data-melius-ui-id="fixed-costs-panel" data-melius-ui-role="panel">
          <div className="p-4">
            <SectionTitle title={copy.sections.fixedCosts} action={copy.actions.review} actionId="fixed-costs-review" onAction={() => onUtility(copy.sections.fixedCosts, localized(language, 'Recurring costs are ready for budget review.', '固定費を予算確認できます。'), ReceiptText)} />
          </div>
          {fixedCosts.map((cost) => (
            <button
              key={cost.id}
              type="button"
              data-melius-ui-id={`fixed-cost-row-${cost.id}`}
              data-melius-ui-role="list-item"
              onClick={() => onOpenPanel(getExpensePanel(cost, copy, language))}
              className="flex w-full items-center justify-between gap-3 border-t border-zinc-950/[0.08] p-4 text-left transition-colors hover:bg-zinc-950/[0.035] dark:border-white/[0.08] dark:hover:bg-white/[0.045]"
            >
              <div className="min-w-0">
                <div className="truncate font-black text-zinc-950 dark:text-white">{cost.title[language]}</div>
                <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{cost.due[language]}</div>
              </div>
              <div className="font-black text-zinc-950 dark:text-white">{cost.amount[language]}</div>
            </button>
          ))}
        </PanelSurface>

        <div>
          <SectionTitle title={copy.sections.paymentQueue} action={copy.actions.schedule} actionId="expenses-schedule-payments" onAction={() => onUtility(copy.actions.schedule, localized(language, 'Upcoming payments are ready to schedule.', '今後の支払いを予定化できます。'), CalendarClock)} />
          <div className="mt-3">
            <PaymentTable id="expense-payment-queue" rows={outgoingPayments} copy={copy} language={language} onOpen={(row) => onOpenPanel(getCashPanel(row, copy, language))} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsView({
  copy,
  language,
  completedActionIds,
  onToggleAction,
  onOpenPanel,
  onUtility,
}: {
  copy: AppCopy;
  language: Language;
  completedActionIds: string[];
  onToggleAction: (id: string) => void;
  onOpenPanel: (panel: DetailPanel) => void;
  onUtility: (title: string, body: string, icon?: LucideIcon) => void;
}) {
  return (
    <div data-melius-ui-id="insights-workspace" data-melius-ui-role="workspace" className="content-rise space-y-5">
      <div>
        <SectionTitle title={copy.sections.drivers} action={copy.actions.compare} actionId="insights-compare" onAction={() => onUtility(copy.actions.compare, localized(language, 'Revenue, margin, and cash changes are ready for comparison.', '売上、粗利、現金の変化を比較できます。'), Target)} />
        <div data-melius-ui-id="insight-driver-grid" data-melius-ui-role="cards" className="mt-3 grid gap-3 lg:grid-cols-3">
          {insights.map((insight) => (
            <CardSurface key={insight.id} data-melius-ui-id={`insight-card-${insight.id}`} data-melius-ui-role="card">
              <button type="button" onClick={() => onOpenPanel(getInsightPanel(insight, copy, language))} className="block h-full w-full p-4 text-left">
                <ToneIcon tone={insight.tone} icon={insight.icon} />
                <h3 className="mt-4 font-black text-zinc-950 dark:text-white">{insight.title[language]}</h3>
                <p className="mt-2 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{insight.body[language]}</p>
                <div className="mt-4">
                  <StatusBadge tone={insight.tone}>{insight.impact[language]}</StatusBadge>
                </div>
              </button>
            </CardSurface>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PanelSurface data-melius-ui-id="outlook-panel" data-melius-ui-role="panel">
          <div className="p-4">
            <SectionTitle title={copy.sections.outlook} action={copy.actions.review} actionId="outlook-review" onAction={() => onUtility(copy.sections.outlook, localized(language, 'Month-end forecast assumptions are ready for review.', '月末見込みの前提を確認できます。'), Lightbulb)} />
            <div className="mt-3 grid gap-3">
              {outlookCards.map((card) => (
                <div key={card.id} data-melius-ui-id={`outlook-card-${card.id}`} data-melius-ui-role="metric" className="rounded-lg border border-zinc-950/[0.08] bg-zinc-50 p-3 dark:border-white/[0.08] dark:bg-white/[0.05]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{card.label[language]}</div>
                      <div className="mt-1 text-xl font-black text-zinc-950 dark:text-white">{card.value[language]}</div>
                    </div>
                    <StatusBadge tone={card.tone}>{copy.labels.confidence} {card.confidence}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PanelSurface>

        <PanelSurface data-melius-ui-id="insight-next-actions-panel" data-melius-ui-role="panel">
          <div className="p-4">
            <SectionTitle title={copy.sections.todos} action={copy.actions.schedule} actionId="insight-actions-schedule" onAction={() => onUtility(copy.actions.schedule, localized(language, 'Open actions are ready for calendar scheduling.', '未完了アクションをカレンダー予定にできます。'), CalendarClock)} />
          </div>
          {nextActions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              copy={copy}
              language={language}
              completed={completedActionIds.includes(action.id)}
              onToggle={() => onToggleAction(action.id)}
              onOpen={() => onOpenPanel(getActionPanel(action, copy, language))}
            />
          ))}
        </PanelSurface>
      </div>
    </div>
  );
}

function FilterButton({ dataId, selected, onClick, children }: { dataId: string; selected: boolean; onClick: () => void; children: ReactNode }) {
  if (selected) {
    return (
      <button
        type="button"
        data-melius-ui-id={dataId}
        data-melius-ui-role="filter"
        aria-pressed="true"
        onClick={onClick}
        className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-950 px-3 text-sm font-black text-white dark:bg-white dark:text-zinc-950"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role="filter"
      aria-pressed="false"
      onClick={onClick}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-950/[0.10] bg-white/[0.72] px-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-white hover:text-zinc-950 dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

function Toast({ notice }: { notice: NoticeState }) {
  return (
    <div data-melius-ui-id="toast-notice" data-melius-ui-role="status" className="toast-enter fixed bottom-4 right-4 z-[60] max-w-sm rounded-lg border border-zinc-950/[0.10] bg-white p-4 shadow-xl shadow-zinc-950/15 dark:border-white/[0.10] dark:bg-zinc-950">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="font-black text-zinc-950 dark:text-white">{notice.title}</div>
          {notice.body ? <div className="mt-1 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{notice.body}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    overview: true,
    revenue: true,
    cashflow: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('all');
  const [cashflowWindow, setCashflowWindow] = useState<CashflowWindow>('90');
  const [expenseFilter, setExpenseFilter] = useState<ExpenseFilter>('all');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const copy = COPY[language];
  const [inspectorPanel, setInspectorPanel] = useState<DetailPanel>(() => getDefaultPanel('overview', COPY.en, 'en'));
  const [modalPanel, setModalPanel] = useState<DetailPanel | null>(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyLanguage(language, copy.metaTitle);
  }, [language, copy.metaTitle]);

  useEffect(() => {
    setInspectorPanel(getDefaultPanel(activeTab, copy, language));
  }, [activeTab, copy, language]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const showNotice = (title: string, body?: string) => {
    setNotice({ id: Date.now(), title, body });
  };

  const openPanel = (panel: DetailPanel) => {
    setInspectorPanel(panel);

    if (panel.presentation === 'modal') {
      setModalPanel(panel);
    }
  };

  const openUtilityPanel = (title: string, body: string, icon: LucideIcon = Settings) => {
    const panel: DetailPanel = {
      eyebrow: localized(language, 'Workspace action', 'ワークスペース操作'),
      title,
      body,
      icon,
      tone: 'stone',
      meta: [
        { label: copy.labels.status, value: localized(language, 'Ready', '準備完了') },
        { label: copy.labels.owner, value: copy.userName },
        { label: localized(language, 'Template', 'テンプレート'), value: TEMPLATE_ID },
      ],
      primaryLabel: copy.actions.open,
      secondaryLabel: copy.actions.review,
    };

    setInspectorPanel(panel);
    showNotice(title, body);
  };

  const handlePrimaryPanelAction = () => {
    showNotice(inspectorPanel.primaryLabel, localized(language, 'The selected dashboard action responded in this UI template.', '選択中のダッシュボード操作が反応しました。'));
  };

  const handleSecondaryPanelAction = () => {
    showNotice(inspectorPanel.secondaryLabel, localized(language, 'Secondary details are available in the inspector.', '補足情報をインスペクターで確認できます。'));
  };

  const handleModalPrimary = () => {
    if (modalPanel) {
      showNotice(modalPanel.primaryLabel, modalPanel.title);
    }
    setModalPanel(null);
  };

  const handleModalSecondary = () => {
    if (modalPanel) {
      showNotice(modalPanel.secondaryLabel, modalPanel.title);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((current) => ({ ...current, [id]: !current[id] }));
  };

  const toggleAlert = (id: string) => {
    setDismissedAlertIds((current) => {
      const exists = current.includes(id);
      showNotice(exists ? localized(language, 'Alert reopened', 'アラートを戻しました') : localized(language, 'Alert acknowledged', 'アラートを確認済みにしました'));
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const toggleAction = (id: string) => {
    setCompletedActionIds((current) => {
      const exists = current.includes(id);
      showNotice(exists ? localized(language, 'Action reopened', 'アクションを未完了に戻しました') : localized(language, 'Action completed', 'アクションを完了にしました'));
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const filteredAlertCount = useMemo(() => alerts.filter((alert) => !dismissedAlertIds.includes(alert.id)).length, [dismissedAlertIds]);

  const content = (() => {
    if (activeTab === 'revenue') {
      return (
        <RevenueView
          copy={copy}
          language={language}
          filter={revenueFilter}
          searchTerm={searchTerm}
          onFilter={(filter) => {
            setRevenueFilter(filter);
            showNotice(copy.actions.filter, localized(language, 'Revenue view filter updated.', '売上ビューの絞り込みを更新しました。'));
          }}
          onOpenPanel={openPanel}
          onUtility={openUtilityPanel}
        />
      );
    }

    if (activeTab === 'cashflow') {
      return (
        <CashflowView
          copy={copy}
          language={language}
          windowValue={cashflowWindow}
          onWindow={(windowValue) => {
            setCashflowWindow(windowValue);
            showNotice(copy.actions.filter, localized(language, 'Cashflow window updated.', '資金繰りの表示期間を更新しました。'));
          }}
          onOpenPanel={openPanel}
          onUtility={openUtilityPanel}
        />
      );
    }

    if (activeTab === 'expenses') {
      return (
        <ExpensesView
          copy={copy}
          language={language}
          filter={expenseFilter}
          onFilter={(filter) => {
            setExpenseFilter(filter);
            showNotice(copy.actions.filter, localized(language, 'Expense filter updated.', '経費の絞り込みを更新しました。'));
          }}
          onOpenPanel={openPanel}
          onUtility={openUtilityPanel}
        />
      );
    }

    if (activeTab === 'insights') {
      return (
        <InsightsView
          copy={copy}
          language={language}
          completedActionIds={completedActionIds}
          onToggleAction={toggleAction}
          onOpenPanel={openPanel}
          onUtility={openUtilityPanel}
        />
      );
    }

    return (
      <OverviewView
        copy={copy}
        language={language}
        dismissedAlertIds={dismissedAlertIds}
        completedActionIds={completedActionIds}
        onOpenPanel={openPanel}
        onToggleAlert={toggleAlert}
        onToggleAction={toggleAction}
        onUtility={openUtilityPanel}
      />
    );
  })();

  return (
    <AppShell data-melius-ui-id="owner-pulse-app-shell" data-melius-ui-role="app">
      <WorkspaceFrame data-melius-ui-id="owner-pulse-workspace-frame" data-melius-ui-role="layout">
        <SidebarShell data-melius-ui-id="desktop-sidebar" data-melius-ui-role="navigation">
          <SidebarContent
            copy={copy}
            language={language}
            activeTab={activeTab}
            expandedItems={expandedItems}
            idPrefix="desktop-nav"
            onSelectTab={setActiveTab}
            onToggleExpanded={toggleExpanded}
            onUtilityAction={openUtilityPanel}
          />
        </SidebarShell>

        {sidebarOpen ? (
          <>
            <Overlay data-melius-ui-id="mobile-sidebar-overlay" data-melius-ui-role="overlay" onClick={() => setSidebarOpen(false)}>
              <span className="sr-only">{copy.closeSidebar}</span>
            </Overlay>
            <MobileDrawer data-melius-ui-id="mobile-sidebar" data-melius-ui-role="navigation">
              <SidebarContent
                copy={copy}
                language={language}
                activeTab={activeTab}
                expandedItems={expandedItems}
                idPrefix="mobile-nav"
                onSelectTab={setActiveTab}
                onToggleExpanded={toggleExpanded}
                onUtilityAction={openUtilityPanel}
                onCloseMobile={() => setSidebarOpen(false)}
              />
            </MobileDrawer>
          </>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader data-melius-ui-id="workspace-topbar" data-melius-ui-role="header">
            <IconButton dataId="mobile-menu-button" roleName="button" label={copy.openSidebar} onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <div data-melius-ui-id="topbar-tab-list" data-melius-ui-role="tabs" className="hidden min-w-0 items-center border-l border-zinc-950/[0.14] pl-2 dark:border-white/[0.12] md:flex">
              {tabs.map((tab) => (
                <TabButton key={tab} dataId={`top-tab-${tab}`} roleName="tab" selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
                  {copy.tabs[tab]}
                </TabButton>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <SearchInput
                dataId="workspace-search"
                roleName="search"
                label={copy.searchLabel}
                type="search"
                placeholder={copy.search}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
              />
            </div>
            <LanguageSwitcher copy={copy} language={language} onLanguageChange={setLanguage} />
            <ThemeSwitcher copy={copy} theme={theme} onThemeChange={setTheme} />
            <IconButton dataId="topbar-export" roleName="button" label={copy.export} onClick={() => openUtilityPanel(copy.export, localized(language, 'The current dashboard view is prepared for export.', '現在のダッシュボード表示を書き出す準備ができました。'), Download)}>
              <Download className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <IconButton dataId="topbar-alerts" roleName="button" label={copy.notifications} onClick={() => openUtilityPanel(copy.notifications, localized(language, `${filteredAlertCount} active alerts need review.`, `${filteredAlertCount}件のアクティブな注意項目があります。`), Bell)}>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </WorkspaceHeader>

          <div className="md:hidden">
            <div data-melius-ui-id="mobile-tab-list" data-melius-ui-role="tabs" className="thin-scrollbar flex gap-1 overflow-x-auto border-b border-zinc-950/[0.12] bg-[#f8f6ef]/[0.92] px-3 py-2 dark:border-white/[0.08] dark:bg-[#141310]/[0.86]">
              {tabs.map((tab) => (
                <TabButton key={tab} dataId={`mobile-tab-${tab}`} roleName="tab" selected={activeTab === tab} onClick={() => setActiveTab(tab)}>
                  {copy.tabs[tab]}
                </TabButton>
              ))}
            </div>
          </div>

          <main data-melius-ui-id="workspace-main" data-melius-ui-role="main" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-5 p-4 lg:p-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <div className="min-w-0 space-y-5">
                <WorkspaceHero
                  tab={activeTab}
                  copy={copy}
                  language={language}
                  onPrimary={() => openPanel(getDefaultPanel(activeTab, copy, language))}
                  onSecondary={() => openUtilityPanel(copy.headers[activeTab].secondary, copy.headers[activeTab].body, Filter)}
                />
                {content}
              </div>
              <InspectorPanel panel={inspectorPanel} copy={copy} onPrimary={handlePrimaryPanelAction} onSecondary={handleSecondaryPanelAction} />
            </div>
          </main>
        </div>
      </WorkspaceFrame>

      {modalPanel ? (
        <DetailModal
          panel={modalPanel}
          copy={copy}
          onClose={() => setModalPanel(null)}
          onPrimary={handleModalPrimary}
          onSecondary={handleModalSecondary}
        />
      ) : null}

      {notice ? <Toast key={notice.id} notice={notice} /> : null}
    </AppShell>
  );
}
