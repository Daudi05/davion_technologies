import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({ baseURL: BASE, timeout: 15000 });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('dv_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r => r, async err => {
  const orig = err.config;
  if (err.response?.status === 401 && !orig._retry) {
    orig._retry = true;
    const ref = localStorage.getItem('dv_refresh');
    if (ref) {
      try {
        const res = await axios.post(`${BASE}/auth/refresh`,{},{ headers:{ Authorization:`Bearer ${ref}` } });
        const tok = res.data.data.access_token;
        localStorage.setItem('dv_token', tok);
        orig.headers.Authorization = `Bearer ${tok}`;
        return api(orig);
      } catch { localStorage.clear(); window.location.href = '/admin/login'; }
    }
  }
  return Promise.reject(err.response?.data?.message || err.message || 'Request failed');
});
export default api;

export const publicApi = {
  services:     () => api.get('/public/services'),
  service:      slug => api.get(`/public/services/${slug}`),
  portfolio:    p => api.get('/public/portfolio', { params: p }),
  project:      slug => api.get(`/public/portfolio/${slug}`),
  testimonials: () => api.get('/public/testimonials'),
  team:         () => api.get('/public/team'),
  blog:         p => api.get('/public/blog', { params: p }),
  post:         slug => api.get(`/public/blog/${slug}`),
  blogCats:     () => api.get('/public/blog/categories'),
  contact:      d => api.post('/public/contact', d),
  jobs:         () => api.get('/public/jobs'),
  apply:        (id, d) => api.post(`/public/jobs/${id}/apply`, d),
  stats:        () => api.get('/public/stats'),
};

export const adminApi = {
  login:          d => api.post('/auth/login', d),
  me:             () => api.get('/auth/me'),
  dashboard:      () => api.get('/admin/dashboard'),
  messages:       p => api.get('/admin/messages', { params: p }),
  markRead:       id => api.patch(`/admin/messages/${id}/read`),
  portfolio:      p => api.get('/admin/portfolio', { params: p }),
  createProject:  d => api.post('/admin/portfolio', d),
  updateProject:  (id,d) => api.put(`/admin/portfolio/${id}`, d),
  deleteProject:  id => api.delete(`/admin/portfolio/${id}`),
  services:       () => api.get('/admin/services'),
  createService:  d => api.post('/admin/services', d),
  updateService:  (id,d) => api.put(`/admin/services/${id}`, d),
  deleteService:  id => api.delete(`/admin/services/${id}`),
  blog:           p => api.get('/admin/blog', { params: p }),
  createPost:     d => api.post('/admin/blog', d),
  updatePost:     (id,d) => api.put(`/admin/blog/${id}`, d),
  deletePost:     id => api.delete(`/admin/blog/${id}`),
  testimonials:   () => api.get('/admin/testimonials'),
  createTestimonial: d => api.post('/admin/testimonials', d),
  deleteTestimonial: id => api.delete(`/admin/testimonials/${id}`),
  jobs:           () => api.get('/admin/jobs'),
  createJob:      d => api.post('/admin/jobs', d),
  deleteJob:      id => api.delete(`/admin/jobs/${id}`),
  applications:   () => api.get('/admin/applications'),
  upload:         f => { const fd = new FormData(); fd.append('file',f); return api.post('/uploads',fd,{headers:{'Content-Type':'multipart/form-data'}}); },
};
