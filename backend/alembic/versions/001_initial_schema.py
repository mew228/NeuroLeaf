"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2026-02-01

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('timezone', sa.String(length=50), nullable=True),
        sa.Column('preferences', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create mood_entries table
    op.create_table(
        'mood_entries',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mood_score', sa.Integer(), nullable=False),
        sa.Column('mood_emoji', sa.String(length=10), nullable=True),
        sa.Column('mood_label', sa.String(length=50), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('entry_date', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_mood_user_date', 'mood_entries', ['user_id', 'entry_date'])

    # Create journal_entries table
    op.create_table(
        'journal_entries',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('entry_date', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_journal_user_date', 'journal_entries', ['user_id', 'entry_date'])
    op.create_index('idx_journal_created', 'journal_entries', ['created_at'])

    # Create ai_analysis table
    op.create_table(
        'ai_analysis',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('journal_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mood_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('sentiment_score', sa.Numeric(precision=3, scale=2), nullable=True),
        sa.Column('sentiment_label', sa.String(length=20), nullable=True),
        sa.Column('primary_emotion', sa.String(length=50), nullable=True),
        sa.Column('emotion_scores', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('stress_level', sa.String(length=20), nullable=True),
        sa.Column('stress_keywords', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('ai_reflection', sa.Text(), nullable=True),
        sa.Column('reflection_tone', sa.String(length=50), nullable=True),
        sa.Column('crisis_detected', sa.Boolean(), nullable=True),
        sa.Column('crisis_severity', sa.String(length=20), nullable=True),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
        sa.Column('model_version', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['journal_id'], ['journal_entries.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['mood_id'], ['mood_entries.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_analysis_user', 'ai_analysis', ['user_id', 'processed_at'])
    op.create_index('idx_analysis_journal', 'ai_analysis', ['journal_id'])
    op.create_index('idx_crisis_detected', 'ai_analysis', ['crisis_detected', 'crisis_severity'])

    # Create crisis_logs table
    op.create_table(
        'crisis_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('journal_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('analysis_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('detected_patterns', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('severity_level', sa.String(length=20), nullable=False),
        sa.Column('flagged_content', sa.Text(), nullable=True),
        sa.Column('resources_shown', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('user_acknowledged', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['journal_id'], ['journal_entries.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['analysis_id'], ['ai_analysis.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_crisis_user', 'crisis_logs', ['user_id', 'created_at'])
    op.create_index('idx_crisis_severity', 'crisis_logs', ['severity_level', 'created_at'])


def downgrade() -> None:
    op.drop_table('crisis_logs')
    op.drop_table('ai_analysis')
    op.drop_table('journal_entries')
    op.drop_table('mood_entries')
    op.drop_table('users')
