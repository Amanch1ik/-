"""Add payment system tables

Revision ID: add_payment_system
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_payment_system'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Создание enum типов
    payment_method_enum = postgresql.ENUM(
        'bank_card', 'elsom', 'mobile_balance', 'elkart', 'cash_terminal', 'bank_transfer',
        name='paymentmethodenum'
    )
    payment_method_enum.create(op.get_bind())
    
    payment_status_enum = postgresql.ENUM(
        'pending', 'processing', 'success', 'failed', 'cancelled',
        name='paymentstatusenum'
    )
    payment_status_enum.create(op.get_bind())
    
    # Создание таблицы транзакций
    op.create_table('transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('commission', sa.Float(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('payment_method', payment_method_enum, nullable=False),
        sa.Column('status', payment_status_enum, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('gateway_transaction_id', sa.String(length=255), nullable=True),
        sa.Column('gateway_response', sa.Text(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('phone_number', sa.String(length=20), nullable=True),
        sa.Column('card_last_four', sa.String(length=4), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_transactions_id'), 'transactions', ['id'], unique=False)
    op.create_index(op.f('ix_transactions_user_id'), 'transactions', ['user_id'], unique=False)
    
    # Создание таблицы кошельков
    op.create_table('wallets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('balance', sa.Float(), nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('daily_limit', sa.Float(), nullable=True),
        sa.Column('monthly_limit', sa.Float(), nullable=True),
        sa.Column('single_transaction_limit', sa.Float(), nullable=True),
        sa.Column('daily_used', sa.Float(), nullable=True),
        sa.Column('monthly_used', sa.Float(), nullable=True),
        sa.Column('last_daily_reset', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('last_monthly_reset', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_frozen', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_wallets_id'), 'wallets', ['id'], unique=False)
    op.create_index(op.f('ix_wallets_user_id'), 'wallets', ['user_id'], unique=False)
    
    # Создание таблицы возвратов
    op.create_table('refunds',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('transaction_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('status', payment_status_enum, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('gateway_refund_id', sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(['transaction_id'], ['transactions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_refunds_id'), 'refunds', ['id'], unique=False)
    
    # Создание таблицы методов оплаты
    op.create_table('payment_methods',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('name_ky', sa.String(length=100), nullable=True),
        sa.Column('name_en', sa.String(length=100), nullable=True),
        sa.Column('commission_rate', sa.Float(), nullable=False),
        sa.Column('min_commission', sa.Float(), nullable=True),
        sa.Column('max_commission', sa.Float(), nullable=True),
        sa.Column('min_amount', sa.Float(), nullable=True),
        sa.Column('max_amount', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_instant', sa.Boolean(), nullable=True),
        sa.Column('processing_time_minutes', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payment_methods_id'), 'payment_methods', ['id'], unique=False)
    op.create_unique_constraint('uq_payment_methods_code', 'payment_methods', ['code'])
    
    # Создание таблицы аналитики платежей
    op.create_table('payment_analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('bank_card_count', sa.Integer(), nullable=True),
        sa.Column('bank_card_amount', sa.Float(), nullable=True),
        sa.Column('elsom_count', sa.Integer(), nullable=True),
        sa.Column('elsom_amount', sa.Float(), nullable=True),
        sa.Column('mobile_balance_count', sa.Integer(), nullable=True),
        sa.Column('mobile_balance_amount', sa.Float(), nullable=True),
        sa.Column('elkart_count', sa.Integer(), nullable=True),
        sa.Column('elkart_amount', sa.Float(), nullable=True),
        sa.Column('cash_terminal_count', sa.Integer(), nullable=True),
        sa.Column('cash_terminal_amount', sa.Float(), nullable=True),
        sa.Column('bank_transfer_count', sa.Integer(), nullable=True),
        sa.Column('bank_transfer_amount', sa.Float(), nullable=True),
        sa.Column('total_transactions', sa.Integer(), nullable=True),
        sa.Column('total_amount', sa.Float(), nullable=True),
        sa.Column('total_commission', sa.Float(), nullable=True),
        sa.Column('successful_transactions', sa.Integer(), nullable=True),
        sa.Column('failed_transactions', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payment_analytics_id'), 'payment_analytics', ['id'], unique=False)
    op.create_index(op.f('ix_payment_analytics_date'), 'payment_analytics', ['date'], unique=False)


def downgrade():
    # Удаление таблиц
    op.drop_index(op.f('ix_payment_analytics_date'), table_name='payment_analytics')
    op.drop_index(op.f('ix_payment_analytics_id'), table_name='payment_analytics')
    op.drop_table('payment_analytics')
    
    op.drop_constraint('uq_payment_methods_code', 'payment_methods', type_='unique')
    op.drop_index(op.f('ix_payment_methods_id'), table_name='payment_methods')
    op.drop_table('payment_methods')
    
    op.drop_index(op.f('ix_refunds_id'), table_name='refunds')
    op.drop_table('refunds')
    
    op.drop_index(op.f('ix_wallets_user_id'), table_name='wallets')
    op.drop_index(op.f('ix_wallets_id'), table_name='wallets')
    op.drop_table('wallets')
    
    op.drop_index(op.f('ix_transactions_user_id'), table_name='transactions')
    op.drop_index(op.f('ix_transactions_id'), table_name='transactions')
    op.drop_table('transactions')
    
    # Удаление enum типов
    payment_status_enum = postgresql.ENUM(
        'pending', 'processing', 'success', 'failed', 'cancelled',
        name='paymentstatusenum'
    )
    payment_status_enum.drop(op.get_bind())
    
    payment_method_enum = postgresql.ENUM(
        'bank_card', 'elsom', 'mobile_balance', 'elkart', 'cash_terminal', 'bank_transfer',
        name='paymentmethodenum'
    )
    payment_method_enum.drop(op.get_bind())
