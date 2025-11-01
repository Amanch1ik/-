"""Add complete notification, achievement, review and promotion systems

Revision ID: add_complete_systems
Revises: add_payment_system
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_complete_systems'
down_revision = 'add_payment_system'
branch_labels = None
depends_on = None


def upgrade():
    # Create notification tables
    op.create_table('notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('notification_type', sa.Enum('push', 'sms', 'email', 'in_app', name='notificationtype'), nullable=False),
        sa.Column('priority', sa.Enum('low', 'normal', 'high', 'urgent', name='notificationpriority'), nullable=True),
        sa.Column('status', sa.Enum('pending', 'sent', 'failed', 'delivered', 'read', name='notificationstatus'), nullable=True),
        sa.Column('data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('scheduled_at', sa.DateTime(), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)
    op.create_index(op.f('ix_notifications_notification_type'), 'notifications', ['notification_type'], unique=False)
    op.create_index(op.f('ix_notifications_status'), 'notifications', ['status'], unique=False)
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)

    op.create_table('notification_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('title_template', sa.String(length=255), nullable=False),
        sa.Column('message_template', sa.Text(), nullable=False),
        sa.Column('notification_type', sa.Enum('push', 'sms', 'email', 'in_app', name='notificationtype'), nullable=False),
        sa.Column('variables', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_notification_templates_id'), 'notification_templates', ['id'], unique=False)

    op.create_table('notification_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('push_enabled', sa.Boolean(), nullable=True),
        sa.Column('sms_enabled', sa.Boolean(), nullable=True),
        sa.Column('email_enabled', sa.Boolean(), nullable=True),
        sa.Column('in_app_enabled', sa.Boolean(), nullable=True),
        sa.Column('marketing_enabled', sa.Boolean(), nullable=True),
        sa.Column('transaction_enabled', sa.Boolean(), nullable=True),
        sa.Column('promotion_enabled', sa.Boolean(), nullable=True),
        sa.Column('system_enabled', sa.Boolean(), nullable=True),
        sa.Column('quiet_hours_start', sa.String(length=5), nullable=True),
        sa.Column('quiet_hours_end', sa.String(length=5), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_notification_settings_id'), 'notification_settings', ['id'], unique=False)

    op.create_table('notification_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('notification_id', sa.Integer(), nullable=False),
        sa.Column('attempt_number', sa.Integer(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'sent', 'failed', 'delivered', 'read', name='notificationstatus'), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('response_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['notification_id'], ['notifications.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notification_logs_id'), 'notification_logs', ['id'], unique=False)

    # Create achievement tables
    op.create_table('achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.Enum('transaction', 'referral', 'loyalty', 'social', 'special', name='achievementcategory'), nullable=False),
        sa.Column('rarity', sa.Enum('common', 'rare', 'epic', 'legendary', name='achievementrarity'), nullable=True),
        sa.Column('points', sa.Integer(), nullable=True),
        sa.Column('icon', sa.String(length=255), nullable=True),
        sa.Column('requirements', sa.JSON(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_achievements_id'), 'achievements', ['id'], unique=False)
    op.create_index(op.f('ix_achievements_category'), 'achievements', ['category'], unique=False)

    op.create_table('user_achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('progress', sa.JSON(), nullable=True),
        sa.Column('unlocked_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['achievement_id'], ['achievements.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_achievements_id'), 'user_achievements', ['id'], unique=False)
    op.create_index(op.f('ix_user_achievements_achievement_id'), 'user_achievements', ['achievement_id'], unique=False)
    op.create_index(op.f('ix_user_achievements_user_id'), 'user_achievements', ['user_id'], unique=False)

    op.create_table('user_levels',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('current_level', sa.Integer(), nullable=True),
        sa.Column('current_points', sa.Integer(), nullable=True),
        sa.Column('total_points_earned', sa.Integer(), nullable=True),
        sa.Column('level_updated_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_user_levels_id'), 'user_levels', ['id'], unique=False)

    op.create_table('level_rewards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('level', sa.Integer(), nullable=False),
        sa.Column('reward_type', sa.String(length=50), nullable=False),
        sa.Column('reward_value', sa.Float(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_level_rewards_id'), 'level_rewards', ['id'], unique=False)
    op.create_index(op.f('ix_level_rewards_level'), 'level_rewards', ['level'], unique=False)

    op.create_table('user_level_rewards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('reward_id', sa.Integer(), nullable=False),
        sa.Column('is_claimed', sa.Boolean(), nullable=True),
        sa.Column('claimed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['reward_id'], ['level_rewards.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_level_rewards_id'), 'user_level_rewards', ['id'], unique=False)
    op.create_index(op.f('ix_user_level_rewards_reward_id'), 'user_level_rewards', ['reward_id'], unique=False)
    op.create_index(op.f('ix_user_level_rewards_user_id'), 'user_level_rewards', ['user_id'], unique=False)

    op.create_table('achievement_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('current_progress', sa.Integer(), nullable=True),
        sa.Column('required_progress', sa.Integer(), nullable=False),
        sa.Column('progress_data', sa.JSON(), nullable=True),
        sa.Column('last_updated', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['achievement_id'], ['achievements.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_achievement_progress_id'), 'achievement_progress', ['id'], unique=False)
    op.create_index(op.f('ix_achievement_progress_achievement_id'), 'achievement_progress', ['achievement_id'], unique=False)
    op.create_index(op.f('ix_achievement_progress_user_id'), 'achievement_progress', ['user_id'], unique=False)

    # Create review tables
    op.create_table('partner_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('partner_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', 'hidden', name='reviewstatus'), nullable=True),
        sa.Column('likes_count', sa.Integer(), nullable=True),
        sa.Column('reports_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['partner_id'], ['partners.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_partner_reviews_id'), 'partner_reviews', ['id'], unique=False)
    op.create_index(op.f('ix_partner_reviews_partner_id'), 'partner_reviews', ['partner_id'], unique=False)
    op.create_index(op.f('ix_partner_reviews_user_id'), 'partner_reviews', ['user_id'], unique=False)

    op.create_table('review_photos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('photo_url', sa.String(length=500), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['review_id'], ['partner_reviews.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_photos_id'), 'review_photos', ['id'], unique=False)
    op.create_index(op.f('ix_review_photos_review_id'), 'review_photos', ['review_id'], unique=False)

    op.create_table('review_likes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['review_id'], ['partner_reviews.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_likes_id'), 'review_likes', ['id'], unique=False)
    op.create_index(op.f('ix_review_likes_review_id'), 'review_likes', ['review_id'], unique=False)
    op.create_index(op.f('ix_review_likes_user_id'), 'review_likes', ['user_id'], unique=False)

    op.create_table('review_reports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('reporter_id', sa.Integer(), nullable=False),
        sa.Column('reason', sa.Enum('spam', 'inappropriate', 'fake', 'offensive', 'other', name='reportreason'), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['reporter_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['review_id'], ['partner_reviews.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_reports_id'), 'review_reports', ['id'], unique=False)
    op.create_index(op.f('ix_review_reports_reporter_id'), 'review_reports', ['reporter_id'], unique=False)
    op.create_index(op.f('ix_review_reports_review_id'), 'review_reports', ['review_id'], unique=False)

    op.create_table('review_moderations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('moderator_id', sa.Integer(), nullable=False),
        sa.Column('action', sa.String(length=20), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['moderator_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['review_id'], ['partner_reviews.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_moderations_id'), 'review_moderations', ['id'], unique=False)
    op.create_index(op.f('ix_review_moderations_moderator_id'), 'review_moderations', ['moderator_id'], unique=False)
    op.create_index(op.f('ix_review_moderations_review_id'), 'review_moderations', ['review_id'], unique=False)

    # Create promotion tables
    op.create_table('promotions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.Enum('general', 'partner', 'seasonal', 'referral', 'loyalty', 'special', name='promotioncategory'), nullable=False),
        sa.Column('promotion_type', sa.Enum('discount_percent', 'discount_amount', 'cashback', 'bonus_points', 'free_shipping', 'gift', name='promotiontype'), nullable=False),
        sa.Column('partner_id', sa.Integer(), nullable=True),
        sa.Column('discount_percent', sa.Float(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=True),
        sa.Column('min_order_amount', sa.Float(), nullable=True),
        sa.Column('max_discount_amount', sa.Float(), nullable=True),
        sa.Column('usage_limit', sa.Integer(), nullable=True),
        sa.Column('usage_limit_per_user', sa.Integer(), nullable=True),
        sa.Column('usage_count', sa.Integer(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('status', sa.Enum('draft', 'active', 'paused', 'expired', 'cancelled', name='promotionstatus'), nullable=True),
        sa.Column('conditions', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['partner_id'], ['partners.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_promotions_id'), 'promotions', ['id'], unique=False)
    op.create_index(op.f('ix_promotions_category'), 'promotions', ['category'], unique=False)
    op.create_index(op.f('ix_promotions_partner_id'), 'promotions', ['partner_id'], unique=False)
    op.create_index(op.f('ix_promotions_start_date'), 'promotions', ['start_date'], unique=False)
    op.create_index(op.f('ix_promotions_end_date'), 'promotions', ['end_date'], unique=False)
    op.create_index(op.f('ix_promotions_status'), 'promotions', ['status'], unique=False)

    op.create_table('promo_codes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('promotion_id', sa.Integer(), nullable=False),
        sa.Column('promo_type', sa.Enum('percentage', 'fixed_amount', 'free_shipping', 'bonus_points', name='promocodetype'), nullable=False),
        sa.Column('discount_percent', sa.Float(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=True),
        sa.Column('usage_limit', sa.Integer(), nullable=True),
        sa.Column('usage_limit_per_user', sa.Integer(), nullable=True),
        sa.Column('usage_count', sa.Integer(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('status', sa.Enum('active', 'inactive', 'expired', 'used', 'cancelled', name='promocodestatus'), nullable=True),
        sa.Column('conditions', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['promotion_id'], ['promotions.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index(op.f('ix_promo_codes_id'), 'promo_codes', ['id'], unique=False)
    op.create_index(op.f('ix_promo_codes_code'), 'promo_codes', ['code'], unique=False)
    op.create_index(op.f('ix_promo_codes_promotion_id'), 'promo_codes', ['promotion_id'], unique=False)
    op.create_index(op.f('ix_promo_codes_start_date'), 'promo_codes', ['start_date'], unique=False)
    op.create_index(op.f('ix_promo_codes_end_date'), 'promo_codes', ['end_date'], unique=False)
    op.create_index(op.f('ix_promo_codes_status'), 'promo_codes', ['status'], unique=False)

    op.create_table('user_promo_codes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('promo_code_id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['promo_code_id'], ['promo_codes.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_promo_codes_id'), 'user_promo_codes', ['id'], unique=False)
    op.create_index(op.f('ix_user_promo_codes_order_id'), 'user_promo_codes', ['order_id'], unique=False)
    op.create_index(op.f('ix_user_promo_codes_promo_code_id'), 'user_promo_codes', ['promo_code_id'], unique=False)
    op.create_index(op.f('ix_user_promo_codes_user_id'), 'user_promo_codes', ['user_id'], unique=False)

    op.create_table('promotion_usage',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('promotion_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ),
        sa.ForeignKeyConstraint(['promotion_id'], ['promotions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_promotion_usage_id'), 'promotion_usage', ['id'], unique=False)
    op.create_index(op.f('ix_promotion_usage_order_id'), 'promotion_usage', ['order_id'], unique=False)
    op.create_index(op.f('ix_promotion_usage_promotion_id'), 'promotion_usage', ['promotion_id'], unique=False)
    op.create_index(op.f('ix_promotion_usage_user_id'), 'promotion_usage', ['user_id'], unique=False)

    op.create_table('promo_code_generations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('promotion_id', sa.Integer(), nullable=False),
        sa.Column('generated_by', sa.Integer(), nullable=False),
        sa.Column('codes_count', sa.Integer(), nullable=False),
        sa.Column('code_length', sa.Integer(), nullable=False),
        sa.Column('codes', sa.Text(), nullable=False),
        sa.Column('generated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['generated_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['promotion_id'], ['promotions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_promo_code_generations_id'), 'promo_code_generations', ['id'], unique=False)
    op.create_index(op.f('ix_promo_code_generations_generated_by'), 'promo_code_generations', ['generated_by'], unique=False)
    op.create_index(op.f('ix_promo_code_generations_promotion_id'), 'promo_code_generations', ['promotion_id'], unique=False)


def downgrade():
    # Drop promotion tables
    op.drop_index(op.f('ix_promo_code_generations_promotion_id'), table_name='promo_code_generations')
    op.drop_index(op.f('ix_promo_code_generations_generated_by'), table_name='promo_code_generations')
    op.drop_index(op.f('ix_promo_code_generations_id'), table_name='promo_code_generations')
    op.drop_table('promo_code_generations')

    op.drop_index(op.f('ix_promotion_usage_user_id'), table_name='promotion_usage')
    op.drop_index(op.f('ix_promotion_usage_promotion_id'), table_name='promotion_usage')
    op.drop_index(op.f('ix_promotion_usage_order_id'), table_name='promotion_usage')
    op.drop_index(op.f('ix_promotion_usage_id'), table_name='promotion_usage')
    op.drop_table('promotion_usage')

    op.drop_index(op.f('ix_user_promo_codes_user_id'), table_name='user_promo_codes')
    op.drop_index(op.f('ix_user_promo_codes_promo_code_id'), table_name='user_promo_codes')
    op.drop_index(op.f('ix_user_promo_codes_order_id'), table_name='user_promo_codes')
    op.drop_index(op.f('ix_user_promo_codes_id'), table_name='user_promo_codes')
    op.drop_table('user_promo_codes')

    op.drop_index(op.f('ix_promo_codes_status'), table_name='promo_codes')
    op.drop_index(op.f('ix_promo_codes_end_date'), table_name='promo_codes')
    op.drop_index(op.f('ix_promo_codes_start_date'), table_name='promo_codes')
    op.drop_index(op.f('ix_promo_codes_promotion_id'), table_name='promo_codes')
    op.drop_index(op.f('ix_promo_codes_code'), table_name='promo_codes')
    op.drop_index(op.f('ix_promo_codes_id'), table_name='promo_codes')
    op.drop_table('promo_codes')

    op.drop_index(op.f('ix_promotions_status'), table_name='promotions')
    op.drop_index(op.f('ix_promotions_end_date'), table_name='promotions')
    op.drop_index(op.f('ix_promotions_start_date'), table_name='promotions')
    op.drop_index(op.f('ix_promotions_partner_id'), table_name='promotions')
    op.drop_index(op.f('ix_promotions_category'), table_name='promotions')
    op.drop_index(op.f('ix_promotions_id'), table_name='promotions')
    op.drop_table('promotions')

    # Drop review tables
    op.drop_index(op.f('ix_review_moderations_review_id'), table_name='review_moderations')
    op.drop_index(op.f('ix_review_moderations_moderator_id'), table_name='review_moderations')
    op.drop_index(op.f('ix_review_moderations_id'), table_name='review_moderations')
    op.drop_table('review_moderations')

    op.drop_index(op.f('ix_review_reports_review_id'), table_name='review_reports')
    op.drop_index(op.f('ix_review_reports_reporter_id'), table_name='review_reports')
    op.drop_index(op.f('ix_review_reports_id'), table_name='review_reports')
    op.drop_table('review_reports')

    op.drop_index(op.f('ix_review_likes_user_id'), table_name='review_likes')
    op.drop_index(op.f('ix_review_likes_review_id'), table_name='review_likes')
    op.drop_index(op.f('ix_review_likes_id'), table_name='review_likes')
    op.drop_table('review_likes')

    op.drop_index(op.f('ix_review_photos_review_id'), table_name='review_photos')
    op.drop_index(op.f('ix_review_photos_id'), table_name='review_photos')
    op.drop_table('review_photos')

    op.drop_index(op.f('ix_partner_reviews_user_id'), table_name='partner_reviews')
    op.drop_index(op.f('ix_partner_reviews_partner_id'), table_name='partner_reviews')
    op.drop_index(op.f('ix_partner_reviews_id'), table_name='partner_reviews')
    op.drop_table('partner_reviews')

    # Drop achievement tables
    op.drop_index(op.f('ix_achievement_progress_user_id'), table_name='achievement_progress')
    op.drop_index(op.f('ix_achievement_progress_achievement_id'), table_name='achievement_progress')
    op.drop_index(op.f('ix_achievement_progress_id'), table_name='achievement_progress')
    op.drop_table('achievement_progress')

    op.drop_index(op.f('ix_user_level_rewards_user_id'), table_name='user_level_rewards')
    op.drop_index(op.f('ix_user_level_rewards_reward_id'), table_name='user_level_rewards')
    op.drop_index(op.f('ix_user_level_rewards_id'), table_name='user_level_rewards')
    op.drop_table('user_level_rewards')

    op.drop_index(op.f('ix_level_rewards_level'), table_name='level_rewards')
    op.drop_index(op.f('ix_level_rewards_id'), table_name='level_rewards')
    op.drop_table('level_rewards')

    op.drop_index(op.f('ix_user_levels_id'), table_name='user_levels')
    op.drop_table('user_levels')

    op.drop_index(op.f('ix_user_achievements_user_id'), table_name='user_achievements')
    op.drop_index(op.f('ix_user_achievements_achievement_id'), table_name='user_achievements')
    op.drop_index(op.f('ix_user_achievements_id'), table_name='user_achievements')
    op.drop_table('user_achievements')

    op.drop_index(op.f('ix_achievements_category'), table_name='achievements')
    op.drop_index(op.f('ix_achievements_id'), table_name='achievements')
    op.drop_table('achievements')

    # Drop notification tables
    op.drop_index(op.f('ix_notification_logs_id'), table_name='notification_logs')
    op.drop_table('notification_logs')

    op.drop_index(op.f('ix_notification_settings_id'), table_name='notification_settings')
    op.drop_table('notification_settings')

    op.drop_index(op.f('ix_notification_templates_id'), table_name='notification_templates')
    op.drop_table('notification_templates')

    op.drop_index(op.f('ix_notifications_user_id'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_status'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_notification_type'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_id'), table_name='notifications')
    op.drop_table('notifications')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS notificationtype CASCADE')
    op.execute('DROP TYPE IF EXISTS notificationpriority CASCADE')
    op.execute('DROP TYPE IF EXISTS notificationstatus CASCADE')
    op.execute('DROP TYPE IF EXISTS achievementcategory CASCADE')
    op.execute('DROP TYPE IF EXISTS achievementrarity CASCADE')
    op.execute('DROP TYPE IF EXISTS reviewstatus CASCADE')
    op.execute('DROP TYPE IF EXISTS reportreason CASCADE')
    op.execute('DROP TYPE IF EXISTS promotioncategory CASCADE')
    op.execute('DROP TYPE IF EXISTS promotiontype CASCADE')
    op.execute('DROP TYPE IF EXISTS promotionstatus CASCADE')
    op.execute('DROP TYPE IF EXISTS promocodetype CASCADE')
    op.execute('DROP TYPE IF EXISTS promocodestatus CASCADE')
