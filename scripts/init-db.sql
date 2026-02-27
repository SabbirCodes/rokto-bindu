-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donation history table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  donation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  location VARCHAR(255),
  recipient_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges/achievements table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(100) NOT NULL,
  badge_icon VARCHAR(50),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_name)
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  patient_name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  hospital VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  urgency VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('critical', 'urgent', 'normal')),
  details TEXT,
  needed_by DATE,
  is_fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_blood_group ON users(blood_group);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_location ON blood_requests(location);
CREATE INDEX IF NOT EXISTS idx_blood_requests_is_fulfilled ON blood_requests(is_fulfilled);
CREATE INDEX IF NOT EXISTS idx_blood_requests_urgency ON blood_requests(urgency);