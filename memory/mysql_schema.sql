-- GreatWorks Foundation MySQL Schema (for XAMPP/phpMyAdmin)
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(50) UNIQUE,
  gofundme_url TEXT,
  social_handle VARCHAR(50),
  tagline VARCHAR(255),
  language VARCHAR(10),
  cdn_base_url TEXT,
  updated_at DATETIME
);

CREATE TABLE newsletter_subscribers (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at DATETIME
);

CREATE TABLE contact_inquiries (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  topic VARCHAR(100),
  message TEXT,
  status VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE posts (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  content LONGTEXT,
  excerpt TEXT,
  tags JSON,
  category VARCHAR(100),
  author VARCHAR(100),
  status VARCHAR(50),
  scheduled_for DATETIME,
  published_at DATETIME,
  cover_image TEXT,
  program_type VARCHAR(100),
  views INT,
  version INT,
  revisions JSON,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE pages (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  content LONGTEXT,
  status VARCHAR(50),
  version INT,
  revisions JSON,
  updated_at DATETIME
);

CREATE TABLE media_items (
  id CHAR(36) PRIMARY KEY,
  filename VARCHAR(255),
  hash VARCHAR(255),
  type VARCHAR(50),
  tags JSON,
  program_type VARCHAR(100),
  original_url TEXT,
  optimized_url TEXT,
  webp_url TEXT,
  size INT,
  created_at DATETIME
);

CREATE TABLE events (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  start_datetime DATETIME,
  end_datetime DATETIME,
  location VARCHAR(255),
  capacity INT,
  cover_image TEXT,
  recurrence JSON,
  registration_count INT,
  waitlist_count INT,
  status VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE registrations (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE feedback (
  id CHAR(36) PRIMARY KEY,
  event_id CHAR(36),
  rating INT,
  comments TEXT,
  created_at DATETIME
);

CREATE TABLE volunteers (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  skills JSON,
  availability VARCHAR(255),
  motivation TEXT,
  resume_url TEXT,
  status VARCHAR(50),
  hours_logged DECIMAL(10,2),
  recognitions JSON,
  training_status VARCHAR(50),
  background_check_status VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE donors (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  segment VARCHAR(50),
  total_donated DECIMAL(12,2),
  created_at DATETIME
);

CREATE TABLE donations (
  id CHAR(36) PRIMARY KEY,
  donor_id CHAR(36),
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  amount DECIMAL(12,2),
  currency VARCHAR(10),
  recurring BOOLEAN,
  frequency VARCHAR(50),
  campaign VARCHAR(100),
  status VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE donation_goals (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  target_amount DECIMAL(12,2),
  current_amount DECIMAL(12,2),
  created_at DATETIME
);

CREATE TABLE impact_updates (
  id CHAR(36) PRIMARY KEY,
  donor_id CHAR(36),
  title VARCHAR(255),
  message TEXT,
  created_at DATETIME
);

CREATE TABLE integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) UNIQUE,
  config JSON
);

CREATE TABLE webhooks (
  id CHAR(36) PRIMARY KEY,
  event VARCHAR(100),
  url TEXT,
  secret VARCHAR(255),
  active BOOLEAN,
  created_at DATETIME
);

CREATE TABLE social_posts (
  id CHAR(36) PRIMARY KEY,
  platform VARCHAR(50),
  content TEXT,
  status VARCHAR(50),
  scheduled_for DATETIME,
  created_at DATETIME
);

CREATE TABLE programs (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  impact VARCHAR(255),
  stats JSON
);

CREATE TABLE partners (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  logo_url TEXT,
  website TEXT
);

CREATE TABLE gallery_collections (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  program_type VARCHAR(100),
  media_ids JSON,
  created_at DATETIME
);

CREATE TABLE staff_users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50),
  created_at DATETIME
);

CREATE TABLE users (
  user_id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50),
  password_hash TEXT,
  auth_provider VARCHAR(50),
  picture TEXT,
  created_at DATETIME
);

CREATE TABLE user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  session_token TEXT,
  expires_at DATETIME,
  created_at DATETIME
);

CREATE TABLE annual_reports (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255),
  year VARCHAR(10),
  file_url TEXT,
  created_at DATETIME
);

CREATE TABLE analytics_events (
  id CHAR(36) PRIMARY KEY,
  event_type VARCHAR(100),
  metadata JSON,
  created_at DATETIME
);

CREATE TABLE reports (
  id CHAR(36) PRIMARY KEY,
  period VARCHAR(50),
  generated_at DATETIME,
  data JSON
);

CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY,
  type VARCHAR(50),
  recipient VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  status VARCHAR(50),
  created_at DATETIME
);
