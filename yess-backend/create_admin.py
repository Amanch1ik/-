"""
Script to create admin user and test data for admin panel
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.role import Role, UserRole
from app.models.wallet import Wallet
from app.core.security import get_password_hash
from datetime import datetime

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

def create_roles(db: Session):
    """Create roles if they don't exist"""
    roles_data = [
        {"code": "admin", "title": "Администратор"},
        {"code": "partner", "title": "Партнер"},
        {"code": "agent", "title": "Агент"},
        {"code": "user", "title": "Пользователь"},
    ]

    for role_data in roles_data:
        existing_role = db.query(Role).filter(Role.code == role_data["code"]).first()
        if not existing_role:
            role = Role(**role_data)
            db.add(role)
            print(f"✅ Created role: {role_data['title']}")

    db.commit()
    print("✅ All roles created")

def create_admin_user(db: Session):
    """Create admin user"""
    # Check if admin exists
    admin_email = "admin@yess-loyalty.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()

    if existing_admin:
        print(f"⚠️  Admin user already exists: {admin_email}")
        return existing_admin

    # Create admin user
    admin_password = "admin123456"  # Change this in production!
    admin_user = User(
        name="Admin User",
        email=admin_email,
        phone="+996700000000",
        password_hash=get_password_hash(admin_password),
        phone_verified=True,
        email_verified=True,
        is_active=True,
        is_blocked=False,
        created_at=datetime.utcnow()
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # Create wallet for admin
    wallet = Wallet(
        user_id=admin_user.id,
        balance=10000.0
    )
    db.add(wallet)

    # Assign admin role
    admin_role = db.query(Role).filter(Role.code == "admin").first()
    if admin_role:
        user_role = UserRole(
            user_id=admin_user.id,
            role_id=admin_role.id
        )
        db.add(user_role)

    db.commit()

    print(f"""
✅ Admin user created successfully!

📧 Email: {admin_email}
🔑 Password: {admin_password}

⚠️  IMPORTANT: Change the password after first login!
""")

    return admin_user

def create_test_users(db: Session, count: int = 10):
    """Create test users"""
    print(f"\n📝 Creating {count} test users...")

    for i in range(1, count + 1):
        email = f"user{i}@test.com"
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            continue

        user = User(
            name=f"Test User {i}",
            email=email,
            phone=f"+99670000{i:04d}",
            password_hash=get_password_hash("password123"),
            phone_verified=True,
            email_verified=i % 2 == 0,  # Half verified
            is_active=True,
            is_blocked=i > 8,  # Last 2 blocked
            created_at=datetime.utcnow()
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # Create wallet
        wallet = Wallet(
            user_id=user.id,
            balance=float(1000 * i)
        )
        db.add(wallet)

        # Assign user role
        user_role_obj = db.query(Role).filter(Role.code == "user").first()
        if user_role_obj:
            user_role = UserRole(
                user_id=user.id,
                role_id=user_role_obj.id
            )
            db.add(user_role)

    db.commit()
    print(f"✅ Created {count} test users")

def main():
    """Main function"""
    print("🚀 Initializing YESS Loyalty Admin Panel...")
    print("=" * 60)

    # Initialize database
    init_db()

    # Create database session
    db = SessionLocal()

    try:
        # Create roles
        create_roles(db)

        # Create admin user
        admin_user = create_admin_user(db)

        # Create test users
        create_test_users(db, count=10)

        print("\n" + "=" * 60)
        print("✅ Setup complete!")
        print("\n🎯 Next steps:")
        print("1. Start backend: cd yess-backend && uvicorn app.main:app --reload")
        print("2. Start admin panel: cd admin-panel && npm run dev")
        print("3. Open browser: http://localhost:3001")
        print("4. Login with admin credentials above")
        print("=" * 60)

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
