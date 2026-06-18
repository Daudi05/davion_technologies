import os
from dotenv import load_dotenv
load_dotenv()
from app import create_app, db
from app.models.user import User
from app.models.content import (Service, PortfolioProject, Testimonial,
                                  TeamMember, BlogPost, BlogCategory, JobPosting)

app = create_app()

def seed():
    with app.app_context():
        db.create_all()

        # Admin user
        if not User.query.filter_by(email='admin@davion.tech').first():
            u = User(username='admin', email='admin@davion.tech', role='super_admin')
            u.set_password('Admin@2025!')
            db.session.add(u)
            db.session.flush()

        # Services
        services_data = [
            ('Web Development', 'web-development', '🌐', 'Custom web applications built with modern frameworks. Fast, secure, scalable.', 'From KES 80,000'),
            ('Mobile Apps', 'mobile-apps', '📱', 'Native and cross-platform mobile apps for iOS and Android.', 'From KES 120,000'),
            ('UI/UX Design', 'ui-ux-design', '🎨', 'Design systems and interfaces your users will love to use.', 'From KES 40,000'),
            ('AI Solutions', 'ai-solutions', '🤖', 'Machine learning, NLP, and AI integrations for your business.', 'From KES 150,000'),
            ('E-commerce', 'e-commerce', '🛒', 'End-to-end online stores with payment integration and inventory management.', 'From KES 90,000'),
            ('API Development', 'api-development', '⚡', 'RESTful and GraphQL APIs that power your products and integrations.', 'From KES 60,000'),
            ('Cloud Solutions', 'cloud-solutions', '☁️', 'AWS, GCP and Azure deployments, migrations and DevOps pipelines.', 'From KES 50,000'),
            ('Business Automation', 'business-automation', '⚙️', 'Automate repetitive workflows and free your team to do real work.', 'From KES 70,000'),
        ]
        for i, (title, slug, icon, desc, price) in enumerate(services_data):
            if not Service.query.filter_by(slug=slug).first():
                db.session.add(Service(title=title, slug=slug, icon=icon, short_desc=desc, price_from=price, order=i))

        # Portfolio projects
        projects = [
            ('Mjengo Connect', 'mjengo-connect', 'Afrimason Ltd', 'Web Application',
             'B2B marketplace connecting construction firms with verified suppliers across East Africa.',
             ['React', 'Flask', 'PostgreSQL', 'M-Pesa', 'Redis'],
             'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', True),
            ('PayGo Wallet', 'paygo-wallet', 'FinTrust Kenya', 'Mobile App',
             'Mobile money wallet serving 50,000+ users with instant P2P transfers and bill payments.',
             ['React Native', 'Node.js', 'MongoDB', 'Safaricom Daraja'],
             'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80', True),
            ('Duka Analytics', 'duka-analytics', 'RetailEdge Africa', 'SaaS Platform',
             'Real-time sales and inventory analytics for Kenyan SME retailers.',
             ['Vue.js', 'Python', 'PostgreSQL', 'Chart.js', 'Celery'],
             'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', True),
            ('Afya360', 'afya360', 'MedLink Africa', 'Web + Mobile',
             'Telemedicine platform connecting patients with doctors across 6 African countries.',
             ['React', 'React Native', 'Flask', 'PostgreSQL', 'WebRTC'],
             'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', False),
            ('SchoolSync', 'schoolsync', 'Elimu Digital', 'Web Application',
             'School management ERP managing 15,000+ students across 40 institutions.',
             ['React', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
             'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', True),
            ('LogiTrack', 'logitrack', 'Speedy Logistics', 'Web + Mobile',
             'Real-time fleet and delivery tracking system for logistics companies.',
             ['React', 'Flask', 'PostgreSQL', 'Google Maps API', 'Socket.io'],
             'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', False),
        ]
        for title,slug,client,cat,summary,tech,img,featured in projects:
            if not PortfolioProject.query.filter_by(slug=slug).first():
                db.session.add(PortfolioProject(
                    title=title, slug=slug, client=client, category=cat,
                    summary=summary, technologies=tech, cover_image=img, is_featured=featured,
                    description=summary, challenge='Building for East African market constraints.',
                    solution='We built with offline-first, mobile-first principles.',
                    outcome='Delivered on time, 40% under projected infrastructure cost.',
                ))

        # Testimonials
        testimonials = [
            ('David Njoroge', 'CEO, Afrimason Ltd', 'Davion Technologies transformed our manual supplier process into a slick digital marketplace. Delivery was ahead of schedule and the team communicates like no other agency I\'ve worked with.', 5),
            ('Wanjiru Kamau', 'CTO, FinTrust Kenya', 'The PayGo wallet handles 50,000+ daily transactions without a hiccup. The architecture they designed is enterprise-grade. Worth every shilling.', 5),
            ('Amina Hassan', 'Product Manager, RetailEdge', 'We went from Excel spreadsheets to a real-time analytics dashboard in 8 weeks. Davion\'s team understands African SME problems better than any global agency.', 5),
            ('James Otieno', 'Founder, Elimu Digital', 'SchoolSync went live in 40 schools simultaneously. Zero data loss, zero downtime. I\'ve since referred three other founders to Davion.', 5),
        ]
        for name, role, content, rating in testimonials:
            if not Testimonial.query.filter_by(name=name).first():
                db.session.add(Testimonial(name=name, role=role, content=content, rating=rating))

        # Blog categories + posts
        cats = ['Engineering', 'Product', 'Business', 'Design']
        cat_objs = {}
        for cat in cats:
            c = BlogCategory.query.filter_by(name=cat).first()
            if not c:
                c = BlogCategory(name=cat, slug=cat.lower())
                db.session.add(c); db.session.flush()
            cat_objs[cat] = c.id

        posts = [
            ('Why Kenyan SMEs Need Custom Software in 2025', 'why-kenyan-smes-need-custom-software',
             'Off-the-shelf software is built for the global average. Your business is not average.', 'Business', True),
            ('Building for M-Pesa: What Every Developer Needs to Know', 'building-for-mpesa-guide',
             'A practical guide to integrating Safaricom Daraja API without the headaches.', 'Engineering', True),
            ('From Idea to Launch: How We Shipped AfyaConnect in 12 Weeks', 'idea-to-launch-afyaconnect',
             'A behind-the-scenes look at our fastest product delivery.', 'Product', True),
        ]
        for title, slug, excerpt, cat, published in posts:
            if not BlogPost.query.filter_by(slug=slug).first():
                from datetime import datetime
                db.session.add(BlogPost(
                    title=title, slug=slug, excerpt=excerpt,
                    category_id=cat_objs[cat], author='Davion Technologies',
                    is_published=published, read_time=6,
                    published_at=datetime.utcnow() if published else None,
                    cover_image='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
                    content=f'<p>{excerpt}</p><p>Full content coming soon...</p>',
                ))

        # Jobs
        if not JobPosting.query.first():
            jobs = [
                ('Senior Full-Stack Engineer', 'Engineering', 'Remote / Nairobi', 'Full-time',
                 'Lead development of client projects. Own architecture decisions.',
                 ['5+ years Python/JS experience', 'React + Flask proficiency', 'PostgreSQL', 'AWS/GCP']),
                ('Product Designer', 'Design', 'Nairobi', 'Full-time',
                 'Shape the products we build and how we present ourselves.',
                 ['4+ years UI/UX experience', 'Figma mastery', 'Design systems experience']),
                ('Business Development Exec', 'Sales', 'Nairobi / Hybrid', 'Full-time',
                 'Drive new client relationships across East Africa.',
                 ['B2B sales experience', 'Tech industry knowledge', 'Strong Swahili and English']),
            ]
            for title,dept,loc,typ,desc,reqs in jobs:
                db.session.add(JobPosting(title=title,department=dept,location=loc,
                                          type=typ,description=desc,requirements=reqs))

        db.session.commit()
        print('✅ Seed complete')
        print('   Admin: admin@davion.tech / Admin@2025!')

if __name__ == '__main__':
    seed()
