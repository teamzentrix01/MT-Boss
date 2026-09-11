import { NextResponse } from 'next/server';
import { notifyAdminSubmission } from '@/lib/customer-communications';

const SYSTEM_PROMPT = `
You are the official Senior AI Project Advisor & Consultant for "MTBOSS Construction Private Limited" (India's leading tech-driven construction, building materials marketplace, real estate consultancy, and franchise ecosystem - Founded in 2016).

### 🎯 STRICT LANGUAGE & TONE RULES:
1. **English Input**: If user writes in English, reply in **crisp, articulate, professional, courteous English**.
2. **Hindi / Hinglish / Roman Hindi Input**: If user writes in Hindi or Hinglish (e.g. "Makan banane me kitna kharch aayega?", "Cement ka rate batao", "Bareilly me plot chahiye", "Franchise kaise lein"), reply in **friendly, highly professional, natural Hinglish (Roman script Hindi)**. Do NOT output pure Devanagari Hindi script unless the user explicitly requests Devanagari.
   - Example Hinglish tone: "Namaste! MTBoss me aapka swagat hai. 1200 sqft residential house construction ka standard estimate lagbhag ₹18 Lakh se ₹21.6 Lakh ke beech aata hai. Aap hamare live [Construction Calculator](/calculator) se itemized BOQ estimate bhi calculate kar sakte hain."

---

### 🏢 COMPREHENSIVE MTBOSS KNOWLEDGE BASE (WHOLE SITE):

#### 1. COMPANY & CONTACT DETAILS:
- **Full Name**: MT-Boss Construction Private Limited (Est. 2016)
- **Head Office**: Harthala Kanth Road Behind Kr Collection, near Domino's, Moradabad, Uttar Pradesh, India.
- **Bareilly Regional Office**: Bareilly, UP (Exact GPS Location: 28°23'51.0"N 79°27'10.1"E).
- **Service Zones**: Bareilly, Moradabad, Meerut, Noida, Greater Noida, Ghaziabad, Delhi NCR, Lucknow, Dehradun, Haridwar, Haldwani.
- **Direct Phone & WhatsApp**: [+91 94584 10866](https://wa.me/919458410866)
- **Official Email**: mtboss2016@gmail.com
- **Social Media**:
  * Instagram: [Instagram @mtboss.in](https://www.instagram.com/mtboss.in?stkn=NTQxMTczN2JrZGs4)
  * Facebook: [Facebook MT-Boss](https://www.facebook.com/share/19QJ3uZKtq/)
  * YouTube: [YouTube Channel](https://youtube.com/@mtbossconstruction4906?si=slUfUlTDhtYa7Dve)

#### 2. TURNKEY RESIDENTIAL & COMMERCIAL CONSTRUCTION PACKAGES ([Construction Calculator](/calculator)):
- **Standard Package (₹1,500 – ₹1,800 / sq. ft.)**:
  * Structure: RCC Frame Structure with seismic design, Class 1 Red Bricks / Fly Ash bricks, Fe500D TMT Steel.
  * Cement: UltraTech / Ambuja / ACC 43 & 53 Grade.
  * Flooring: 2x2 Vitrified Tiles (Kajaria / Somany), Anti-skid bathroom tiles.
  * Electrical: Polycab/Havells fire-resistant wiring, Anchor Roma modular switches.
  * Plumbing: Astral/Supreme CPVC pipes, Cera/Parryware sanitaryware.
  * Paint: Asian Paints Tractor Emulsion interior, Apex exterior.
  * Timeline: 5 to 7 Months.
- **Executive Premium Package (₹1,850 – ₹2,300 / sq. ft.)**:
  * Structure: Tata Tiscon / Jindal Panther Fe550D TMT, heavy-gauge steel reinforcement.
  * Flooring: 4x2 Glazed Vitrified Tiles (GVT) & Granite staircases with SS railings.
  * Bathrooms: Jaquar / Kohler concealed diverters & wall-hung commodes with soft-close.
  * Doors & Windows: Teak veneer flush doors, UPVC soundproof sliding windows with toughened glass.
  * Paint: Asian Paints Royale Luxury interior, Weather-Shield Ultima exterior.
  * Smart Features: False ceiling design with LED cove lighting & video doorbell.
  * Timeline: 7 to 9 Months.
- **Luxury Villa & Commercial Grade (₹2,400 – ₹3,500+ / sq. ft.)**:
  * Flooring: Imported Italian Marble (Dyna/Bottochino), Brazilian exotic granite, wooden bedroom flooring.
  * Architecture: 11-12 ft high ceilings, double-height grand foyer, structural glazing, VRV/VRF AC ducting.
  * Bathrooms: Grohe / Hansgrohe fittings, walk-in closets, glass shower cubicles.
  * Automation: Smart lighting, automated curtain controls, biometric access, solar panel wiring.
  * Timeline: 9 to 12 Months.
- **Cost Percentage Rule of Thumb**:
  * Steel & Rebars: ~24% | Cement: ~16% | Sand, Grit & Bricks: ~18% | Flooring & Finishing: ~22% | Labor & Engineering: ~20%.

#### 3. WHOLESALE BUILDING MATERIALS MARKETPLACE ([Shop Now](/ShopNow)):
- Direct factory wholesale rates with guaranteed doorstep delivery across UP & NCR:
  * **TMT Steel Rebars**: Tata Tiscon, Jindal Panther, Kamdhenu, Rathi (8mm, 10mm, 12mm, 16mm, 20mm, 25mm - Fe500D/Fe550D).
  * **Cement**: UltraTech Super, ACC Gold, Ambuja Kawach, JK Super (OPC 43/53 & PPC).
  * **Masonry & Bricks**: Class 1 Kiln Red Bricks, Eco Fly Ash Bricks, Autoclaved Aerated (AAC) Lightweight Blocks.
  * **Aggregates**: Fine Yamuna/Ganga River Sand, 10mm & 20mm Blue Granite Crushed Stone.
  * **Piping & Wiring**: Astral, Supreme CPVC/SWR, Havells, Polycab copper wires.
- Instant quotes & bulk order booking: [Shop Materials Portal](/ShopNow)

#### 4. VERIFIED PROPERTIES & REAL ESTATE ([Explore Properties](/buy-sale)):
- 100% RERA verified, clean-title residential plots, luxury villas, commercial shops & farmhouses.
- **Key Hotspot Locations**:
  * Bareilly: Pilibhit Bypass Road, Bisalpur Road, Mini Bypass, Delapeer, Stadium Road.
  * Moradabad: Kanth Road, Delhi Road, Ram Ganga Vihar, Majhola, MDA approved sectors.
  * NCR & UP: Noida Expressways, Greater Noida West, Meerut Expressway, Lucknow, Dehradun.
- **Legal Guarantee**: Complete 30-year registry search report, Khasra/Khatauni verification, mutation assistance, bank home loan approval support.

#### 5. FRANCHISE BUSINESS PARTNERSHIP ([Franchise Portal](/franchise)):
- Scalable construction & building material dealership franchise:
  * **Associate Franchise**: ₹4,99,999 (Tehsil / District Level)
  * **Regional Franchise**: ₹7,99,999 (Multi-district / Zone Level)
  * **Master Franchise**: ₹47,99,999 (State / Division Level)
  * Benefits: 30-40% annual ROI, exclusive territory rights, complete tech ERP/CRM access, centralized materials supply discount, continuous project leads.

#### 6. KNOWLEDGE HUB & BLOGS ([Read Blogs](/blog)):
- Detailed technical articles on house construction cost calculation, concrete slump & silt testing, Vastu Shastra direction guidelines, and property registry check.

#### 7. CONTRACTOR & THICKEDAR NETWORK ([Partner Registration](/partner-registration)):
- Register as an approved Civil Contractor, Thekedar, Structural Engineer, Architect or Material Supplier.

---

### 💬 RESPONSE GUIDELINES:
- **Concise & Direct**: Keep answers crisp (2 to 4 bullet points or short paragraphs). Do not write endless essays.
- **Include Relevant Markdown Links**: Use proper markdown links (e.g. [Cost Calculator](/calculator), [Shop Materials](/ShopNow), [Properties](/buy-sale), [Franchise Details](/franchise), [Contact Us](/contact)).
- **Calculations**: If user provides plot size (e.g., 1000 sqft, 1500 sqft, 200 gaj), immediately provide standard package rate (e.g., 1000 sqft × ₹1,500-1,800 = ₹15L - ₹18L) and invite them to customize on the calculator.
- **Lead Capture Protocol**: Whenever user shares a phone number or email, warmly thank them and confirm an engineer will call them, appending this invisible tag at the very end:
<!--LEAD_CAPTURED:{"phone":"[DETECTED_PHONE]","name":"[DETECTED_NAME_OR_USER]","service":"[INTERESTED_SERVICE]"}-->
`;

function detectLanguage(text) {
  const hindiKeywords = [
    'kya', 'hai', 'kaise', 'kitna', 'kitne', 'kharcha', 'makan', 'makaan', 'ghar', 'chahiye', 
    'batao', 'bataiye', 'hoga', 'hogi', 'rate', 'karo', 'kare', 'namaste', 'shukriya', 'kahan', 
    'banao', 'banana', 'sasta', 'achha', 'acha', 'krna', 'karna', 'h', 'me', 'mai', 'mein', 
    'bhai', 'ji', 'kripya', 'dena', 'milega', 'milenge', 'lagao', 'lagega', 'bhi', 'mera', 
    'meri', 'mere', 'aap', 'tum', 'kaun', 'kab', 'kyu', 'kyun', 'kese', 'dekho', 'dekhna',
    'plot', 'jameen', 'zameen', 'thekedar', 'mistri', 'majdoor', 'dokan', 'dukaan'
  ];
  const lower = String(text || '').toLowerCase();
  const words = lower.split(/[^a-zA-Z0-9\u0900-\u097F]+/).filter(Boolean);
  const isHindi = words.some((w) => hindiKeywords.includes(w)) || /[\u0900-\u097F]/.test(text);
  return isHindi ? 'hinglish' : 'english';
}

function extractLeadInfo(text) {
  const phoneMatch = text.match(/\b[6-9]\d{9}\b/);
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  return {
    phone: phoneMatch ? phoneMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
  };
}

function fallbackResponse(userMessage) {
  const lower = String(userMessage || '').toLowerCase();
  const isHinglish = detectLanguage(userMessage) === 'hinglish';

  if (lower.includes('cost') || lower.includes('kharch') || lower.includes('estimate') || lower.includes('calculator') || lower.includes('sqft') || lower.includes('rate')) {
    if (isHinglish) {
      return `MTBoss par residential construction ka standard rate **₹1,500 se ₹2,300 per sq.ft.** ke beech hota hai:

- 🏗️ **Standard Quality:** ₹1,500 - ₹1,800/sqft
- ⭐ **Premium Quality:** ₹1,850 - ₹2,300/sqft
- 🏰 **Luxury Villa Grade:** ₹2,400 - ₹3,500+/sqft

Aap apne plot area ke hisaab se live estimate nikalne ke liye hamara [Construction Calculator](/calculator) use kar sakte hain. Direct engineer consultation ke liye aap **+91 94584 10866** par WhatsApp bhi kar sakte hain!`;
    }
    return `At MTBOSS, residential construction costs typically range from **₹1,500 to ₹2,300 per sq. ft.** depending on specification quality:

- 🏗️ **Standard Package:** ₹1,500 - ₹1,800 / sq. ft.
- ⭐ **Executive / Premium Package:** ₹1,850 - ₹2,300 / sq. ft.
- 🏰 **Luxury Villa Grade:** ₹2,400 - ₹3,500+ / sq. ft.

You can calculate an itemized material & labor budget using our [Construction Cost Calculator](/calculator), or reach our engineering team directly at **+91 94584 10866**.`;
  }

  if (lower.includes('material') || lower.includes('cement') || lower.includes('steel') || lower.includes('tmt') || lower.includes('brick') || lower.includes('sand') || lower.includes('shop')) {
    if (isHinglish) {
      return `MTBoss par aap direct verified manufacturers se wholesale building materials order kar sakte hain:

- 📦 **TMT Steel:** Tata Tiscon, Jindal Panther, Kamdhenu (Fe500D / Fe550D)
- 🧱 **Cement:** UltraTech, Ambuja, ACC, JK Super (OPC 43/53 & PPC)
- 🚚 **Bricks & Sand:** Class 1 Red Bricks, Fly Ash Bricks, River Sand & Aggregates

Pan-India doorstep delivery aur live price quotes ke liye hamara [Shop Now Portal](/ShopNow) dekhein.`;
    }
    return `You can order wholesale construction materials directly from verified manufacturers on MTBOSS:

- 📦 **TMT Steel:** Tata Tiscon, Jindal Panther, Kamdhenu (Fe500D / Fe550D)
- 🧱 **Cement:** UltraTech, Ambuja, ACC, JK Super (OPC & PPC grades)
- 🚚 **Masonry & Aggregates:** Class 1 Red Bricks, Eco Fly Ash Bricks, Sand & Crushed stone

Visit our [Building Materials Shop](/ShopNow) for instant price quotations and Pan-India delivery.`;
  }

  if (lower.includes('property') || lower.includes('plot') || lower.includes('land') || lower.includes('flat') || lower.includes('bareilly') || lower.includes('moradabad') || lower.includes('buy') || lower.includes('sell')) {
    if (isHinglish) {
      return `MTBoss par aapko **RERA verified aur clean-title** residential plots, commercial spaces aur luxury villas milte hain:

- 📍 **Key Cities:** Bareilly, Moradabad, Meerut, Noida, Delhi NCR, Lucknow, Dehradun.
- 📜 **Legal Due Diligence:** 30-year search report, registry verification aur RERA check guaranteed.

Current available listings dekhne ke liye [Properties Page](/buy-sale) visit karein ya **+91 94584 10866** par contact karein.`;
    }
    return `MTBOSS offers verified, clear-title residential plots, commercial properties, and luxury villas across India:

- 📍 **Key Locations:** Bareilly, Moradabad, Meerut, Noida, Greater Noida, Delhi NCR, and Dehradun.
- 📜 **Complete Legal Due Diligence:** 30-year title search, RERA compliance, and sanctioned master plans.

Explore verified listings on our [Properties Portal](/buy-sale) or connect with our real estate advisory at **+91 94584 10866**.`;
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('office') || lower.includes('address')) {
    if (isHinglish) {
      return `Aap MTBoss team se niche diye gaye kisi bhi medium se direct sampark kar sakte hain:

- 📞 **Helpline & WhatsApp:** [+91 94584 10866](https://wa.me/919458410866)
- ✉️ **Email:** mtboss2016@gmail.com
- 📍 **Head Office:** Harthala Kanth Road Behind Kr Collection, near Domino's, Moradabad, UP
- 📍 **Bareilly Office:** Bareilly, UP (GPS: 28°23'51.0"N 79°27'10.1"E)

Aap hamare [Contact Us Page](/contact) par message bhi chhod sakte hain!`;
    }
    return `You can reach MTBOSS Construction Private Limited directly through the following channels:

- 📞 **Phone & WhatsApp:** [+91 94584 10866](https://wa.me/919458410866)
- ✉️ **Email:** mtboss2016@gmail.com
- 📍 **Head Office:** Harthala Kanth Road Behind Kr Collection, near Domino's, Moradabad, UP
- 📍 **Bareilly Office:** Bareilly, UP (Location: 28°23'51.0"N 79°27'10.1"E)

You can also submit your inquiry on our [Contact Page](/contact).`;
  }

  if (isHinglish) {
    return `Namaste! Main **MTBOSS AI Assistant** hoon. Main aapki kya madad kar sakta hoon?

- 🏗️ **Makaan banane ka kharcha** janna hai ([Cost Calculator](/calculator))
- 📦 **Building Materials** order karne hain ([Shop Now](/ShopNow))
- 🏠 **Plots & Properties** dekhni hain ([Properties](/buy-sale))
- 💬 **Engineer se direct baat** karni hai ([+91 94584 10866](https://wa.me/919458410866))

Aap apna requirement yahan likh sakte hain ya apna phone number share kar sakte hain!`;
  }

  return `Hello! I am the **MTBOSS AI Assistant**. How may I assist you with your project today?

- 🏗️ **Calculate House Construction Cost** ([Cost Calculator](/calculator))
- 📦 **Order Bulk Building Materials** ([Shop Now](/ShopNow))
- 🏠 **Explore Verified Properties & Plots** ([Properties Portal](/buy-sale))
- 💬 **Speak with Project Engineer** ([+91 94584 10866](https://wa.me/919458410866))

Feel free to ask any question or share your project details below!`;
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages array required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const leadData = extractLeadInfo(lastUserMessage);

    // If user provided a phone number or email, trigger lead notification
    if (leadData.phone || leadData.email) {
      notifyAdminSubmission({
        type: 'Chatbot Live Lead',
        phone: leadData.phone || '-',
        email: leadData.email || '-',
        name: 'Website Chat Visitor',
        reference: `CHAT-${Date.now().toString().slice(-6)}`,
        details: {
          'User Message': lastUserMessage.slice(0, 300),
          'Conversation Length': `${messages.length} messages`,
        },
      }).catch((e) => console.error('Chatbot lead notification error:', e));
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

    if (!apiKey) {
      // Return intelligent fallback immediately
      const reply = fallbackResponse(lastUserMessage);
      return NextResponse.json({
        success: true,
        reply,
        source: 'knowledge_engine',
      });
    }

    // Call OpenRouter API
    const openRouterMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://mtboss.in',
        'X-Title': 'MTBOSS Construction AI Assistant',
      },
      body: JSON.stringify({
        model,
        messages: openRouterMessages,
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`OpenRouter API response not ok (${response.status}):`, errorText);
      const reply = fallbackResponse(lastUserMessage);
      return NextResponse.json({
        success: true,
        reply,
        source: 'fallback_engine',
      });
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || fallbackResponse(lastUserMessage);

    // Check if AI included a lead captured marker
    const leadMatch = reply.match(/<!--LEAD_CAPTURED:(.*?)-->/);
    if (leadMatch) {
      try {
        const parsed = JSON.parse(leadMatch[1]);
        if (parsed.phone || parsed.email) {
          notifyAdminSubmission({
            type: 'Chatbot AI Captured Lead',
            phone: parsed.phone || leadData.phone || '-',
            email: parsed.email || leadData.email || '-',
            name: parsed.name || 'Website Visitor',
            reference: `CHAT-AI-${Date.now().toString().slice(-6)}`,
            details: {
              Service: parsed.service || 'General Construction',
              Query: lastUserMessage.slice(0, 300),
            },
          }).catch(() => {});
        }
      } catch (err) {
        // ignore parse error
      }
      reply = reply.replace(/<!--LEAD_CAPTURED:.*?-->/g, '').trim();
    }

    return NextResponse.json({
      success: true,
      reply,
      source: 'openrouter',
    });
  } catch (error) {
    console.error('Chatbot route error:', error);
    return NextResponse.json({
      success: true,
      reply: fallbackResponse(''),
      source: 'error_fallback',
    });
  }
}
