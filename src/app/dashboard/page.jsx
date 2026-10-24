// Updated quick services image upload pipeline (up to 200MB, all image formats, screenshots & PDF)
'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AdminStatCard, AdminSectionCard, AdminMoney, AdminButton, AdminInput } from './AdminUI';

const managerLoading = () => <div className="empty-state">Loading section...</div>;
const dynamicManager = (loader) => dynamic(loader, { loading: managerLoading });

// Admin managers are large and only one is visible at a time. Loading the active
// manager on demand keeps the initial dashboard bundle small without changing tabs.
const QuickServicesManager = dynamicManager(() => import('../components/QuickServicesManager'));
const PrimaryServicesManager = dynamicManager(() => import('../components/PrimaryServicesManager'));
const ProfessionalServicesManager = dynamicManager(() => import('../components/ProfessionalServicesManager'));
const ProfessionalEnquiriesManager = dynamicManager(() => import('../components/ProfessionalEnquiriesManager'));
const ShopNowManager = dynamicManager(() => import('../components/ShopNowManager'));
const ShopProductsManager = dynamicManager(() => import('../components/ShopNowManager').then((m) => m.ShopProductsManager));
const PropertiesManager = dynamicManager(() => import('../components/PropertiesManager'));
const PropertyBookingsManager = dynamicManager(() => import('../components/PropertyBookingsManager'));
const ProjectsManager = dynamicManager(() => import('../components/ProjectsManager'));
const OperationalProjectsManager = dynamicManager(() => import('../components/OperationalProjectsManager'));
const PartyProjectManagement = dynamicManager(() => import('../components/PartyProjectManagement'));
const VendorManagementAdmin = dynamicManager(() => import('../components/VendorManagementAdmin'));
const ProductApprovalsAdmin = dynamicManager(() => import('../components/ProductApprovalsAdmin'));
const UserManagementAdmin = dynamicManager(() => import('../components/UserManagementAdmin'));
const SupplierHubAdmin = dynamicManager(() => import('../components/SupplierHubAdmin'));
const FranchisesManager = dynamicManager(() => import('./franchises/page'));
const AgentsManager = dynamicManager(() => import('./agents/page'));
const BookingsManager = dynamicManager(() => import('../components/BookingsManager'));
const FreeTimeSlotsManager = dynamicManager(() => import('../components/FreeTimeSlotsManager'));
const QuickServicesPricing = dynamicManager(() => import('../components/QuickServicesPricing'));
const CalculatorManager = dynamicManager(() => import('../components/CalculatorManager'));
const RevenueManager = dynamicManager(() => import('../components/RevenueManager'));
const HeroBannersManager = dynamicManager(() => import('../components/HeroBannersManager'));
const JobsManager = dynamicManager(() => import('../components/JobsManager'));
const OfficeLocationsManager = dynamicManager(() => import('../components/OfficeLocationsManager'));
const LeadManagementAdmin = dynamicManager(() => import('../components/LeadManagementAdmin'));
const PropertyEnquiriesManager = dynamicManager(() => import('../components/PropertyEnquiriesManager'));
const CitiesManager = dynamicManager(() => import('../components/CitiesManager'));
const FaqsManager = dynamicManager(() => import('../components/FaqsManager'));
const ReviewsManager = dynamicManager(() => import('../components/ReviewsManager'));
const BlogsManager = dynamicManager(() => import('../components/BlogsManager'));
const ShippingSettingsManager = dynamicManager(() => import('../components/ShippingSettingsManager'));
const ShopCommissionSettingsManager = dynamicManager(() => import('../components/ShopCommissionSettingsManager'));
const PmDashboard = dynamicManager(() => import('../components/PmDashboard'));
const PmAuditLog = dynamicManager(() => import('../components/PmAuditLog'));
const OrdersHistoryManager = dynamicManager(() => import('../components/OrdersHistoryManager'));
const CashbackManager = dynamicManager(() => import('../components/CashbackManager'));

import {
  LayoutDashboard, UserCog, Calculator, FileText, Briefcase, BriefcaseBusiness,
  ClipboardList, MapPin, Building, Mail, Store, CalendarClock, HelpCircle, Star,
  ImageIcon, Newspaper, Layers, MessageSquare, Users, Building2, FolderKanban,
  House, Zap, Wrench, CircleDollarSign, CalendarDays, Tags, ShoppingCart,
  PlusCircle, Truck, HardHat, PackageCheck, Eye, Trash2, X,
  Clock, CheckCircle2, ShieldCheck, Ban, ActionIconButton, Pencil, Plus, Wallet,
  ArrowLeft,
} from '@/app/components/ui/icons';

function hasResumeFile(resumeUrl) {
  const value = String(resumeUrl || '').trim();
  return Boolean(value) && !['not uploaded', 'null', 'undefined', 'n/a', '-'].includes(value.toLowerCase());
}

function getResumeActionUrl(resumeUrl, mode) {
  if (!hasResumeFile(resumeUrl)) return '';

  try {
    if (typeof window === 'undefined') return resumeUrl;
    const parsedUrl = new URL(resumeUrl, window.location.origin);
    const { pathname } = parsedUrl;
    const marker = '/uploads/resumes/';

    if (pathname.startsWith('/api/career-enquiries/resume/')) {
      parsedUrl.searchParams.set('mode', mode);
      return `${pathname}?${parsedUrl.searchParams.toString()}`;
    }

    if (!pathname.startsWith(marker)) return resumeUrl;

    const filename = pathname.slice(marker.length);
    return `/api/career-enquiries/resume/${encodeURIComponent(filename)}?mode=${mode}`;
  } catch {
    return resumeUrl;
  }
}

function getResumeViewerUrl(resumeUrl, resumeName) {
  const viewUrl = getResumeActionUrl(resumeUrl, 'view');
  if (!viewUrl) return '';

  const params = new URLSearchParams({
    url: viewUrl,
    name: resumeName || 'Resume',
  });

  return `/dashboard/resume-viewer?${params.toString()}`;
}

const CAREER_EDIT_FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', required: true },
  { name: 'alternative_phone', label: 'Alternative Phone' },
  { name: 'experience', label: 'Experience', required: true },
  { name: 'current_company', label: 'Current Company' },
  { name: 'notice_period', label: 'Notice Period' },
  { name: 'current_salary', label: 'Current Salary' },
  { name: 'expected_salary', label: 'Expected Salary' },
];

function makeCareerEditForm(application = {}) {
  return {
    name: application.name || '',
    email: application.email || '',
    phone: application.phone || '',
    alternative_phone: application.alternative_phone || '',
    experience: application.experience || '',
    current_company: application.current_company || '',
    notice_period: application.notice_period || '',
    current_salary: application.current_salary || '',
    expected_salary: application.expected_salary || '',
    cover_letter: application.cover_letter || '',
  };
}

function AdminDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');
  const initialProjectId = searchParams.get('projectId') || null;
  const isDarkMode = false;
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [calculatorQuotes, setCalculatorQuotes] = useState([]);
  const [selectedCalculatorQuote, setSelectedCalculatorQuote] = useState(null);
  const [primaryServiceEnquiries, setPrimaryServiceEnquiries] = useState([]);
  const [selectedPrimaryServiceEnquiry, setSelectedPrimaryServiceEnquiry] = useState(null);
  const [pseSearch, setPseSearch] = useState('');
  const [careerEnquiries, setCareerEnquiries] = useState([]);
  const [careerSearch, setCareerSearch] = useState('');
  const [selectedCareerEnquiry, setSelectedCareerEnquiry] = useState(null);
  const [careerStatus, setCareerStatus] = useState('New');
  const [careerNote, setCareerNote] = useState('');
  const [careerInterviewAt, setCareerInterviewAt] = useState('');
  const [careerSaving, setCareerSaving] = useState(false);
  const [careerEditForm, setCareerEditForm] = useState({});
  const [careerEditResume, setCareerEditResume] = useState(null);
  const [careerEditSaving, setCareerEditSaving] = useState(false);
  const [pendingProperties, setPendingProperties] = useState(0);
  const [pendingVendors, setPendingVendors] = useState(0);
  const [pendingSuppliers, setPendingSuppliers] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [activeVendorBookings, setActiveVendorBookings] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [todayCommission, setTodayCommission] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [supplierCommission, setSupplierCommission] = useState({ total: 0, today: 0, fulfilled: 0, open: 0 });
  const [shopVendorCommission, setShopVendorCommission] = useState({
    today: 0,
    total: 0,
    pending: 0,
    paid: 0,
    pendingVendors: [],
  });
  const [settlingVendor, setSettlingVendor] = useState(null);
  const [settleNote, setSettleNote] = useState('Settled offline by admin');
  const [isSettling, setIsSettling] = useState(false);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState('');
  const [pkgVendors, setPkgVendors] = useState([]);
  const [pkgSuppliers, setPkgSuppliers] = useState([]);
  const [pkgMsg, setPkgMsg] = useState('');
  const [packageSubTab, setPackageSubTab] = useState('approvals'); // 'approvals' | 'plans'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [plansList, setPlansList] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planSaving, setPlanSaving] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    id: '',
    name: '',
    duration_months: 6,
    price: 0,
    label: '',
    description: '',
    is_active: true,
    target_role: 'both',
    sort_order: 1,
  });
  const loadedData = useRef(new Set());
  const router = useRouter();

  // Sync tab from URL when navigating via sidebar
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const fetchPackageRequests = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/packages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPkgVendors(data.vendors || []);
        setPkgSuppliers(data.suppliers || []);
      }
    } catch (err) {
      console.error('Error fetching package requests:', err);
    }
  };

  const handlePackageAction = async (entityType, entityId, action) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          action: action
        })
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(data.message || 'Action completed successfully');
        fetchPackageRequests();
        setTimeout(() => setPkgMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to complete action');
      }
    } catch (err) {
      console.error('Package action error:', err);
      alert('Error updating package');
    }
  };

  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const headers = {};
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/admin/packages/plans', { headers });
      const data = await res.json();
      if (data.success) {
        setPlansList(data.plans || data.packages || []);
      } else {
        console.error('fetchPlans failed:', data.error);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleOpenPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({
        id: plan.id,
        name: plan.name || '',
        duration_months: plan.duration_months || 0,
        price: plan.price || 0,
        label: plan.label || '',
        description: plan.description || '',
        is_active: plan.is_active !== false,
        target_role: plan.target_role === 'both' ? 'all' : (plan.target_role || 'all'),
        sort_order: plan.sort_order ?? 0,
      });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        id: '',
        name: '',
        duration_months: 6,
        price: 0,
        label: '',
        description: '',
        is_active: true,
        target_role: 'all',
        sort_order: plansList.length + 1,
      });
    }
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    if (e) e.preventDefault();
    if (!planFormData.name || planFormData.duration_months === '' || planFormData.price === '') {
      alert('Please fill in Plan Name, Duration, and Price');
      return;
    }
    try {
      setPlanSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/packages/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planFormData)
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(editingPlan ? 'Plan updated successfully' : 'Plan created successfully');
        setPlanModalOpen(false);
        setEditingPlan(null);
        fetchPlans();
        setTimeout(() => setPkgMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to save plan');
      }
    } catch (err) {
      console.error('Save plan error:', err);
      alert('Error saving plan');
    } finally {
      setPlanSaving(false);
    }
  };

  const handleTogglePlanActive = async (plan) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/packages/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...plan,
          is_active: !plan.is_active
        })
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(`Plan ${!plan.is_active ? 'activated' : 'deactivated'} successfully`);
        fetchPlans();
        setTimeout(() => setPkgMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to update plan status');
      }
    } catch (err) {
      console.error('Toggle plan status error:', err);
      alert('Error updating plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/packages/plans', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: planId })
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(data.message || 'Plan deleted');
        fetchPlans();
        setTimeout(() => setPkgMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to delete plan');
      }
    } catch (err) {
      console.error('Delete plan error:', err);
      alert('Error deleting plan');
    }
  };

  useEffect(() => {
    if (activeTab === 'packages') {
      fetchPackageRequests();
      fetchPlans();
    }
  }, [activeTab, packageSubTab]);

  const fetchPrimaryServiceEnquiries = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const primaryEnquiryRes = await fetch('/api/primary-service-enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const primaryEnquiryData = await primaryEnquiryRes.json();
      if (primaryEnquiryData.success) setPrimaryServiceEnquiries(primaryEnquiryData.data);
    } catch (error) {
      console.error('Error fetching primary service enquiries:', error);
    }
  }, []);

  const handleMarkVendorCommissionPaid = async (vendor) => {
    if (!vendor) return;
    try {
      setIsSettling(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/shop-commissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendor_id: vendor.vendor_id,
          note: settleNote || 'Settled offline by admin',
        }),
      });
      const data = await res.json();
      if (data?.success) {
        if (data.data) {
          setShopVendorCommission({
            today: parseFloat(data.data.today || 0),
            total: parseFloat(data.data.total || 0),
            pending: parseFloat(data.data.pending || 0),
            paid: parseFloat(data.data.paid || 0),
            pendingVendors: data.data.pendingVendors || [],
          });
        }
        setSettlingVendor(null);
        setSettleNote('Settled offline by admin');
        setSettleSuccessMsg(`✓ Recorded ₹${Number(vendor.pending_due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} as paid for ${vendor.vendor_name}`);
        setTimeout(() => setSettleSuccessMsg(''), 5000);
      } else {
        alert(data?.error || 'Failed to update commission status');
      }
    } catch (err) {
      console.error('Error marking commission as paid:', err);
      alert('Error marking commission as paid');
    } finally {
      setIsSettling(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataKey = ['overview', 'submissions', 'calculator-quotes', 'primary-service-enquiries', 'career-enquiries'].includes(activeTab)
        ? activeTab
        : null;

      if (!dataKey || loadedData.current.has(dataKey)) {
        setLoading(false);
        return;
      }

      loadedData.current.add(dataKey);

      try {
        const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const requestJson = async (url, options = {}) => {
          try {
            const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
          }
        };

        if (activeTab === 'submissions') {
          const data = await requestJson('/api/contact');
          if (data?.success) setSubmissions(data.data || []);
          return;
        }

        if (activeTab === 'calculator-quotes') {
          const data = await requestJson('/api/calculator-quote-otp?limit=100&page=1');
          if (data?.success) setCalculatorQuotes(data.data || []);
          return;
        }

        if (activeTab === 'primary-service-enquiries') {
          await fetchPrimaryServiceEnquiries();
          return;
        }

        if (activeTab === 'career-enquiries') {
          const data = await requestJson('/api/career-enquiries?limit=100&page=1');
          if (data?.success) setCareerEnquiries(data.data || []);
          return;
        }

        // Overview requests are independent, so do them concurrently. Previously
        // each slow endpoint delayed every endpoint after it and blocked the page.
        setLoading(false);
        await Promise.all([
          requestJson('/api/contact').then((data) => {
            if (data?.success) setSubmissions(data.data || []);
          }),
          requestJson('/api/properties?status=pending&fields=list&limit=1&page=1').then((data) => {
            if (data?.success) setPendingProperties(data.pagination?.total || (data.data || []).length);
          }),
          requestJson('/api/admin/vendors?status=pending&counts=1').then((data) => {
            if (data?.success) setPendingVendors(data.pagination?.total || 0);
          }),
          requestJson('/api/admin/suppliers?status=pending&counts=1').then((data) => {
            if (data?.success) setPendingSuppliers(data.pagination?.total || 0);
          }),
          requestJson('/api/admin/suppliers', { method: 'PATCH' }).then((data) => {
            if (data?.success) {
              setSupplierCommission({
                total: parseFloat(data.data.total_commission || 0),
                today: parseFloat(data.data.today_commission || 0),
                fulfilled: parseInt(data.data.total_fulfilled || 0),
                open: parseInt(data.data.open_enquiries || 0),
              });
            }
          }),
          requestJson('/api/admin/shop-commissions').then((data) => {
            if (data?.success && data?.data) {
              setShopVendorCommission({
                today: parseFloat(data.data.today || 0),
                total: parseFloat(data.data.total || 0),
                pending: parseFloat(data.data.pending || 0),
                paid: parseFloat(data.data.paid || 0),
                pendingVendors: data.data.pendingVendors || [],
              });
            }
          }),
          requestJson('/api/admin/bookings').then((data) => {
            if (!data?.success) return;

            const all = data.data || [];
            const today = new Date().toISOString().split('T')[0];
            const completed = all.filter(b => b.status === 'COMPLETED');
            const calcCommission = b => Math.round((parseFloat(b.final_amount || b.total_amount || 0)) * 0.15);
            const calcGST = b => Math.round((parseFloat(b.final_amount || b.total_amount || 0)) * 0.18);

            setPendingBookings(all.filter(b => b.status === 'WAITING_FOR_VENDOR_ACCEPTANCE').length);
            setCompletedBookings(completed.length);
            setActiveVendorBookings(all.filter(b => ['VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS'].includes(b.status)).length);
            setTotalCommission(completed.reduce((sum, booking) => sum + calcCommission(booking), 0));
            setTotalGST(completed.reduce((sum, booking) => sum + calcGST(booking), 0));
            setTodayCommission(
              completed
                .filter(b => b.completed_at && b.completed_at.startsWith(today))
                .reduce((sum, booking) => sum + calcCommission(booking), 0)
            );
          }),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, fetchPrimaryServiceEnquiries]);

  const stats = [
    { label: 'Pending Bookings', value: pendingBookings, icon: Clock, color: 'a' },
    { label: 'Active (On Way/Work)', value: activeVendorBookings, icon: Truck, color: 'b' },
    { label: 'Completed Bookings', value: completedBookings, icon: CheckCircle2, color: 'c' },
    { label: 'Pending Vendors', value: pendingVendors, icon: HardHat, color: 'd' },
  ];

  const getStatusColor = (status) => {
    const map = {
      'New': 'status-new',
      'Site Visit': 'status-new',
      'Estimate': 'status-pending',
      'Planning': 'status-contacted',
      'Work Start': 'status-pending',
      'Complete': 'status-resolved',
      'Pending': 'status-pending',
      'Contacted': 'status-contacted',
      'Resolved': 'status-resolved',
    };
    return map[status] || 'status-new';
  };
  const primaryServiceStatuses = ['Pending', 'Site Visit', 'Estimate', 'Planning', 'Work Start', 'Complete'];
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'calculator-quotes', label: 'Calculator Quotes', icon: FileText },
    { id: 'hero-banners', label: 'Hero Banners', icon: ImageIcon },
    { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
    { id: 'blogs', label: 'SEO Blogs & Articles', icon: Newspaper },
    { id: 'career-enquiries', label: 'Career Enquiry', icon: Briefcase },
    { id: 'jobs', label: 'New Jobs', icon: BriefcaseBusiness },
    { id: 'lead-management', label: 'Lead Management', icon: ClipboardList },
    { id: 'office-locations', label: 'Office Locations', icon: MapPin },
    { id: 'cities', label: 'Cities', icon: Building },
    { id: 'submissions', label: 'Contact Forms', icon: Mail },
    { id: 'franchises', label: 'Franchises', icon: Store },
    { id: 'free-slots', label: 'Free Time Slots', icon: CalendarClock },
    { id: 'primary-services', label: 'Construction Services', icon: Layers },
    { id: 'primary-service-enquiries', label: 'Construction Enquiry', icon: MessageSquare },
    { id: 'professional-enquiries', label: 'Professional Enquiries', icon: MessageSquare },
    { id: 'professionals', label: 'Professional Services', icon: Users },
    { id: 'project-management', label: 'Project Management', icon: Building2 },
    { id: 'projects', label: 'Portfolio Projects', icon: FolderKanban },
    { id: 'properties', label: 'Properties', icon: House },
    { id: 'quick-enquiries', label: 'Quick Enquiry', icon: Zap },
    { id: 'quick-services', label: 'Quick Services', icon: Wrench },
    { id: 'revenue', label: 'Revenue & Earnings', icon: CircleDollarSign },
    { id: 'bookings', label: 'Service Bookings', icon: CalendarDays },
    { id: 'orders-history', label: 'Orders History', icon: ClipboardList },
    { id: 'shop-categories', label: 'Shop Now Manager', icon: ShoppingCart },
    { id: 'cashback', label: 'Cashback & Wallet', icon: Wallet },
    { id: 'shop-products', label: '+ Add Shop Product', icon: PlusCircle },
    { id: 'shipping-settings', label: 'Shipping Settings', icon: Truck },
    { id: 'shop-commission-settings', label: 'Vendor Commission', icon: CircleDollarSign },
    { id: 'packages', label: 'Package Approvals', icon: PackageCheck },
  ];

  const openCareerEnquiry = async (application) => {
    setSelectedCareerEnquiry(application);
    setCareerEditForm(makeCareerEditForm(application));
    setCareerEditResume(null);
    setCareerStatus(application.status || 'New');
    setCareerNote(application.status_note || '');
    setCareerInterviewAt(application.interview_at
      ? new Date(application.interview_at).toISOString().slice(0, 16)
      : '');
    try {
      const data = await requestJson(`/api/career-enquiries?id=${application.id}`);
      if (data?.success && data.data) {
        setSelectedCareerEnquiry(data.data);
        setCareerEditForm(makeCareerEditForm(data.data));
        setCareerStatus(data.data.status || 'New');
        setCareerNote(data.data.status_note || '');
        setCareerInterviewAt(data.data.interview_at
          ? new Date(data.data.interview_at).toISOString().slice(0, 16)
          : '');
      }
    } catch { /* keep list row */ }
  };

  const openCalculatorQuote = async (item) => {
    setSelectedCalculatorQuote(item);
    try {
      const data = await requestJson(`/api/calculator-quote-otp?id=${item.id}`);
      if (data?.success && data.data) setSelectedCalculatorQuote(data.data);
    } catch { /* keep list row */ }
  };

  const updateCareerApplication = async () => {
    if (!selectedCareerEnquiry) return;
    setCareerSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const response = await fetch('/api/career-enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedCareerEnquiry.id,
          status: careerStatus,
          note: careerNote,
          interview_at: careerStatus === 'Interview Scheduled' ? careerInterviewAt : null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Application update failed');
      setSelectedCareerEnquiry(data.data);
      setCareerEnquiries((current) => current.map((item) => item.id === data.data.id ? data.data : item));
      setCareerNote(data.data.status_note || '');
      setCareerEditForm(makeCareerEditForm(data.data));
    } catch (error) {
      alert(error.message);
    } finally {
      setCareerSaving(false);
    }
  };

  const updateCareerApplicationDetails = async () => {
    if (!selectedCareerEnquiry) return;
    setCareerEditSaving(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const formData = new FormData();
      formData.append('id', selectedCareerEnquiry.id);
      Object.entries(careerEditForm).forEach(([key, value]) => formData.append(key, value || ''));
      if (careerEditResume) formData.append('resume', careerEditResume);

      const response = await fetch('/api/career-enquiries', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Application details update failed');
      setSelectedCareerEnquiry(data.data);
      setCareerEnquiries((current) => current.map((item) => item.id === data.data.id ? data.data : item));
      setCareerEditForm(makeCareerEditForm(data.data));
      setCareerEditResume(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setCareerEditSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <>

      <div className={`dash-root${isDarkMode ? ' dark-mode' : ''}`}>
        {/* Header */}
        {activeTab === 'overview' && (
          <div className="dash-header">
            <div className="dash-header-inner">
              <div>
                <div className="dash-title">Welcome back, Admin</div>
                <div className="dash-subtitle">Manage properties, forms, vendors &amp; services</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Bar */}
        <div className="dash-tabs-bar">
          <div className="dash-tabs-inner">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`dash-tab${activeTab === tab.id ? ' active' : ''}`}
                >
                  <span className="dash-tab-icon">
                    {TabIcon ? (typeof TabIcon === 'string' ? TabIcon : <TabIcon size={16} strokeWidth={1.75} aria-hidden="true" />) : null}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="dash-content">

          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="dash-stats">
                {stats.map((stat, index) => (
                  <AdminStatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    tone={["info", "warning", "success", "accent"][index]}
                  />
                ))}
              </div>

              <AdminSectionCard
                title="Admin earnings"
                tag="Commission"
                bodyClassName="admin-section-card__body--metrics"
              >
                {[
                  { label: "Today's commission", value: <AdminMoney value={todayCommission} />, helper: "15% of today's bookings" },
                  { label: "Total commission", value: <AdminMoney value={totalCommission} />, helper: "15% of completed bookings", positive: true },
                  { label: "Total GST collected", value: <AdminMoney value={totalGST} />, helper: "18% collected from users" },
                ].map((metric) => (
                  <div className="admin-metric" key={metric.label}>
                    <p className="admin-metric__label">{metric.label}</p>
                    <p className={`admin-metric__value ${metric.positive ? "admin-metric__value--success" : ""}`}>{metric.value}</p>
                    <p className="admin-metric__helper">{metric.helper}</p>
                  </div>
                ))}
              </AdminSectionCard>

              <AdminSectionCard
                title="Supplier marketplace"
                tag="15% commission"
                bodyClassName="admin-section-card__body--metrics admin-section-card__body--four"
              >
                {[
                  { label: "Today's commission", value: <AdminMoney value={supplierCommission.today} /> },
                  { label: "Total commission", value: <AdminMoney value={supplierCommission.total} />, positive: true },
                  { label: "Orders fulfilled", value: supplierCommission.fulfilled, number: true },
                  { label: "Open enquiries", value: supplierCommission.open, tone: "warning", number: true },
                ].map((metric) => (
                  <div className="admin-metric" key={metric.label}>
                    <p className="admin-metric__label">{metric.label}</p>
                    <p className={`admin-metric__value ${metric.positive ? "admin-metric__value--success" : ""} ${metric.tone ? `admin-metric__value--${metric.tone}` : ""} ${metric.number ? "admin-number" : ""}`}>{metric.value}</p>
                  </div>
                ))}
              </AdminSectionCard>
              {/* 🛒 Shop Vendor Commission */}
              <div className="panel" style={{ marginBottom: '1rem' }}>
                <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="panel-title inline-flex items-center gap-2"><ShoppingCart size={20} strokeWidth={1.7} aria-hidden="true" /> Shop vendor commission</span>
                  <button
                    onClick={() => setActiveTab('shop-commission-settings')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-blue, #2563eb)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    Commission Settings →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', padding: '1rem' }}>
                  {[
                    { label: "Today's Commission", value: `₹${(shopVendorCommission.today || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--brand-blue)' },
                    { label: 'Total Commission', value: `₹${(shopVendorCommission.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#4ade80' },
                    { label: 'Pending Payout', value: `₹${(shopVendorCommission.pending || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#f97316' },
                    { label: 'Collected', value: `₹${(shopVendorCommission.paid || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#10b981' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
                      <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '0.5rem' }}>{label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Pending dues list & Mark as Paid action */}
                <div style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                        Pending Settlements (Money vendors owe platform)
                      </span>
                    </div>
                    {settleSuccessMsg && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{settleSuccessMsg}</span>
                    )}
                  </div>

                  {(!shopVendorCommission.pendingVendors || shopVendorCommission.pendingVendors.length === 0) ? (
                    <div style={{ padding: '0.875rem 1rem', background: 'var(--bg)', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>All vendor commissions are settled. No pending payouts.</span>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--muted)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Vendor / Shop</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Contact</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Pending Orders</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Pending Due</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shopVendorCommission.pendingVendors.map((v) => (
                            <tr key={v.vendor_id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>
                                {v.vendor_name}
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
                                {v.phone || v.email || '—'}
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                                <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600 }}>
                                  {v.pending_orders_count} {v.pending_orders_count === 1 ? 'order' : 'orders'}
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#f97316' }}>
                                ₹{Number(v.pending_due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                                <button
                                  onClick={() => {
                                    setSettlingVendor(v);
                                    setSettleNote('Settled offline by admin');
                                  }}
                                  style={{
                                    background: 'var(--brand-blue)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    transition: 'opacity .15s',
                                  }}
                                >
                                  <CheckCircle2 size={13} />
                                  Mark as Paid
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Recent Contact Submissions</span>
                </div>
                <div className="panel-body">
                  {submissions.length === 0 ? (
                    <p className="empty-state">No submissions yet.</p>
                  ) : (
                    <div>
                      {submissions.slice(0, 5).map((item) => (
                        <div key={item.id} className="sub-row" onClick={() => setSelectedSubmission(item)}>
                          <div>
                            <div className="sub-name">{item.name}</div>
                            <div className="sub-meta">{item.email} · {item.department}</div>
                          </div>
                          <span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {pendingProperties > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Pending Properties Review</div>
                  <div className="pending-alert-body">
                    <strong>{pendingProperties}</strong> {pendingProperties === 1 ? 'property' : 'properties'} awaiting verification.
                  </div>
                  <button onClick={() => setActiveTab('properties')} className="review-btn">
                    Review Properties →
                  </button>
                </div>
              )}

              {pendingVendors > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Pending Vendor Verification</div>
                  <div className="pending-alert-body">
                    <strong>{pendingVendors}</strong> {pendingVendors === 1 ? 'vendor' : 'vendors'} awaiting approval.
                  </div>
                  <button onClick={() => setActiveTab('vendors')} className="review-btn">
                    Review Vendors →
                  </button>
                </div>
              )}

              {pendingSuppliers > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Pending supplier applications</div>
                  <div className="pending-alert-body">
                    <strong>{pendingSuppliers}</strong> {pendingSuppliers === 1 ? 'supplier' : 'suppliers'} awaiting approval.
                  </div>
                  <button onClick={() => setActiveTab('suppliers')} className="review-btn">
                    Review Suppliers →
                  </button>
                </div>
              )}

              {pendingBookings > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">⏳ Pending Service Bookings</div>
                  <div className="pending-alert-body">
                    <strong>{pendingBookings}</strong> {pendingBookings === 1 ? 'booking' : 'bookings'} waiting for vendor assignment.
                  </div>
                  <button onClick={() => setActiveTab('bookings')} className="review-btn">
                    Review Bookings →
                  </button>
                </div>
              )}

              {activeVendorBookings > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Active vendor bookings</div>
                  <div className="pending-alert-body">
                    <strong>{activeVendorBookings}</strong> {activeVendorBookings === 1 ? 'booking is' : 'bookings are'} currently being worked on.
                  </div>
                  <button onClick={() => setActiveTab('bookings')} className="review-btn">
                    View Details →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Contact Submissions */}
          {activeTab === 'submissions' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Contact Submissions</span>
                <input type="text" placeholder="Search…" className="search-input" />
              </div>
              <div className="panel">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Department', 'Status', 'Date', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.email}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.department}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}>
                            <ActionIconButton
                              icon={Eye}
                              label="View contact submission"
                              onClick={() => setSelectedSubmission(item)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {submissions.length === 0 && <p className="empty-state">No contact submissions yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'primary-service-enquiries' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Construction enquiry</span>
                <AdminButton className="dash-export-btn" onClick={fetchPrimaryServiceEnquiries}>
                  Refresh
                </AdminButton>
                <AdminInput
                  bare
                  id="construction-enquiry-search"
                  type="text"
                  aria-label="Search construction enquiries"
                  placeholder="Search name, phone, service or email"
                  className="search-input"
                  value={pseSearch}
                  onChange={e => setPseSearch(e.target.value)}
                />
              </div>
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Enquirer', 'Service & Location', 'Budget', 'Carpet Area', 'Meeting Date', 'Time Slot', 'Images', 'Status', 'Submitted', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.55rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {primaryServiceEnquiries
                        .filter(item => {
                          const q = pseSearch.toLowerCase();
                          return !q ||
                            item.name?.toLowerCase().includes(q) ||
                            item.phone?.includes(q) ||
                            item.alternate_phone?.includes(q) ||
                            item.email?.toLowerCase().includes(q) ||
                            item.service_title?.toLowerCase().includes(q) ||
                            item.city?.toLowerCase().includes(q) ||
                            item.state?.toLowerCase().includes(q) ||
                            item.address?.toLowerCase().includes(q);
                        })
                        .map((item) => {
                          const imgUrls = Array.isArray(item.property_image_urls)
                            ? item.property_image_urls
                            : item.property_image_url ? [item.property_image_url] : [];
                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '0.6rem 0.875rem', minWidth: '150px' }}>
                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Main: {item.phone}</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Alt: {item.alternate_phone || '—'}</div>
                                {item.email && <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{item.email}</div>}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', minWidth: '160px' }}>
                                <div style={{ fontWeight: 600 }}>{item.service_title}</div>
                                {(item.city || item.state) && <div style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>{[item.city, item.state].filter(Boolean).join(', ')}</div>}
                                {item.address && (
                                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.address}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.budget || '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.carpet_area ? `${item.carpet_area} sqft` : '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                                {item.meeting_date ? new Date(item.meeting_date).toLocaleDateString('en-IN') : '—'}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{item.time_slot || '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                {imgUrls.length > 0 ? (
                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {imgUrls.slice(0, 3).map((url, i) => (
                                      <Image key={i} src={url} alt="" width={36} height={36} unoptimized style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }}
                                        onError={ev => { ev.currentTarget.style.display = 'none'; }} />
                                    ))}
                                    {imgUrls.length > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>+{imgUrls.length - 3}</span>}
                                  </div>
                                ) : <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>—</span>}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                <select
                                  value={item.status}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
                                    await fetch('/api/primary-service-enquiries', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ id: item.id, status: newStatus }),
                                    });
                                    setPrimaryServiceEnquiries(prev => prev.map(x => x.id === item.id ? { ...x, status: newStatus } : x));
                                  }}
                                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', padding: '3px 6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  {primaryServiceStatuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                {new Date(item.created_at).toLocaleDateString('en-IN')}
                                <div style={{ fontSize: '0.68rem' }}>{new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                <ActionIconButton
                                  icon={Eye}
                                  label="View enquiry details"
                                  onClick={() => setSelectedPrimaryServiceEnquiry(item)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {primaryServiceEnquiries.length === 0 && <p className="empty-state">No primary services enquiries yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'career-enquiries' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Career Enquiry</span>
                <input
                  type="search"
                  placeholder="Search..."
                  className="search-input"
                  value={careerSearch}
                  onChange={(event) => setCareerSearch(event.target.value)}
                />
              </div>
              <div className="panel">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Phone', 'Position', 'Experience', 'Status', 'Date', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {careerEnquiries.filter((item) => {
                        const query = careerSearch.trim().toLowerCase();
                        if (!query) return true;

                        const searchableValues = [
                          item.name,
                          item.email,
                          item.phone,
                          item.position,
                          item.experience,
                          item.status,
                          item.created_at && new Date(item.created_at).toLocaleDateString(),
                        ];

                        return searchableValues.some((value) =>
                          String(value ?? '').toLowerCase().includes(query)
                        );
                      }).map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.email}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.phone}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.position}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.experience}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}>
                            <ActionIconButton
                              icon={Eye}
                              label="View career application"
                              onClick={() => openCareerEnquiry(item)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {careerEnquiries.length === 0 ? (
                    <p className="empty-state">No career enquiries yet.</p>
                  ) : careerEnquiries.filter((item) => {
                    const query = careerSearch.trim().toLowerCase();
                    return !query || [
                      item.name,
                      item.email,
                      item.phone,
                      item.position,
                      item.experience,
                      item.status,
                      item.created_at && new Date(item.created_at).toLocaleDateString(),
                    ].some((value) => String(value ?? '').toLowerCase().includes(query));
                  }).length === 0 ? (
                    <p className="empty-state">No career enquiries match your search.</p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && <SupplierHubAdmin isDarkMode={isDarkMode} />}
          {(activeTab === 'users' || activeTab === 'vendors' || activeTab === 'agents') && (
            <UserManagementAdmin isDarkMode={isDarkMode} initialRoleView={activeTab} />
          )}
          {activeTab === 'product-approvals' && <ProductApprovalsAdmin isDarkMode={isDarkMode} />}

          {activeTab === 'packages' && (
            <div>
              <div className="section-head" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <span className="section-head-title">Package Approvals & Subscriptions</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                    Manage vendor/supplier subscription packages and review incoming subscription requests.
                  </div>
                </div>
                {pkgMsg && (
                  <span style={{
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    {pkgMsg}
                  </span>
                )}
              </div>

              {/* Sub-navigation tabs: Requests vs Manage Plans */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.35rem',
                  background: 'var(--bg)',
                  padding: '0.3rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <button
                    type="button"
                    onClick={() => setPackageSubTab('approvals')}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: packageSubTab === 'approvals' ? 'var(--surface)' : 'transparent',
                      color: packageSubTab === 'approvals' ? 'var(--text)' : 'var(--muted)',
                      boxShadow: packageSubTab === 'approvals' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Requests and subscriptions
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPackageSubTab('plans'); fetchPlans(); }}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: packageSubTab === 'plans' ? 'var(--surface)' : 'transparent',
                      color: packageSubTab === 'plans' ? 'var(--text)' : 'var(--muted)',
                      boxShadow: packageSubTab === 'plans' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ⚙️ Manage Plans {plansList.length > 0 ? `(${plansList.length})` : ''}
                  </button>
                </div>

                {packageSubTab === 'plans' && (
                  <button
                    type="button"
                    onClick={() => handleOpenPlanModal(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.9rem',
                      background: 'var(--brand-blue)',
                      color: '#fff',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(16,185,129,0.2)'
                    }}
                  >
                    <Plus size={15} /> Add New Plan
                  </button>
                )}
              </div>

              {/* VIEW 1: REQUESTS & ACTIVE SUBSCRIPTIONS */}
              {packageSubTab === 'approvals' && (
                <>
                  {selectedPackage ? (
                    <div className="panel" style={{ padding: '1.75rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                      {/* Header / Back */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPackage(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text)',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          <ArrowLeft size={16} /> Back to Packages
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${selectedPackage.type === 'vendor' ? 'status-contacted' : 'status-pending'}`} style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                            {selectedPackage.type}
                          </span>
                          <span className={`badge ${selectedPackage.package_status === 'active' ? 'status-resolved' : 'status-pending'}`} style={{ fontWeight: 700 }}>
                            {selectedPackage.package_status === 'active' ? '✓ Active Subscription' : '⏳ Pending Request'}
                          </span>
                        </div>
                      </div>

                      {/* Entity & Plan Title */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                          {selectedPackage.package_name} Plan Details
                        </h2>
                        <p style={{ margin: '0.35rem 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
                          Subscription request for {selectedPackage.type}: <strong>{selectedPackage.email}</strong>
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Plan Name & Price</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.25rem' }}>{selectedPackage.package_name}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.15rem' }}>
                            ₹{Number(selectedPackage.package_price).toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Entity Type & Email</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>{selectedPackage.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                            Role: <strong style={{ textTransform: 'capitalize' }}>{selectedPackage.type}</strong> (ID: #{selectedPackage.id})
                          </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Phone & Location</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}>{selectedPackage.phone || 'Phone not provided'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                            City: <strong>{selectedPackage.city || 'City not specified'}</strong>
                          </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Timeline & Status</div>
                          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            Requested: <strong>{selectedPackage.package_purchased_at ? new Date(selectedPackage.package_purchased_at).toLocaleString('en-IN') : '—'}</strong>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                            {selectedPackage.package_status === 'active' ? (
                              <>
                                Expires: <strong style={{ color: '#059669' }}>{new Date(selectedPackage.package_expires_at).toLocaleDateString('en-IN')}</strong> ({Math.max(0, Math.ceil((new Date(selectedPackage.package_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))} days left)
                              </>
                            ) : (
                              <span style={{ color: '#d97706', fontWeight: 600 }}>Waiting for admin approval</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Business Information */}
                      {(selectedPackage.shop_name || selectedPackage.business_name || selectedPackage.name || selectedPackage.address) && (
                        <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Business / Profile Details
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                            {selectedPackage.shop_name && (
                              <div><span style={{ color: 'var(--muted)' }}>Shop / Business:</span> <strong>{selectedPackage.shop_name}</strong></div>
                            )}
                            {selectedPackage.name && (
                              <div><span style={{ color: 'var(--muted)' }}>Contact Person:</span> <strong>{selectedPackage.name}</strong></div>
                            )}
                            {selectedPackage.address && (
                              <div><span style={{ color: 'var(--muted)' }}>Address:</span> <strong>{selectedPackage.address}</strong></div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions for Pending Requests */}
                      {selectedPackage.package_status === 'pending' && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={async () => {
                              await handlePackageAction(selectedPackage.type, selectedPackage.id, 'approve');
                              setSelectedPackage(null);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.65rem 1.4rem',
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <ShieldCheck size={18} /> Approve Package Subscription
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Are you sure you want to reject this package request?')) {
                                await handlePackageAction(selectedPackage.type, selectedPackage.id, 'reject');
                                setSelectedPackage(null);
                              }
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.65rem 1.4rem',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Ban size={18} /> Reject Package Request
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* PENDING REQUESTS PANEL */}
                      <div className="panel" style={{ marginBottom: '1.5rem' }}>
                        <div className="panel-header">
                          <span className="panel-title inline-flex items-center gap-2"><Clock size={20} strokeWidth={1.7} aria-hidden="true" /> Pending package requests</span>
                        </div>
                        <div className="panel-body" style={{ padding: 0 }}>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                              <thead>
                                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                                  {['Type', 'Entity Info', 'City', 'Plan Name', 'Price', 'Requested At', 'Actions'].map(col => (
                                    <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  ...pkgVendors.filter(v => v.package_status === 'pending').map(v => ({ ...v, type: 'vendor' })),
                                  ...pkgSuppliers.filter(s => s.package_status === 'pending').map(s => ({ ...s, type: 'supplier' }))
                                ].map((item) => (
                                  <tr
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => setSelectedPackage(item)}
                                    title="Click to view full package details"
                                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                                    className="hover:bg-slate-50"
                                  >
                                    <td style={{ padding: '0.6rem 0.875rem' }}>
                                      <span className={`badge ${item.type === 'vendor' ? 'status-contacted' : 'status-pending'}`}>{item.type}</span>
                                    </td>
                                    <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>
                                      {item.email}
                                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.phone || 'No phone'}</div>
                                    </td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.city}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', fontWeight: '700', color: 'var(--accent)' }}>{item.package_name}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', fontWeight: '700' }}>₹{Number(item.package_price).toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.package_purchased_at).toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '0.6rem 0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <ActionIconButton
                                        icon={ShieldCheck}
                                        variant="success"
                                        label="Approve package"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePackageAction(item.type, item.id, 'approve');
                                        }}
                                      />
                                      <ActionIconButton
                                        icon={Ban}
                                        variant="danger"
                                        label="Reject package"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePackageAction(item.type, item.id, 'reject');
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                                {pkgVendors.filter(v => v.package_status === 'pending').length === 0 && pkgSuppliers.filter(s => s.package_status === 'pending').length === 0 && (
                                  <tr>
                                    <td colSpan={7} className="empty-state" style={{ textAlign: 'center', padding: '2rem' }}>No pending package requests.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* ACTIVE SUBSCRIPTIONS PANEL */}
                      <div className="panel">
                        <div className="panel-header">
                          <span className="panel-title">✅ Active Packages & Subscriptions</span>
                        </div>
                        <div className="panel-body" style={{ padding: 0 }}>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                              <thead>
                                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                                  {['Type', 'Entity Info', 'Plan Name', 'Price', 'Starts At', 'Expires At', 'Days Left'].map(col => (
                                    <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  ...pkgVendors.filter(v => v.package_status === 'active').map(v => ({ ...v, type: 'vendor' })),
                                  ...pkgSuppliers.filter(s => s.package_status === 'active').map(s => ({ ...s, type: 'supplier' }))
                                ].map((item) => {
                                  const daysLeft = Math.max(0, Math.ceil((new Date(item.package_expires_at) - new Date()) / (1000 * 60 * 60 * 24)));
                                  return (
                                    <tr
                                      key={`${item.type}-${item.id}`}
                                      onClick={() => setSelectedPackage(item)}
                                      title="Click to view full package details"
                                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                                      className="hover:bg-slate-50"
                                    >
                                      <td style={{ padding: '0.6rem 0.875rem' }}>
                                        <span className={`badge ${item.type === 'vendor' ? 'status-contacted' : 'status-pending'}`}>{item.type}</span>
                                      </td>
                                      <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>
                                        {item.email}
                                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.city} · {item.phone || 'No phone'}</div>
                                      </td>
                                      <td style={{ padding: '0.6rem 0.875rem', fontWeight: '700', color: 'var(--accent)' }}>{item.package_name}</td>
                                      <td style={{ padding: '0.6rem 0.875rem', fontWeight: '700' }}>₹{Number(item.package_price).toLocaleString('en-IN')}</td>
                                      <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.package_starts_at).toLocaleDateString('en-IN')}</td>
                                      <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.package_expires_at).toLocaleDateString('en-IN')}</td>
                                      <td style={{ padding: '0.6rem 0.875rem' }}>
                                        <span className={`badge ${daysLeft > 15 ? 'status-resolved' : 'status-pending'}`} style={{ fontWeight: 700 }}>
                                          {daysLeft} days
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                                {pkgVendors.filter(v => v.package_status === 'active').length === 0 && pkgSuppliers.filter(s => s.package_status === 'active').length === 0 && (
                                  <tr>
                                    <td colSpan={7} className="empty-state" style={{ textAlign: 'center', padding: '2rem' }}>No active package subscriptions.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* VIEW 2: MANAGE PLANS */}
              {packageSubTab === 'plans' && (
                <div className="panel">
                  <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="panel-title inline-flex items-center gap-2"><PackageCheck size={20} strokeWidth={1.7} aria-hidden="true" /> All subscription plans</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      Total {plansList.length} plan{plansList.length === 1 ? '' : 's'} configured
                    </span>
                  </div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    {plansLoading ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                        Loading subscription plans...
                      </div>
                    ) : plansList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                        No subscription plans found. Click <strong>&quot;+ Add New Plan&quot;</strong> to configure your first plan.
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                          <thead>
                            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                              {['Order', 'Plan Name', 'Duration', 'Price', 'Target Role', 'Badge', 'Status', 'Actions'].map(col => (
                                <th key={col} style={{ padding: '0.55rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {plansList.map((plan, idx) => (
                              <tr key={plan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.65rem 0.875rem', color: 'var(--muted)', fontWeight: 600 }}>
                                  #{plan.sort_order ?? idx + 1}
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem' }}>
                                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{plan.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>
                                    ID: <code>{plan.id}</code>
                                    {plan.description && ` · ${plan.description}`}
                                  </div>
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem', fontWeight: 600 }}>
                                  {plan.duration_months} Months
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem', fontWeight: 700, color: '#10b981' }}>
                                  ₹{Number(plan.price).toLocaleString('en-IN')}
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem' }}>
                                  <span className={`badge ${plan.target_role === 'vendor' ? 'status-contacted' : plan.target_role === 'supplier' ? 'status-pending' : 'status-resolved'}`}>
                                    {plan.target_role === 'vendor' ? 'Vendors Only' : plan.target_role === 'supplier' ? 'Suppliers Only' : 'Both'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem' }}>
                                  {plan.label ? (
                                    <span style={{ fontSize: '0.72rem', background: 'var(--bg)', border: '1px solid var(--border)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                                      {plan.label}
                                    </span>
                                  ) : (
                                    <span style={{ color: 'var(--muted)' }}>-</span>
                                  )}
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePlanActive(plan)}
                                    title="Click to toggle active status"
                                    style={{
                                      cursor: 'pointer',
                                      border: 'none',
                                      background: plan.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                      color: plan.is_active ? '#10b981' : '#ef4444',
                                      padding: '0.2rem 0.6rem',
                                      borderRadius: '999px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700
                                    }}
                                  >
                                    {plan.is_active ? '● Active' : '○ Inactive'}
                                  </button>
                                </td>
                                <td style={{ padding: '0.65rem 0.875rem' }}>
                                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPlanModal(plan)}
                                      title="Edit plan"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.7rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--surface)',
                                        color: 'var(--text)',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                      }}
                                    >
                                      <Pencil size={13} /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePlan(plan.id)}
                                      title="Delete plan"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.35rem 0.7rem',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        color: '#ef4444',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      <Trash2 size={13} /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODAL: ADD / EDIT PLAN */}
              {planModalOpen && (
                <div className="modal-backdrop" onClick={() => setPlanModalOpen(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
                    <div className="modal-head">
                      <span className="modal-title">{editingPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}</span>
                      <button className="modal-close" onClick={() => setPlanModalOpen(false)} aria-label="Close" title="Close">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSavePlan}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                            Plan Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1 Year Premium Plan"
                            value={planFormData.name}
                            onChange={e => setPlanFormData(prev => ({ ...prev, name: e.target.value }))}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Duration (Months) *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              max="120"
                              value={planFormData.duration_months}
                              onChange={e => setPlanFormData(prev => ({ ...prev, duration_months: parseInt(e.target.value, 10) || 0 }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Price (₹) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="1"
                              value={planFormData.price}
                              onChange={e => setPlanFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Target Audience
                            </label>
                            <select
                              value={planFormData.target_role}
                              onChange={e => setPlanFormData(prev => ({ ...prev, target_role: e.target.value }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                            >
                              <option value="all">Both Vendors & Suppliers</option>
                              <option value="vendor">Vendors Only</option>
                              <option value="supplier">Suppliers Only</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Badge Label (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Most Popular"
                              value={planFormData.label}
                              onChange={e => setPlanFormData(prev => ({ ...prev, label: e.target.value }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Plan ID {editingPlan ? '(Read Only)' : '(Optional)'}
                            </label>
                            <input
                              type="text"
                              disabled={Boolean(editingPlan)}
                              placeholder="e.g. pkg_3m (auto if empty)"
                              value={planFormData.id}
                              onChange={e => setPlanFormData(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: editingPlan ? 'var(--surface)' : 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', opacity: editingPlan ? 0.7 : 1 }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                              Display Sort Order
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={planFormData.sort_order}
                              onChange={e => setPlanFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                            Description
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Describe features and benefits of this plan..."
                            value={planFormData.description}
                            onChange={e => setPlanFormData(prev => ({ ...prev, description: e.target.value }))}
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', resize: 'vertical' }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <input
                            type="checkbox"
                            id="plan_is_active"
                            checked={planFormData.is_active}
                            onChange={e => setPlanFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                          />
                          <label htmlFor="plan_is_active" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
                            Active (Visible to users for selection & registration)
                          </label>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                          <button
                            type="button"
                            onClick={() => setPlanModalOpen(false)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--muted)',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={planSaving}
                            style={{
                              padding: '0.5rem 1.25rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: 'var(--brand-blue)',
                              color: '#fff',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: planSaving ? 'not-allowed' : 'pointer',
                              opacity: planSaving ? 0.7 : 1
                            }}
                          >
                            {planSaving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'properties' && <PropertiesManager isDarkMode={isDarkMode} />}
          {activeTab === 'room-rentals' && <PropertiesManager isDarkMode={isDarkMode} categoryFilter="room_rent" />}
          {activeTab === 'flats' && <PropertiesManager isDarkMode={isDarkMode} categoryFilter="flat" />}
          {activeTab === 'plots' && <PropertiesManager isDarkMode={isDarkMode} categoryFilter="plot" />}
          {activeTab === 'create-property' && <PropertiesManager isDarkMode={isDarkMode} createMode />}
          {activeTab === 'property-bookings' && <PropertyBookingsManager isDarkMode={isDarkMode} />}
          {activeTab === 'cities' && <CitiesManager />}
          {activeTab === 'property-enquiries' && <PropertyEnquiriesManager isDarkMode={isDarkMode} />}
          {activeTab === 'quick-services' && <QuickServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'quick-enquiries' && <BookingsManager isDarkMode={isDarkMode} title="Quick Enquiries" />}
          {activeTab === 'primary-services' && <PrimaryServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'professionals' && <ProfessionalServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'professional-enquiries' && <ProfessionalEnquiriesManager isDarkMode={isDarkMode} />}
          {activeTab === 'franchises' && <FranchisesManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'project-management' && <OperationalProjectsManager isDarkMode={isDarkMode} />}
          {activeTab === 'party-project-management' && <PartyProjectManagement isDarkMode={isDarkMode} initialProjectId={initialProjectId} />}
          {activeTab === 'pm-reports' && <PartyProjectManagement initialScreen="reports" isDarkMode={isDarkMode} />}
          {activeTab === 'pm-dashboard' && <PmDashboard isDarkMode={isDarkMode} />}
          {activeTab === 'pm-audit' && <PmAuditLog isDarkMode={isDarkMode} />}
          {activeTab === 'shop-categories' && (
            <ShopNowManager
              key={activeTab}
              isDarkMode={isDarkMode}
              initialTab="categories"
            />
          )}
          {activeTab === 'shop-products' && (
            <ShopProductsManager
              key={activeTab}
              isDarkMode={isDarkMode}
            />
          )}
          {activeTab === 'cashback' && <CashbackManager isDarkMode={isDarkMode} />}
          {activeTab === 'shipping-settings' && <ShippingSettingsManager />}
          {activeTab === 'shop-commission-settings' && <ShopCommissionSettingsManager isDarkMode={isDarkMode} />}
          {activeTab === 'bookings' && <BookingsManager isDarkMode={isDarkMode} />}
          {activeTab === 'orders-history' && <OrdersHistoryManager isDarkMode={isDarkMode} />}
          {activeTab === 'revenue' && <RevenueManager isDarkMode={isDarkMode} />}
          {activeTab === 'free-slots' && <FreeTimeSlotsManager isDarkMode={isDarkMode} />}
          {activeTab === 'quick-services-pricing' && <QuickServicesPricing isDarkMode={isDarkMode} />}
          {activeTab === 'calculator' && <CalculatorManager isDarkMode={isDarkMode} />}

          {activeTab === 'calculator-quotes' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Calculator Quote Requests</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {calculatorQuotes.length} total
                </span>
              </div>
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Customer', 'Project', 'Estimated Budget', 'Site Image', 'Status', 'Submitted', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.55rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calculatorQuotes.map((item) => {
                        const est = item.estimate || {};
                        const project = est.project || {};
                        const totals = est.totals || {};
                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.6rem 0.875rem', minWidth: 170 }}>
                              <div style={{ fontWeight: 700 }}>{item.name}</div>
                              <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{item.phone}</div>
                              <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{item.email}</div>
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', minWidth: 180 }}>
                              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{project.city || '-'}</div>
                              <div>{project.propertySize ? `${Number(project.propertySize).toLocaleString('en-IN')} sqft` : '-'} · {project.floors || '-'} floors</div>
                              <div>{project.quality || '-'} · {project.foundation || '-'}</div>
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              ₹{Number(totals.grandTotal || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem' }}>
                              {item.site_image_url ? (
                                <Image src={item.site_image_url} alt="Site" width={48} height={48} unoptimized style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }} />
                              ) : <span style={{ color: 'var(--muted)' }}>-</span>}
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem' }}>
                              <span className={`badge ${item.verified ? 'status-resolved' : 'status-pending'}`}>{item.verified ? 'Verified' : 'OTP Pending'}</span>
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                              {new Date(item.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td style={{ padding: '0.6rem 0.875rem' }}>
                              <ActionIconButton
                                icon={Eye}
                                label="View calculator quote"
                                onClick={() => openCalculatorQuote(item)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {calculatorQuotes.length === 0 && <p className="empty-state">No calculator quote requests yet.</p>}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'hero-banners' && <HeroBannersManager isDarkMode={isDarkMode} />}
          {activeTab === 'faqs' && <FaqsManager isDarkMode={isDarkMode} />}
          {activeTab === 'reviews' && <ReviewsManager isDarkMode={isDarkMode} />}
          {activeTab === 'blogs' && <BlogsManager isDarkMode={isDarkMode} />}
          {activeTab === 'jobs' && <JobsManager isDarkMode={isDarkMode} />}
          {activeTab === 'lead-management' && <LeadManagementAdmin isDarkMode={isDarkMode} />}
          {activeTab === 'office-locations' && <OfficeLocationsManager isDarkMode={isDarkMode} />}

        </div>

        {selectedCalculatorQuote && (() => {
          const q = selectedCalculatorQuote;
          const est = q.estimate || {};
          const project = est.project || {};
          const totals = est.totals || {};
          const rows = Array.isArray(est.lineItems) ? est.lineItems : [];
          return (
            <div className="modal-backdrop" onClick={() => setSelectedCalculatorQuote(null)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 'min(860px, calc(100vw - 2rem))', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-head">
                  <span className="modal-title">Calculator Quote Details</span>
                  <button className="modal-close" onClick={() => setSelectedCalculatorQuote(null)} aria-label="Close" title="Close">
                    <X size={18} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>

                <div className="modal-grid">
                  {[
                    ['Name', q.name],
                    ['Email', q.email],
                    ['Phone', q.phone],
                    ['OTP Status', q.verified ? 'Verified' : 'Pending'],
                    ['City', project.city || '-'],
                    ['Property Size', project.propertySize ? `${Number(project.propertySize).toLocaleString('en-IN')} sqft` : '-'],
                    ['Built-up Area', project.builtUpArea ? `${Number(project.builtUpArea).toLocaleString('en-IN')} sqft` : '-'],
                    ['Floors', project.floors || '-'],
                    ['Package', project.quality || '-'],
                    ['Foundation', project.foundation || '-'],
                    ['Estimated Budget', `₹${Number(totals.grandTotal || 0).toLocaleString('en-IN')}`],
                    ['Approx Rate', `₹${Number(totals.perSqft || 0).toLocaleString('en-IN')} / sqft`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="modal-field-label">{label}</div>
                      <div className="modal-field-value">{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div className="modal-field-label">Site Address</div>
                  <div className="modal-message">{q.address}</div>
                </div>

                {q.site_image_url && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Site Image</div>
                    <a href={q.site_image_url} target="_blank" rel="noopener noreferrer">
                      <Image src={q.site_image_url} alt="Site upload" width={720} height={320} unoptimized style={{ width: '100%', height: 'auto', maxHeight: 320, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                    </a>
                  </div>
                )}

                <div className="modal-grid">
                  {[
                    ['Material Total', `₹${Number(totals.materialTotal || 0).toLocaleString('en-IN')}`],
                    ['Labour Cost', `₹${Number(totals.labourTotal || 0).toLocaleString('en-IN')}`],
                    ['Transport', `₹${Number(totals.transportTotal || 0).toLocaleString('en-IN')}`],
                    ['Supervision', `₹${Number(totals.supervisionTotal || 0).toLocaleString('en-IN')}`],
                    ['Contingency', `₹${Number(totals.contingencyTotal || 0).toLocaleString('en-IN')}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="modal-field-label">{label}</div>
                      <div className="modal-field-value">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="modal-field-label" style={{ margin: '0.75rem 0 0.375rem' }}>Material BOQ</div>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {['Phase', 'Category', 'Product', 'Quantity', 'Rate', 'Amount'].map(h => (
                          <th key={h} style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--muted)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={`${row.category}-${idx}`} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.5rem' }}>{row.phase}</td>
                          <td style={{ padding: '0.5rem' }}>{row.category}</td>
                          <td style={{ padding: '0.5rem' }}>{row.product}</td>
                          <td style={{ padding: '0.5rem' }}>{Number(row.quantity || 0).toLocaleString('en-IN')} {row.unit}</td>
                          <td style={{ padding: '0.5rem' }}>₹{Number(row.rate || 0).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 700 }}>₹{Number(row.amount || 0).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className="modal-close-btn" onClick={() => setSelectedCalculatorQuote(null)}>Close</button>
              </div>
            </div>
          );
        })()}

        {/* Modal */}
        {selectedSubmission && (
          <div className="modal-backdrop" onClick={() => setSelectedSubmission(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <span className="modal-title">Submission Details</span>
                <button className="modal-close" onClick={() => setSelectedSubmission(null)} aria-label="Close" title="Close">
                  <X size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              <div className="modal-grid">
                {[
                  ['Name', selectedSubmission.name],
                  ['Email', selectedSubmission.email],
                  ['Phone', selectedSubmission.phone],
                  ['Department', selectedSubmission.department],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div className="modal-field-label">Subject</div>
                <div className="modal-field-value">{selectedSubmission.subject}</div>
              </div>

              <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Message</div>
              <div className="modal-message">{selectedSubmission.message}</div>

              <button className="modal-close-btn" onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        )}

        {selectedPrimaryServiceEnquiry && (() => {
          const enq = selectedPrimaryServiceEnquiry;
          const imgUrls = Array.isArray(enq.property_image_urls)
            ? enq.property_image_urls
            : enq.property_image_url ? [enq.property_image_url] : [];
          const imgNames = Array.isArray(enq.property_image_names)
            ? enq.property_image_names
            : enq.property_image_name ? [enq.property_image_name] : [];
          const siteImgUrls = Array.isArray(enq.site_image_urls) ? enq.site_image_urls : [];
          const siteImgNames = Array.isArray(enq.site_image_names) ? enq.site_image_names : [];

          const updateStatus = async (status) => {
            const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
            await fetch('/api/primary-service-enquiries', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ id: enq.id, status }),
            });
            const updated = { ...enq, status };
            setSelectedPrimaryServiceEnquiry(updated);
            setPrimaryServiceEnquiries(prev => prev.map(x => x.id === enq.id ? updated : x));
          };

          return (
            <div className="modal-backdrop" onClick={() => setSelectedPrimaryServiceEnquiry(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}
                style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}>

                {/* Header */}
                <div className="modal-head" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface)' }}>
                  <div>
                    <span className="modal-title">{enq.service_title} Enquiry</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                      {new Date(enq.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button className="modal-close" onClick={() => setSelectedPrimaryServiceEnquiry(null)} aria-label="Close" title="Close">
                    <X size={18} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>

                {/* ── Section 1: Enquirer ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Enquirer Details</div>
                  <div className="modal-grid">
                    {[
                      ['Name', enq.name],
                      ['Main Phone', enq.phone],
                      ['Alternative Phone', enq.alternate_phone || '—'],
                      ['Email', enq.email || '—'],
                      ['Service', enq.service_title],
                      ['State', enq.state || '—'],
                      ['City', enq.city || '—'],
                      ['Status', enq.status],
                      ['Submitted', new Date(enq.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="modal-field-label">{label}</div>
                        <div className="modal-field-value">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Section 2: Project Details ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Project Details</div>
                  <div className="modal-grid">
                    {[
                      ['Budget', enq.budget || '—'],
                      ['Carpet Area', enq.carpet_area ? `${enq.carpet_area} sqft` : '—'],
                      ['Time Slot', enq.time_slot || '—'],
                      ['Meeting Date', enq.meeting_date ? new Date(enq.meeting_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="modal-field-label">{label}</div>
                        <div className="modal-field-value">{value}</div>
                      </div>
                    ))}
                  </div>

                  {enq.gps_location && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label">GPS Location</div>
                      <a href={`https://maps.google.com/?q=${enq.gps_location}`} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', marginTop: 4 }}>
                        {enq.gps_location} — Open in Google Maps ↗
                      </a>
                    </div>
                  )}

                  {enq.address && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label">Full Address</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text)', marginTop: 4, lineHeight: 1.6 }}>{enq.address}</div>
                    </div>
                  )}

                  {enq.message && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Project Description</div>
                      <div className="modal-message">{enq.message}</div>
                    </div>
                  )}
                </div>

                {/* ── Section 3: Property Images ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Property Images {imgUrls.length > 0 && <span style={{ fontWeight: 600, color: 'var(--muted)' }}>({imgUrls.length} file{imgUrls.length !== 1 ? 's' : ''})</span>}
                  </div>
                  {imgUrls.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>No property images uploaded.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
                      {imgUrls.map((url, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg)' }}>
                          <a href={url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                            <Image src={url} alt={imgNames[idx] || `Image ${idx + 1}`} width={340} height={280} unoptimized
                              style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                              onError={ev => { ev.currentTarget.parentElement.parentElement.style.display = 'none'; }} />
                          </a>
                          <div style={{ padding: '0.45rem 0.6rem', display: 'flex', gap: '0.3rem' }}>
                            <a href={url} target="_blank" rel="noreferrer"
                              style={{ flex: 1, textAlign: 'center', padding: '0.35rem 0', fontSize: '0.7rem', fontWeight: 800, background: 'var(--accent)', color: '#111', textDecoration: 'none', borderRadius: '3px' }}>
                              🔍 View
                            </a>
                            <a href={url} download={imgNames[idx] || `property-image-${idx + 1}`}
                              style={{ flex: 1, textAlign: 'center', padding: '0.35rem 0', fontSize: '0.7rem', fontWeight: 700, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none', borderRadius: '3px' }}>
                              ⬇ Save
                            </a>
                          </div>
                          {imgNames[idx] && (
                            <div style={{ padding: '0 0.6rem 0.5rem', fontSize: '0.65rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {imgNames[idx]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Section 4: Admin Actions ── */}
                {(enq.rating_stars || enq.review_text || siteImgUrls.length > 0) && (
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                      Customer Review
                    </div>
                    {enq.rating_stars && (
                      <div style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {'★'.repeat(enq.rating_stars)}{'☆'.repeat(5 - enq.rating_stars)}
                      </div>
                    )}
                    {enq.review_text && <div className="modal-message">{enq.review_text}</div>}
                    {siteImgUrls.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.875rem' }}>
                        {siteImgUrls.map((url, idx) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', display: 'block', background: 'var(--bg)' }}>
                            <Image src={url} alt={siteImgNames[idx] || `Site photo ${idx + 1}`} width={280} height={240} unoptimized style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, alignSelf: 'center' }}>Mark as:</span>
                    {primaryServiceStatuses.map(status => {
                      const isActive = enq.status === status;
                      return (
                        <button key={status}
                          onClick={() => updateStatus(status)}
                          aria-pressed={isActive}
                          style={{
                            padding: '0.45rem 0.85rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                            background: isActive ? '#111' : 'var(--accent)',
                            color: isActive ? 'var(--accent)' : '#111',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: isActive ? '0 0 0 3px rgba(255, 204, 0, 0.22)' : 'none',
                            transform: isActive ? 'translateY(-1px)' : 'none',
                          }}>
                          {isActive ? `✓ ${status}` : status}
                        </button>
                      );
                    })}
                  </div>
                  <button className="modal-close-btn" style={{ margin: 0 }}
                    onClick={() => setSelectedPrimaryServiceEnquiry(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedCareerEnquiry && (
          <div className="modal-backdrop" onClick={() => setSelectedCareerEnquiry(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <span className="modal-title">Career Enquiry Details</span>
                <button className="modal-close" onClick={() => setSelectedCareerEnquiry(null)} aria-label="Close" title="Close">
                  <X size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              <div className="modal-grid">
                {[
                  ['Name', selectedCareerEnquiry.name],
                  ['Email', selectedCareerEnquiry.email],
                  ['Phone', selectedCareerEnquiry.phone],
                  ['Alternative Phone', selectedCareerEnquiry.alternative_phone || '-'],
                  ['Position', selectedCareerEnquiry.position],
                  ['Department', selectedCareerEnquiry.department || '-'],
                  ['Location', selectedCareerEnquiry.job_location || '-'],
                  ['Experience', selectedCareerEnquiry.experience],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className="modal-field-label">Resume</div>
                <div className="modal-field-value">
                  {hasResumeFile(selectedCareerEnquiry.resume_url)
                    ? selectedCareerEnquiry.resume_name || 'Resume'
                    : 'Not Uploaded'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem' }}>
                  {hasResumeFile(selectedCareerEnquiry.resume_url) ? (
                    <>
                      <a
                        href={getResumeViewerUrl(selectedCareerEnquiry.resume_url, selectedCareerEnquiry.resume_name)}
                        target="_blank"
                        rel="noreferrer"
                        className="modal-close-btn"
                        style={{ width: 'auto', textDecoration: 'none', padding: '0.45rem 0.875rem' }}
                      >
                        View Resume
                      </a>
                      <a
                        href={getResumeActionUrl(selectedCareerEnquiry.resume_url, 'download')}
                        download={selectedCareerEnquiry.resume_name || true}
                        className="modal-close-btn"
                        style={{ width: 'auto', textDecoration: 'none', padding: '0.45rem 0.875rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      >
                        Download
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="modal-close-btn"
                        style={{ width: 'auto', padding: '0.45rem 0.875rem', opacity: 0.45, cursor: 'not-allowed' }}
                      >
                        View Resume
                      </button>
                      <button
                        type="button"
                        disabled
                        className="modal-close-btn"
                        style={{ width: 'auto', padding: '0.45rem 0.875rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', opacity: 0.45, cursor: 'not-allowed' }}
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
                {!hasResumeFile(selectedCareerEnquiry.resume_url) && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    No resume file was uploaded with this application.
                  </p>
                )}
              </div>

              <div className="modal-grid">
                {[
                  ['Current Company', selectedCareerEnquiry.current_company || '-'],
                  ['Notice Period', selectedCareerEnquiry.notice_period || '-'],
                  ['Current Salary', selectedCareerEnquiry.current_salary || '-'],
                  ['Expected Salary', selectedCareerEnquiry.expected_salary || '-'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Cover Letter</div>
              <div className="modal-message">{selectedCareerEnquiry.cover_letter || 'No cover letter provided.'}</div>

              <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)' }}>
                <div className="modal-field-label" style={{ marginBottom: '0.6rem' }}>Edit Application Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                  {CAREER_EDIT_FIELDS.map(field => (
                    <label key={field.name} style={{ display: 'block' }}>
                      <span className="modal-field-label">{field.label}</span>
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        value={careerEditForm[field.name] || ''}
                        onChange={event => setCareerEditForm(current => ({ ...current, [field.name]: event.target.value }))}
                        className="search-input"
                        style={{ width: '100%', marginTop: '0.25rem' }}
                      />
                    </label>
                  ))}
                </div>
                <label style={{ display: 'block', marginTop: '0.6rem' }}>
                  <span className="modal-field-label">Cover Letter</span>
                  <textarea
                    value={careerEditForm.cover_letter || ''}
                    onChange={event => setCareerEditForm(current => ({ ...current, cover_letter: event.target.value }))}
                    className="search-input"
                    rows={4}
                    style={{ width: '100%', marginTop: '0.25rem', resize: 'vertical' }}
                  />
                </label>
                <label style={{ display: 'block', marginTop: '0.6rem' }}>
                  <span className="modal-field-label">Replace Resume</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={event => setCareerEditResume(event.target.files?.[0] || null)}
                    className="search-input"
                    style={{ width: '100%', marginTop: '0.25rem' }}
                  />
                </label>
                <button type="button" onClick={updateCareerApplicationDetails} disabled={careerEditSaving}
                  className="modal-close-btn" style={{ marginTop: '0.75rem', background: 'var(--accent)', color: '#fff', opacity: careerEditSaving ? 0.55 : 1 }}>
                  {careerEditSaving ? 'Saving...' : 'Save Detail Changes'}
                </button>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)' }}>
                <div className="modal-field-label" style={{ marginBottom: '0.6rem' }}>Update Application Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, .8fr) minmax(220px, 1.2fr)', gap: '0.6rem' }}>
                  <select value={careerStatus} onChange={event => setCareerStatus(event.target.value)} className="search-input" style={{ width: '100%' }}>
                    {['New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <input value={careerNote} onChange={event => setCareerNote(event.target.value)}
                    placeholder="Update visible to applicant" className="search-input" style={{ width: '100%' }} />
                </div>
                {careerStatus === 'Interview Scheduled' && (
                  <input type="datetime-local" value={careerInterviewAt} onChange={event => setCareerInterviewAt(event.target.value)}
                    className="search-input" style={{ width: '100%', marginTop: '0.6rem' }} />
                )}
                <button type="button" onClick={updateCareerApplication} disabled={careerSaving}
                  className="modal-close-btn" style={{ marginTop: '0.75rem', background: 'var(--accent)', color: '#fff', opacity: careerSaving ? 0.55 : 1 }}>
                  {careerSaving ? 'Saving…' : 'Post Status Update'}
                </button>
              </div>

              <button className="modal-close-btn" onClick={() => setSelectedCareerEnquiry(null)}>Close</button>
            </div>
          </div>
        )}

        {settlingVendor && (
          <div className="modal-backdrop" onClick={() => !isSettling && setSettlingVendor(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal-head">
                <div className="modal-title">Record Vendor Offline Settlement</div>
                <button className="modal-close" onClick={() => !isSettling && setSettlingVendor(null)}>×</button>
              </div>
              <div style={{ marginBottom: '1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Vendor:</span>
                  <span style={{ fontWeight: 700 }}>{settlingVendor.vendor_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--muted)' }}>Pending Orders:</span>
                  <span style={{ fontWeight: 600 }}>{settlingVendor.pending_orders_count} orders</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                  <span style={{ color: 'var(--muted)' }}>Due Amount:</span>
                  <span style={{ fontWeight: 900, color: '#10b981', fontSize: '1.125rem' }}>
                    ₹{Number(settlingVendor.pending_due_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)', marginBottom: '0.375rem' }}>
                  Settlement Note / Offline Payment Reference:
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  placeholder="e.g. Settled offline via Cash / UPI / Bank Transfer"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="modal-close-btn"
                  disabled={isSettling}
                  onClick={() => setSettlingVendor(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{
                    padding: '0.45rem 1rem',
                    background: 'var(--brand-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: isSettling ? 'not-allowed' : 'pointer',
                    opacity: isSettling ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  disabled={isSettling}
                  onClick={() => handleMarkVendorCommissionPaid(settlingVendor)}
                >
                  <CheckCircle2 size={15} />
                  {isSettling ? 'Saving...' : 'Confirm as Paid'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading…</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
