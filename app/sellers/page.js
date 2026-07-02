'use client';

import { useState, useEffect } from 'react';

const FEATURES = [
  { em: "🆓", title: "Free Registration", desc: "No charges to join. No monthly fees. List your products and start selling completely free." },
  { em: "🚚", title: "Logistics Support", desc: "We partner with couriers and guide you on packaging. You just prepare the order — we handle the rest." },
  { em: "💸", title: "Fast Payments", desc: "Get paid directly to your bank account within 3–5 working days after successful delivery." },
  { em: "📊", title: "Seller Dashboard", desc: "Track your orders, sales, revenue and customers — all in one easy-to-use dashboard." },
  { em: "🏅", title: "GI Tag Help", desc: "Don't have a GI certificate? We help you apply and get your products officially certified." },
  { em: "📱", title: "WhatsApp Support", desc: "Dedicated seller support team on WhatsApp. Get help in Hindi or English, anytime." },
  { em: "📸", title: "Photography Help", desc: "Need better product photos? Our team assists with photography tips and guidance — completely free." },
  { em: "🌍", title: "Pan-India Reach", desc: "Sell from your village in Bihar and reach customers in Mumbai, Delhi, Bengaluru and beyond." },
];

const STEPS = [
  { n: "1", title: "Fill this form", desc: "Takes less than 3 minutes to complete" },
  { n: "2", title: "Team verification call", desc: "Our team calls you within 24 hours" },
  { n: "3", title: "Account activated", desc: "Get access to your seller dashboard" },
  { n: "4", title: "List & sell", desc: "Upload photos and start getting orders" },
];

const DISTRICTS = [
  "Select your district", "Patna", "Muzaffarpur", "Darbhanga", "Bhagalpur",
  "Gaya", "Nalanda", "Madhubani", "Sitamarhi", "Vaishali", "Samastipur",
  "Begusarai", "Munger", "Bhojpur", "Rohtas", "Arrah", "Aurangabad",
  "Jehanabad", "Nawada", "Sheikhpura", "Lakhisarai", "Jamui",
];

const CATEGORIES = [
  "What do you sell or make?",
  "Food & Agricultural Products",
  "Handicrafts & Art",
  "Textiles & Silk",
  "Spices & Herbs",
  "Sweets & Snacks",
  "Fresh Fruits",
  "Dairy Products",
  "Other",
];

const LANGUAGES = [
  "Select preferred language",
  "Hindi",
  "Maithili",
  "Bhojpuri",
  "English"
];

const SELLER_TYPES = [
  "Select seller type",
  "Individual Farmer",
  "Individual Artisan",
  "Self-Help Group (SHG) / Co-operative",
  "Small Business / Proprietorship"
];

function FormInput({ label, placeholder, type = 'text', required = false, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '11px 13px',
          border: `1.5px solid ${error ? '#D32F2F' : '#E8DDD4'}`,
          borderRadius: 8,
          fontSize: 13,
          fontFamily: 'inherit',
          background: '#FFFCF8',
          outline: 'none',
          color: '#1A1410',
          transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = error ? '#D32F2F' : '#C85A08'}
        onBlur={e => e.target.style.borderColor = error ? '#D32F2F' : '#E8DDD4'}
      />
      {error && <span style={{ display: 'block', fontSize: 11, color: '#D32F2F', marginTop: 4 }}>{error}</span>}
    </div>
  );
}

function FormSelect({ label, options, required = false, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '11px 13px',
          border: `1.5px solid ${error ? '#D32F2F' : '#E8DDD4'}`,
          borderRadius: 8,
          fontSize: 13,
          fontFamily: 'inherit',
          background: '#FFFCF8',
          outline: 'none',
          color: '#1A1410',
          cursor: 'pointer',
          transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = error ? '#D32F2F' : '#C85A08'}
        onBlur={e => e.target.style.borderColor = error ? '#D32F2F' : '#E8DDD4'}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span style={{ display: 'block', fontSize: 11, color: '#D32F2F', marginTop: 4 }}>{error}</span>}
    </div>
  );
}

function FormTextarea({ label, placeholder, required = false, rows = 3, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
        {label}{required && <span style={{ color: '#C85A08' }}> *</span>}
      </label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '11px 13px',
          border: `1.5px solid ${error ? '#D32F2F' : '#E8DDD4'}`,
          borderRadius: 8,
          fontSize: 13,
          fontFamily: 'inherit',
          background: '#FFFCF8',
          outline: 'none',
          color: '#1A1410',
          resize: 'vertical',
          lineHeight: 1.6,
          transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = error ? '#D32F2F' : '#C85A08'}
        onBlur={e => e.target.style.borderColor = error ? '#D32F2F' : '#E8DDD4'}
      />
      {error && <span style={{ display: 'block', fontSize: 11, color: '#D32F2F', marginTop: 4 }}>{error}</span>}
    </div>
  );
}


export default function SellersPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    language: 'Select preferred language',
    sellerType: 'Select seller type',
    businessName: '',
    district: 'Select your district',
    villageTown: '',
    pinCode: '',
    streetAddress: '',
    category: 'What do you sell or make?',
    productDescription: '',
    monthlyCapacity: '',
    hasGst: 'No, I am exempt (Turnover below threshold)',
    gstNumber: '',
    payoutMethod: 'upi',
    upiId: '',
    bankHolderName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    aadhaarNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // OTP states
  const [sellerId, setSellerId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  // Resume states
  const [showResumePanel, setShowResumePanel] = useState(false);
  const [resumeId, setResumeId] = useState('');
  const [resumeError, setResumeError] = useState('');

  const handleResumeProgress = async () => {
    if (!resumeId.trim()) {
      setResumeError("Please enter your Seller ID.");
      return;
    }
    setLoading(true);
    setResumeError('');
    try {
      const response = await fetch(`/api/register-seller?sellerId=${resumeId.trim()}`);
      const result = await response.json();

      if (result.success) {
        const seller = result.seller;
        // Populate formData
        setFormData({
          fullName: seller.fullName || '',
          mobile: seller.mobile || '',
          email: seller.email || '',
          language: seller.language || 'Select preferred language',
          sellerType: seller.sellerType || 'Select seller type',
          businessName: seller.businessName || '',
          district: seller.district || 'Select your district',
          villageTown: seller.villageTown || '',
          pinCode: seller.pinCode || '',
          streetAddress: seller.streetAddress || '',
          category: seller.category || 'What do you sell or make?',
          productDescription: seller.productDescription || '',
          monthlyCapacity: seller.monthlyCapacity || '',
          hasGst: seller.hasGst || 'No, I am exempt (Turnover below threshold)',
          gstNumber: seller.gstNumber || '',
          payoutMethod: seller.payoutMethod || 'upi',
          upiId: seller.upiId || '',
          bankHolderName: seller.bankHolderName || '',
          bankAccountNumber: seller.bankAccountNumber || '',
          bankIfsc: seller.bankIfsc || '',
          aadhaarNumber: seller.aadhaarNumber || '',
        });
        
        setSellerId(seller.id);
        setOtpVerified(true);
        
        // Determine step to resume based on missing details
        let targetStep = 2;
        if (!seller.sellerType || seller.sellerType === 'Select seller type' || !seller.district || seller.district === 'Select your district' || !seller.villageTown || !seller.pinCode || !seller.streetAddress) {
          targetStep = 2;
        } else if (!seller.category || seller.category === 'What do you sell or make?' || !seller.productDescription || !seller.monthlyCapacity) {
          targetStep = 3;
        } else {
          targetStep = 4;
        }
        
        setStep(targetStep);
        setShowResumePanel(false);
      } else {
        setResumeError(result.error || 'Seller ID not found. Please check and try again.');
      }
    } catch (err) {
      console.error('Resume error:', err);
      setResumeError('Network error. Failed to resume progress.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpSent && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpCountdown]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field] || errors.submit) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
        submit: null
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      else if (formData.fullName.trim().length < 3) newErrors.fullName = "Name must be at least 3 characters";

      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.language || formData.language === "Select preferred language") {
        newErrors.language = "Please select your preferred language";
      }
    }

    if (currentStep === 2) {
      if (!formData.sellerType || formData.sellerType === "Select seller type") {
        newErrors.sellerType = "Please select a seller type";
      }

      if (!formData.district || formData.district === "Select your district") {
        newErrors.district = "Please select your district";
      }

      if (!formData.villageTown.trim()) {
        newErrors.villageTown = "Village / Town is required";
      } else if (formData.villageTown.trim().length < 2) {
        newErrors.villageTown = "Village / Town must be at least 2 characters";
      }

      if (!formData.pinCode.trim()) {
        newErrors.pinCode = "Pin Code is required";
      } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
        newErrors.pinCode = "Pin Code must be exactly 6 digits";
      }

      if (!formData.streetAddress.trim()) {
        newErrors.streetAddress = "Complete address is required";
      } else if (formData.streetAddress.trim().length < 5) {
        newErrors.streetAddress = "Complete address must be at least 5 characters";
      }
    }

    if (currentStep === 3) {
      if (!formData.category || formData.category === "What do you sell or make?") {
        newErrors.category = "Please select a product category";
      }

      if (!formData.productDescription.trim()) {
        newErrors.productDescription = "Product description is required";
      } else if (formData.productDescription.trim().length < 10) {
        newErrors.productDescription = "Description must be at least 10 characters";
      }

      if (!formData.monthlyCapacity.trim()) {
        newErrors.monthlyCapacity = "Monthly capacity is required";
      }

      if (formData.hasGst === "Yes, I have a GSTIN") {
        if (!formData.gstNumber.trim()) {
          newErrors.gstNumber = "GSTIN number is required";
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(formData.gstNumber.trim())) {
          newErrors.gstNumber = "Please enter a valid 15-character GSTIN (e.g. 10AAAAA1111A1Z1)";
        }
      }
    }

    if (currentStep === 4) {
      if (formData.payoutMethod === "upi") {
        if (!formData.upiId.trim()) {
          newErrors.upiId = "UPI ID is required";
        } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId.trim())) {
          newErrors.upiId = "Please enter a valid UPI ID (e.g. mobile@upi)";
        }
      } else if (formData.payoutMethod === "bank") {
        if (!formData.bankHolderName.trim()) {
          newErrors.bankHolderName = "Account holder name is required";
        }
        if (!formData.bankAccountNumber.trim()) {
          newErrors.bankAccountNumber = "Account number is required";
        } else if (!/^\d{9,18}$/.test(formData.bankAccountNumber.trim())) {
          newErrors.bankAccountNumber = "Please enter a valid account number (9–18 digits)";
        }
        if (!formData.bankIfsc.trim()) {
          newErrors.bankIfsc = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIfsc.toUpperCase().trim())) {
          newErrors.bankIfsc = "Please enter a valid 11-digit IFSC code (e.g. SBIN0012345)";
        }
      }

      if (formData.aadhaarNumber.trim() && !/^\d{12}$/.test(formData.aadhaarNumber.trim())) {
        newErrors.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    // Validate Step 1 fields before sending OTP
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.language || formData.language === "Select preferred language") {
      newErrors.language = "Preferred language is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setOtpSent(true);
    setOtpCountdown(30);
  };

  const handleRegisterAccount = async () => {
    if (!otp.trim()) {
      setErrors(prev => ({ ...prev, otp: "Please enter the OTP code" }));
      return;
    } else if (otp.trim() !== '123456') {
      setErrors(prev => ({ ...prev, otp: "Invalid OTP. Use the demo code: 123456" }));
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const response = await fetch('/api/register-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          language: formData.language,
          otp: otp.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSellerId(result.sellerId);
        setOtpVerified(true);
        setStep(2); // Progress directly to step 2 after account creation
      } else {
        setErrors({ submit: result.error || 'Account registration failed. Please try again.' });
      }
    } catch (err) {
      console.error('Account creation error:', err);
      setErrors({ submit: 'Network error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePatchUpdate = async (nextStep) => {
    setLoading(true);
    setErrors({});
    
    let fieldsToUpdate = {};
    if (step === 2) {
      fieldsToUpdate = {
        sellerType: formData.sellerType,
        businessName: formData.businessName,
        district: formData.district,
        villageTown: formData.villageTown,
        pinCode: formData.pinCode,
        streetAddress: formData.streetAddress,
      };
    } else if (step === 3) {
      fieldsToUpdate = {
        category: formData.category,
        productDescription: formData.productDescription,
        monthlyCapacity: formData.monthlyCapacity,
        hasGst: formData.hasGst,
        gstNumber: formData.hasGst === 'Yes, I have a GSTIN' ? formData.gstNumber : '',
      };
    }

    try {
      const response = await fetch('/api/register-seller', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          ...fieldsToUpdate
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStep(nextStep);
      } else {
        setErrors({ submit: result.error || 'Failed to update details. Please try again.' });
      }
    } catch (err) {
      console.error('Incremental update error:', err);
      setErrors({ submit: 'Network error. Could not save progress.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 1) {
        handleRegisterAccount();
      } else {
        handlePatchUpdate(step + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      setLoading(true);
      setErrors({});
      try {
        const response = await fetch('/api/register-seller', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sellerId,
            payoutMethod: formData.payoutMethod,
            upiId: formData.payoutMethod === 'upi' ? formData.upiId : '',
            bankHolderName: formData.payoutMethod === 'bank' ? formData.bankHolderName : '',
            bankAccountNumber: formData.payoutMethod === 'bank' ? formData.bankAccountNumber : '',
            bankIfsc: formData.payoutMethod === 'bank' ? formData.bankIfsc : '',
            aadhaarNumber: formData.aadhaarNumber,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitted(true);
        } else {
          setErrors({ submit: result.error || 'Failed to finalize registration. Please try again.' });
        }
      } catch (err) {
        console.error('Final submit error:', err);
        setErrors({ submit: 'Network error. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ background: '#FFFCF8' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(140deg, #EAF5F0 0%, #FFFCF8 60%, #FFF4EC 100%)',
        padding: '72px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 72,
        alignItems: 'center',
        borderBottom: '1px solid #E8DDD4',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EAF5F0', border: '1px solid rgba(26,92,56,0.2)', borderRadius: 40, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#1A5C38', marginBottom: 20 }}>
            🌾 For Farmers & Artisans of Bihar
          </div>
          <h1 style={{ fontSize: 46, color: '#1A1410', lineHeight: 1.1, marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Sell Your <em style={{ color: '#1A5C38', fontStyle: 'italic' }}>Bihar Products</em> to All of India
          </h1>
          <p style={{ fontSize: 16, color: '#4A3F35', lineHeight: 1.75, marginBottom: 28 }}>
            No middlemen. No hidden fees. Direct payment to your bank account within 3–5 days. Join 800+ sellers already growing with Bihar Ka Bazaar.
          </p>
          <button
            onClick={() => document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#1A5C38', color: '#fff', border: '2px solid #1A5C38', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Register Free Today →
          </button>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 36 }}>
            {[["800+", "Active Sellers"], ["₹0", "Registration Fee"], ["3–5", "Days to First Payment"]].map(([n, l]) => (
              <div key={l} style={{ background: '#fff', border: '1.5px solid #E8DDD4', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1A5C38', fontFamily: "'Playfair Display', serif" }}>{n}</div>
                <div style={{ fontSize: 11, color: '#8C7B6E', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Story Card */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 36, border: '1.5px solid #E8DDD4', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>👨‍🌾</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A5C38' }}>Ram Prasad — Makhana Farmer</div>
            <div style={{ fontSize: 12, color: '#8C7B6E' }}>Darbhanga, Bihar</div>
          </div>
          <div style={{ background: '#F5EEE6', borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#8C7B6E', marginBottom: 4 }}>Monthly Earnings Before BKB</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#8C7B6E' }}>₹8,000 – ₹12,000</div>
          </div>
          <div style={{ background: '#EAF5F0', border: '1.5px solid rgba(26,92,56,0.2)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#1A5C38', marginBottom: 4, fontWeight: 700 }}>Monthly Earnings with BKB</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1A5C38', fontFamily: "'Playfair Display', serif" }}>₹38,000+</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#8C7B6E', marginTop: 16, fontStyle: 'italic' }}>
            "Bihar Ka Bazaar changed everything for my family"
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: '72px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Benefits</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>Everything You Need to Sell</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: '#FFFCF8', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: '24px 18px', textAlign: 'center', transition: 'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C85A08'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD4'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: 38, display: 'block', marginBottom: 12 }}>{f.em}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: '#8C7B6E', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: '72px 60px', background: '#FFF8F2', borderTop: '1px solid #E8DDD4', borderBottom: '1px solid #E8DDD4' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Process</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>How It Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ textAlign: 'center', position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', top: 28, left: '60%', width: '80%', height: 2, background: '#E8DDD4', zIndex: 0 }} />
              )}
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C85A08', color: '#fff', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative', zIndex: 1, fontFamily: "'Playfair Display', serif" }}>
                {s.n}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: '#8C7B6E', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── REGISTRATION FORM ── */}
      <div id="register-section" style={{ background: '#1A5C38', padding: '72px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

        {/* Left text */}
        <div>
          <h2 style={{ fontSize: 36, color: '#fff', marginBottom: 14, fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
            Register as a Seller Today
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 32 }}>
            Fill the form and our team will contact you within 24 hours to complete your registration and help you list your first product.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</span>
                <div>
                  <strong style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{s.title}</strong>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, padding: '20px 22px', background: 'rgba(255,255,255,0.1)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Need help? Call us directly</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>+91 612-XXX-XXXX</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>Mon–Sat, 9am to 6pm · Hindi & English</div>
          </div>
        </div>

        {/* Registration Form */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 24, color: '#1A5C38', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Registration Submitted!</h3>
              <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.7, marginBottom: 20 }}>
                Dhanyavaad, <strong>{formData.fullName}</strong>! Our verification team will review your application for <strong>{formData.category}</strong> and contact you in <strong>{formData.language}</strong> at <strong>{formData.mobile}</strong> within 24 hours.
              </p>
              <div style={{ background: '#F5EEE6', borderRadius: 12, padding: '16px', fontSize: 13, color: '#4A3F35', textAlign: 'left', lineHeight: 1.6 }}>
                <strong style={{ color: '#1A1410', display: 'block', marginBottom: 8 }}>Application Details Summary:</strong>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <li><strong>Seller Type:</strong> {formData.sellerType}</li>
                  <li><strong>Location:</strong> {formData.villageTown}, {formData.district} (PIN {formData.pinCode})</li>
                  <li><strong>GSTIN Details:</strong> {formData.hasGst === 'Yes, I have a GSTIN' ? `Yes (${formData.gstNumber})` : 'Exempt'}</li>
                  <li><strong>Payout Setup:</strong> {formData.payoutMethod === 'upi' ? `UPI (${formData.upiId})` : `Bank Transfer (Account ending in ${formData.bankAccountNumber.slice(-4)})`}</li>
                </ul>
              </div>
            </div>
          ) : (
            <form onSubmit={e => e.preventDefault()}>
              {/* Progress Bar & Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#C85A08', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Step {step} of 4
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1410' }}>
                    {step === 1 && "Personal Profile"}
                    {step === 2 && "Business & Address"}
                    {step === 3 && "Products & GST Details"}
                    {step === 4 && "Payout & Verification"}
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#E8DDD4', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(step / 4) * 100}%`, height: '100%', background: '#1A5C38', borderRadius: 3, transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Step 1: Personal Profile */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Personal Profile</h3>

                  {/* Resume Panel Link */}
                  <div style={{ marginBottom: 20, borderBottom: '1px solid #E8DDD4', paddingBottom: 16 }}>
                    <div 
                      onClick={() => {
                        setShowResumePanel(!showResumePanel);
                        setResumeError('');
                      }} 
                      style={{ fontSize: 13, color: '#C85A08', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {showResumePanel ? '🔑 Hide Resume Panel' : '🔑 Already started? Click here to resume with Seller ID'}
                    </div>

                    {showResumePanel && (
                      <div style={{ marginTop: 12, background: '#F5EEE6', borderRadius: 10, padding: 14, border: '1.5px solid #E8DDD4' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
                              Enter your Seller ID
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. BKB-SEL-178..."
                              value={resumeId}
                              onChange={(e) => {
                                setResumeId(e.target.value);
                                if (resumeError) setResumeError('');
                              }}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                border: `1.5px solid ${resumeError ? '#D32F2F' : '#E8DDD4'}`,
                                borderRadius: 8,
                                fontSize: 12,
                                fontFamily: 'inherit',
                                background: '#FFFCF8',
                                outline: 'none',
                                color: '#1A1410'
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleResumeProgress}
                            disabled={loading}
                            style={{
                              padding: '10px 8px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              background: '#1A5C38',
                              color: '#fff',
                              border: 'none',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              transition: 'all 0.2s',
                              height: '38px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {loading ? 'Resuming...' : 'Resume Progress'}
                          </button>
                        </div>
                        {resumeError && (
                          <span style={{ display: 'block', fontSize: 11, color: '#D32F2F', marginTop: 6 }}>
                            ⚠️ {resumeError}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <FormInput
                    label="Full Name"
                    placeholder="e.g. Ram Prasad"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    error={errors.fullName}
                    required
                  />

                  {/* Mobile & OTP row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end', marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 5 }}>
                        Mobile Number <span style={{ color: '#C85A08' }}> *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={handleInputChange('mobile')}
                        disabled={otpVerified}
                        style={{
                          width: '100%',
                          padding: '11px 13px',
                          border: `1.5px solid ${errors.mobile ? '#D32F2F' : '#E8DDD4'}`,
                          borderRadius: 8,
                          fontSize: 13,
                          fontFamily: 'inherit',
                          background: otpVerified ? '#EAF5F0' : '#FFFCF8',
                          outline: 'none',
                          color: '#1A1410',
                          transition: 'border-color 0.2s'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpCountdown > 0 || otpVerified}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        background: (otpCountdown > 0 || otpVerified) ? '#E8DDD4' : '#C85A08',
                        color: (otpCountdown > 0 || otpVerified) ? '#8C7B6E' : '#fff',
                        border: 'none',
                        cursor: (otpCountdown > 0 || otpVerified) ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        height: '42px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {otpVerified ? 'Verified ✓' : (otpCountdown > 0 ? `Resend in ${otpCountdown}s` : (otpSent ? 'Resend OTP' : 'Send OTP'))}
                    </button>
                  </div>
                  {errors.mobile && <span style={{ display: 'block', fontSize: 11, color: '#D32F2F', marginTop: -10, marginBottom: 14 }}>{errors.mobile}</span>}

                  {otpSent && !otpVerified && (
                    <div style={{ background: '#FFF8F2', border: '1.5px dashed #C85A08', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                      <FormInput
                        label="Enter 6-Digit OTP"
                        placeholder="Enter 123456 to verify"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value);
                          if (errors.otp) setErrors(prev => ({ ...prev, otp: null }));
                        }}
                        error={errors.otp}
                        required
                      />
                      <span style={{ fontSize: 11, color: '#9A720A', display: 'block', marginTop: -6 }}>
                        💡 <strong>Demo Mode:</strong> Use test code <strong>123456</strong> to verify.
                      </span>
                    </div>
                  )}

                  <FormInput
                    label="Email Address"
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={errors.email}
                    required
                  />

                  <FormSelect
                    label="Preferred Language for Verification Call"
                    options={LANGUAGES}
                    value={formData.language}
                    onChange={handleInputChange('language')}
                    error={errors.language}
                    required
                  />
                </div>
              )}

              {/* Step 2: Business & Address */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Business & Location</h3>
                  
                  {sellerId && (
                    <div style={{ background: '#EAF5F0', border: '1.5px solid rgba(26,92,56,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1A5C38', fontWeight: 600 }}>
                      ✓ Account created (ID: {sellerId}). You can finalize details now, or they will be saved as you progress.
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <FormSelect
                      label="Seller Type"
                      options={SELLER_TYPES}
                      value={formData.sellerType}
                      onChange={handleInputChange('sellerType')}
                      error={errors.sellerType}
                      required
                    />
                    <FormInput
                      label="Business / Farm Name (Optional)"
                      placeholder="e.g. Prasad Makhana Farms"
                      value={formData.businessName}
                      onChange={handleInputChange('businessName')}
                      error={errors.businessName}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <FormSelect
                      label="District"
                      options={DISTRICTS}
                      value={formData.district}
                      onChange={handleInputChange('district')}
                      error={errors.district}
                      required
                    />
                    <FormInput
                      label="Village / Town"
                      placeholder="e.g. Manigachhi"
                      value={formData.villageTown}
                      onChange={handleInputChange('villageTown')}
                      error={errors.villageTown}
                      required
                    />
                  </div>
                  <FormInput
                    label="Pin Code"
                    placeholder="e.g. 847239"
                    value={formData.pinCode}
                    onChange={handleInputChange('pinCode')}
                    error={errors.pinCode}
                    required
                  />
                  <FormTextarea
                    label="Complete Street Address"
                    placeholder="e.g. Ward No. 4, near Shiv Mandir, Manigachhi"
                    value={formData.streetAddress}
                    onChange={handleInputChange('streetAddress')}
                    error={errors.streetAddress}
                    required
                  />
                </div>
              )}

              {/* Step 3: Products & GSTIN Details */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Product & GSTIN Details</h3>
                  <FormSelect
                    label="Product Category"
                    options={CATEGORIES}
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    error={errors.category}
                    required
                  />
                  <FormTextarea
                    label="About Your Products"
                    placeholder="Describe what items you sell, your experience, what makes them unique..."
                    value={formData.productDescription}
                    onChange={handleInputChange('productDescription')}
                    error={errors.productDescription}
                    required
                  />
                  <FormInput
                    label="Estimated Monthly Supply Capacity"
                    placeholder="e.g. 500 kg of makhana, 15 paintings"
                    value={formData.monthlyCapacity}
                    onChange={handleInputChange('monthlyCapacity')}
                    error={errors.monthlyCapacity}
                    required
                  />
                  <FormSelect
                    label="Do you have a GSTIN (GST Number)?"
                    options={["No, I am exempt (Turnover below threshold)", "Yes, I have a GSTIN"]}
                    value={formData.hasGst}
                    onChange={handleInputChange('hasGst')}
                    error={errors.hasGst}
                    required
                  />
                  {formData.hasGst === "Yes, I have a GSTIN" && (
                    <FormInput
                      label="GSTIN Number"
                      placeholder="e.g. 10AAAAA1111A1Z1"
                      value={formData.gstNumber}
                      onChange={handleInputChange('gstNumber')}
                      error={errors.gstNumber}
                      required
                    />
                  )}
                </div>
              )}

              {/* Step 4: Payout & Verification */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontSize: 18, color: '#1A1410', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Payout Setup & Verification</h3>
                  
                  {/* Payout Method Selector */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4A3F35', marginBottom: 8 }}>
                      Preferred Payout Method *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div
                        onClick={() => {
                          setFormData(prev => ({ ...prev, payoutMethod: 'upi' }));
                          setErrors(prev => ({ ...prev, upiId: null, bankHolderName: null, bankAccountNumber: null, bankIfsc: null }));
                        }}
                        style={{
                          border: `1.5px solid ${formData.payoutMethod === 'upi' ? '#C85A08' : '#E8DDD4'}`,
                          background: formData.payoutMethod === 'upi' ? '#FFF4EC' : '#fff',
                          borderRadius: 10,
                          padding: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 13,
                          color: formData.payoutMethod === 'upi' ? '#C85A08' : '#4A3F35',
                          transition: 'all 0.2s'
                        }}
                      >
                        📱 UPI ID
                      </div>
                      <div
                        onClick={() => {
                          setFormData(prev => ({ ...prev, payoutMethod: 'bank' }));
                          setErrors(prev => ({ ...prev, upiId: null, bankHolderName: null, bankAccountNumber: null, bankIfsc: null }));
                        }}
                        style={{
                          border: `1.5px solid ${formData.payoutMethod === 'bank' ? '#C85A08' : '#E8DDD4'}`,
                          background: formData.payoutMethod === 'bank' ? '#FFF4EC' : '#fff',
                          borderRadius: 10,
                          padding: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 13,
                          color: formData.payoutMethod === 'bank' ? '#C85A08' : '#4A3F35',
                          transition: 'all 0.2s'
                        }}
                      >
                        🏦 Bank Account
                      </div>
                    </div>
                  </div>

                  {formData.payoutMethod === 'upi' ? (
                    <FormInput
                      label="UPI ID for Payments"
                      placeholder="e.g. mobile@upi, name@okaxis"
                      value={formData.upiId}
                      onChange={handleInputChange('upiId')}
                      error={errors.upiId}
                      required
                    />
                  ) : (
                    <div>
                      <FormInput
                        label="Account Holder Name"
                        placeholder="e.g. Ram Prasad"
                        value={formData.bankHolderName}
                        onChange={handleInputChange('bankHolderName')}
                        error={errors.bankHolderName}
                        required
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <FormInput
                          label="Bank Account Number"
                          placeholder="e.g. 10023456789"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange('bankAccountNumber')}
                          error={errors.bankAccountNumber}
                          required
                        />
                        <FormInput
                          label="IFSC Code"
                          placeholder="e.g. SBIN0012345"
                          value={formData.bankIfsc}
                          onChange={handleInputChange('bankIfsc')}
                          error={errors.bankIfsc}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <FormInput
                    label="Aadhaar Card Number (Optional - for instant activation)"
                    placeholder="e.g. 123456789012"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange('aadhaarNumber')}
                    error={errors.aadhaarNumber}
                  />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8, marginBottom: 14 }}>
                    <input type="checkbox" id="terms" required style={{ marginTop: 3, cursor: 'pointer' }} defaultChecked />
                    <label htmlFor="terms" style={{ fontSize: 11, color: '#8C7B6E', lineHeight: 1.4, cursor: 'pointer' }}>
                      I agree to the Bihar Ka Bazaar seller terms and verify that the information supplied above is accurate.
                    </label>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: 8, padding: 12, color: '#C62828', fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
                  ⚠️ {errors.submit}
                </div>
              )}

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: 13,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      background: '#fff',
                      color: '#4A3F35',
                      border: '1.5px solid #E8DDD4',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => !loading && (e.target.style.borderColor = '#C85A08')}
                    onMouseLeave={e => !loading && (e.target.style.borderColor = '#E8DDD4')}
                  >
                    ← Back
                  </button>
                )}
                {step === 1 ? (
                  !otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{
                        flex: 2,
                        padding: 13,
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        background: '#C85A08',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                      onMouseEnter={e => e.target.style.background = '#A04806'}
                      onMouseLeave={e => e.target.style.background = '#C85A08'}
                    >
                      Send Verification OTP
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRegisterAccount}
                      disabled={loading}
                      style={{
                        flex: 2,
                        padding: 13,
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        background: loading ? '#8C7B6E' : '#1A5C38',
                        color: '#fff',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                      onMouseEnter={e => !loading && (e.target.style.background = '#124328')}
                      onMouseLeave={e => !loading && (e.target.style.background = '#1A5C38')}
                    >
                      {loading ? 'Registering...' : 'Verify OTP & Register Account'}
                    </button>
                  )
                ) : step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: 13,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      background: loading ? '#8C7B6E' : '#C85A08',
                      color: '#fff',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => !loading && (e.target.style.background = '#A04806')}
                    onMouseLeave={e => !loading && (e.target.style.background = '#C85A08')}
                  >
                    {loading ? 'Saving...' : 'Continue →'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      flex: 2,
                      padding: 13,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      background: loading ? '#8C7B6E' : '#1A5C38',
                      color: '#fff',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => !loading && (e.target.style.background = '#124328')}
                    onMouseLeave={e => !loading && (e.target.style.background = '#1A5C38')}
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#8C7B6E', marginTop: 16 }}>
                Or register via call: <strong style={{ color: '#1A1410' }}>+91 612-XXX-XXXX</strong>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── TESTIMONIALS FROM SELLERS ── */}
      <div style={{ padding: '72px 60px', background: '#fff' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 44px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#C85A08', marginBottom: 8 }}>Seller Stories</div>
          <h2 style={{ fontSize: 34, color: '#1A1410', fontFamily: "'Playfair Display', serif" }}>What Our Sellers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {[
            { em: "👩‍🌾", bg: "#EAF5F0", name: "Kamla Devi", role: "Madhubani Artist · Madhubani", text: "Before BKB I could only sell locally. Now my paintings go to Bangalore, Mumbai, even overseas. I earn 4x more than before." },
            { em: "👨‍🌾", bg: "#FFF4EC", name: "Ram Prasad", role: "Makhana Farmer · Darbhanga", text: "I used to sell to middlemen at very low prices. Now I get the full market price directly. My family's life has completely changed." },
            { em: "👩‍🌾", bg: "#FEF8E0", name: "Sunita Kumari", role: "Silk Weaver · Bhagalpur", text: "The team helped me get my GI certificate and even helped me take better photos of my sarees. Orders started coming within a week!" },
          ].map(t => (
            <div key={t.name} style={{ background: '#FFFCF8', border: '1.5px solid #E8DDD4', borderRadius: 16, padding: 28 }}>
              <div style={{ color: '#9A720A', fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: '#4A3F35', lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{t.em}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#8C7B6E' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}