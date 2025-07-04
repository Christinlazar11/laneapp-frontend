import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';
import type { ApplicationFormData } from '../types';
import { isAdult, isValidFileType, isValidFileSize } from '../utils/validation';
import api from '../api/axios';
import { uploadToCloudinary } from '../api/cloudinary';
import LoadingButton from '@mui/lab/LoadingButton';

const initialForm: ApplicationFormData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  dob: '',
  address: '',
  aadhaar: null,
  photograph: null,
  signature: null,
};

const allowedAadhaarTypes = ['application/pdf', 'image/png', 'image/jpeg'];
const allowedPhotoTypes = ['image/png', 'image/jpeg'];
const allowedSignatureTypes = ['image/png', 'image/jpeg'];
const maxFileSizeMB = 2;

const DRAFT_KEY = 'll_app_draft';

const ApplicationForm: React.FC = () => {
  const [form, setForm] = useState<ApplicationFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setForm({ ...initialForm, ...JSON.parse(draft) });
    }
  }, []);

  // Helper: validate a single field
  const validateField = (name: keyof ApplicationFormData, value: string | File | null): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) return 'Full Name is required (min 2 characters).';
        break;
      case 'phoneNumber':
        if (!value || typeof value !== 'string') return 'Phone Number is required.';
        if (!/^\d{10}$/.test(value)) return 'Phone Number must be 10 digits.';
        break;
      case 'email':
        if (!value || typeof value !== 'string') return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email address.';
        break;
      case 'dob':
        if (!value || typeof value !== 'string') return 'Date of Birth is required.';
        if (!isAdult(value)) return 'You must be at least 18 years old.';
        break;
      case 'address':
        if (!value || typeof value !== 'string' || value.trim().length < 5) return 'Address is required (min 5 characters).';
        break;
      case 'aadhaar':
        if (!value) return 'Aadhaar is required.';
        break;
      case 'photograph':
        if (!value) return 'Photograph is required.';
        break;
      case 'signature':
        if (!value) return 'Signature is required.';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Validate this field
    const error = validateField(name as keyof ApplicationFormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (name: keyof ApplicationFormData, allowedTypes: string[], maxSize: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      let error = '';
      if (file) {
        if (!isValidFileType(file, allowedTypes)) {
          error = 'Invalid file type.';
        } else if (!isValidFileSize(file, maxSize)) {
          error = 'File size exceeds 2MB.';
        }
      } else {
        error = validateField(name, null);
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
      setForm((prev) => ({ ...prev, [name]: error ? null : file }));
    };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    // Full Name: required, min 2 chars
    if (!form.fullName || form.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name is required (min 2 characters).';
    }
    // Phone Number: required, 10 digits
    if (!form.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits.';
    }
    // Email: required, valid format
    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Invalid email address.';
    }
    // DOB: required, age >= 18
    if (!form.dob) {
      newErrors.dob = 'Date of Birth is required.';
    } else if (!isAdult(form.dob)) {
      newErrors.dob = 'You must be at least 18 years old.';
    }
    // Address: required, min 5 chars
    if (!form.address || form.address.trim().length < 5) {
      newErrors.address = 'Address is required (min 5 characters).';
    }
    // Aadhaar: required
    if (!form.aadhaar) newErrors.aadhaar = 'Aadhaar is required.';
    // Photograph: required
    if (!form.photograph) newErrors.photograph = 'Photograph is required.';
    // Signature: required
    if (!form.signature) newErrors.signature = 'Signature is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    setSuccessMsg('Draft saved!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // 1. Upload files to Cloudinary and get URLs
      const aadhaarUrl = form.aadhaar
        ? await uploadToCloudinary(form.aadhaar)
        : '';
      const photographUrl = form.photograph
        ? await uploadToCloudinary(form.photograph)
        : '';
      const signatureUrl = form.signature
        ? await uploadToCloudinary(form.signature)
        : '';

      // 2. Prepare data to send to backend (no files, just URLs)
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        dob: form.dob,
        address: form.address,
        aadhaar: aadhaarUrl,
        photograph: photographUrl,
        signature: signatureUrl,
        timeStamp: Date.now(),
      };
      console.log(payload)
      const response = await api.post('/user/submission', payload);
      const data = response.data;

      if (data.save === true) {
        setSnackbarMsg('Data has been saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        localStorage.removeItem(DRAFT_KEY);
        setSubmitting(false);
        setForm(initialForm)
        return;
      }
      if (data.ageLessthan18) {
        setSnackbarMsg('You must be at least 18 years old.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSubmitting(false);
        setForm(initialForm)
        return;
      }
      if (data.existing) {
        setSnackbarMsg('Data already submitted.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSubmitting(false);
        setForm(initialForm)
        return;
      }

      setSubmitting(false);
    } catch {
      setSubmitting(false);
      setSnackbarMsg('An error occurred. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setForm(initialForm)
    }
  };

  // Helper: check if any field has data
  const isFormEmpty = () => {
    return (
      !form.fullName &&
      !form.phoneNumber &&
      !form.email &&
      !form.dob &&
      !form.address &&
      !form.aadhaar &&
      !form.photograph &&
      !form.signature
    );
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: { xs: '100%', sm: 400, md: 420 },
          mx: 'auto',
          p: { xs: 1, sm: 2, md: 2 },
          mt: { xs: 0, sm: 1, md: 0 },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Learner's Licence Application
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={1.5}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              error={!!errors.address}
              helperText={errors.address}
              multiline
              minRows={2}
              fullWidth
            />
            <Button
              variant="outlined"
              component="label"
              color={errors.aadhaar ? 'error' : 'primary'}
              fullWidth
            >
              Upload Aadhaar (PDF/PNG/JPEG)
              <input
                type="file"
                hidden
                accept={allowedAadhaarTypes.join(',')}
                onChange={handleFileChange('aadhaar', allowedAadhaarTypes, maxFileSizeMB)}
              />
            </Button>
            {form.aadhaar && <Typography variant="body2">Selected: {form.aadhaar.name}</Typography>}
            {errors.aadhaar && <Alert severity="error">{errors.aadhaar}</Alert>}

            <Button
              variant="outlined"
              component="label"
              color={errors.photograph ? 'error' : 'primary'}
              fullWidth
            >
              Upload Photograph (PNG/JPEG)
              <input
                type="file"
                hidden
                accept={allowedPhotoTypes.join(',')}
                onChange={handleFileChange('photograph', allowedPhotoTypes, maxFileSizeMB)}
              />
            </Button>
            {form.photograph && <Typography variant="body2">Selected: {form.photograph.name}</Typography>}
            {errors.photograph && <Alert severity="error">{errors.photograph}</Alert>}

            <Button
              variant="outlined"
              component="label"
              color={errors.signature ? 'error' : 'primary'}
              fullWidth
            >
              Upload Signature (PNG/JPEG)
              <input
                type="file"
                hidden
                accept={allowedSignatureTypes.join(',')}
                onChange={handleFileChange('signature', allowedSignatureTypes, maxFileSizeMB)}
              />
            </Button>
            {form.signature && <Typography variant="body2">Selected: {form.signature.name}</Typography>}
            {errors.signature && <Alert severity="error">{errors.signature}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
              <Button
                variant="outlined"
                onClick={handleSaveDraft}
                disabled={submitting || isFormEmpty()}
                fullWidth
              >
                Save as Draft
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={submitting}
                fullWidth
              >
                Submit
              </LoadingButton>
            </Stack>
            {successMsg && <Alert severity="info">{successMsg}</Alert>}
          </Stack>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ApplicationForm; 