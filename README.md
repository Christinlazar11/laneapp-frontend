# Learner's Licence Application Portal

A full-stack application for users to submit documents for a learner's licence and for admins to review, approve, or reject applications.

## Features

- **User Side:**
  - Responsive, accessible application form
  - Real-time and on-submit validation
  - File uploads (Aadhaar, Photograph, Signature) via Cloudinary
  - Save as draft (client-side)
  - Confirmation and error feedback

- **Admin Side:**
  - Secure login (JWT-based)
  - Dashboard with sortable/filterable submissions table
  - Review dialog with document previews
  - Status change (Pending, Approved, Rejected) with restrictions
  - Internal notes (optional, extendable)
  - Logout and protected routes

## Tech Stack
- React + TypeScript + Vite
- Material UI (MUI) for UI/UX
- Axios for API calls
- Cloudinary for file uploads
- Environment variables for config

## Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd my-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root with:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
   ```
   - Get Cloudinary values from your Cloudinary dashboard.
   - Set your backend API base URL as needed.

4. **Run the app:**
   ```bash
   npm run dev
   ```

## File Uploads
- Files are uploaded directly to Cloudinary from the frontend.
- Only the secure URLs are sent to the backend.
- File type and size are validated client-side.

## Mailer
- Email notifications are mocked in the frontend (console log).
- For production, implement real email sending in the backend.

## Edge Cases & Error Handling
- Cannot save empty drafts.
- Cannot submit invalid or incomplete forms.
- All API/file upload errors show user feedback.
- Admin cannot change status if already rejected.
- Protected routes for admin dashboard and login.
- Responsive and mobile-friendly design.

## Ownership
- All async calls use try/catch and show errors.
- Code is modular, clean, and well-typed.
- All major edge cases are handled.

## Contributing
PRs and issues welcome!

---

**Built with product thinking, code quality, and user experience in mind.**
