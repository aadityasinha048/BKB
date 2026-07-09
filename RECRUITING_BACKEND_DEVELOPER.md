About the Project:
We are building Bihar Ka Bazaar (BKB), a modern e-commerce platform that connects local artisans, weavers, and farmers in Bihar with buyers across India. The application's frontend and current API endpoints are built using Next.js (App Router) and React.

Currently, the application stores data locally via JSON flat files. We are looking for an experienced backend developer to migrate our storage system to a production-ready database (MongoDB or PostgreSQL) and help us secure and scale our multi-step Seller Registration System.

---

Key Deliverables:

Milestone 1: Database Migration (SQL or NoSQL)
* Analyze the current JSON flat-file storage structure and choose the best database (MongoDB or PostgreSQL).
* Migrate data models (Sellers, Prelaunch Signups, Sessions, and System Logs) to the new database.
* Refactor our existing Data Abstraction Layer (DAL) in /lib/db.js so that our API routes continue to work with zero-to-minimal changes.

Milestone 2: Secure Seller Registration Flow
Refine and secure our existing multi-step registration wizard:
* Step 1: Verify contact info using a real OTP service (e.g., Twilio, Msg91).
* Step 2: Store verified location data (Districts, PIN codes, etc.).
* Step 3: Handle business classification and capacity inputs.
* Step 4: Securely collect bank credentials, UPI IDs, and implement validation for GST/PAN and Aadhaar card details.
* Save & Resume: Build secure progress-saving so sellers can resume filling out the form using their generated Seller ID and OTP.

Milestone 3: Security & Logging
* Securely encrypt sensitive fields (bank details, Aadhaar).
* Add structured error logging and an audit trail for admin actions.

---

Required Technical Stack:
* Next.js 14+ (App Router) & React.js
* Node.js (backend API routes)
* Databases: MongoDB / PostgreSQL (Schema design, indexing, connection pooling)
* Security: Data encryption, secure handling of PII data, input validation
* APIs: REST, integration of SMS gateways (Twilio/Msg91) and KYC verification APIs

---

How to Apply (Screening Question):
To ensure you have actually read this description and are not a bot bidding automatically, please start your proposal with the answer to this question:
"What database (MongoDB or PostgreSQL) would you recommend for an e-commerce platform scaling up from JSON files, and why?"

(Note: Automated/AI-generated bids that do not answer this question will be ignored immediately.)
