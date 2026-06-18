from flask import Blueprint, request
from datetime import datetime
from sqlalchemy import or_
from app import db, mail, limiter
from app.models.content import (Service, PortfolioProject, Testimonial,
                                 TeamMember, BlogPost, BlogCategory,
                                 ContactMessage, JobPosting, JobApplication)
from app.utils import ok, err, created, paginate

public_bp = Blueprint('public', __name__)


# ── Services ──────────────────────────────────────────────────────────
@public_bp.get('/services')
def list_services():
    services = Service.query.filter_by(is_active=True).order_by(Service.order).all()
    return ok('Success', [s.to_dict() for s in services])

@public_bp.get('/services/<slug>')
def get_service(slug):
    s = Service.query.filter_by(slug=slug, is_active=True).first_or_404()
    return ok('Success', s.to_dict())


# ── Portfolio ─────────────────────────────────────────────────────────
@public_bp.get('/portfolio')
def list_portfolio():
    page     = request.args.get('page', 1, type=int)
    category = request.args.get('category')
    featured = request.args.get('featured')
    q = PortfolioProject.query.filter_by(is_active=True)
    if category: q = q.filter_by(category=category)
    if featured: q = q.filter_by(is_featured=True)
    q = q.order_by(PortfolioProject.completed_at.desc())
    items, pagination = paginate(q, page)   # ✅ tuple unpack
    return ok('Success', [p.to_dict() for p in items], pagination=pagination)

@public_bp.get('/portfolio/<slug>')
def get_project(slug):
    p = PortfolioProject.query.filter_by(slug=slug, is_active=True).first_or_404()
    return ok('Success', p.to_dict(detail=True))


# ── Testimonials ──────────────────────────────────────────────────────
@public_bp.get('/testimonials')
def list_testimonials():
    t = Testimonial.query.filter_by(is_active=True).order_by(Testimonial.order).all()
    return ok('Success', [x.to_dict() for x in t])


# ── Team ──────────────────────────────────────────────────────────────
@public_bp.get('/team')
def list_team():
    team = TeamMember.query.filter_by(is_active=True).order_by(TeamMember.order).all()
    return ok('Success', [m.to_dict() for m in team])


# ── Blog ──────────────────────────────────────────────────────────────
@public_bp.get('/blog')
def list_blog():
    page     = request.args.get('page', 1, type=int)
    category = request.args.get('category')
    search   = request.args.get('search')
    q = BlogPost.query.filter_by(is_published=True)
    if category:
        cat = BlogCategory.query.filter_by(slug=category).first()
        if cat: q = q.filter_by(category_id=cat.id)
    if search:
        term = f'%{search}%'
        q = q.filter(or_(BlogPost.title.ilike(term), BlogPost.excerpt.ilike(term)))
    q = q.order_by(BlogPost.published_at.desc())
    items, pagination = paginate(q, page, 9)   # ✅ tuple unpack
    return ok('Success', [p.to_dict() for p in items], pagination=pagination)

@public_bp.get('/blog/<slug>')
def get_post(slug):
    p = BlogPost.query.filter_by(slug=slug, is_published=True).first_or_404()
    p.views += 1
    db.session.commit()
    return ok('Success', p.to_dict(detail=True))

@public_bp.get('/blog/categories')
def blog_categories():
    cats = BlogCategory.query.all()
    return ok('Success', [c.to_dict() for c in cats])


# ── Contact ───────────────────────────────────────────────────────────
@public_bp.post('/contact')
@limiter.limit('5 per hour')
def contact():
    d = request.get_json() or {}
    required = ['name', 'email', 'message']
    if not all(d.get(f) for f in required):
        return err('Name, email and message are required')
    msg = ContactMessage(
        name    = d['name'].strip(),
        email   = d['email'].lower().strip(),
        phone   = d.get('phone', ''),
        company = d.get('company', ''),
        service = d.get('service', ''),
        budget  = d.get('budget', ''),
        message = d['message'].strip(),
    )
    db.session.add(msg)
    db.session.commit()

    try:
        from flask_mail import Message as MailMsg
        m = MailMsg(
            subject    = f'New Enquiry from {msg.name} — Davion Technologies',
            recipients = [mail.default_sender],
            body       = f'Name: {msg.name}\nEmail: {msg.email}\nPhone: {msg.phone}\nCompany: {msg.company}\nService: {msg.service}\nBudget: {msg.budget}\n\n{msg.message}'
        )
        mail.send(m)
    except:
        pass
    return created("Message received! We'll be in touch within 24 hours.")


# ── Jobs ──────────────────────────────────────────────────────────────
@public_bp.get('/jobs')
def list_jobs():
    jobs = JobPosting.query.filter_by(is_active=True).order_by(JobPosting.created_at.desc()).all()
    return ok('Success', [j.to_dict() for j in jobs])

@public_bp.post('/jobs/<int:job_id>/apply')
@limiter.limit('3 per hour')
def apply(job_id):
    d   = request.get_json() or {}
    job = JobPosting.query.filter_by(id=job_id, is_active=True).first_or_404()
    if not all([d.get('name'), d.get('email')]):
        return err('Name and email required')
    application = JobApplication(
        job_id       = job_id,
        name         = d['name'],
        email        = d['email'],
        phone        = d.get('phone', ''),
        cover_letter = d.get('cover_letter', ''),
        resume_url   = d.get('resume_url', ''),
    )
    db.session.add(application)
    db.session.commit()
    return created('Application submitted successfully!')


# ── Stats ─────────────────────────────────────────────────────────────
@public_bp.get('/stats')
def stats():
    return ok('Success', {
        'projects':     PortfolioProject.query.filter_by(is_active=True).count(),
        'clients':      48,
        'years':        5,
        'team_size':    12,
        'satisfaction': 98,
    })