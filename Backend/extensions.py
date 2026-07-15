"""
Shared extension instances. Created here (not in app.py) so that models
and routes can import `db`/`bcrypt`/`jwt` without circular-import issues --
app.py calls .init_app() on each of these during app creation.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()