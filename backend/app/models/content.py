from app import db
from datetime import datetime

class Service(db.Model):
    __tablename__ = 'services'
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(150), nullable=False)
    slug        = db.Column(db.String(150), unique=True, nullable=False)
    icon        = db.Column(db.String(100))
    short_desc  = db.Column(db.Text)
    long_desc   = db.Column(db.Text)
    features    = db.Column(db.JSON)
    price_from  = db.Column(db.String(50))
    order       = db.Column(db.Integer, default=0)
    is_active   = db.Column(db.Boolean, default=True)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'title':self.title,'slug':self.slug,'icon':self.icon,
                'short_desc':self.short_desc,'long_desc':self.long_desc,
                'features':self.features or [],'price_from':self.price_from,'order':self.order}


class PortfolioProject(db.Model):
    __tablename__ = 'portfolio_projects'
    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(200), nullable=False)
    slug         = db.Column(db.String(200), unique=True, nullable=False)
    client       = db.Column(db.String(150))
    category     = db.Column(db.String(80))
    summary      = db.Column(db.Text)
    description  = db.Column(db.Text)
    challenge    = db.Column(db.Text)
    solution     = db.Column(db.Text)
    outcome      = db.Column(db.Text)
    technologies = db.Column(db.JSON)
    cover_image  = db.Column(db.Text)
    images       = db.Column(db.JSON)
    url          = db.Column(db.Text)
    is_featured  = db.Column(db.Boolean, default=False)
    is_active    = db.Column(db.Boolean, default=True)
    completed_at = db.Column(db.Date)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, detail=False):
        d = {'id':self.id,'title':self.title,'slug':self.slug,'client':self.client,
             'category':self.category,'summary':self.summary,'technologies':self.technologies or [],
             'cover_image':self.cover_image,'is_featured':self.is_featured,
             'completed_at':self.completed_at.isoformat() if self.completed_at else None}
        if detail:
            d.update({'description':self.description,'challenge':self.challenge,
                      'solution':self.solution,'outcome':self.outcome,
                      'images':self.images or [],'url':self.url})
        return d


class Testimonial(db.Model):
    __tablename__ = 'testimonials'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(150), nullable=False)
    role       = db.Column(db.String(150))
    company    = db.Column(db.String(150))
    avatar_url = db.Column(db.Text)
    content    = db.Column(db.Text, nullable=False)
    rating     = db.Column(db.Integer, default=5)
    is_active  = db.Column(db.Boolean, default=True)
    order      = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'name':self.name,'role':self.role,'company':self.company,
                'avatar_url':self.avatar_url,'content':self.content,'rating':self.rating}


class TeamMember(db.Model):
    __tablename__ = 'team_members'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(150), nullable=False)
    role       = db.Column(db.String(150))
    bio        = db.Column(db.Text)
    photo_url  = db.Column(db.Text)
    linkedin   = db.Column(db.Text)
    twitter    = db.Column(db.Text)
    github     = db.Column(db.Text)
    order      = db.Column(db.Integer, default=0)
    is_active  = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'name':self.name,'role':self.role,'bio':self.bio,
                'photo_url':self.photo_url,'linkedin':self.linkedin,'twitter':self.twitter,'github':self.github}


class BlogCategory(db.Model):
    __tablename__ = 'blog_categories'
    id    = db.Column(db.Integer, primary_key=True)
    name  = db.Column(db.String(100), nullable=False)
    slug  = db.Column(db.String(100), unique=True, nullable=False)
    posts = db.relationship('BlogPost', backref='category', lazy='dynamic')

    def to_dict(self):
        return {'id':self.id,'name':self.name,'slug':self.slug,'count':self.posts.filter_by(is_published=True).count()}


class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(300), nullable=False)
    slug         = db.Column(db.String(300), unique=True, nullable=False)
    excerpt      = db.Column(db.Text)
    content      = db.Column(db.Text)
    cover_image  = db.Column(db.Text)
    category_id  = db.Column(db.Integer, db.ForeignKey('blog_categories.id'))
    author       = db.Column(db.String(150), default='Davion Technologies')
    read_time    = db.Column(db.Integer, default=5)
    is_published = db.Column(db.Boolean, default=False)
    views        = db.Column(db.Integer, default=0)
    published_at = db.Column(db.DateTime)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, detail=False):
        d = {'id':self.id,'title':self.title,'slug':self.slug,'excerpt':self.excerpt,
             'cover_image':self.cover_image,'author':self.author,'read_time':self.read_time,
             'is_published':self.is_published,'views':self.views,
             'category':self.category.to_dict() if self.category else None,
             'published_at':self.published_at.isoformat() if self.published_at else None}
        if detail: d['content'] = self.content
        return d


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(150), nullable=False)
    email      = db.Column(db.String(255), nullable=False)
    phone      = db.Column(db.String(30))
    company    = db.Column(db.String(150))
    service    = db.Column(db.String(100))
    budget     = db.Column(db.String(50))
    message    = db.Column(db.Text, nullable=False)
    is_read    = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'name':self.name,'email':self.email,'phone':self.phone,
                'company':self.company,'service':self.service,'budget':self.budget,
                'message':self.message,'is_read':self.is_read,
                'created_at':self.created_at.isoformat()}


class JobPosting(db.Model):
    __tablename__ = 'job_postings'
    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(200), nullable=False)
    department   = db.Column(db.String(100))
    location     = db.Column(db.String(100), default='Nairobi, Kenya / Remote')
    type         = db.Column(db.String(50), default='Full-time')
    description  = db.Column(db.Text)
    requirements = db.Column(db.JSON)
    salary_range = db.Column(db.String(100))
    is_active    = db.Column(db.Boolean, default=True)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'title':self.title,'department':self.department,
                'location':self.location,'type':self.type,'description':self.description,
                'requirements':self.requirements or [],'salary_range':self.salary_range}


class JobApplication(db.Model):
    __tablename__ = 'job_applications'
    id         = db.Column(db.Integer, primary_key=True)
    job_id     = db.Column(db.Integer, db.ForeignKey('job_postings.id'))
    name       = db.Column(db.String(150), nullable=False)
    email      = db.Column(db.String(255), nullable=False)
    phone      = db.Column(db.String(30))
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.Text)
    status     = db.Column(db.String(30), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id':self.id,'job_id':self.job_id,'name':self.name,'email':self.email,
                'phone':self.phone,'cover_letter':self.cover_letter,'resume_url':self.resume_url,
                'status':self.status,'created_at':self.created_at.isoformat()}
