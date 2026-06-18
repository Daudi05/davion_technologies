from flask import Blueprint, request
from datetime import datetime
from app import db
from app.models.content import (Service, PortfolioProject, Testimonial,
                                 TeamMember, BlogPost, BlogCategory,
                                 ContactMessage, JobPosting, JobApplication)
from app.utils import ok, err, created, require_admin, paginate

admin_bp = Blueprint('admin', __name__)


# ── Dashboard ─────────────────────────────────────────────────────────
@admin_bp.get('/dashboard')
@require_admin
def dashboard():
    return ok({
        'projects':    PortfolioProject.query.count(),
        'messages':    ContactMessage.query.count(),
        'unread':      ContactMessage.query.filter_by(is_read=False).count(),
        'posts':       BlogPost.query.count(),
        'applications':JobApplication.query.count(),
        'testimonials':Testimonial.query.count(),
    })


# ── Services CRUD ─────────────────────────────────────────────────────
@admin_bp.get('/services')
@require_admin
def list_services():
    services = Service.query.order_by(Service.order).all()
    return ok([s.to_dict() for s in services])

@admin_bp.post('/services')
@require_admin
def create_service():
    d = request.get_json() or {}
    if not d.get('title'): return err('Title required')
    s = Service(
        title=d['title'], slug=d.get('slug', d['title'].lower().replace(' ','-')),
        icon=d.get('icon',''), short_desc=d.get('short_desc',''),
        long_desc=d.get('long_desc',''), features=d.get('features',[]),
        price_from=d.get('price_from',''), order=d.get('order',0),
    )
    db.session.add(s); db.session.commit()
    return created(s.to_dict())

@admin_bp.put('/services/<int:sid>')
@require_admin
def update_service(sid):
    s = Service.query.get_or_404(sid)
    d = request.get_json() or {}
    for f in ['title','slug','icon','short_desc','long_desc','features','price_from','order','is_active']:
        if f in d: setattr(s, f, d[f])
    db.session.commit()
    return ok(s.to_dict())

@admin_bp.delete('/services/<int:sid>')
@require_admin
def delete_service(sid):
    s = Service.query.get_or_404(sid)
    db.session.delete(s); db.session.commit()
    return ok(message='Deleted')


# ── Portfolio CRUD ────────────────────────────────────────────────────
@admin_bp.get('/portfolio')
@require_admin
def list_portfolio():
    page   = request.args.get('page', 1, type=int)
    result = paginate(PortfolioProject.query.order_by(PortfolioProject.created_at.desc()), page, 15)
    return ok([p.to_dict() for p in result['items']],
              pagination={k: result[k] for k in ['total','page','pages']})

@admin_bp.post('/portfolio')
@require_admin
def create_project():
    d = request.get_json() or {}
    if not d.get('title'): return err('Title required')
    p = PortfolioProject(
        title=d['title'], slug=d.get('slug', d['title'].lower().replace(' ','-')),
        client=d.get('client',''), category=d.get('category',''),
        summary=d.get('summary',''), description=d.get('description',''),
        challenge=d.get('challenge',''), solution=d.get('solution',''),
        outcome=d.get('outcome',''), technologies=d.get('technologies',[]),
        cover_image=d.get('cover_image',''), images=d.get('images',[]),
        url=d.get('url',''), is_featured=d.get('is_featured',False),
    )
    db.session.add(p); db.session.commit()
    return created(p.to_dict(detail=True))

@admin_bp.put('/portfolio/<int:pid>')
@require_admin
def update_project(pid):
    p = PortfolioProject.query.get_or_404(pid)
    d = request.get_json() or {}
    for f in ['title','slug','client','category','summary','description','challenge',
              'solution','outcome','technologies','cover_image','images','url',
              'is_featured','is_active']:
        if f in d: setattr(p, f, d[f])
    db.session.commit()
    return ok(p.to_dict(detail=True))

@admin_bp.delete('/portfolio/<int:pid>')
@require_admin
def delete_project(pid):
    p = PortfolioProject.query.get_or_404(pid)
    db.session.delete(p); db.session.commit()
    return ok(message='Deleted')


# ── Blog CRUD ─────────────────────────────────────────────────────────
@admin_bp.get('/blog')
@require_admin
def list_blog():
    page   = request.args.get('page', 1, type=int)
    result = paginate(BlogPost.query.order_by(BlogPost.created_at.desc()), page, 15)
    return ok([p.to_dict() for p in result['items']],
              pagination={k: result[k] for k in ['total','page','pages']})

@admin_bp.post('/blog')
@require_admin
def create_post():
    d = request.get_json() or {}
    if not d.get('title'): return err('Title required')
    cat_id = d.get('category_id')
    p = BlogPost(
        title=d['title'], slug=d.get('slug', d['title'].lower().replace(' ','-').replace('?','')),
        excerpt=d.get('excerpt',''), content=d.get('content',''),
        cover_image=d.get('cover_image',''), category_id=cat_id,
        author=d.get('author','Davion Technologies'), read_time=d.get('read_time',5),
        is_published=d.get('is_published',False),
        published_at=datetime.utcnow() if d.get('is_published') else None,
    )
    db.session.add(p); db.session.commit()
    return created(p.to_dict(detail=True))

@admin_bp.put('/blog/<int:pid>')
@require_admin
def update_post(pid):
    p = BlogPost.query.get_or_404(pid)
    d = request.get_json() or {}
    for f in ['title','slug','excerpt','content','cover_image','category_id','author','read_time','is_published']:
        if f in d: setattr(p, f, d[f])
    if d.get('is_published') and not p.published_at:
        p.published_at = datetime.utcnow()
    db.session.commit()
    return ok(p.to_dict(detail=True))

@admin_bp.delete('/blog/<int:pid>')
@require_admin
def delete_post(pid):
    p = BlogPost.query.get_or_404(pid)
    db.session.delete(p); db.session.commit()
    return ok(message='Deleted')


# ── Messages ──────────────────────────────────────────────────────────
@admin_bp.get('/messages')
@require_admin
def list_messages():
    page   = request.args.get('page', 1, type=int)
    result = paginate(ContactMessage.query.order_by(ContactMessage.created_at.desc()), page, 20)
    return ok([m.to_dict() for m in result['items']],
              pagination={k: result[k] for k in ['total','page','pages']})

@admin_bp.patch('/messages/<int:mid>/read')
@require_admin
def mark_read(mid):
    m = ContactMessage.query.get_or_404(mid)
    m.is_read = True; db.session.commit()
    return ok(message='Marked as read')


# ── Testimonials CRUD ─────────────────────────────────────────────────
@admin_bp.get('/testimonials')
@require_admin
def list_testimonials():
    t = Testimonial.query.order_by(Testimonial.order).all()
    return ok([x.to_dict() for x in t])

@admin_bp.post('/testimonials')
@require_admin
def create_testimonial():
    d = request.get_json() or {}
    if not all([d.get('name'), d.get('content')]): return err('Name and content required')
    t = Testimonial(**{k: d.get(k) for k in ['name','role','company','content','avatar_url','rating','order'] if d.get(k) is not None})
    db.session.add(t); db.session.commit()
    return created(t.to_dict())

@admin_bp.delete('/testimonials/<int:tid>')
@require_admin
def delete_testimonial(tid):
    t = Testimonial.query.get_or_404(tid)
    db.session.delete(t); db.session.commit()
    return ok(message='Deleted')


# ── Jobs CRUD ─────────────────────────────────────────────────────────
@admin_bp.get('/jobs')
@require_admin
def list_jobs():
    jobs = JobPosting.query.order_by(JobPosting.created_at.desc()).all()
    return ok([j.to_dict() for j in jobs])

@admin_bp.post('/jobs')
@require_admin
def create_job():
    d = request.get_json() or {}
    if not d.get('title'): return err('Title required')
    j = JobPosting(title=d['title'], department=d.get('department',''),
                   location=d.get('location','Nairobi, Kenya'), type=d.get('type','Full-time'),
                   description=d.get('description',''), requirements=d.get('requirements',[]),
                   salary_range=d.get('salary_range',''))
    db.session.add(j); db.session.commit()
    return created(j.to_dict())

@admin_bp.delete('/jobs/<int:jid>')
@require_admin
def delete_job(jid):
    j = JobPosting.query.get_or_404(jid)
    db.session.delete(j); db.session.commit()
    return ok(message='Deleted')

@admin_bp.get('/applications')
@require_admin
def list_applications():
    page   = request.args.get('page', 1, type=int)
    result = paginate(JobApplication.query.order_by(JobApplication.created_at.desc()), page, 20)
    return ok([a.to_dict() for a in result['items']],
              pagination={k: result[k] for k in ['total','page','pages']})
