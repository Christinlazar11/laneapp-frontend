import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Select, MenuItem, InputLabel, FormControl, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import api from '../api/axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';

const statusOptions = ['pending', 'approved', 'rejected'];

type Order = 'asc' | 'desc';

type Submission = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dob: string;
  address: string;
  aadhaar: string;
  photograph: string;
  signature: string;
  submissionId: string;
  timestamp: string;
  status: string;
  __v: number;
};

const AdminDashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Submission>('timestamp');
  const [order, setOrder] = useState<Order>('desc');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    api.get('/admin/submissions')
      .then(res => {
        setSubmissions(res.data.submissionData)})
      .catch(() => setSubmissions([]));
  }, []);

  // Filtering and sorting logic
  const filteredData = useMemo(() => {
    let data = [...submissions];
    if (statusFilter) {
      data = data.filter((s) => s.status === statusFilter);
    }
    if (nameFilter) {
      data = data.filter((s) => s.fullName.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    data.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      if (orderBy === 'timestamp' || orderBy === 'dob') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [submissions, statusFilter, nameFilter, orderBy, order]);

  const handleSort = (property: keyof Submission) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubmission(null);
  };

  const handleStatusChange = async (e: SelectChangeEvent<string>) => {
    if (!selectedSubmission) return;
    const newStatus = e.target.value;
    setStatusUpdating(true);
    try {
      await api.patch(`/admin/submissions/${selectedSubmission._id}/status`, { status: newStatus });
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      setSubmissions((prev) => prev.map(s => s._id === selectedSubmission._id ? { ...s, status: newStatus } : s));
      setSnackbarMsg('Status updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMsg('Failed to update status.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 1200, mx: 'auto', p: 4, mt: 0, pt: 2 }}>
      <Typography variant="h4" gutterBottom>Submission Dashboard</Typography>
      <Box mt={2} mb={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Filter by Name"
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
          />
        </Stack>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fullName'}
                  direction={orderBy === 'fullName' ? order : 'asc'}
                  onClick={() => handleSort('fullName')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleSort('timestamp')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  <Chip
                    label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    color={
                      row.status === 'approved'
                        ? 'success'
                        : row.status === 'pending'
                        ? 'primary'
                        : row.status === 'rejected'
                        ? 'warning'
                        : 'default'
                    }
                    sx={{ fontWeight: 600, fontSize: 14 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => handleReview(row)}>
                    Review
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No submissions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Submission Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box>
              <Typography variant="subtitle1"><b>Name:</b> {selectedSubmission.fullName}</Typography>
              <Typography variant="subtitle1"><b>Email:</b> {selectedSubmission.email}</Typography>
              <Typography variant="subtitle1"><b>Phone:</b> {selectedSubmission.phoneNumber}</Typography>
              <Typography variant="subtitle1"><b>Date of Birth:</b> {new Date(selectedSubmission.dob).toLocaleDateString()}</Typography>
              <Typography variant="subtitle1"><b>Address:</b> {selectedSubmission.address}</Typography>
              <Box mt={2} mb={2}>
                <FormControl sx={{ minWidth: 200 }} disabled={statusUpdating || selectedSubmission.status === 'rejected' || selectedSubmission.status === 'approved'}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedSubmission.status}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Typography variant="subtitle1"><b>Submission ID:</b> {selectedSubmission.submissionId}</Typography>
              <Typography variant="subtitle1"><b>Timestamp:</b> {new Date(selectedSubmission.timestamp).toLocaleString()}</Typography>
              <Box mt={2}>
                <Typography variant="subtitle1"><b>Aadhaar:</b> <Link href={selectedSubmission.aadhaar} target="_blank" rel="noopener">View</Link></Typography>
                <Typography variant="subtitle1"><b>Photograph:</b> <Link href={selectedSubmission.photograph} target="_blank" rel="noopener">View</Link></Typography>
                <Typography variant="subtitle1"><b>Signature:</b> <Link href={selectedSubmission.signature} target="_blank" rel="noopener">View</Link></Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
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
    </Paper>
  );
};

export default AdminDashboard; 