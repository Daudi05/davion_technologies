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

        # ── Portfolio projects ────────────────────────────────────────────
        # Remove old placeholder projects so they don't show up alongside the real ones
        old_slugs = ['mjengo-connect', 'paygo-wallet', 'duka-analytics', 'afya360', 'schoolsync', 'logitrack']
        PortfolioProject.query.filter(PortfolioProject.slug.in_(old_slugs)).delete(synchronize_session=False)
        db.session.commit()

        projects = [
            ('Danis Choice', 'danis-choice', 'Danis Choice', 'E-commerce',
             'Full e-commerce platform for a ladies fashion brand selling clothing, shoes, and bags — built with a custom storefront, cart, checkout, and admin dashboard for inventory and order management.',
             ['React', 'Flask', 'PostgreSQL', 'Framer Motion'],
             'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', True),
            ('Nyabera Secondary School', 'nyabera-secondary-school', 'Nyabera Secondary School', 'Education',
             'School management and information system for student records, communication, and academic administration — digitizing daily operations for the institution.',
             ['React', 'Flask', 'PostgreSQL', 'JWT Auth'],
             'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80', True),
            ('Mkopo Finance', 'mkopo-finance', 'Mkopo Finance', 'Fintech',
             'Loan management platform supporting 12 loan product types, customer onboarding, loan officer workflows, and M-Pesa-integrated repayments for a Kenyan microfinance institution.',
             ['React', 'Flask', 'PostgreSQL', 'M-Pesa Daraja API'],
             'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', True),
        ]
        for title,slug,client,cat,summary,tech,img,featured in projects:
            if not PortfolioProject.query.filter_by(slug=slug).first():
                db.session.add(PortfolioProject(
                    title=title, slug=slug, client=client, category=cat,
                    summary=summary, technologies=tech, cover_image=img, is_featured=featured,
                    description=summary, challenge='Building for real-world Kenyan business constraints — low bandwidth, mobile-first users, and local payment systems.',
                    solution='We built with offline-first, mobile-first principles tailored to the client\'s actual operating environment.',
                    outcome='Delivered on time and fully adopted by the client\'s team and end users.',
                ))

        # Testimonials
        testimonials = [
            ('Danis Wanjiru', 'Founder, Danis Choice', 'Davion Technologies built us a storefront that actually feels premium. Our customers notice the difference, and our order management has never been smoother.', 5),
            ('Mr. Otieno', 'Principal, Nyabera Secondary School', 'The system has completely changed how we manage student records and communicate with parents. What used to take days now takes minutes.', 5),
            ('James Mwangi', 'Operations Manager, Mkopo Finance', 'Our loan officers process applications faster and our M-Pesa repayments reconcile automatically. This system paid for itself within months.', 5),
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
            ('From Idea to Launch: How We Shipped Mkopo Finance', 'idea-to-launch-mkopo-finance',
             'A behind-the-scenes look at building a loan management platform for a Kenyan microfinance institution.', 'Product', True),
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