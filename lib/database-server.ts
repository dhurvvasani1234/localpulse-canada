// lib/database-server.ts
import Database from 'better-sqlite3';
import path from 'path';

const database = new Database(process.env.DATABASE_PATH || './localpulse.db');

// Initialize database tables (same as before)
export function initDatabase() {
  // Events table
  database.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT NULL,
      title_fr TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_fr TEXT NOT NULL,
      city TEXT NOT NULL CHECK(city IN ('toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton')),
      category TEXT NOT NULL CHECK(category IN ('community', 'sports', 'arts', 'food', 'education', 'business')),
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      image_url TEXT,
      is_featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Discussions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS discussions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      name TEXT NOT NULL,
      comment TEXT NOT NULL,
      city TEXT NOT NULL,
      approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  // Newsletter subscribers
  database.exec(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      city TEXT,
      language TEXT DEFAULT 'en',
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert some sample events if table is empty
  const eventCount = database.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
  
  if (eventCount.count === 0) {
    const sampleEvents = [
      {
        title_en: 'Toronto Waterfront Cleanup',
        title_fr: 'Nettoyage du front de mer de Toronto',
        description_en: 'Join us for a community cleanup at Toronto Waterfront. Gloves and bags provided.',
        description_fr: 'Rejoignez-nous pour un nettoyage communautaire au front de mer de Toronto. Gants et sacs fournis.',
        city: 'toronto',
        category: 'community',
        date: '2024-03-15',
        time: '10:00 AM',
        location: 'Harbourfront Centre',
        is_featured: 1
      },
      {
        title_en: 'Montreal Jazz Festival',
        title_fr: 'Festival de Jazz de Montréal',
        description_en: 'Experience the world-renowned Montreal Jazz Festival with local and international artists.',
        description_fr: 'Découvrez le Festival de Jazz de Montréal de renommée mondiale avec des artistes locaux et internationaux.',
        city: 'montreal',
        category: 'arts',
        date: '2024-06-28',
        time: '6:00 PM',
        location: 'Quartier des Spectacles',
        is_featured: 1
      }
    ];

    const insert = database.prepare(`
      INSERT INTO events (title_en, title_fr, description_en, description_fr, city, category, date, time, location, is_featured)
      VALUES (@title_en, @title_fr, @description_en, @description_fr, @city, @category, @date, @time, @location, @is_featured)
    `);

    sampleEvents.forEach(event => insert.run(event));
  }
}

// Database helper functions
export const db = {
  events: {
    all: () => database.prepare('SELECT * FROM events ORDER BY date DESC').all(),
    featured: () => database.prepare('SELECT * FROM events WHERE is_featured = 1 ORDER BY date DESC').all(),
    byCity: (city: string) => database.prepare('SELECT * FROM events WHERE city = ? ORDER BY date DESC').all(city),
    byId: (id: number) => database.prepare('SELECT * FROM events WHERE id = ?').get(id),
    byCategory: (category: string) => database.prepare('SELECT * FROM events WHERE category = ? ORDER BY date DESC').all(category),
    create: (data: any) => {
      const stmt = database.prepare(`
        INSERT INTO events (title_en, title_fr, description_en, description_fr, city, category, date, time, location, image_url, is_featured)
        VALUES (@title_en, @title_fr, @description_en, @description_fr, @city, @category, @date, @time, @location, @image_url, @is_featured)
      `);
      return stmt.run(data);
    },
    update: (id: number, data: any) => {
      const stmt = database.prepare(`
        UPDATE events 
        SET title_en = @title_en, title_fr = @title_fr, 
            description_en = @description_en, description_fr = @description_fr,
            city = @city, category = @category, date = @date, time = @time,
            location = @location, image_url = @image_url, is_featured = @is_featured
        WHERE id = @id
      `);
      return stmt.run({ ...data, id });
    },
    delete: (id: number) => database.prepare('DELETE FROM events WHERE id = ?').run(id),
    countByCity: () => {
      const result = database.prepare(`
        SELECT city, COUNT(*) as count 
        FROM events 
        GROUP BY city
      `).all();
      return result as { city: string; count: number }[];
    }
  },
  
  discussions: {
    all: () => database.prepare('SELECT * FROM discussions WHERE approved = 1 ORDER BY created_at DESC').all(),
    pending: () => database.prepare('SELECT * FROM discussions WHERE approved = 0 ORDER BY created_at DESC').all(),
    byCity: (city: string) => database.prepare('SELECT * FROM discussions WHERE city = ? AND approved = 1 ORDER BY created_at DESC').all(city),
    byEvent: (eventId: number) => database.prepare('SELECT * FROM discussions WHERE event_id = ? AND approved = 1 ORDER BY created_at DESC').all(eventId),
    create: (data: any) => {
      const stmt = database.prepare(`
        INSERT INTO discussions (event_id, name, comment, city)
        VALUES (@event_id, @name, @comment, @city)
      `);
      return stmt.run(data);
    },
    approve: (id: number) => database.prepare('UPDATE discussions SET approved = 1 WHERE id = ?').run(id),
    delete: (id: number) => database.prepare('DELETE FROM discussions WHERE id = ?').run(id),
    countPending: () => {
      const result = database.prepare('SELECT COUNT(*) as count FROM discussions WHERE approved = 0').get() as { count: number };
      return result.count;
    }
  },
  
  newsletter: {
    subscribe: (email: string, city?: string, language: string = 'en') => {
      const stmt = database.prepare(`
        INSERT OR IGNORE INTO newsletter (email, city, language)
        VALUES (@email, @city, @language)
      `);
      return stmt.run({ email, city, language });
    },
    all: () => database.prepare('SELECT * FROM newsletter ORDER BY subscribed_at DESC').all(),
    count: () => {
      const result = database.prepare('SELECT COUNT(*) as count FROM newsletter').get() as { count: number };
      return result.count;
    },
    unsubscribe: (email: string) => database.prepare('DELETE FROM newsletter WHERE email = ?').run(email)
  }
};

// Initialize database
initDatabase();

export default db;