'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, FileText, Eye, CheckCircle2, Info, Database, Users, AlertTriangle, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'mai', label: 'मैथिली (Maithili)' },
  { code: 'bho', label: 'भोजपुरी (Bhojpuri)' }
];

const SECTIONS_CONFIG = [
  { id: 'introduction', icon: Info },
  { id: 'scope', icon: Globe },
  { id: 'data-collection', icon: Eye },
  { id: 'data-usage', icon: FileText },
  { id: 'data-sharing', icon: Users },
  { id: 'data-retention', icon: Database },
  { id: 'data-protection', icon: Shield },
  { id: 'user-rights', icon: CheckCircle2 },
  { id: 'cookies', icon: AlertTriangle },
  { id: 'children', icon: Lock },
  { id: 'changes', icon: FileText },
  { id: 'contact', icon: Lock },
];

const TRANSLATIONS = {
  en: {
    heroTitle: 'Privacy Policy',
    heroSubtitle: "Effective Date: July 19, 2026 • Operated by Bindisa Agritech Private Limited",
    heroLegal: "We are committed to protecting your personal data in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.",
    tocTitle: 'Table of Contents',
    langSelectorLabel: 'Choose Language:',
    sections: {
      introduction: {
        title: '1. Introduction',
        content: [
          'Welcome to Bihar Ka Bazaar ("BKB", "we", "us", or "our"), an online marketplace operated by Bindisa Agritech Private Limited, a company incorporated under the laws of India, headquartered in Gaya, Bihar. Our platform connects local farmers, weavers, artisans, and micro-entrepreneurs of Bihar directly with buyers across India — without intermediaries, ensuring fair trade and better livelihoods.',
          'This Privacy Policy ("Policy") describes how we collect, process, store, share, and protect the personal data of users — including sellers, buyers, and visitors — who interact with our website at biharkabazaar.com and any related services, APIs, or mobile applications (collectively, the "Platform").',
          'By registering on or using the Platform, you acknowledge that you have read, understood, and agree to be bound by this Policy. If you do not agree, please discontinue your use of the Platform immediately.'
        ]
      },
      scope: {
        title: '2. Scope & Applicability',
        content: [
          'This Policy applies to all individuals who access or use the Platform, including:',
          '• Sellers / Partners — Farmers, weavers, artisans, and micro-businesses who register and list products on BKB.',
          '• Buyers / Customers — Individuals who browse, order, or purchase products through the Platform.',
          '• Visitors — Anyone who visits the website without creating an account.',
          '• Pre-launch subscribers — Individuals who sign up for early access or launch notifications.',
          'This Policy does not apply to third-party websites, applications, or services that may be linked to from our Platform. We encourage you to review the privacy policies of those third parties separately.'
        ]
      },
      dataCollection: {
        title: '3. Information We Collect',
        content: [
          'We collect only the information that is necessary to provide our services, verify identities, ensure platform safety, and process payments. The data we collect falls into the following categories:'
        ],
        cards: [
          {
            title: 'A. Information You Provide Directly',
            points: [
              'Seller Registration: Full legal name, mobile number, email address, profile photograph, language preference, business name (if any), type of enterprise (Individual Artisan / Cooperative / Farmer), and OTP verification.',
              'Seller Profile Details: Business district, village/town, PIN code, street address, product category, product descriptions, monthly production capacity, GI tag certificate number (if applicable), and GST registration status/number.',
              'Financial & KYC Information: Aadhaar number (last four digits displayed only), UPI ID, bank account holder name, bank account number, and bank IFSC code — collected solely for the purpose of processing payouts directly to sellers without intermediaries.',
              'Product Information: Product name, description, pricing, weight variants, and product images (which may be uploaded by the seller from their device).',
              'Buyer Information: Name, mobile number, email address, delivery address (street, city, state, PIN code), and order history.',
              'Pre-launch Registrations: Name, mobile number, and preferred delivery location of individuals who signed up for early access.',
              'Communications: Any queries, feedback, or support messages you send us via contact forms, email, or phone.'
            ]
          },
          {
            title: 'B. Information Collected Automatically',
            points: [
              'Device & Browser Information: IP address, browser type and version, operating system, device identifiers, and screen resolution.',
              'Usage Data: Pages visited, time spent on pages, click paths, search queries, product views, and referral sources.',
              'Session Data: Login timestamps, session duration, and platform interactions.',
              'Log Data: Server logs that record requests made to our API, error events, and security-related events such as failed login attempts.'
            ]
          },
          {
            title: 'C. Sensitive Personal Data',
            points: [
              'In accordance with the DPDP Act 2023 and Rule 3 of the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, sensitive categories of data collected by BKB are handled with heightened security controls:',
              '• Financial information (bank account details, UPI IDs)',
              '• Aadhaar identification numbers',
              '• Government-issued document numbers (GST, GI certificates)'
            ]
          }
        ]
      },
      dataUsage: {
        title: '4. How We Use Information',
        content: [
          'We process your personal data only for specific, lawful, and transparent purposes. The lawful bases for our processing under applicable Indian law are: your consent, the performance of a contract with you, our legitimate business interests, and compliance with legal obligations.',
          'We do not use your personal information for automated profiling or decision-making that produces significant legal effects without human review.'
        ],
        grid: [
          { title: '🛒 Order Fulfillment', text: 'Processing and confirming purchases, arranging shipping, and delivering products to buyers.' },
          { title: '✅ Seller Verification', text: 'Authenticating seller identities via OTP, cross-checking Aadhaar details, and verifying GI certifications before listing products publicly.' },
          { title: '💳 Direct Payouts', text: 'Transferring sales proceeds directly to sellers via bank transfer or UPI — ensuring zero commission deduction and timely payments.' },
          { title: '📧 Communications', text: 'Sending order confirmations, payment alerts, shipping updates, and important account notifications.' },
          { title: '🔒 Security & Fraud Prevention', text: 'Detecting suspicious activity, preventing unauthorized logins, enforcing rate limits, and investigating potential breaches.' },
          { title: '📊 Platform Improvement', text: 'Analyzing usage patterns, improving search relevance, and enhancing UX based on anonymized aggregate data.' },
          { title: '⚖️ Legal Compliance', text: 'Maintaining records required under GST law, responding to law enforcement requests, and fulfilling statutory obligations.' },
          { title: '📣 Marketing (Opt-in only)', text: 'Sending promotional communications about new Bihar products, artisan stories, and platform offers — only if you have explicitly opted in.' }
        ]
      },
      dataSharing: {
        title: '5. Sharing & Disclosure',
        content: [
          'We do not sell, rent, or trade your personal data to any third party for commercial purposes. We may share your information in limited, defined circumstances:',
          '• Logistics & Delivery Partners: We share buyer name, delivery address, and contact number with our logistics and courier partners solely to facilitate product delivery.',
          '• Payment Processing: Financial data is shared with authorized banking partners or UPI service providers to execute seller payouts. We do not store full bank credentials beyond what is required for payout processing.',
          '• Technology Service Providers: We work with trusted hosting, cloud infrastructure, and database providers (operating under data processing agreements) to run the platform securely. These providers are contractually prohibited from using your data for any purpose other than providing the agreed services.',
          '• Legal & Regulatory Authorities: We may disclose information when legally required to do so — such as in response to court orders, government notices, or law enforcement requests under applicable Indian law.',
          '• Business Transfers: In the event of a merger, acquisition, or sale of substantially all assets of Bindisa Agritech, user data may be transferred to the successor entity, subject to equivalent privacy protections.',
          '• With Your Consent: We may share your data with other parties when you explicitly consent to such sharing.'
        ],
        note: 'Note on Public Seller Profiles: Approved seller names, business names, district, and product listings are displayed publicly on the BKB marketplace to enable buyers to discover and trust local artisans. Sensitive financial or government ID information is never made publicly visible.'
      },
      dataRetention: {
        title: '6. Data Retention',
        content: [
          'We retain personal data only for as long as is necessary to fulfill the purposes outlined in this Policy, or as required by applicable law:',
          'After the applicable retention period expires, personal data is either securely deleted or anonymized so that it can no longer be associated with any individual.'
        ],
        tableHeaders: ['Data Category', 'Retention Period'],
        tableRows: [
          ['Seller account & profile data', 'Duration of seller relationship + 5 years post-deactivation'],
          ['Buyer order records', '7 years (as per GST and accounting regulations)'],
          ['Financial / KYC documents', '5 years post last transaction, or as mandated by RBI/PMLA'],
          ['Product listings & images', 'Until seller deletes the product or account is deactivated'],
          ['Server & access logs', '90 days (rolling)'],
          ['Pre-launch registration data', 'Until platform launch + 1 year, or until user requests deletion'],
          ['Marketing opt-in consents', 'Until withdrawn by the user'],
        ]
      },
      dataProtection: {
        title: '7. Security Measures',
        content: [
          'We take the security of your personal information seriously. We implement a combination of technical, organizational, and physical safeguards to protect your data from unauthorized access, disclosure, alteration, or destruction:',
          'Despite our best efforts, no security system is impenetrable. We cannot guarantee the absolute security of your data. You are advised to keep your login credentials confidential and notify us immediately if you suspect unauthorized access to your account.'
        ],
        grid: [
          { icon: '🔐', title: 'Encryption in Transit', text: 'All data transmitted between your browser and our servers is encrypted using TLS (Transport Layer Security) protocols.' },
          { icon: '🛡️', title: 'Access Controls', text: 'Internal access to sensitive data is restricted to authorized personnel only, with role-based permissions and audit trails.' },
          { icon: '🔒', title: 'Sensitive Field Masking', text: 'Aadhaar numbers and bank account details are masked in our admin interfaces and are never returned in full via our public APIs.' },
          { icon: '📋', title: 'Rate Limiting & Monitoring', text: 'Our APIs are protected by rate limiting, IP-based throttling, and anomaly detection to prevent brute-force or abuse attacks.' },
          { icon: '🗄️', title: 'Database Security', text: 'Our databases are hosted in secured environments with restricted network access, automated backups, and intrusion detection systems.' },
          { icon: '📢', title: 'Breach Notification', text: 'In the event of a personal data breach, we will notify affected users and the Data Protection Board of India within the timelines prescribed by applicable law.' }
        ]
      },
      userRights: {
        title: '8. Your Rights & Choices',
        content: [
          'Under the Digital Personal Data Protection Act, 2023 and other applicable Indian privacy laws, you have the following rights with respect to your personal data:'
        ],
        rights: [
          { right: '🔍 Right to Access', text: 'You have the right to request a summary of the personal data we hold about you and the purposes for which it is being processed.' },
          { right: '✏️ Right to Correction', text: 'You have the right to request correction of inaccurate or incomplete personal data. Sellers can update most profile information directly via the Seller Dashboard.' },
          { right: '🗑️ Right to Erasure', text: 'You may request deletion of your personal data. We will honor such requests to the extent permitted by law, balancing your request against our legal obligations (e.g., tax records, fraud prevention).' },
          { right: '📤 Right to Data Portability', text: 'You may request a machine-readable copy of the personal data you have provided to us, so you can transfer it to another service provider.' },
          { right: '🚫 Right to Withdraw Consent', text: 'Where our processing is based on your consent (e.g., marketing communications), you may withdraw that consent at any time without affecting the lawfulness of prior processing.' },
          { right: '⚖️ Right to Grievance Redressal', text: 'You have the right to file a complaint regarding our data processing practices with our Grievance Officer or with the Data Protection Board of India once constituted.' },
          { right: '📵 Right to Opt-out of Marketing', text: 'You can unsubscribe from promotional emails or SMS messages at any time using the unsubscribe link in our communications or by contacting us directly.' }
        ],
        warning: 'To exercise any of these rights, please contact our Grievance Officer at privacy@biharkabazaar.com. We will respond within 30 days of receiving your verified request, as required by applicable law.'
      },
      cookies: {
        title: '9. Cookies & Tracking Technologies',
        content: [
          'We use cookies and similar tracking technologies (local storage, session storage) to operate our Platform and improve your experience. We do not currently use third-party advertising or behavioral tracking cookies.',
          'Most browsers allow you to control or block cookies through their settings. However, disabling strictly necessary cookies may impair your ability to use key Platform features such as the seller dashboard.'
        ],
        types: [
          { type: 'Strictly Necessary Cookies', desc: 'These are essential for the website to function and cannot be disabled. They include session cookies that keep you logged in as a seller, and security tokens that protect against cross-site request forgery (CSRF).' },
          { type: 'Functional Cookies', desc: 'These remember your preferences (e.g., language selection) to personalize your experience. They do not track you across other websites.' },
          { type: 'Analytics Cookies (Optional)', desc: 'If enabled, these help us understand how users navigate the Platform — which pages are most visited, where users exit, and which products are most viewed — using anonymized aggregate data.' }
        ]
      },
      children: {
        title: "10. Children's Privacy",
        content: [
          'Bihar Ka Bazaar is not directed at individuals under the age of 18. We do not knowingly collect, process, or store personal data from children. If you are a parent or guardian and believe your child has inadvertently provided personal information to us, please contact us immediately at privacy@biharkabazaar.com, and we will promptly delete that information.',
          'Seller registration requires the registrant to be at least 18 years of age and legally capable of entering into binding contracts under Indian law.'
        ]
      },
      changes: {
        title: '11. Changes to This Policy',
        content: [
          'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. When we make material changes, we will:',
          '• Update the "Effective Date" at the top of this page.',
          '• Notify registered sellers via email or an in-platform notification at least 14 days before the changes take effect for material updates.',
          '• Display a prominent banner on the Platform\'s homepage for significant revisions.',
          'Your continued use of the Platform after the effective date of any revised Policy constitutes your acceptance of the updated terms. We encourage you to review this page periodically.'
        ]
      },
      contact: {
        title: '12. Grievance Officer & Contact',
        content: [
          'If you have any questions, concerns, or complaints about this Privacy Policy or our data handling practices, you may reach our designated Grievance Officer:'
        ],
        grievanceTitle: '📋 Grievance Officer',
        grievanceFields: [
          'Name: Coming Soon',
          'Email: privacy@biharkabazaar.com',
          'Response Time: Within 30 days'
        ],
        entityTitle: '🏢 Registered Entity',
        entityFields: [
          'Company: Bindisa Agritech Pvt. Ltd.',
          'Address: Gaya, Bihar – 823001, India',
          'Jurisdiction: Courts at Gaya, Bihar'
        ],
        governingLaw: '📌 Governing Law: This Privacy Policy shall be governed by and construed in accordance with the laws of India, including but not limited to the Digital Personal Data Protection Act, 2023; the Information Technology Act, 2000; and the Information Technology (Amendment) Act, 2008. Any disputes arising in connection with this Policy shall be subject to the exclusive jurisdiction of the courts at Gaya, Bihar.'
      }
    }
  },
  hi: {
    heroTitle: 'गोपनीयता नीति',
    heroSubtitle: "प्रभावी तिथि: 19 जुलाई, 2026 • बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित",
    heroLegal: "हम डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act) और सूचना प्रौद्योगिकी अधिनियम, 2000 के अनुसार आपके व्यक्तिगत डेटा की सुरक्षा के लिए प्रतिबद्ध हैं।",
    tocTitle: 'विषय सूची',
    langSelectorLabel: 'भाषा चुनें:',
    sections: {
      introduction: {
        title: '1. परिचय',
        content: [
          'बिहार का बाज़ार ("BKB", "हम", "हमें", या "हमारा") में आपका स्वागत है, जो बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित एक ऑनलाइन बाज़ार है, जो भारत के कानूनों के तहत गठित एक कंपनी है, जिसका मुख्यालय गया, बिहार में है। हमारा प्लेटफ़ॉर्म बिहार के स्थानीय किसानों, बुनकरों, कारीगरों और सूक्ष्म उद्यमियों को सीधे भारत भर के खरीदारों से जोड़ता है — बिना किसी बिचौलिए के, जिससे निष्पक्ष व्यापार और बेहतर आजीविका सुनिश्चित होती है।',
          'यह गोपनीयता नीति ("नीति") बताती है कि हम biharkabazaar.com पर हमारी वेबसाइट और संबंधित सेवाओं, एपीआई या मोबाइल अनुप्रयोगों (सामूहिक रूप से, "प्लेटफ़ॉर्म") के साथ बातचीत करने वाले उपयोगकर्ताओं — जिसमें विक्रेता, खरीदार और आगंतुक शामिल हैं — के व्यक्तिगत डेटा को कैसे एकत्र, संसाधित, संग्रहीत, साझा और सुरक्षित करते हैं।',
          'प्लेटफ़ॉर्म पर पंजीकरण करके या इसका उपयोग करके, आप स्वीकार करते हैं कि आपने इस नीति को पढ़ा है, समझा है, और इससे बाध्य होने के लिए सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया तुरंत प्लेटफ़ॉर्म का उपयोग बंद कर दें।'
        ]
      },
      scope: {
        title: '2. कार्यक्षेत्र और प्रयोज्यता',
        content: [
          'यह नीति उन सभी व्यक्तियों पर लागू होती है जो प्लेटफ़ॉर्म का उपयोग करते हैं, जिनमें शामिल हैं:',
          '• विक्रेता / भागीदार — किसान, बुनकर, कारीगर और सूक्ष्म व्यवसाय जो BKB पर पंजीकरण करते हैं और उत्पादों को सूचीबद्ध करते हैं।',
          '• खरीदार / ग्राहक — वे व्यक्ति जो प्लेटफ़ॉर्म के माध्यम से उत्पादों को ब्राउज़ करते हैं, ऑर्डर करते हैं या खरीदते हैं।',
          '• आगंतुक — कोई भी व्यक्ति जो बिना खाता बनाए वेबसाइट पर आता है।',
          '• प्री-लॉन्च ग्राहक — वे व्यक्ति जो शुरुआती पहुंच या लॉन्च सूचनाओं के लिए साइन अप करते हैं।',
          'यह नीति तीसरे पक्ष की वेबसाइटों, अनुप्रयोगों या सेवाओं पर लागू नहीं होती है जो हमारे प्लेटफ़ॉर्म से जुड़े हो सकते हैं। हम आपको उन तीसरे पक्षों की गोपनीयता नीतियों की अलग से समीक्षा करने के लिए प्रोत्साहित करते हैं।'
        ]
      },
      dataCollection: {
        title: '3. जानकारी जो हम एकत्र करते हैं',
        content: [
          'हम केवल वही जानकारी एकत्र करते हैं जो हमारी सेवाएं प्रदान करने, पहचान सत्यापित करने, प्लेटफ़ॉर्म सुरक्षा सुनिश्चित करने और भुगतान संसाधित करने के लिए आवश्यक है। हमारे द्वारा एकत्र किया जाने वाला डेटा निम्नलिखित श्रेणियों में आता है:'
        ],
        cards: [
          {
            title: 'क. जानकारी जो आप हमें सीधे प्रदान करते हैं',
            points: [
              'विक्रेता पंजीकरण: पूरा कानूनी नाम, मोबाइल नंबर, ईमेल पता, प्रोफ़ाइल फ़ोटो, भाषा प्राथमिकता, व्यवसाय का नाम (यदि कोई हो), उद्यम का प्रकार (व्यक्तिगत कारीगर / सहकारी / किसान), और ओटीपी सत्यापन।',
              'विक्रेता प्रोफ़ाइल विवरण: व्यावसायिक जिला, गाँव/कस्बा, पिन कोड, सड़क का पता, उत्पाद श्रेणी, उत्पाद विवरण, मासिक उत्पादन क्षमता, जीआई टैग प्रमाणपत्र संख्या (यदि लागू हो), और जीएसटी पंजीकरण स्थिति/संख्या।',
              'वित्तीय और केवाईसी जानकारी: आधार संख्या (केवल अंतिम चार अंक प्रदर्शित), यूपीआई आईडी, बैंक खाताधारक का नाम, बैंक खाता संख्या, और बैंक आईएफएससी कोड — जो केवल बिचौलियों के बिना सीधे विक्रेताओं को भुगतान संसाधित करने के उद्देश्य से एकत्र किया जाता है।',
              'उत्पाद की जानकारी: उत्पाद का नाम, विवरण, मूल्य निर्धारण, वजन विकल्प और उत्पाद की छवियां (जो विक्रेता द्वारा उनके डिवाइस से अपलोड की जा सकती हैं)।',
              'खरीदार की जानकारी: नाम, मोबाइल नंबर, ईमेल पता, वितरण पता (सड़क, शहर, राज्य, पिन कोड), और ऑर्डर इतिहास।',
              'प्री-लॉन्च पंजीकरण: नाम, मोबाइल नंबर और शुरुआती पहुंच के लिए साइन अप करने वाले व्यक्तियों का पसंदीदा डिलीवरी स्थान।',
              'संचार: कोई भी प्रश्न, प्रतिक्रिया, या सहायता संदेश जो आप हमें संपर्क फ़ॉर्म, ईमेल या फोन के माध्यम से भेजते हैं।'
            ]
          },
          {
            title: 'ख. स्वचालित रूप से एकत्र की गई जानकारी',
            points: [
              'डिवाइस और ब्राउज़र जानकारी: आईपी पता, ब्राउज़र प्रकार और संस्करण, ऑपरेटिंग सिस्टम, डिवाइस पहचानकर्ता और स्क्रीन रिज़ॉल्यूशन।',
              'उपयोग डेटा: देखे गए पृष्ठ, पृष्ठों पर बिताया गया समय, क्लिक पथ, खोज प्रश्न, उत्पाद दृश्य और रेफ़रल स्रोत।',
              'सत्र डेटा: लॉगिन टाइमस्टैम्प, सत्र की अवधि और प्लेटफ़ॉर्म इंटरैक्शन।',
              'लॉग डेटा: सर्वर लॉग जो हमारे एपीआई के अनुरोधों, त्रुटि घटनाओं और सुरक्षा से संबंधित घटनाओं जैसे कि विफल लॉगिन प्रयासों को रिकॉर्ड करते हैं।'
            ]
          },
          {
            title: 'ग. संवेदनशील व्यक्तिगत डेटा',
            points: [
              'DPDP अधिनियम 2023 और आईटी नियमों के नियम 3 के अनुसार, BKB द्वारा एकत्र की गई डेटा की संवेदनशील श्रेणियों को सख्त सुरक्षा नियंत्रणों के साथ संभाला जाता है:',
              '• वित्तीय जानकारी (बैंक खाते का विवरण, यूपीआई आईडी)',
              '• आधार पहचान संख्या',
              '• सरकार द्वारा जारी दस्तावेज़ संख्या (जीएसटी, जीआई प्रमाणपत्र)'
            ]
          }
        ]
      },
      dataUsage: {
        title: '4. हम जानकारी का उपयोग कैसे करते हैं',
        content: [
          'हम आपके व्यक्तिगत डेटा को केवल विशिष्ट, वैध और पारदर्शी उद्देश्यों के लिए संसाधित करते हैं। लागू भारतीय कानून के तहत हमारे प्रसंस्करण के कानूनी आधार हैं: आपकी सहमति, आपके साथ एक अनुबंध का निष्पादन, हमारे वैध व्यावसायिक हित, और कानूनी दायित्वों का अनुपालन।',
          'हम मानवीय समीक्षा के बिना आपके व्यक्तिगत विवरण का उपयोग स्वचालित प्रोफ़ाइलिंग या निर्णय लेने के लिए नहीं करते हैं जिससे महत्वपूर्ण कानूनी प्रभाव उत्पन्न होते हैं।'
        ],
        grid: [
          { title: '🛒 ऑर्डर पूरा करना', text: 'खरीद को संसाधित और पुष्टि करना, शिपिंग की व्यवस्था करना और खरीदारों को उत्पाद वितरित करना।' },
          { title: '✅ विक्रेता सत्यापन', text: 'ओटीपी के माध्यम से विक्रेता की पहचान को प्रमाणित करना, आधार विवरण की जांच करना और उत्पादों को सार्वजनिक रूप से सूचीबद्ध करने से पहले जीआई प्रमाणपत्रों को सत्यापित करना।' },
          { title: '💳 सीधे भुगतान', text: 'बिना किसी कमीशन कटौती और समय पर भुगतान सुनिश्चित करते हुए बैंक ट्रांसफर या यूपीआई के माध्यम से बिक्री आय को सीधे विक्रेताओं को हस्तांतरित करना।' },
          { title: '📧 संचार', text: 'ऑर्डर की पुष्टि, भुगतान अलर्ट, शिपिंग अपडेट और महत्वपूर्ण खाता सूचनाएं भेजना।' },
          { title: '🔒 सुरक्षा और धोखाधड़ी की रोकथाम', text: 'संदिग्ध गतिविधि का पता लगाना, अनधिकृत लॉगिन को रोकना, दर सीमाओं को लागू करना और संभावित उल्लोंघनों की जांच करना।' },
          { title: '📊 प्लेटफ़ॉर्म में सुधार', text: 'उपयोग पैटर्न का विश्लेषण करना, खोज प्रासंगिकता में सुधार करना और अनाम एकत्रित डेटा के आधार पर उपयोगकर्ता अनुभव को बढ़ाना।' },
          { title: '⚖️ कानूनी अनुपालन', text: 'जीएसटी कानून के तहत आवश्यक रिकॉर्ड बनाए रखना, कानून प्रवर्तन अनुरोधों का जवाब देना और वैधानिक दायित्वों को पूरा करना।' },
          { title: '📣 विपणन (केवल ऑप्ट-इन)', text: 'नए बिहार उत्पादों, कारीगरों की कहानियों और प्लेटफ़ॉर्म ऑफ़र के बारे में प्रचार संचार भेजना — केवल तभी जब आपने स्पष्ट रूप से सहमति दी हो।' }
        ]
      },
      dataSharing: {
        title: '5. साझा करना और प्रकटीकरण',
        content: [
          'हम व्यावसायिक उद्देश्यों के लिए किसी भी तीसरे पक्ष को आपका व्यक्तिगत डेटा बेचते, किराए पर या व्यापार नहीं करते हैं। हम सीमित, परिभाषित परिस्थितियों में आपकी जानकारी साझा कर सकते हैं:',
          '• रसद और वितरण भागीदार: हम उत्पाद वितरण की सुविधा के लिए केवल अपने रसद और कूरियर भागीदारों के साथ खरीदार का नाम, वितरण पता और संपर्क नंबर साझा करते हैं।',
          '• भुगतान प्रसंस्करण: विक्रेताओं को भुगतान करने के लिए वित्तीय डेटा अधिकृत बैंकिंग भागीदारों या यूपीआई सेवा प्रदाताओं के साथ साझा किया जाता है। हम भुगतान प्रसंस्करण के लिए आवश्यक से अधिक बैंक विवरण संग्रहीत नहीं करते हैं।',
          '• प्रौद्योगिकी सेवा प्रदाता: हम प्लेटफ़ॉर्म को सुरक्षित रूप से चलाने के लिए विश्वसनीय होस्टिंग, क्लाउड इन्फ्रास्ट्रक्चर और डेटाबेस प्रदाताओं के साथ काम करते हैं। इन प्रदाताओं को अनुबंधित सेवाओं को प्रदान करने के अलावा किसी अन्य उद्देश्य के लिए आपके डेटा का उपयोग करने से प्रतिबंधित किया गया है।',
          '• कानूनी और नियामक प्राधिकरण: लागू भारतीय कानून के तहत अदालत के आदेशों, सरकारी नोटिसों या कानून प्रवर्तन अनुरोधों के जवाब में हम कानूनन आवश्यक होने पर जानकारी का खुलासा कर सकते हैं।',
          '• व्यावसायिक स्थानान्तरण: विलय, अधिग्रहण, या संपत्तियों की बिक्री के मामले में, उपयोगकर्ता डेटा को समकक्ष गोपनीयता संरक्षण के अधीन नए संस्थान को हस्तांतरित किया जा सकता है।',
          '• आपकी सहमति से: जब आप स्पष्ट रूप से सहमति देते हैं तो हम अन्य पक्षों के साथ आपका डेटा साझा कर सकते हैं।'
        ],
        note: 'सार्वजनिक विक्रेता प्रोफ़ाइल पर नोट: स्वीकृत विक्रेता नाम, व्यवसाय का नाम, जिला और उत्पाद सूची बीकेबी बाज़ार पर सार्वजनिक रूप से प्रदर्शित की जाती है ताकि खरीदार स्थानीय कारीगरों को खोज सकें और उन पर भरोसा कर सकें। संवेदनशील वित्तीय या सरकारी आईडी जानकारी कभी भी सार्वजनिक रूप से दिखाई नहीं देती है।'
      },
      dataRetention: {
        title: '6. डेटा प्रतिधारण (रखना)',
        content: [
          'हम व्यक्तिगत डेटा को केवल तब तक बनाए रखते हैं जब तक कि इस नीति में उल्लिखित उद्देश्यों को पूरा करने के लिए आवश्यक हो, या लागू कानून द्वारा आवश्यक हो:',
          'लागू प्रतिधारण अवधि समाप्त होने के बाद, व्यक्तिगत डेटा को या तो सुरक्षित रूप से हटा दिया जाता है या अनाम कर दिया जाता है ताकि इसे किसी भी व्यक्ति से जोड़ा न जा सके।'
        ],
        tableHeaders: ['डेटा श्रेणी', 'धारण अवधि'],
        tableRows: [
          ['विक्रेता खाता और प्रोफ़ाइल डेटा', 'विक्रेता संबंध की अवधि + निष्क्रियता के 5 साल बाद तक'],
          ['खरीदार ऑर्डर रिकॉर्ड', '7 वर्ष (जीएसटी और लेखा नियमों के अनुसार)'],
          ['वित्तीय / केवाईसी दस्तावेज', 'अंतिम लेनदेन के 5 साल बाद तक, या आरबीआई/पीएमएलए द्वारा अनिवार्य'],
          ['उत्पाद सूची और चित्र', 'जब तक विक्रेता उत्पाद को हटा नहीं देता या खाता निष्क्रिय नहीं हो जाता'],
          ['सर्वर और एक्सेस लॉग', '90 दिन (रोलिंग)'],
          ['लॉन्च से पहले का पंजीकरण डेटा', 'प्लेटफ़ॉर्म लॉन्च + 1 वर्ष तक, या जब तक उपयोगकर्ता हटाने का अनुरोध नहीं करता'],
          ['विपणन सहमति', 'जब तक उपयोगकर्ता द्वारा वापस नहीं लिया जाता'],
        ]
      },
      dataProtection: {
        title: '7. सुरक्षा उपाय',
        content: [
          'हम आपकी व्यक्तिगत जानकारी की सुरक्षा को गंभीरता से लेते हैं। हम आपके डेटा को अनधिकृत पहुंच, प्रकटीकरण, परिवर्तन या विनाश से बचाने के लिए तकनीकी, संगठनात्मक और भौतिक सुरक्षा उपायों के संयोजन को लागू करते हैं:',
          'हमारे सर्वोत्तम प्रयासों के बावजूद, कोई भी सुरक्षा प्रणाली अभेद्य नहीं है। हम आपके डेटा की पूर्ण सुरक्षा की गारंटी नहीं दे सकते। आपको सलाह दी जाती है कि आप अपने लॉगिन क्रेडेंशियल को गोपनीय रखें और यदि आपको अपने खाते में अनधिकृत पहुंच का संदेह हो तो हमें तुरंत सूचित करें।'
        ],
        grid: [
          { icon: '🔐', title: 'पारगमन में एन्क्रिप्शन', text: 'आपके ब्राउज़र और हमारे सर्वर के बीच प्रेषित सभी डेटा को टीएलएस (ट्रांसपोर्ट लेयर सिक्योरिटी) प्रोटोकॉल का उपयोग करके एन्क्रिप्ट किया जाता है।' },
          { icon: '🛡️', title: 'पहुंच नियंत्रण', text: 'संवेदनशील डेटा तक आंतरिक पहुंच केवल अधिकृत कर्मियों तक ही सीमित है, जिसमें भूमिका-आधारित अनुमतियां और ऑडिट ट्रेल्स शामिल हैं।' },
          { icon: '🔒', title: 'संवेदनशील फ़ील्ड मास्किंग', text: 'आधार संख्या और बैंक खाते के विवरण हमारे व्यवस्थापक इंटरफेस में छिपाए जाते हैं और हमारे सार्वजनिक एपीआई के माध्यम से कभी भी पूर्ण रूप से वापस नहीं किए जाते हैं।' },
          { icon: '📋', title: 'दर सीमित करना और निगरानी', text: 'ब्रूट-फ़ोर्स हमलों को रोकने के लिए हमारे एपीआई दर सीमित करने, आईपी-आधारित थ्रॉटलिंग और विसंगति का पता लगाने से सुरक्षित हैं।' },
          { icon: '🗄️', title: 'डेटाबेस सुरक्षा', text: 'हमारे डेटाबेस सुरक्षित नेटवर्क पहुंच, स्वचालित बैकअप और घुसपैठ का पता लगाने वाली प्रणालियों के साथ सुरक्षित वातावरण में होस्ट किए जाते हैं।' },
          { icon: '📢', title: 'उल्लंघन की अधिसूचना', text: 'डेटा उल्लंघन की स्थिति में, हम प्रभावित उपयोगकर्ताओं और भारतीय डेटा संरक्षण बोर्ड को लागू कानून द्वारा निर्धारित समय सीमा के भीतर सूचित करेंगे।' }
        ]
      },
      userRights: {
        title: '8. आपके अधिकार और विकल्प',
        content: [
          'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 और अन्य लागू भारतीय गोपनीयता कानूनों के तहत, आपको अपने व्यक्तिगत डेटा के संबंध में निम्नलिखित अधिकार हैं:'
        ],
        rights: [
          { right: '🔍 देखने का अधिकार', text: 'आपको हमारे पास मौजूद आपके व्यक्तिगत डेटा के सारांश और इसे संसाधित करने के उद्देश्यों का अनुरोध करने का अधिकार है।' },
          { right: '✏️ सुधार का अधिकार', text: 'आपको गलत या अपूर्ण व्यक्तिगत डेटा को सुधारने का अनुरोध करने का अधिकार है। विक्रेता सीधे विक्रेता डैशबोर्ड के माध्यम से अधिकांश प्रोफ़ाइल जानकारी अपडेट कर सकते हैं।' },
          { right: '🗑️ मिटाने का अधिकार', text: 'आप अपने व्यक्तिगत डेटा को हटाने का अनुरोध कर सकते हैं। हम कानून द्वारा अनुमत सीमा तक ऐसे अनुरोधों का सम्मान करेंगे, कानूनी दायित्वों (जैसे कि कर रिकॉर्ड, धोखाधड़ी की रोकथाम) के साथ आपके अनुरोध को संतुलित करेंगे।' },
          { right: '📤 डेटा पोर्टेबिलिटी का अधिकार', text: 'आप अपने द्वारा हमें प्रदान किए गए व्यक्तिगत डेटा की एक पठनीय प्रति का अनुरोध कर सकते हैं, ताकि आप इसे किसी अन्य सेवा प्रदाता को स्थानांतरित कर सकें।' },
          { right: '🚫 सहमति वापस लेने का अधिकार', text: 'जहां हमारा प्रसंस्करण आपकी सहमति (जैसे, विपणन संचार) पर आधारित है, आप पूर्व प्रसंस्करण की वैधता को प्रभावित किए बिना किसी भी समय उस सहमति को वापस ले सकते हैं।' },
          { right: '⚖️ शिकायत निवारण का अधिकार', text: 'आपको हमारे डेटा प्रसंस्करण प्रथाओं के संबंध में हमारे शिकायत अधिकारी या भारतीय डेटा संरक्षण बोर्ड (गठित होने पर) के पास शिकायत दर्ज करने का अधिकार है।' },
          { right: '📵 मार्केटिंग से बाहर निकलने का अधिकार', text: 'आप हमारे संचार में दिए गए अनसब्सक्राइब लिंक का उपयोग करके या हमसे सीधे संपर्क करके किसी भी समय प्रचार ईमेल या एसएमएस संदेशों से सदस्यता समाप्त कर सकते हैं।' }
        ],
        warning: 'इनमें से किसी भी अधिकार का प्रयोग करने के लिए, कृपया हमारे शिकायत अधिकारी से privacy@biharkabazaar.com पर संपर्क करें। हम लागू कानून की आवश्यकता के अनुसार, आपके सत्यापित अनुरोध प्राप्त होने के 30 दिनों के भीतर जवाब देंगे।'
      },
      cookies: {
        title: '9. कुकीज़ और ट्रैकिंग तकनीक',
        content: [
          'हम अपने प्लेटफ़ॉर्म को संचालित करने और आपके अनुभव को बेहतर बनाने के लिए कुकीज़ और इसी तरह की ट्रैकिंग तकनीकों (स्थानीय भंडारण, सत्र भंडारण) का उपयोग करते हैं। हम वर्तमान में तीसरे पक्ष के विज्ञापन या व्यवहार संबंधी ट्रैकिंग कुकीज़ का उपयोग नहीं करते हैं।',
          'अधिकांश ब्राउज़र आपको अपनी सेटिंग्स के माध्यम से कुकीज़ को नियंत्रित या ब्लॉक करने की अनुमति देते हैं। हालांकि, आवश्यक कुकीज़ को अक्षम करने से प्लेटफ़ॉर्म की प्रमुख विशेषताओं जैसे कि विक्रेता डैशबोर्ड का उपयोग करने की आपकी क्षमता प्रभावित हो सकती है।'
        ],
        types: [
          { type: 'कठोरता से आवश्यक कुकीज़', desc: 'ये वेबसाइट के काम करने के लिए आवश्यक हैं और इन्हें अक्षम नहीं किया जा सकता है। इनमें सत्र कुकीज़ शामिल हैं जो आपको विक्रेता के रूप में लॉग इन रखती हैं, और सुरक्षा टोकन जो सीएसआरएफ हमलों से रक्षा करते हैं।' },
          { type: 'कार्यात्मक कुकीज़', desc: 'ये आपके अनुभव को व्यक्तिगत बनाने के लिए आपकी प्राथमिकताओं (जैसे, भाषा चयन) को याद रखते हैं। ये आपको अन्य वेबसाइटों पर ट्रैक नहीं करते हैं।' },
          { type: 'विश्लेषण कुकीज़ (वैकल्पिक)', desc: 'यदि सक्षम किया जाता है, तो ये हमें यह समझने में मदद करते हैं कि उपयोगकर्ता प्लेटफ़ॉर्म का उपयोग कैसे करते हैं — कौन से पृष्ठ सबसे अधिक देखे जाते हैं और कौन से उत्पाद सबसे अधिक देखे जाते हैं।' }
        ]
      },
      children: {
        title: "10. बच्चों की गोपनीयता",
        content: [
          'बिहार का बाज़ार 18 वर्ष से कम उम्र के व्यक्तियों के लिए नहीं है। हम जानबूझकर बच्चों से व्यक्तिगत डेटा एकत्र, संसाधित या संग्रहीत नहीं करते हैं। यदि आप माता-पिता या अभिभावक हैं और मानते हैं कि आपके बच्चे ने अनजाने में हमें व्यक्तिगत जानकारी प्रदान की है, तो कृपया तुरंत privacy@biharkabazaar.com पर हमसे संपर्क करें, और हम तुरंत उस जानकारी को हटा देंगे।',
          'विक्रेता पंजीकरण के लिए पंजीकरणकर्ता की आयु कम से कम 18 वर्ष होनी चाहिए और वह भारतीय कानून के तहत बाध्यकारी अनुबंध करने में कानूनी रूप से सक्षम होना चाहिए।'
        ]
      },
      changes: {
        title: '11. इस नीति में बदलाव',
        content: [
          'हम अपनी प्रथाओं, तकनीक, कानूनी आवश्यकताओं, या व्यावसायिक संचालन में बदलाव को दर्शाने के लिए समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। जब हम महत्वपूर्ण बदलाव करेंगे, तो हम:',
          '• इस पृष्ठ के शीर्ष पर "प्रभावी तिथि" को अपडेट करेंगे।',
          '• महत्वपूर्ण अपडेट के लिए बदलाव प्रभावी होने से कम से कम 14 दिन पहले पंजीकृत विक्रेताओं को ईमेल या प्लेटफ़ॉर्म अधिसूचना के माध्यम से सूचित करेंगे।',
          '• महत्वपूर्ण संशोधनों के लिए प्लेटफ़ॉर्म के होमपेज पर एक प्रमुख बैनर प्रदर्शित करेंगे।',
          'संशोधित नीति की प्रभावी तिथि के बाद आपके द्वारा प्लेटफ़ॉर्म का निरंतर उपयोग आपके द्वारा अपडेट की गई शर्तों की स्वीकृति माना जाएगा। हम आपको समय-समय पर इस पृष्ठ की समीक्षा करने के लिए प्रोत्साहित करते हैं।'
        ]
      },
      contact: {
        title: '12. शिकायत अधिकारी और संपर्क',
        content: [
          'यदि इस गोपनीयता नीति या हमारे डेटा प्रबंधन प्रथाओं के बारे में आपका कोई प्रश्न, चिंता या शिकायत है, तो आप हमारे शिकायत अधिकारी से संपर्क कर सकते हैं:'
        ],
        grievanceTitle: '📋 शिकायत अधिकारी',
        grievanceFields: [
          'नाम: जल्द आ रहा है',
          'ईमेल: privacy@biharkabazaar.com',
          'जवाब देने का समय: 30 दिनों के भीतर'
        ],
        entityTitle: '🏢 पंजीकृत इकाई',
        entityFields: [
          'कंपनी: बिंदिसा एग्रीटेक प्राइवेट लिमिटेड',
          'पता: गया, बिहार – 823001, भारत',
          'अधिकार क्षेत्र: गया, बिहार की अदालतें'
        ],
        governingLaw: '📌 शासी कानून: यह गोपनीयता नीति भारत के कानूनों के अनुसार शासित और विश्लेषित की जाएगी, जिसमें डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023; सूचना प्रौद्योगिकी अधिनियम, 2000; और सूचना प्रौद्योगिकी (संशोधन) अधिनियम, 2008 शामिल हैं। इस नीति के संबंध में उत्पन्न होने वाले किसी भी विवाद के लिए केवल गया, बिहार की अदालतों का अधिकार क्षेत्र होगा।'
      }
    }
  },
  mai: {
    heroTitle: 'गोपनीयता नीति',
    heroSubtitle: "प्रभावी तिथि: 19 जुलाई, 2026 • बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित",
    heroLegal: "हम डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act) आ सूचना प्रौद्योगिकी अधिनियम, 2000 क अनुसार अहाँक व्यक्तिगत डेटा क सुरक्षा लेल प्रतिबद्ध छी।",
    tocTitle: 'विषय सूची',
    langSelectorLabel: 'भाषा चुनू:',
    sections: {
      introduction: {
        title: '1. परिचय',
        content: [
          'बिहार का बाज़ार ("BKB", "हम", "हमर", या "हमरा") में अहाँक स्वागत अछि, जे बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित एकटा ऑनलाइन बाज़ार थिक, जे भारतक कानूनक तहत गठित एकटा कंपनी अछि, जेकर मुख्यालय गया, बिहार में अछि। हमर प्लेटफ़ॉर्म बिहारक स्थानीय किसान, बुनकर, कारीगर आ सूक्ष्म उद्यमी सभ के सीधे भारत भरक खरीदार सभ सँ जोड़ैत अछि — बिना कोनो बिचौलिया क, जे निष्पक्ष व्यापार आ बेहतर आजीविका सुनिश्चित करैत अछि।',
          'ई गोपनीयता नीति ("नीति") बताबैत अछि जे हम biharkabazaar.com पर हमर वेबसाइट आ संबंधित सेवा, एपीआई या मोबाइल अनुप्रयोग सभ (सामूहिक रूप सँ, "प्लेटफ़ॉर्म") क संग बातचीत करय वाला उपयोगकर्ता सभ — जेकरा में विक्रेता, खरीदार आ आगंतुक शामिल छथि — क व्यक्तिगत डेटा कए कोना एकत्र, संसाधित, संग्रहीत, साझा आ सुरक्षित करैत छी।',
          'प्लेटफ़ॉर्म पर पंजीकरण कऽ कऽ या एकर उपयोग कऽ कऽ, अहाँ स्वीकार करैत छी जे अहाँ एहि नीति कए पढ़लहुँ अछि, बुझलहुँ अछि, आ एकरा सँ बान्हल रहबाक लेल सहमत छी। यदि अहाँ सहमत नै छी, तँ कृपया तुरंत प्लेटफ़ॉर्मक उपयोग बंद कऽ दियौक।'
        ]
      },
      scope: {
        title: '2. कार्यक्षेत्र आ प्रयोज्यता',
        content: [
          'ई नीति ओहि सभ व्यक्ति पर लागू होइत अछि जे प्लेटफ़ॉर्मक उपयोग करैत छथि, जाहि में शामिल छथि:',
          '• विक्रेता / भागीदार — किसान, बुनकर, कारीगर आ सूक्ष्म व्यवसाय जे BKB पर पंजीकरण करैत छथि आ उत्पाद सभ सूचीबद्ध करैत छथि।',
          '• खरीदार / ग्राहक — ओ व्यक्ति जे प्लेटफ़ॉर्मक माध्यम सँ उत्पाद सभ ब्राउज़ करैत छथि, ऑर्डर करैत छथि या खरीदैत छथि।',
          '• आगंतुक — कोनो व्यक्ति जे बिना खाता बनेने वेबसाइट पर आबैत छथि।',
          '• प्री-लॉन्च ग्राहक — ओ व्यक्ति जे शुरुआती पहुंच या लॉन्च सूचना सभक लेल साइन अप करैत छथि।',
          'ई नीति ओहि तेसर पक्षक वेबसाइट, अनुप्रयोग या सेवा सभ पर लागू नै होइत अछि जे हमर प्लेटफ़ॉर्म सँ जुड़ल भऽ सकैत अछि। हम अहाँक ओहि तेसर पक्षक गोपनीयता नीति सभक अलग सँ समीक्षा करबाक लेल प्रोत्साहित करैत छी।'
        ]
      },
      dataCollection: {
        title: '3. जानकारी जे हम एकत्र करैत छी',
        content: [
          'हम केवल ओही जानकारी एकत्र करैत छी जे हमर सेवा सभ प्रदान करबाक, पहचान सत्यापित करबाक, प्लेटफ़ॉर्म सुरक्षा सुनिश्चित करबाक आ भुगतान संसाधित करबाक लेल आवश्यक अछि। हमर द्वारा एकत्र कयल जाबय वाला डेटा निम्नलिखित श्रेणी सभ में आबैत अछि:'
        ],
        cards: [
          {
            title: 'क. जानकारी जे अहाँ हमरा सीधे प्रदान करैत छी',
            points: [
              'विक्रेता पंजीकरण: पूरा कानूनी नाम, मोबाइल नंबर, ईमेल पता, प्रोफ़ाइल फ़ोटो, भाषा प्राथमिकता, व्यवसायक नाम (यदि कतहु हो), उद्यमक प्रकार (व्यक्तिगत कारीगर / सहकारी / किसान), आ ओटीपी सत्यापन।',
              'विक्रेता प्रोफ़ाइल विवरण: व्यावसायिक जिला, गाम/शहर, पिन कोड, सड़कक पता, उत्पाद श्रेणी, उत्पाद विवरण, मासिक उत्पादन क्षमता, जीआई टैग प्रमाणपत्र संख्या (यदि लागू हो), आ जीएसटी पंजीकरण स्थिति/संख्या।',
              'वित्तीय आ केवाईसी जानकारी: आधार संख्या (केवल अंतिम चारि अंक प्रदर्शित), यूपीआई आईडी, बैंक खाताधारकक नाम, बैंक खाता संख्या, आ बैंक आईएफएससी कोड — जे केवल बिचौलिया सभक बिना सीधे विक्रेता सभ कए भुगतान संसाधित करबाक उद्देश्य सँ एकत्र कयल जाइत अछि।',
              'उत्पादक जानकारी: उत्पादक नाम, विवरण, मूल्य निर्धारण, वजन विकल्प आ उत्पादक छवि सभ (जे विक्रेता द्वारा अपन डिवाइस सँ अपलोड कयल जा सकैत अछि)।',
              'खरीदारक जानकारी: नाम, मोबाइल नंबर, ईमेल पता, वितरण पता (सड़क, शहर, राज्य, पिन कोड), आ ऑर्डर इतिहास।',
              'प्री-लॉन्च पंजीकरण: नाम, मोबाइल नंबर आ शुरुआती पहुंचक लेल साइन अप करय वाला व्यक्ति सभक पसंदीदा डिलीवरी स्थान।',
              'संचार: कोनो प्रश्न, प्रतिक्रिया, या सहायता संदेश जे अहाँ हमरा संपर्क फ़ॉर्म, ईमेल या फोनक माध्यम सँ पठाबैत छी।'
            ]
          },
          {
            title: 'ख. स्वचालित रूप सँ एकत्र कयल गेल जानकारी',
            points: [
              'डिवाइस आ ब्राउज़रक जानकारी: आईपी पता, ब्राउज़रक प्रकार आ संस्करण, ऑपरेटिंग सिस्टम, डिवाइस पहचानकर्ता आ स्क्रीन रिज़ॉल्यूशन।',
              'उपयोग डेटा: देखल गेल पृष्ठ, पृष्ठ सभ पर बितल समय, क्लिक पथ, खोज प्रश्न, उत्पाद दृश्य आ रेफ़रल स्रोत।',
              'सत्र डेटा: लॉगिन टाइमस्टैम्प, सत्रक अवधि आ प्लेटफ़ॉर्म इंटरैक्शन।',
              'लॉग डेटा: सर्वर लॉग जे हमर एपीआईक अनुरोध सभ, त्रुटि घटना सभ आ सुरक्षा सँ संबंधित घटना सभ जेना कि विफल लॉगिन प्रयास सभ कए रिकॉर्ड करैत अछि।'
            ]
          },
          {
            title: 'ग. संवेदनशील व्यक्तिगत डेटा',
            points: [
              'DPDP अधिनियम 2023 आ आईटी नियमक नियम 3 क अनुसार, BKB द्वारा एकत्र कयल गेल डेटाक संवेदनशील श्रेणी सभ कए सख्त सुरक्षा नियंत्रणक संग नियंत्रित कयल जाइत अछि:',
              '• वित्तीय जानकारी (बैंक खाताक विवरण, यूपीआई आईडी)',
              '• आधार पहचान संख्या',
              '• सरकार द्वारा जारी दस्तावेज़ संख्या (जीएसटी, जीआई प्रमाणपत्र)'
            ]
          }
        ]
      },
      dataUsage: {
        title: '4. हम जानकारीक उपयोग कोना करैत छी',
        content: [
          'हम अहाँक व्यक्तिगत डेटा कए केवल विशिष्ट, वैध आ पारदर्शी उद्देश्य सभक लेल संसाधित करैत छी। लागू भारतीय कानूनक तहत हमर प्रसंस्करणक कानूनी आधार अछि: अहाँक सहमति, अहाँक संग एकटा अनुबंधक निष्पादन, हमर वैध व्यावसायिक हित, आ कानूनी दायित्व सभक अनुपालन।',
          'हम अहाँक व्यक्तिगत विवरणक उपयोग स्वचालित प्रोफ़ाइलिंग या निर्णय लेबाक लेल नै करैत छी जाहि सँ कोनो महत्वपूर्ण कानूनी प्रभाव पड़य।'
        ],
        grid: [
          { title: '🛒 ऑर्डर पूरा करब', text: 'खरीद कए संसाधित आ पुष्टि करब, शिपिंगक व्यवस्था करब आ खरीदार सभ कए उत्पाद वितरित करब।' },
          { title: '✅ विक्रेता सत्यापन', text: 'ओटीपीक माध्यम सँ विक्रेताक पहचान कए प्रमाणित करब, आधार विवरणक जांच करब आ उत्पाद सभ कए सार्वजनिक रूप सँ सूचीबद्ध करबा सँ पहिने जीआई प्रमाणपत्र सभ कए सत्यापित करब।' },
          { title: '💳 सीधे भुगतान', text: 'बिना कोनो कमीशन कटौती आ समय पर भुगतान सुनिश्चित करैत बैंक ट्रांसफर या यूपीआईक माध्यम सँ बिक्री आय कए सीधे विक्रेता सभ कए हस्तांतरित करब।' },
          { title: '📧 संचार', text: 'ऑर्डरक पुष्टि, भुगतान अलर्ट, शिपिंग अपडेट आ महत्वपूर्ण खाताक सूचना सभ पठाबब।' },
          { title: '🔒 सुरक्षा आ धोखाधड़ीक रोकथाम', text: 'संदिग्ध गतिविधक पता लगाबब, अनधिकृत लॉगिन कए रोकब, दर सीमा सभ लागू करब आ संभावित उल्लंघनसभक जांच करब।' },
          { title: '📊 प्लेटफ़ॉर्म में सुधार', text: 'उपयोग पैटर्नक विश्लेषण करब, खोज प्रासंगिकता में सुधार करब आ अनाम एकत्रित डेटाक आधार पर उपयोगकर्ताक अनुभव कए बढ़ावा देब।' },
          { title: '⚖️ कानूनी अनुपालन', text: 'जीएसटी कानूनक तहत आवश्यक रिकॉर्ड बनाए रखब, कानून प्रवर्तन अनुरोधक जवाब देब आ वैधानिक दायित्व सभ कए पूरा करब।' },
          { title: '📣 विपणन (केवल ऑप्ट-इन)', text: 'नब बिहार उत्पाद सभ, कारीगर सभक कहानी आ प्लेटफ़ॉर्मक ऑफ़र सभक बारे में प्रचार संचार पठाबब — केवल तखने जखन अहाँ स्पष्ट रूप सँ सहमति देने होइ।' }
        ]
      },
      dataSharing: {
        title: '5. साझा करब आ प्रकटीकरण',
        content: [
          'हम व्यावसायिक उद्देश्य सभक लेल कोनो तेसर पक्ष कए अहाँक व्यक्तिगत डेटा नै बेचैत छी, भाड़ा पर नै दैत छी आ नै व्यापार करैत छी। हम सीमित, परिभाषित परिस्थिति सभ में अहाँक जानकारी साझा कऽ सकैत छी:',
          '• रसद आ वितरण भागीदार: हम उत्पाद वितरणक सुविधा लेल केवल अपन रसद आ कूरियर भागीदार सभक संग खरीदारक नाम, वितरण पता आ संपर्क नंबर साझा करैत छी।',
          '• भुगतान प्रसंस्करण: विक्रेता सभ कए भुगतान करबाक लेल वित्तीय डेटा अधिकृत बैंकिंग भागीदार सभ या यूपीआई सेवा प्रदाता सभक संग साझा कयल जाइत अछि। हम भुगतान प्रसंस्करणक लेल आवश्यक सँ बेसी बैंक विवरण संग्रहीत नै करैत छी।',
          '• प्रौद्योगिकी सेवा प्रदाता: हम प्लेटफ़ॉर्म कए सुरक्षित रूप सँ चलाबय लेल विश्वसनीय होस्टिंग, क्लाउड इन्फ्रास्ट्रक्चर आ डेटाबेस प्रदाता सभक संग काज करैत छी। एहि प्रदाता सभ कए अनुबंधित सेवा सभ प्रदान करबाक अतिरिक्त कोनो अन्य उद्देश्यक लेल अहाँक डेटाक उपयोग करबा सँ रोकल गेल अछि।',
          '• कानूनी आ नियामक प्राधिकरण: लागू भारतीय कानूनक तहत अदालतक आदेश सभ, सरकारी नोटिस सभ या कानून प्रवर्तन अनुरोध सभक जवाब में हम कानूनन आवश्यक भेला पर जानकारीक खुलासा कऽ सकैत छी।',
          '• व्यावसायिक स्थानान्तरण: विलय, अधिग्रहण, या संपत्ति सभक बिक्रीक स्थिति में, उपयोगकर्ता डेटा कए समकक्ष गोपनीयता संरक्षणक अधीन नव संस्थान कए हस्तांतरित कयल जा सकैत अछि।',
          '• अहाँक सहमति सँ: जखन अहाँ स्पष्ट रूप सँ सहमति दैत छी तखन हम अन्य पक्ष सभक संग अहाँक डेटा साझा कऽ सकैत छी।'
        ],
        note: 'सार्वजनिक विक्रेता प्रोफ़ाइल पर नोट: स्वीकृत विक्रेता नाम, व्यवसायक नाम, जिला आ उत्पादक सूची बीकेबी बाज़ार पर सार्वजनिक रूप सँ प्रदर्शित कयल जाइत अछि ताकि खरीदार स्थानीय कारीगर सभ कए खोजि सकथि आ ओकरा सभ पर भरोसा कऽ सकथि। संवेदनशील वित्तीय या सरकारी आईडी जानकारी कखनो सार्वजनिक रूप सँ प्रदर्शित नै कयल जाइत अछि।'
      },
      dataRetention: {
        title: '6. डेटा प्रतिधारण (रखब)',
        content: [
          'हम व्यक्तिगत डेटा कए केवल तखने धरि बनाए रखैत छी जखन धरि कि एहि नीति में उल्लिखित उद्देश्य सभ कए पूरा करबाक लेल आवश्यक हो, या लागू कानून द्वारा आवश्यक हो:',
          'लागू प्रतिधारण अवधि समाप्त भेलाक बाद, व्यक्तिगत डेटा कए या त सुरक्षित रूप सँ हटा देल जाइत अछि या अनाम कऽ देल जाइत अछि ताकि एकरा कोनो व्यक्ति सँ जोड़ल नै जा सकय।'
        ],
        tableHeaders: ['डेटा श्रेणी', 'धारण अवधि'],
        tableRows: [
          ['विक्रेता खाता आ प्रोफ़ाइल डेटा', 'विक्रेता संबंधक अवधि + निष्क्रियताक 5 साल बाद धरि'],
          ['खरीदार ऑर्डर रिकॉर्ड', '7 वर्ष (जीएसटी आ लेखा नियम सभक अनुसार)'],
          ['वित्तीय / केवाईसी दस्तावेज', 'अंतिम लेनदेनक 5 साल बाद धरि, या आरबीआई/पीएमएलए द्वारा अनिवार्य'],
          ['उत्पाद सूची आ चित्र', 'जखन धरि विक्रेता उत्पाद कए हटा नै दैत छथि या खाता निष्क्रिय नै भऽ जाइत अछि'],
          ['सर्वर आ एक्सेस लॉग', '90 दिन (रोलिंग)'],
          ['लॉन्च सँ पहिनेक पंजीकरण डेटा', 'प्लेटफ़ॉर्म लॉन्च + 1 वर्ष धरि, या जखन धरि उपयोगकर्ता हटाबय लेल अनुरोध नै करैत छथि'],
          ['विपणन सहमति', 'जखन धरि उपयोगकर्ता द्वारा वापस नै लेल जाइत अछि'],
        ]
      },
      dataProtection: {
        title: '7. सुरक्षा उपाय',
        content: [
          'हम अहाँक व्यक्तिगत जानकारीक सुरक्षा कए गंभीरता सँ लैत छी। हम अहाँक डेटा कए अनधिकृत पहुंच, प्रकटीकरण, परिवर्तन या विनाश सँ बचेबाक लेल तकनीकी, संगठनात्मक आ भौतिक सुरक्षा उपाय सभक संयोजन लागू करैत छी:',
          'हमर सर्वोत्तम प्रयास सभक बावजूद, कोनो सुरक्षा प्रणाली अभेद्य नै अछि। हम अहाँक डेटाक पूर्ण सुरक्षाक गारंटी नै दऽ सकैत छी। अहाँक सलाह देल जाइत अछि जे अहाँ अपन लॉगिन क्रेडेंशियल कए गोपनीय राखू आ यदि अहाँ कए अपन खाता में अनधिकृत पहुंचक संदेह हो तँ हमरा तुरंत सूचित करू।'
        ],
        grid: [
          { icon: '🔐', title: 'पारगमन में एन्क्रिप्शन', text: 'अहाँक ब्राउज़र आ हमर सर्वरक बीच प्रेषित सभ डेटा कए टीएलएस (ट्रांसपोर्ट लेयर सिक्योरिटी) प्रोटोकॉलक उपयोग कऽ कऽ एन्क्रिप्ट कयल जाइत अछि।' },
          { icon: '🛡️', title: 'पहुंच नियंत्रण', text: 'संवेदनशील डेटा धरि आंतरिक पहुंच केवल अधिकृत कर्मचारी सभ धरि सीमित अछि, जाहि में भूमिका-आधारित अनुमति आ ऑडिट ट्रेल्स शामिल अछि।' },
          { icon: '🔒', title: 'संवेदनशील फ़ील्ड मास्किंग', text: 'आधार संख्या आ बैंक खाताक विवरण हमर व्यवस्थापक इंटरफेस में नुकाओल जाइत अछि आ हमर सार्वजनिक एपीआईक माध्यम सँ कखनो पूर्ण रूप सँ वापस नै कयल जाइत अछि।' },
          { icon: '📋', title: 'दर सीमित करब आ निगरानी', text: 'ब्रूट-फ़ोर्स हमला सभ कए रोकि सकय लेल हमर एपीआई दर सीमित करबाक, आईपी-आधारित थ्रॉटलिंग आ विसंगतिक पता लगेबाक उपाय सभ सँ सुरक्षित अछि।' },
          { icon: '🗄️', title: 'डेटाबेसक सुरक्षा', text: 'हमर डेटाबेस सुरक्षित नेटवर्क पहुंच, स्वचालित बैकअप आ घुसपैठक पता लगेबाक प्रणाली सभक संग सुरक्षित वातावरण में होस्ट कयल जाइत अछि।' },
          { icon: '📢', title: 'उल्लंघनक अधिसूचना', text: 'डेटा उल्लंघनक स्थिति में, हम प्रभावित उपयोगकर्ता सभ आ भारतीय डेटा संरक्षण बोर्ड कए लागू कानून द्वारा निर्धारित समय सीमाक भीतर सूचित करब।' }
        ]
      },
      userRights: {
        title: '8. अहाँक अधिकार आ विकल्प',
        content: [
          'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 आ अन्य लागू भारतीय गोपनीयता कानून सभक तहत, अहाँक अपन व्यक्तिगत डेटाक संबंध में निम्नलिखित अधिकार अछि:'
        ],
        rights: [
          { right: '🔍 देखबाक अधिकार', text: 'अहाँ कए हमर लग मौजूद अहाँक व्यक्तिगत डेटाक सारांश आ एकरा संसाधित करबाक उद्देश्य सभक अनुरोध करबाक अधिकार अछि।' },
          { right: '✏️ सुधारक अधिकार', text: 'अहाँ कए गलत या अपूर्ण व्यक्तिगत डेटा कए सुधारबाक अनुरोध करबाक अधिकार अछि। विक्रेता सीधे विक्रेता डैशबोर्डक माध्यम सँ अधिकांश प्रोफ़ाइल जानकारी अपडेट कऽ सकैत छथि।' },
          { right: '🗑️ मिटबाक अधिकार', text: 'अहाँ अपन व्यक्तिगत डेटा कए हटाबय लेल अनुरोध कऽ सकैत छी। हम कानून द्वारा अनुमत सीमा धरि एहन अनुरोधक सम्मान करब, कानूनी दायित्व सभक संग अहाँक अनुरोधक संतुलन बनेब।' },
          { right: '📤 डेटा पोर्टेबिलिटीक अधिकार', text: 'अहाँ अपन द्वारा हमरा प्रदान कयल गेल व्यक्तिगत डेटाक एकटा पठनीय प्रति कक अनुरोध कऽ सकैत छी, ताकि अहाँ एकरा कोनो अन्य सेवा प्रदाता कए हस्तांतरित कऽ सकी।' },
          { right: '🚫 सहमति वापस लेबाक अधिकार', text: 'अतः हमर प्रसंस्करण अहाँक सहमति पर आधारित अछि, अहाँ पूर्व प्रसंस्करणक वैधता कए प्रभावित कयल बिना कोनो भी समय ओहि सहमति कए वापस लऽ सकैत छी।' },
          { right: '⚖️ शिकायत निवारणक अधिकार', text: 'अहाँ कए हमर डेटा प्रसंस्करण प्रथा सभक संबंध में हमर शिकायत अधिकारी या भारतीय डेटा संरक्षण बोर्ड (गठित होने पर) क लग शिकायत दर्ज करबाक अधिकार अछि।' },
          { right: '📵 Marketing सँ बाहर निकलबाक अधिकार', text: 'अहाँ हमर संचार में देल गेल अनसब्सक्राइब लिंकक उपयोग कऽ कऽ या हमरा सँ सीधे संपर्क कऽ कऽ कोनो भी समय प्रचार ईमेल या एसएमएस संदेश सभ सँ सदस्यता समाप्त कऽ सकैत छी।' }
        ],
        warning: 'एहि में सँ कोनो भी अधिकारक प्रयोग करबाक लेल, कृपया हमर शिकायत अधिकारी सँ privacy@biharkabazaar.com पर संपर्क करू। हम लागू कानूनक आवश्यकताक अनुसार, अहाँक सत्यापित अनुरोध प्राप्त होने के ३० दिनक भीतर जवाब देब।'
      },
      cookies: {
        title: '9. कुकीज़ आ ट्रैकिंग तकनीक',
        content: [
          'हम अपन प्लेटफ़ॉर्म कए संचालित करबाक आ अहाँक अनुभव कए बेहतर बनेबाक लेल कुकीज़ आ एहिना ट्रैकिंग तकनीक सभक उपयोग करैत छी। हम वर्तमान में तेसर पक्षक विज्ञापन या व्यवहार संबंधी ट्रैकिंग कुकीज़क उपयोग नै करैत छी।',
          'अधिकांश ब्राउज़र अहाँ कए अपन सेटिंग्सक माध्यम सँ कुकीज़ कए नियंत्रित या ब्लॉक करबाक अनुमति दैत अछि। हालांकि, आवश्यक कुकीज़ कए अक्षम कएला सँ प्लेटफ़ॉर्मक प्रमुख विशेषता सभ जेना कि विक्रेता डैशबोर्डक उपयोग करबाक अहाँक क्षमता प्रभावित भऽ सकैत अछि।'
        ],
        types: [
          { type: 'कठोरता सँ आवश्यक कुकीज़', desc: 'ई वेबसाइटक काज करबाक लेल आवश्यक अछि आ एकरा अक्षम नै कयल जा सकैत अछि। एहि में सत्र कुकीज़ शामिल अछि जे अहाँ कए विक्रेताक रूप में लॉग इन रखैत अछि, आ सुरक्षा टोकन जे सीएसआरएफ हमला सभ सँ रक्षा करैत अछि।' },
          { type: 'कार्यात्मक कुकीज़', desc: 'ई अहाँक अनुभव कए व्यक्तिगत बनेबाक लेल अहाँक प्राथमिकता सभ कए याद रखैत अछि। ई अहाँ कए अन्य वेबसाइट सभ पर ट्रैक नै करैत अछि।' },
          { type: 'विश्लेषण कुकीज़ (वैकल्पिक)', desc: 'यदि सक्षम कयल जाइत अछि, तँ ई हमरा ई बुझबा में मदद करैत अछि जे उपयोगकर्ता प्लेटफ़ॉर्मक उपयोग कोना करैत छथि — कोन पृष्ठ सभ सबसे बेसी देखल जाइत अछि आ कोन उत्पाद सभ सबसे बेसी देखल जाइत अछि।' }
        ]
      },
      children: {
        title: "10. बच्चा सभक गोपनीयता",
        content: [
          'बिहार का बाज़ार 18 वर्ष सँ कम उमेरक व्यक्ति सभक लेल नै अछि। हम जानि-बुझि कऽ बच्चा सभ सँ व्यक्तिगत डेटा एकत्र, संसाधित या संग्रहीत नै करैत छी। यदि अहाँ माता-पिता या अभिभावक छी आ मानैत छी जे अहाँक बच्चा ने अनजाने में हमरा व्यक्तिगत जानकारी प्रदान कयल अछि, तँ कृपया तुरंत privacy@biharkabazaar.com पर हमरा सँ संपर्क करू, आ हम तुरंत ओहि जानकारी कए हटा देब।',
          'विक्रेता पंजीकरणक लेल पंजीकरणकर्ताक आयु कम सँ कम 18 वर्ष होबाक चाही आ ओ भारतीय कानूनक तहत बाध्यकारी अनुबंध करबा में कानूनी रूप सँ सक्षम होबाक चाही।'
        ]
      },
      changes: {
        title: '11. एहि नीति में बदलाव',
        content: [
          'हम अपन प्रथा सभ, तकनीक, कानूनी आवश्यकता सभ, या व्यावसायिक संचालन में बदलाव कए दर्शाबय लेल समय-समय पर एहि गोपनीयता नीति कए अपडेट कऽ सकैत छी। जखन हम महत्वपूर्ण बदलाव करब, तँ हम:',
          '• एहि पृष्ठक शीर्ष पर "प्रभावी तिथि" कए अपडेट करब।',
          '• महत्वपूर्ण अपडेट लेल बदलाव प्रभावी होबा सँ कम सँ कम 14 दिन पहिने पंजीकृत विक्रेता सभ कए ईमेल या प्लेटफ़ॉर्म अधिसूचनाक माध्यम सँ सूचित करब।',
          '• महत्वपूर्ण संशोधन सभक लेल प्लेटफ़ॉर्मक होमपेज पर एकटा मुख्य बैनर प्रदर्शित करब।',
          'संशोधित नीति क प्रभावी तिथि क बाद अहाँक द्वारा प्लेटफ़ॉर्मक निरंतर उपयोग अहाँक द्वारा अपडेट कयल गेल शर्त सभक स्वीकृति मानल जाइत। हम अहाँ कए समय-समय पर एहि पृष्ठक समीक्षा करबाक लेल प्रोत्साहित करैत छी।'
        ]
      },
      contact: {
        title: '12. शिकायत अधिकारी आ संपर्क',
        content: [
          'यदि एहि गोपनीयता नीति या हमर डेटा प्रबंधन प्रथा सभक बारे में अहाँक कोनो प्रश्न, चिंता या शिकायत अछि, तँ अहाँ हमर शिकायत अधिकारी सँ संपर्क कऽ सकैत छी:'
        ],
        grievanceTitle: '📋 शिकायत अधिकारी',
        grievanceFields: [
          'नाम: जल्द आ रहा है',
          'ईमेल: privacy@biharkabazaar.com',
          'जवाब देबाक समय: 30 दिनक भीतर'
        ],
        entityTitle: '🏢 पंजीकृत इकाई',
        entityFields: [
          'COMPANY: बिंदिसा एग्रीटेक प्राइवेट लिमिटेड',
          'पता: गया, बिहार – 823001, भारत',
          'अधिकार क्षेत्र: गया, बिहारक अदालत सभ'
        ],
        governingLaw: '📌 शासी कानून: ई गोपनीयता नीति भारतक कानूनक अनुसार शासित आ विश्लेषित कयल जायत, जाहि में डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023; सूचना प्रौद्योगिकी अधिनियम, 2000; आ सूचना प्रौद्योगिकी (संशोधन) अधिनियम, 2008 शामिल अछि। एहि नीति क संबंध में उत्पन्न होमय वाला कोनो भी विवादक लेल केवल गया, बिहारक अदालत सभक अधिकार क्षेत्र होयत।'
      }
    }
  },
  bho: {
    heroTitle: 'गोपनीयता नीति',
    heroSubtitle: "प्रभावी तिथि: 19 जुलाई, 2026 • बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित",
    heroLegal: "हम डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act) अउर सूचना प्रौद्योगिकी अधिनियम, 2000 के अनुसार राउर व्यक्तिगत डेटा के सुरक्षा खातिर प्रतिबद्ध बानी।",
    tocTitle: 'विषय सूची',
    langSelectorLabel: 'भाषा चुनीं:',
    sections: {
      introduction: {
        title: '1. परिचय',
        content: [
          'बिहार का बाज़ार ("BKB", "हमनी", "हमनी के", चाहे "हमरा") में राउर स्वागत बा, जवन बिंदिसा एग्रीटेक प्राइवेट लिमिटेड द्वारा संचालित एगो ऑनलाइन बाज़ार हवे, जवन भारत के कानूनन के तहत बनल एगो कंपनी हवे, जेकर मुख्यालय गया, बिहार में बा। हमनी के प्लेटफ़ॉर्म बिहार के स्थानीय किसानन, बुनकरन, शिल्पकारन अउर छोट उद्यमी लोगन के सीधे पूरा भारत के खरीदारन से जोड़ेला — बिना केहू बिचौलिया के, जेकर वजह से सही व्यापार अउर नीक आजीविका सुनिश्चित होला।',
          'ई गोपनीयता नीति ("नीति") बतावेला कि हमनी biharkabazaar.com पर हमनी के वेबसाइट अउर ओकरा से जुड़ल सेवा, एपीआई चाहे मोबाइल एप्लीकेशन (सामूहिक रूप से, "प्लेटफ़ॉर्म") के इस्तेमाल करे वाला यूजरन — जेकरा में विक्रेता, खरीदार अउर आगंतुक शामिल बाड़न — के व्यक्तिगत डेटा के कइसे बटोरीं, ओकर इस्तेमाल करीं, सहेज के रखीं, साझा करीं अउर सुरक्षित करीं।',
          'प्लेटफ़ॉर्म पर रजिस्ट्रेशन करके चाहे एकर इस्तेमाल करके, रउआ ई मानत बानी कि रउआ ए नीति के पढ़ले बानी, समझले बानी अउर एकरा से बंधल रहे के रजामंदी देत बानी। अगर रउआ सहमत नईखीं, त कृपया तुरंत प्लेटफ़ॉर्म के इस्तेमाल बंद कर दीं।'
        ]
      },
      scope: {
        title: '2. कार्यक्षेत्र अउर प्रयोज्यता',
        content: [
          'ई नीति ओकरा सभ पर लागू होला जवन प्लेटफ़ॉर्म के इस्तेमाल करेला, जेकरा में शामिल बाड़न:',
          '• विक्रेता / भागीदार — किसान, बुनकर, शिल्पकार अउर छोट व्यापारी लोग जवन BKB पर रजिस्ट्रेशन करेला अउर सामान लिस्ट करेला।',
          '• खरीदार / ग्राहक — ओ लोग जवन प्लेटफ़ॉर्म के माध्यम से सामान देखेला, ऑर्डर करेला चाहे खरीदेला।',
          '• आगंतुक — केहू भी जवन बिना एकाउंट बनवले वेबसाइट पर आवेला।',
          '• प्री-लॉन्च ग्राहक — ओ लोग जवन शुरुआत में जुड़ाव चाहे लॉन्च के खबर पावे खातिर साइन अप करेला।',
          'ई नीति केहू बाहरी वेबसाइट, एप्लीकेशन चाहे सेवा पर लागू नईखे होत जवन हमनी के प्लेटफ़ॉर्म से जुड़ल हो सकेला। हमनी रउआ के सलाह देब कि ओ सभ बाहरी लोगन के गोपनीयता नीति के अलग से जरूर देख लीं।'
        ]
      },
      dataCollection: {
        title: '3. जानकारी जवन हमनी बटोरीं',
        content: [
          'हमनी खाली उहे जानकारी बटोरीं जवन हमनी के सेवा देवे खातिर, पहचान जाँचे खातिर, प्लेटफ़ॉर्म के सुरक्षा खातिर अउर भुगतान करे खातिर जरूरी बा। बटोरल गइल डेटा नीचे दिहल गइल श्रेणियन में आवेला:'
        ],
        cards: [
          {
            title: 'क. जानकारी जवन रउआ सीधे हमनी के देलीं',
            points: [
              'विक्रेता रजिस्ट्रेशन: पूरा कानूनी नाम, मोबाइल नंबर, ईमेल पता, प्रोफ़ाइल फोटो, भाषा के पसंद, व्यापार के नाम (अगर बा त), उद्यम के प्रकार (व्यक्तिगत शिल्पकार / सहकारी / किसान) अउर ओटीपी सत्यापन।',
              'विक्रेता प्रोफाइल के जानकारी: व्यापार के जिला, गाँव/कस्बा, पिन कोड, सड़क के पता, सामान के श्रेणी, ओकर विवरण, महीना के उत्पादन क्षमता, जीआई टैग प्रमाणपत्र नंबर (अगर लागू होखे त) अउर जीएसटी नंबर।',
              'वित्तीय अउर केवाईसी जानकारी: आधार नंबर (खाली अंतिम चार गो अंक देखाई देई), यूपीआई आईडी, बैंक खाताधारक के नाम, बैंक खाता नंबर अउर बैंक आईएफएससी कोड — जवन खाली बिचौलिया लोग के बिना सीधे विक्रेता लोग के भुगतान करे खातिर बटोरल जाला।',
              'सामान के जानकारी: सामान के नाम, ओकर विवरण, दाम, वजन के विकल्प अउर ओकर फोटो (जवन विक्रेता अपना फोन चाहे कंप्यूटर से अपलोड कर सकेला)।',
              'खरीदार के जानकारी: नाम, मोबाइल नंबर, ईमेल पता, डिलीवरी के पता (सड़क, शहर, राज्य, पिन कोड) अउर ऑर्डर के इतिहास।',
              'प्री-लॉन्च रजिस्ट्रेशन: नाम, mobile number अउर शुरुआत में जुड़े खातिर साइन अप करे वाला लोगन के पसंद के डिलीवरी के जगह।',
              'बातचीत: केहू भी सवाल, फीडबैक चाहे मदद खातिर भेजे गइल मैसेज जवन रउआ ईमेल, फोन चाहे वेबसाइट के माध्यम से भेजीं।'
            ]
          },
          {
            title: 'ख. अपने-आप बटोरल गइल जानकारी',
            points: [
              'डिवाइस अउर ब्राउज़र के जानकारी: आईपी पता, ब्राउज़र के प्रकार अउर वर्शन, ऑपरेटिंग सिस्टम, डिवाइस के पहचान अउर स्क्रीन के रेज़ॉल्यूशन।',
              'इस्तेमाल के डेटा: कवन पन्ना देखल गइल, पन्ना पर बीतल समय, क्लिक करे के रास्ता, खोजल गइल चीज, सामान के देखे के इतिहास अउर कहाँ से वेबसाइट पर आईल बानी ओकर जानकारी।',
              'सत्र के डेटा: लॉगिन के समय, सत्र के अवधि अउर प्लेटफ़ॉर्म पर कइल गइल काम।',
              'लॉग डेटा: सर्वर लॉग जवन हमनी के एपीआई के गइल अनुरोध, गलती के घटना अउर सुरक्षा से जुड़ल घटना जइसे कि गलत पासवर्ड डाल के लॉगिन करे के कोशिश के दर्ज करेला।'
            ]
          },
          {
            title: 'ग. संवेदनशील व्यक्तिगत डेटा',
            points: [
              'DPDP कानून 2023 अउर आईटी नियमन के नियम 3 के अनुसार, BKB द्वारा बटोरल गइल संवेदनशील डेटा के कड़ा सुरक्षा व्यवस्था के साथ राखल जाला:',
              '• वित्तीय जानकारी (बैंक खाता के विवरण, यूपीआई आईडी)',
              '• आधार पहचान नंबर',
              '• सरकार द्वारा जारी दस्तावेज नंबर (जीएसटी, जीआई प्रमाणपत्र)'
            ]
          }
        ]
      },
      dataUsage: {
        title: '4. हमनी जानकारी के इस्तेमाल कइसे करीं',
        content: [
          'हमनी राउर व्यक्तिगत डेटा के खाली तय, कानूनी अउर साफ़ कामन खातिर इस्तेमाल करीं। कानून के तहत डेटा इस्तेमाल करे के आधार बा: राउर मंजूरी, राउर साथ कइल गइल कौल, हमनी के कानूनी व्यापारिक जरूरत अउर कानून के पालन।',
          'हमनी राउर व्यक्तिगत जानकारी के इस्तेमाल मशीन से प्रोफाइल बनावे चाहे अइसन फैसला लेवे खातिर नईखीं करत जेकर कवनो बड़ा कानूनी असर पड़े।'
        ],
        grid: [
          { title: '🛒 ऑर्डर पूरा कइल', text: 'खरीद के पूरा कइल, ओकर पुष्टि कइल, डिलीवरी के व्यवस्था कइल अउर खरीदार तक सामान पहुँचावल।' },
          { title: '✅ विक्रेता के जाँच', text: 'ओटीपी से विक्रेता के पहचान जाँचल, आधार के मिलान कइल अउर सामान के सबके दिखावे से पहिले जीआई प्रमाणपत्र के जाँच कइल।' },
          { title: '💳 सीधे भुगतान', text: 'बिना कवनो कमीशन काटे अउर सही समय पर बैंक खाता चाहे यूपीआई के माध्यम से बिक्री के पइसा सीधे विक्रेता लोग के पठावल।' },
          { title: '📧 बातचीत', text: 'ऑर्डर के रसीद, भुगतान के सूचना, डिलीवरी के खबर अउर एकाउंट से जुड़ल जरूरी जानकारी पठावल।' },
          { title: '🔒 सुरक्षा अउर धोखाधड़ी से बचाव', text: 'कवनो गड़बड़ी के पता लगावल, बिना मंजूरी के लॉगिन रोकल, सुरक्षा नियम लागू कइल अउर गड़बड़ी के जाँच कइल।' },
          { title: '📊 प्लेटफ़ॉर्म में सुधार', text: 'इस्तेमाल के तरीका के समझल, खोज के नीक बनावल अउर बिना नाम के डेटा से प्लेटफ़ॉर्म के अउर बेहतर बनावल।' },
          { title: '⚖️ कानूनी नियम के पालन', text: 'जीएसटी कानून के तहत जरूरी बही-खाता राखल, सरकारी जाँच में मदद कइल अउर कानूनी जिम्मेदारी पूरा कइल।' },
          { title: '📣 प्रचार (खाली मंजूरी पर)', text: 'बिहार के नया सामान, शिल्पकारन के कहानी अउर छूट के बारे में जानकारी पठावल — खाली तब्बे जब रउआ एकरा खातिर मंजूरी देले होखीं।' }
        ]
      },
      dataSharing: {
        title: '5. साझा कइल अउर प्रकटीकरण',
        content: [
          'हमनी राउर कवनो व्यक्तिगत डेटा कवनो बाहरी लोग के बेचे, भाड़ा पर देवे चाहे व्यापार करे खातिर नईखीं देत। हमनी खाली नीचे दिहल गइल खास हाल में राउर जानकारी साझा कर सकीं:',
          '• डिलीवरी करे वाला साथी: हमनी सामान पहुँचावे खातिर खाली डिलीवरी करे वाला कूरियर कंपनी के साथ खरीदार के नाम, पता अउर फोन नंबर साझा करीं।',
          '• भुगतान करे खातिर: पइसा पठावे खातिर बैंक चाहे यूपीआई सेवा देवे वाला कंपनी के साथ वित्तीय जानकारी साझा कइल जाला। हमनी भुगतान करे खातिर जरूरी से ढेर बैंक के जानकारी सुरक्षित नईखीं रखत।',
          '• तकनीक देवे वाला साथी: प्लेटफ़ॉर्म के नीक से चलावे खातिर हमनी सर्वर, क्लाउड अउर डेटाबेस देवे वाला भरोसा के साथ काम करीं। ई लोग कवनो अउर काम खातिर राउर डेटा के इस्तेमाल नईखे कर सकत।',
          '• कोर्ट चाहे पुलिस के आदेश पर: भारतीय कानून के तहत अगर कोर्ट चाहे पुलिस कवनो जाँच खातिर आदेश देवे त हमनी के जानकारी साझा करे के पड़ेला।',
          '• व्यापार के बदलाव पर: अगर कंपनी कवनो दूसरा कंपनी के साथ मिलेले चाहे बिकाले त गोपनीयता नियम के तहत डेटा नया मालिक के पास जा सकेला।',
          '• राउर रजामंदी से: जब रउआ खुद कवनो काम खातिर मंजूरी देब त हमनी राउर डेटा ओकरा खातिर साझा कर सकीं।'
        ],
        note: 'सार्वजनिक विक्रेता प्रोफाइल के बारे में जरूरी बात: मंजूरी मिलल विक्रेता के नाम, जिला अउर सामान के लिस्ट वेबसाइट पर सबके देखाई देई ताकि खरीदार शिल्पकारन के खोज सके अउर भरोसा कर सके। बैंक के खाता चाहे सरकारी आईडी जइसन संवेदनशील जानकारी कखनो सबके ना देखाई।'
      },
      dataRetention: {
        title: '6. डेटा कब तक राखीं',
        content: [
          'हमनी राउर डेटा खाली तब्बे तक सुरक्षित राखीं जब तक ए नीति खातिर चाहे कानून के अनुसार जरूरी होखे:',
          'समय पूरा हो गइला के बाद, डेटा के सुरक्षित तरीका से मिटा दिहल जाला चाहे ओकरा में से नाम हटा दिहल जाला ताकि ओकरा से केहू के पहचान ना हो सके।'
        ],
        tableHeaders: ['डेटा के श्रेणी', 'राखे के समय'],
        tableRows: [
          ['विक्रेता के एकाउंट अउर प्रोफाइल डेटा', 'विक्रेता के साथ जब तक रिश्ता बा + एकाउंट बंद होखे के 5 साल बाद तक'],
          ['खरीदार के ऑर्डर के इतिहास', '7 साल तक (जीएसटी अउर टैक्स कानून के अनुसार)'],
          ['वित्तीय अउर केवाईसी दस्तावेज', 'अंतिम भुगतान के 5 साल बाद तक, चाहे आरबीआई के नियम के अनुसार'],
          ['सामान के लिस्ट अउर फोटो', 'जब तक विक्रेता सामान ना हटा दे चाहे एकाउंट बंद ना हो जाव'],
          ['सर्वर अउर एक्सेस लॉग', '90 दिन तक'],
          ['लॉन्च से पहिले के रजिस्ट्रेशन डेटा', 'वेबसाइट चालू होखे के 1 साल बाद तक, चाहे जब तक यूजर हटावे के ना कहे'],
          ['विपणन (प्रचार) के मंजूरी', 'जब तक यूजर मंजूरी वापस ना ले ले'],
        ]
      },
      dataProtection: {
        title: '7. सुरक्षा के उपाय',
        content: [
          'हमनी राउर जानकारी के सुरक्षा के बहुत गंभीरता से लेवेनी। डेटा के गलत इस्तेमाल, चोरी, बदलाव चाहे नष्ट होखे से बचावे खातिर हमनी तकनीकी अउर भौतिक सुरक्षा के इंतजाम कइले बानी:',
          'हमनी के पूरा कोशिश के बाद भी कवनो सुरक्षा अभेद्य नईखे होत। हमनी राउर डेटा के 100% सुरक्षा के दावा नईखीं कर सकत। रउआ सलाह दिहल जाला कि अपना पासवर्ड के सुरक्षित रखीं अउर कवनो गड़बड़ी बुषाए पर तुरंत हमनी के बताईं।'
        ],
        grid: [
          { icon: '🔐', title: 'रास्ता में एन्क्रिप्शन', text: 'राउर मोबाइल/कंप्यूटर अउर हमनी के सर्वर के बीच के सारा डेटा टीएलएस एन्क्रिप्शन से सुरक्षित होके जाला।' },
          { icon: '🛡️', title: 'पहुंच पर रोक', text: 'कंपनी के भीतर भी खाली उहे लोग राउर संवेदनशील डेटा देख सकेला जेकरा एकर काम बा, ओहू के पूरा रिकॉर्ड रखल जाला।' },
          { icon: '🔒', title: 'जानकारी के लुकावल', text: 'आधार नंबर अउर बैंक के खाता नंबर के बीच के अंक छुपा के रखल जाला अउर सार्वजनिक रूप से कखनो पूरा नंबर ना देखावल जाला।' },
          { icon: '📋', title: 'एपीआई सुरक्षा अउर निगरानी', text: 'वेबसाइट पर हमला रोके खातिर हमनी के एपीआई पर कड़ा पहरा अउर दर सीमा (रेट लिमिट) लगावल गइल बा।' },
          { icon: '🗄️', title: 'डेटाबेस के सुरक्षा', text: 'हमनी के डेटाबेस सुरक्षित नेटवर्क, रोज के बैकअप अउर बाहरी हमला रोके वाला सिस्टम के साथ राखल जाला।' },
          { icon: '📢', title: 'लीक होखे पर खबर', text: 'अगर कखनो डेटा लीक होखे के कवनो आशंका होई त हमनी तय समय के भीतर रउआ के अउर भारतीय डेटा सुरक्षा बोर्ड के खबर देब।' }
        ]
      },
      userRights: {
        title: '8. राउर अधिकार अउर पसंद',
        content: [
          'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 अउर भारत के बाकी गोपनीयता कानून के तहत राउर अपना डेटा पर नीचे दिहल गइल अधिकार बा:'
        ],
        rights: [
          { right: '🔍 जाने के अधिकार', text: 'रउआ ई पूछ सकेनी कि हमनी राउर कवन-कवन डेटा रखले बानी अउर ओकर कइसे इस्तेमाल हो रहल बा।' },
          { right: '✏️ सुधार के अधिकार', text: 'अगर राउर कवनो जानकारी गलत बा त रउआ ओकरा के सुधारे खातिर कह सकेनी। विक्रेता लोग अपना डैशबोर्ड से खुद भी सुधार कर सकेला।' },
          { right: '🗑️ मिटावे के अधिकार', text: 'रउआ अपना डेटा के मिटावे खातिर कह सकेनी। टैक्स चाहे कानूनी जरूरत के छोड़ के बाकी सारा डेटा हमनी मिटा देब।' },
          { right: '📤 डेटा ले जाए के अधिकार', text: 'रउआ अपना डेटा के मशीन से पढ़े लायक फाइल में माँगे के अधिकार बा ताकि रउआ ओकरा के कतही अउर ले जा सकीं।' },
          { right: '🚫 मंजूरी वापस लेवे के अधिकार', text: 'मंजूरी से कइल जा रहल कवनो भी काम (जइसे प्रचार के मैसेज) खातिर रउआ अपना मंजूरी कखनो भी वापस ले सकेनी।' },
          { right: '⚖️ शिकायत करे के अधिकार', text: 'अगर रउआ कवनो शिकायत बा त रउआ हमनी के शिकायत अधिकारी चाहे सरकार के डेटा सुरक्षा बोर्ड के शिकायत कर सकेनी।' },
          { right: '📵 मैसेज बंद करे के अधिकार', text: 'रउआ मैसेज में दिहल गइल लिंक से चाहे हमनी से कह के कखनो भी प्रचार के मैसेज बंद करवा सकेनी।' }
        ],
        warning: 'एह में से कवनो भी अधिकार के इस्तेमाल करे खातिर कृपया हमनी के शिकायत अधिकारी से privacy@biharkabazaar.com पर संपर्क करीं। हमनी 30 दिन के भीतर राउर बात के निपटारा कर देब।'
      },
      cookies: {
        title: '9. कुकीज़ अउर ट्रैकिंग',
        content: [
          'हमनी वेबसाइट के चलावे अउर राउर अनुभव के नीक बनावे खातिर कुकीज़ के इस्तेमाल करेनी। हमनी कवनो बाहरी कंपनी के प्रचार चाहे राउर पीछा करे वाला कुकीज़ के इस्तेमाल नईखीं करत।',
          'रउआ अपना ब्राउज़र के सेटिंग से कुकीज़ बंद कर सकेनी, बाकी ध्यान रहे कि कुकीज़ बंद कइला से विक्रेता डैशबोर्ड जइसन कुछ जरूरी चीज काम ना करी।'
        ],
        types: [
          { type: 'बेहद जरूरी कुकीज़', desc: 'ई वेबसाइट के चलावे खातिर जरूरी बा अउर बंद ना कइल जा सके। ई रउआ के लॉगिन रखेला अउर सुरक्षा के खतरा से बचावेला।' },
          { type: 'पसंद के कुकीज़', desc: 'ई राउर पसंद जइसे कि भाषा के याद रखेला ताकि रउआ के बार-बार बदलाव ना करे के पड़े।' },
          { type: 'जाँच के कुकीज़ (वैकल्पिक)', desc: 'ई हमनी के ई समझे में मदद करेला कि लोग वेबसाइट कइसे इस्तेमाल कर रहल बा ताकि हमनी वेबसाइट के अउर नीक बना सकीं।' }
        ]
      },
      children: {
        title: "10. लइका लोगन के गोपनीयता",
        content: [
          'बिहार का बाज़ार 18 साल से कम उम्र के लइका लोग खातिर नईखे। हमनी जानबूझ के लइका लोग के डेटा नईखीं बटोरत। अगर रउआ बुझाता कि राउर लइका गलती से कवनो जानकारी दे देले बा त हमनी के privacy@biharkabazaar.com पर ईमेल करीं, हमनी तुरंत ओकरा के मिटा देब।',
          'विक्रेता बने खातिर उम्र कम से कम 18 साल होखे के चाहीं अउर कानूनी रूप से अनुबंध (कॉन्ट्रैक्ट) करे के काबिल होखे के चाहीं।'
        ]
      },
      changes: {
        title: '11. नीति में बदलाव',
        content: [
          'हमनी अपना नियमन, तकनीक चाहे कानून के बदलाव के अनुसार समय-समय पर ए नीति में बदलाव कर सकीं। जब कवनो बड़ा बदलाव होई त हमनी:',
          '• पन्ना के सबसे ऊपर दिहल गइल लागू होखे के तारीख बदल देब।',
          '• विक्रेता लोग के बदलाव लागू होखे से कम से कम 14 दिन पहिले ईमेल चाहे मैसेज से खबर देब।',
          '• वेबसाइट के मुख्य पन्ना पर एकर एगो बैनर लगा देब।',
          'बदलाव के बाद भी वेबसाइट के इस्तेमाल जारी रखला के मतलब ई होई कि रउआ नया नियम के मानत बानी। रउआ सलाह दिहल जाला कि समय-समय पर ए पन्ना के देखत रहीं।'
        ]
      },
      contact: {
        title: '12. शिकायत अधिकारी अउर संपर्क',
        content: [
          'अगर ए नीति के बारे में कवनो भी सवाल, चिंता चाहे शिकायत होखे त रउआ हमनी के शिकायत अधिकारी से संपर्क कर सकेनी:'
        ],
        grievanceTitle: '📋 शिकायत अधिकारी',
        grievanceFields: [
          'नाम: जल्द आवे वाला बा',
          'ईमेल: privacy@biharkabazaar.com',
          'जवाब के समय: 30 दिन के भीतर'
        ],
        entityTitle: '🏢 रजिस्टर्ड संस्था',
        entityFields: [
          'कंपनी: बिंदिसा एग्रीटेक प्राइवेट लिमिटेड',
          'पता: गया, बिहार – 823001, भारत',
          'कोर्ट के क्षेत्र: खाली गया, बिहार के कोर्ट'
        ],
        governingLaw: '📌 लागू कानून: ई गोपनीयता नीति भारत के कानून के अनुसार काम करी, जेकरा में डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023; सूचना प्रौद्योगिकी अधिनियम, 2000; अउर ओकर संशोधन शामिल बा। कवनो भी विवाद खातिर कोर्ट के क्षेत्र खाली गया, बिहार होई।'
      }
    }
  }
};

const sectionStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  padding: '36px 40px',
  border: '1.5px solid #E8F5EC',
  boxShadow: '0 4px 24px rgba(27, 107, 58, 0.02)',
  scrollMarginTop: '100px',
};

const h2Style = {
  fontSize: 24,
  color: '#1B6B3A',
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  marginBottom: 16,
};

const pStyle = {
  fontSize: 15,
  color: '#4A3F35',
  lineHeight: 1.85,
  margin: '0 0 16px 0',
};

const lastPStyle = {
  fontSize: 15,
  color: '#4A3F35',
  lineHeight: 1.85,
  margin: 0,
};

const liStyle = {
  fontSize: 15,
  color: '#4A3F35',
  lineHeight: 1.8,
  marginBottom: 8,
};

function InfoCard({ color = '#E87B24', bgColor = '#FEFBF7', title, children }) {
  return (
    <div style={{ background: bgColor, padding: '20px 24px', borderRadius: 12, borderLeft: `4px solid ${color}`, marginBottom: 16 }}>
      {title && <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1A1410', marginBottom: 8, marginTop: 0 }}>{title}</h4>}
      <div style={{ fontSize: 14, color: '#5A504A', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState('en');
  const [activeSection, setActiveSection] = useState('introduction');

  const text = TRANSLATIONS[lang];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    SECTIONS_CONFIG.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getSectionTitle = (id) => {
    const translationKey = id === 'data-collection' ? 'dataCollection' : 
                           id === 'data-usage' ? 'dataUsage' :
                           id === 'data-sharing' ? 'dataSharing' :
                           id === 'data-retention' ? 'dataRetention' :
                           id === 'data-protection' ? 'dataProtection' :
                           id === 'user-rights' ? 'userRights' : id;
    return text.sections[translationKey]?.title || id;
  };

  return (
    <div style={{ background: '#FFFCF8', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

      {/* Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3B1E 0%, #1B6B3A 55%, #2D8F5A 100%)',
        padding: '80px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(232, 123, 36, 0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(27, 107, 58, 0.2)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255, 255, 255, 0.1)', padding: '8px 18px',
            borderRadius: '40px', color: '#A8E6C3', fontSize: 13, fontWeight: 600,
            marginBottom: 20, backdropFilter: 'blur(4px)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)'
          }}>
            <Shield size={14} /> Trust &amp; Safety
          </div>
          
          <h1 style={{ fontSize: 46, color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            {text.heroTitle}
          </h1>
          
          <p style={{ fontSize: 16, color: '#E2F3E9', lineHeight: 1.7, margin: '0 auto 12px', fontWeight: 300, maxWidth: 580 }}>
            {text.heroSubtitle}
          </p>
          
          <p style={{ fontSize: 14, color: '#A8D8BC', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
            {text.heroLegal}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px', display: 'flex', gap: 40, alignItems: 'flex-start' }}>

        {/* Sticky Left Sidebar Navigation */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          
          {/* Language Selector Box */}
          <div style={{
            background: '#ffffff', borderRadius: '20px',
            padding: '20px', border: '1.5px solid #E8F5EC',
            boxShadow: '0 4px 20px rgba(27, 107, 58, 0.04)',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, textTransform: 'uppercase', color: '#8C7B6E',
              letterSpacing: '1px', fontWeight: 700, marginBottom: 10,
            }}>
              <Globe size={13} /> {text.langSelectorLabel}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: lang === l.code ? '1.5px solid #1B6B3A' : '1.5px solid #EDF2EE',
                    background: lang === l.code ? '#F0FAF4' : '#FFFFFF',
                    color: lang === l.code ? '#1B6B3A' : '#4A3F35',
                    fontSize: 13,
                    fontWeight: lang === l.code ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (lang !== l.code) e.currentTarget.style.borderColor = '#E87B24';
                  }}
                  onMouseLeave={(e) => {
                    if (lang !== l.code) e.currentTarget.style.borderColor = '#EDF2EE';
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            position: 'sticky', top: '100px',
            background: '#ffffff', borderRadius: '20px',
            padding: '24px 16px', border: '1.5px solid #E8F5EC',
            boxShadow: '0 4px 20px rgba(27, 107, 58, 0.04)',
          }}>
            <h4 style={{ fontSize: 11, textTransform: 'uppercase', color: '#8C7B6E', letterSpacing: '1.5px', fontWeight: 700, marginBottom: 16, paddingLeft: 10 }}>
              {text.tocTitle}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SECTIONS_CONFIG.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '10px 12px', borderRadius: '10px',
                      border: 'none', background: isActive ? '#E8F5EC' : 'transparent',
                      color: isActive ? '#1B6B3A' : '#4A3F35',
                      fontWeight: isActive ? 700 : 400,
                      fontSize: 13, textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.18s ease', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) { e.currentTarget.style.background = '#FEF9F3'; e.currentTarget.style.color = '#C0621A'; }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A3F35'; }
                    }}
                  >
                    <sec.icon size={14} style={{ color: isActive ? '#1B6B3A' : '#A0948B', flexShrink: 0 }} />
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      width: '100%'
                    }}>
                      {getSectionTitle(sec.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 28, width: '100%', overflow: 'hidden' }}>

          {/* 1. Introduction */}
          <div id="introduction" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.introduction.title}</h2>
            {text.sections.introduction.content.map((p, idx) => (
              <p key={idx} style={idx === text.sections.introduction.content.length - 1 ? lastPStyle : pStyle}>
                {p}
              </p>
            ))}
          </div>

          {/* 2. Scope & Applicability */}
          <div id="scope" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.scope.title}</h2>
            {text.sections.scope.content.map((p, idx) => {
              const isBullet = p.startsWith('•');
              return (
                <p key={idx} style={{
                  ...pStyle,
                  paddingLeft: isBullet ? 16 : 0,
                  marginBottom: idx === text.sections.scope.content.length - 1 ? 0 : 12
                }}>
                  {p}
                </p>
              );
            })}
          </div>

          {/* 3. Information We Collect */}
          <div id="data-collection" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.dataCollection.title}</h2>
            {text.sections.dataCollection.content.map((p, idx) => (
              <p key={idx} style={pStyle}>{p}</p>
            ))}
            
            {text.sections.dataCollection.cards.map((card, idx) => {
              const colors = ['#E87B24', '#1B6B3A', '#D4891A'];
              const bgColors = ['#FEFBF7', '#F4FAF6', '#FFFDF5'];
              return (
                <InfoCard key={idx} color={colors[idx]} bgColor={bgColors[idx]} title={card.title}>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                    {card.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: 13, color: '#5A504A', lineHeight: 1.7 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </InfoCard>
              );
            })}
          </div>

          {/* 4. How We Use Information */}
          <div id="data-usage" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.dataUsage.title}</h2>
            <p style={pStyle}>{text.sections.dataUsage.content[0]}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {text.sections.dataUsage.grid.map((item, idx) => (
                <div key={idx} style={{ background: '#FAFEFA', border: '1.5px solid #E0F0E7', borderRadius: 12, padding: '16px 18px' }}>
                  <h5 style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 6, marginTop: 0 }}>{item.title}</h5>
                  <p style={{ fontSize: 13, color: '#6A6058', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
            
            <p style={lastPStyle}>{text.sections.dataUsage.content[1]}</p>
          </div>

          {/* 5. Sharing & Disclosure */}
          <div id="data-sharing" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.dataSharing.title}</h2>
            <p style={pStyle}>{text.sections.dataSharing.content[0]}</p>
            
            <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
              {text.sections.dataSharing.content.slice(1).map((li, idx) => (
                <li key={idx} style={liStyle}>{li.replace('• ', '')}</li>
              ))}
            </ul>

            <InfoCard color="#E87B24" bgColor="#FFF8F0">
              {text.sections.dataSharing.note}
            </InfoCard>
          </div>

          {/* 6. Data Retention */}
          <div id="data-retention" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.dataRetention.title}</h2>
            <p style={pStyle}>{text.sections.dataRetention.content[0]}</p>

            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1.5px solid #E0EDE4', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#F0FAF4', borderBottom: '2px solid #D0EBD8' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'left', color: '#1B6B3A', fontWeight: 700 }}>
                      {text.sections.dataRetention.tableHeaders[0]}
                    </th>
                    <th style={{ padding: '14px 18px', textAlign: 'left', color: '#1B6B3A', fontWeight: 700 }}>
                      {text.sections.dataRetention.tableHeaders[1]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {text.sections.dataRetention.tableRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #EDF5EF', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFDF9' }}>
                      <td style={{ padding: '12px 18px', color: '#3A3028', fontWeight: 500 }}>{row[0]}</td>
                      <td style={{ padding: '12px 18px', color: '#5A5048' }}>{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={lastPStyle}>{text.sections.dataRetention.content[1]}</p>
          </div>

          {/* 7. Security Measures */}
          <div id="data-protection" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.dataProtection.title}</h2>
            <p style={pStyle}>{text.sections.dataProtection.content[0]}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {text.sections.dataProtection.grid.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: '#F7FBF8', borderRadius: 12, border: '1px solid #E0EDE4' }}>
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: '#1A1410', marginBottom: 4, marginTop: 0 }}>{item.title}</h5>
                    <p style={{ fontSize: 13, color: '#6A6058', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p style={lastPStyle}>{text.sections.dataProtection.content[1]}</p>
          </div>

          {/* 8. Your Rights & Choices */}
          <div id="user-rights" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.userRights.title}</h2>
            <p style={pStyle}>{text.sections.userRights.content[0]}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {text.sections.userRights.rights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, padding: '14px 18px', border: '1.5px solid #E8F0EC', borderRadius: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1B6B3A', minWidth: 160, flexShrink: 0 }}>{item.right}</span>
                  <p style={{ fontSize: 14, color: '#5A504A', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 14, color: '#7A7067', marginTop: 20, padding: '14px 18px', background: '#FEFDF8', borderRadius: 10, border: '1px dashed #D4C89A', marginBottom: 0 }}>
              {text.sections.userRights.warning}
            </p>
          </div>

          {/* 9. Cookies & Tracking Technologies */}
          <div id="cookies" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.cookies.title}</h2>
            <p style={pStyle}>{text.sections.cookies.content[0]}</p>

            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              {text.sections.cookies.types.map((item, idx) => (
                <div key={idx} style={{ padding: '14px 18px', borderRadius: 10, background: '#F8FAF8', border: '1px solid #DCEBDf' }}>
                  <h5 style={{ fontSize: 14, fontWeight: 700, color: '#1B6B3A', marginBottom: 6, marginTop: 0 }}>{item.type}</h5>
                  <p style={{ fontSize: 13, color: '#6A6058', margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <p style={lastPStyle}>{text.sections.cookies.content[1]}</p>
          </div>

          {/* 10. Children's Privacy */}
          <div id="children" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.children.title}</h2>
            <p style={pStyle}>{text.sections.children.content[0]}</p>
            <p style={lastPStyle}>{text.sections.children.content[1]}</p>
          </div>

          {/* 11. Changes to This Policy */}
          <div id="changes" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.changes.title}</h2>
            {text.sections.changes.content.map((p, idx) => {
              const isBullet = p.startsWith('•');
              return (
                <p key={idx} style={{
                  ...pStyle,
                  paddingLeft: isBullet ? 16 : 0,
                  marginBottom: idx === text.sections.changes.content.length - 1 ? 0 : 12
                }}>
                  {p}
                </p>
              );
            })}
          </div>

          {/* 12. Grievance Officer & Contact */}
          <div id="contact" style={sectionStyle}>
            <h2 style={h2Style}>{text.sections.contact.title}</h2>
            <p style={pStyle}>{text.sections.contact.content[0]}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={{ background: '#F0FAF4', padding: '24px 28px', borderRadius: 16, border: '1.5px solid #C8E8D4' }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1B6B3A', marginBottom: 14, marginTop: 0 }}>
                  {text.sections.contact.grievanceTitle}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {text.sections.contact.grievanceFields.map((field, idx) => (
                    <span key={idx} style={{ fontSize: 14, color: '#3A3028' }}>
                      <strong>{field.split(': ')[0]}:</strong> {field.split(': ')[1]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ background: '#FFF8F2', padding: '24px 28px', borderRadius: 16, border: '1.5px solid #EDD5B8' }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#C0621A', marginBottom: 14, marginTop: 0 }}>
                  {text.sections.contact.entityTitle}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {text.sections.contact.entityFields.map((field, idx) => (
                    <span key={idx} style={{ fontSize: 14, color: '#3A3028' }}>
                      <strong>{field.split(': ')[0]}:</strong> {field.split(': ')[1]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#FEFDF8', padding: '18px 24px', borderRadius: 12, border: '1.5px solid #D4C89A', fontSize: 14, color: '#5A5048', lineHeight: 1.7 }}>
              {text.sections.contact.governingLaw}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
