"use client";
import { useState, useEffect } from "react";
import { useServiceCities } from "@/hooks/useServiceCities";
import { uploadPropertyImages } from "@/lib/property-image-upload";

const PROPERTY_TYPES = ["Residential", "Commercial", "Plots"];

const empty = {
  title: "", type: "Residential", location: "", address: "",
  price: "", price_raw: "", beds: "", baths: "", area: "",
  description: "", highlights: "",
  seller_type: "owner", seller_name: "", seller_phone: "", seller_email: "",
};

export default function RentPage() {
  const { cities: availableCities, loading: loadingCities, error: cityError } = useServiceCities();
  const [dark,      setDark]      = useState(true);
  const [form,      setForm]      = useState(empty);
  const [images,    setImages]    = useState([]);    // Cloudinary URLs
  const [imageFiles,setImageFiles]= useState([]);   // File objects for upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step,      setStep]      = useState(1);    // 1=details 2=seller 3=photos 4=review 5=success
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    const html = document.documentElement;
    const obs  = new MutationObserver(() => setDark(html.classList.contains("dark-mode")));
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    setDark(html.classList.contains("dark-mode"));
    return () => obs.disconnect();
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImageFiles(files);
    setImages([]); // Clear previous URLs, will be filled after upload
  };

  const uploadAllImages = async () => {
    if (imageFiles.length === 0) {
      setImages([]);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const uploadedUrls = await uploadPropertyImages(imageFiles, setUploadProgress);
      setImages(uploadedUrls);
      return uploadedUrls;
    } catch (err) {
      setError("Image upload failed: " + err.message);
      setImages([]);
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_,i)=>i!==idx));
    setImageFiles(prev => prev.filter((_,i)=>i!==idx));
  };

  const validate = () => {
    if (step === 1) {
      if (!form.title || !form.type || !form.location || !form.price || !form.price_raw || !form.area)
        return "Please fill all required fields.";
    }
    if (step === 2) {
      if (!form.seller_name || !form.seller_phone)
        return "Name and phone are required.";
    }
    if (step === 3) {
      if (imageFiles.length === 0)
        return "Please upload at least 1 image.";
    }
    return "";
  };

  const handleNext = async () => {
    // If on photo step, upload images before proceeding
    if (step === 3) {
      const err = validate();
      if (err) { setError(err); return; }
      
      setError("");
      const uploadedUrls = await uploadAllImages();
      if (!uploadedUrls) {
        return;
      }
      setStep(s => s + 1);
      return;
    }

    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true); 
    setError("");
    try {
      const payload = {
        title:        form.title,
        type:         form.type,
        listing_type: "rent",
        category:     form.type.toLowerCase(),
        price:        form.price,
        price_raw:    parseInt(form.price_raw.replace(/,/g, "")) || 0,
        location:     form.location,
        address:      form.address,
        beds:         form.type === "Plots" ? null : (form.beds ? parseInt(form.beds) : null),
        baths:        form.type === "Plots" ? null : (form.baths ? parseInt(form.baths) : null),
        area:         form.area   ? parseInt(form.area)   : null,
        description:  form.description,
        highlights:   form.highlights.split("\n").map(h=>h.trim()).filter(Boolean),
        images:       images,
        tag:          "Rent",
        seller_type:  form.seller_type,
        seller_name:  form.seller_name,
        seller_phone: form.seller_phone,
        seller_email: form.seller_email,
      };

      const res  = await fetch("/api/properties", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      const data = await res.json();
      if (data.success) {
        setStep(5);
      } else {
        setError(data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
    finally { 
      setLoading(false); 
    }
  };

  const bg   = dark ? "bg-black text-white"         : "bg-white text-zinc-900";
  const card = dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200";
  const inp  = `w-full px-4 py-3 text-sm border rounded-sm outline-none transition-all ${dark ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)]" : "bg-gray-50 border-gray-200 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800"}`;
  const lbl  = `block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? "text-zinc-400" : "text-zinc-500"}`;
  const muted= dark ? "text-zinc-500" : "text-zinc-400";

  const steps = ["Property Details", "Your Info", "Photos", "Review", "Done"];

  return (
    <main className={`min-h-screen font-serif ${bg}`}>

      {/* Hero */}
      <div className={`py-16 px-4 text-center ${dark ? "bg-zinc-950" : "bg-zinc-800"}`}>
        <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-widest">MTBOSS Property</span>
        <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-widest mt-2 mb-3">
          List Your<span className="block text-[var(--brand-blue)]">Property for Rent</span>
        </h1>
        <p className="text-zinc-400 text-xs max-w-md mx-auto font-bold">
          Free rental listing. Admin-verified before going live. Reach thousands of tenants.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Step Indicator */}
        {step < 5 && (
          <div className="flex mb-10 overflow-x-auto">
            {steps.slice(0,4).map((s, i) => (
              <div key={i} className="flex-1 flex items-center min-w-max">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step > i+1 ? "bg-[var(--brand-blue)] text-black" : step === i+1 ? "bg-[var(--brand-blue)] text-black" : dark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-200 text-zinc-400"}`}>
                    {step > i+1 ? "✓" : i+1}
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${step === i+1 ? "text-[var(--brand-blue)]" : muted}`}>{s}</p>
                </div>
                {i < 3 && <div className={`flex-1 h-px mx-2 ${step > i+1 ? "bg-[var(--brand-blue)]" : dark ? "bg-zinc-800" : "bg-zinc-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {error && <div className={`mb-4 p-3 rounded text-sm font-bold ${dark ? "bg-red-900/20 border border-red-700 text-red-400" : "bg-red-50 border border-red-200 text-red-600"}`}>{error}</div>}

        {/* ── STEP 1: Property Details ── */}
        {step === 1 && (
          <div className={`border rounded-sm p-6 space-y-5 ${card}`}>
            <h2 className="text-lg font-black uppercase tracking-tight">Property Details</h2>

            {/* Seller type toggle */}
            <div>
              <label className={lbl}>You are a *</label>
              <div className="flex gap-3">
                {["owner","broker"].map(t => (
                  <button key={t} type="button" onClick={() => set("seller_type", t)}
                    aria-pressed={form.seller_type === t}
                    className={`property-seller-choice flex-1 py-2.5 text-xs font-black uppercase tracking-widest border transition-all ${form.seller_type === t ? "property-seller-choice-active bg-[var(--brand-blue)] text-black border-[var(--brand-blue)]" : dark ? "property-seller-choice-dark border-zinc-700 text-zinc-400 hover:border-zinc-500" : "property-seller-choice-light border-gray-200 text-zinc-500 hover:border-zinc-500"}`}>
                    {t === "owner" ? "🏠 Owner" : "🤝 Broker / Agent"}
                  </button>
                ))}
              </div>
            </div>

            <div><label className={lbl}>Property Title *</label><input className={inp} placeholder="e.g. 2BHK Apartment for Rent in Noida" value={form.title} onChange={e=>set("title",e.target.value)} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Property Type *</label>
                <select className={inp} value={form.type} onChange={e=>set("type",e.target.value)}>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Location *</label>
                <select className={inp} value={form.location} onChange={e=>set("location",e.target.value)}>
                  <option value="">{loadingCities ? 'Loading locations...' : 'Select location'}</option>
                  {availableCities.map(l => <option key={l}>{l}</option>)}
                </select>
                {cityError && <p className="mt-1 text-[10px] text-red-500">{cityError}</p>}
              </div>
            </div>

            <div><label className={lbl}>Full Address</label><input className={inp} placeholder="Street, Sector, City..." value={form.address} onChange={e=>set("address",e.target.value)} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Monthly Rent (₹) Display *</label><input className={inp} placeholder="e.g. 25,000/mo" value={form.price} onChange={e=>set("price",e.target.value)} /></div>
              <div><label className={lbl}>Rent Amount (numeric) *</label><input type="number" className={inp} placeholder="e.g. 25000" value={form.price_raw} onChange={e=>set("price_raw",e.target.value)} /></div>
            </div>

            {form.type !== "Plots" ? (
              <div className="grid grid-cols-3 gap-4">
                <div><label className={lbl}>Beds</label><input type="number" className={inp} placeholder="2" value={form.beds} onChange={e=>set("beds",e.target.value)} /></div>
                <div><label className={lbl}>Baths</label><input type="number" className={inp} placeholder="1" value={form.baths} onChange={e=>set("baths",e.target.value)} /></div>
                <div><label className={lbl}>Area (sqft) *</label><input type="number" className={inp} placeholder="950" value={form.area} onChange={e=>set("area",e.target.value)} /></div>
              </div>
            ) : (
              <div>
                <label className={lbl}>Area (sqft) *</label>
                <input type="number" className={inp} placeholder="950" value={form.area} onChange={e=>set("area",e.target.value)} />
              </div>
            )}

            <div><label className={lbl}>Description</label><textarea rows={3} className={`${inp} resize-none`} placeholder="Describe the property..." value={form.description} onChange={e=>set("description",e.target.value)} /></div>
            <div><label className={lbl}>Features (one per line)</label><textarea rows={3} className={`${inp} resize-none`} placeholder={"Furnished\nParking Included\nNear Metro"} value={form.highlights} onChange={e=>set("highlights",e.target.value)} /></div>

            <button onClick={handleNext} className="w-full py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[10px] tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all">Next: Your Info →</button>
          </div>
        )}

        {/* ── STEP 2: Seller Info ── */}
        {step === 2 && (
          <div className={`border rounded-sm p-6 space-y-5 ${card}`}>
            <h2 className="text-lg font-black uppercase tracking-tight">Your Information</h2>
            <div><label className={lbl}>Full Name *</label><input className={inp} placeholder="Your name" value={form.seller_name} onChange={e=>set("seller_name",e.target.value)} /></div>
            <div><label className={lbl}>Phone Number *</label><input type="tel" className={inp} placeholder="10-digit mobile number" value={form.seller_phone} onChange={e=>{ const rawDigits = e.target.value.replace(/\D/g, ''); set("seller_phone", rawDigits && /^[6-9]/.test(rawDigits) ? rawDigits.slice(0, 10) : ''); }} maxLength={10} inputMode="numeric" /></div>
            <div><label className={lbl}>Email Address</label><input type="email" className={inp} placeholder="you@example.com" value={form.seller_email} onChange={e=>set("seller_email",e.target.value)} /></div>
            <p className={`text-[11px] leading-relaxed ${muted}`}>⚠️ Your contact details are only shared with verified tenants after admin approval.</p>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className={`flex-1 py-3 border text-xs font-black uppercase tracking-widest transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:border-zinc-500" : "border-gray-300 text-zinc-500 hover:border-zinc-700"}`}>← Back</button>
              <button onClick={handleNext} className="flex-1 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all">Next: Photos →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Photos ── */}
        {step === 3 && (
          <div className={`border rounded-sm p-6 space-y-5 ${card}`}>
            <h2 className="text-lg font-black uppercase tracking-tight">Property Photos</h2>
            <p className={`text-xs ${muted}`}>Upload up to 10 photos. Good photos get 3× more enquiries.</p>

            {/* Upload zone */}
            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-sm cursor-pointer transition-all ${dark ? "border-zinc-700 hover:border-[var(--brand-blue)]" : "border-gray-300 hover:border-zinc-800"}`}>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} disabled={uploading} />
              <p className="text-3xl mb-2">📸</p>
              <p className={`text-xs font-black uppercase tracking-widest ${muted}`}>Click to upload photos</p>
              <p className={`text-[11px] mt-1 ${muted}`}>JPG, PNG, WEBP — max 10 files</p>
            </label>

            {/* Upload Progress */}
            {uploading && (
              <div className={`p-4 rounded ${dark ? "bg-zinc-800" : "bg-sky-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs font-bold ${muted}`}>Uploading: {uploadProgress}%</p>
                </div>
                <div className={`w-full h-2 rounded-full ${dark ? "bg-zinc-700" : "bg-sky-200"}`}>
                  <div className="h-full bg-[var(--brand-blue)] rounded-full transition-all" style={{width: `${uploadProgress}%`}}></div>
                </div>
              </div>
            )}

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`photo-${i}`} className="w-full h-24 object-cover rounded" />
                    <button onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      ✕
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase">Cover</span>}
                  </div>
                ))}
              </div>
            )}

            {imageFiles.length > 0 && !uploading && (
              <p className={`text-xs ${muted}`}>✓ {imageFiles.length} image(s) selected. Ready to upload.</p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className={`flex-1 py-3 border text-xs font-black uppercase tracking-widest transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:border-zinc-500" : "border-gray-300 text-zinc-500 hover:border-zinc-700"}`}>← Back</button>
              <button onClick={handleNext} disabled={uploading || imageFiles.length === 0}
                className="flex-1 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {uploading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Uploading...</> : "Next: Review →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review & Submit ── */}
        {step === 4 && images.length > 0 && (
          <div className={`border rounded-sm p-6 space-y-5 ${card}`}>
            <h2 className="text-lg font-black uppercase tracking-tight">Review & Submit</h2>
            
            {/* Image preview */}
            <div>
              <p className={`text-xs font-black uppercase tracking-widest mb-3 ${muted}`}>Uploaded Images</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {images.map((url, i) => (
                  <img key={i} src={url} alt={`preview-${i}`} className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>

            {/* Property Summary */}
            <div className={`p-4 rounded ${dark ? "bg-zinc-800" : "bg-sky-50"}`}>
              <p className={`text-xs font-black uppercase tracking-widest mb-3 ${muted}`}>Property Summary</p>
              <div className="space-y-1 text-sm">
                <p><strong>Title:</strong> {form.title}</p>
                <p><strong>Type:</strong> {form.type}</p>
                <p><strong>Location:</strong> {form.location}</p>
                <p><strong>Monthly Rent:</strong> ₹{form.price}</p>
                <p><strong>Area:</strong> {form.area} sqft</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className={`flex-1 py-3 border text-xs font-black uppercase tracking-widest transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:border-zinc-500" : "border-gray-300 text-zinc-500 hover:border-zinc-700"}`}>← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting...</> : "Submit Listing ✓"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Success ── */}
        {step === 5 && (
          <div className={`border rounded-sm p-10 text-center space-y-4 ${card}`}>
            <p className="text-6xl">🎉</p>
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-blue)]">Rental Listing Submitted!</h2>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Your rental property has been published successfully and is now available on the Rent Properties page. Admin can still review or moderate the listing.
            </p>
            <div className={`border rounded p-4 text-left space-y-1 ${dark ? "border-zinc-800":"border-gray-100"}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>What happens next</p>
              <p className={`text-xs ${muted}`}>✓ Admin reviews your listing and images</p>
              <p className={`text-xs ${muted}`}>✓ Verification call may be made to {form.seller_phone}</p>
              <p className={`text-xs ${muted}`}>✓ Once approved, listing goes live on Rent page</p>
              <p className={`text-xs ${muted}`}>✓ Tenants can enquire directly</p>
            </div>
            <div className="flex gap-3 pt-2">
              <a href="/property/rent" className="flex-1 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[10px] tracking-widest hover:bg-[var(--brand-blue-dark)] transition-all text-center">Browse Rentals</a>
              <button onClick={() => { setStep(1); setForm(empty); setImages([]); setImageFiles([]); }}
                className={`flex-1 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:border-zinc-500":"border-gray-300 text-zinc-500"}`}>
                List Another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
