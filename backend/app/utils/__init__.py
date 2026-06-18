from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps
from app import db


# ── Response helpers ──────────────────────────────────────────────────────────

def ok(message='Success', data=None, status=200, pagination=None):
    r = {'success': True, 'message': message}
    if data is not None:
        r['data'] = data
    if pagination is not None:
        r['pagination'] = pagination
    return jsonify(r), status


def err(message='Error', status=400):
    return jsonify({'success': False, 'message': message}), status


def created(message='Created', data=None):
    r = {'success': True, 'message': message}
    if data is not None:
        r['data'] = data
    return jsonify(r), 201


# ── Auth helpers ──────────────────────────────────────────────────────────────

def current_user():
    """Return the currently authenticated User object."""
    from app.models.user import User
    uid = get_jwt_identity()
    if uid is None:
        return None
    try:
        return User.query.get(int(uid))
    except Exception:
        return None


def require_admin(fn):
    """
    Decorator — restricts route to admin users only.
    Usage:
        @require_admin
        def my_route(): ...
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return err('Authentication required', 401)

        user = current_user()
        if not user:
            return err('User not found', 404)

        # Support role as string or role object
        role = getattr(user, 'role', None)
        role_name = role.name if hasattr(role, 'name') else str(role or '')

        if role_name not in ('admin', 'super_admin'):
            return err('Admin access required', 403)

        return fn(*args, **kwargs)
    return wrapper


# ── Pagination helper ─────────────────────────────────────────────────────────

def paginate(query, page=None, per_page=20, max_per_page=100):
    """
    Paginate a SQLAlchemy query using request args or provided values.
    Returns (items, pagination_dict).

    Usage:
        items, pagination = paginate(Post.query.filter_by(active=True))
        return ok('Success', data=[p.to_dict() for p in items], pagination=pagination)
    """
    if page is None:
        page = request.args.get('page', 1, type=int)
    per_page = min(
        request.args.get('per_page', per_page, type=int),
        max_per_page
    )
    page  = max(1, page)
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    pages = (total + per_page - 1) // per_page or 1

    pagination = {
        'total':    total,
        'page':     page,
        'per_page': per_page,
        'pages':    pages,
        'has_next': page < pages,
        'has_prev': page > 1,
    }
    return items, pagination