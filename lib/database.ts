// import Database from 'better-sqlite3';
// import path from 'path';

// const databaseInstance = new Database(process.env.DATABASE_PATH || './localpulse.db');

// // Initialize database tables
// export function initDatabase() {
//   // Events table
//   databaseInstance.exec(`
//     CREATE TABLE IF NOT EXISTS events (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title_en TEXT NOT NULL,
//       title_fr TEXT NOT NULL,
//       description_en TEXT NOT NULL,
//       description_fr TEXT NOT NULL,
//       city TEXT NOT NULL CHECK(city IN ('toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton')),
//       category TEXT NOT NULL CHECK(category IN ('community', 'sports', 'arts', 'food', 'education', 'business')),
//       date TEXT NOT NULL,
//       time TEXT,
//       location TEXT,
//       image_url TEXT,
//       is_featured BOOLEAN DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `);

//   // Discussions table
//   databaseInstance.exec(`
//     CREATE TABLE IF NOT EXISTS discussions (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       event_id INTEGER,
//       name TEXT NOT NULL,
//       comment TEXT NOT NULL,
//       city TEXT NOT NULL,
//       approved BOOLEAN DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
//     )
//   `);

//   // Newsletter subscribers
//   databaseInstance.exec(`
//     CREATE TABLE IF NOT EXISTS newsletter (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       email TEXT UNIQUE NOT NULL,
//       city TEXT,
//       language TEXT DEFAULT 'en',
//       subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `);

//   // Insert some sample events if table is empty
//   const eventCount = databaseInstance.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
  
//   if (eventCount.count === 0) {
//     const sampleEvents = [
//       {
//         title_en: 'Toronto Waterfront Cleanup',
//         title_fr: 'Nettoyage du front de mer de Toronto',
//         description_en: 'Join us for a community cleanup at Toronto Waterfront. Gloves and bags provided.',
//         description_fr: 'Rejoignez-nous pour un nettoyage communautaire au front de mer de Toronto. Gants et sacs fournis.',
//         city: 'toronto',
//         category: 'community',
//         date: '2024-03-15',
//         time: '10:00 AM',
//         location: 'Harbourfront Centre',
//         is_featured: 1
//       },
//       {
//         title_en: 'Montreal Jazz Festival',
//         title_fr: 'Festival de Jazz de Montréal',
//         description_en: 'Experience the world-renowned Montreal Jazz Festival with local and international artists.',
//         description_fr: 'Découvrez le Festival de Jazz de Montréal de renommée mondiale avec des artistes locaux et internationaux.',
//         city: 'montreal',
//         category: 'arts',
//         date: '2024-06-28',
//         time: '6:00 PM',
//         location: 'Quartier des Spectacles',
//         is_featured: 1
//       },
//       {
//         title_en: 'Vancouver Farmers Market',
//         title_fr: 'Marché des agriculteurs de Vancouver',
//         description_en: 'Fresh local produce and artisan goods every weekend at Trout Lake.',
//         description_fr: 'Produits locaux frais et produits artisanaux chaque week-end au lac Trout.',
//         city: 'vancouver',
//         category: 'food',
//         date: '2024-03-10',
//         time: '9:00 AM',
//         location: 'Trout Lake Community Centre',
//         is_featured: 0
//       }
//     ];

//     const insert = databaseInstance.prepare(`
//       INSERT INTO events (title_en, title_fr, description_en, description_fr, city, category, date, time, location, is_featured)
//       VALUES (@title_en, @title_fr, @description_en, @description_fr, @city, @category, @date, @time, @location, @is_featured)
//     `);

//     const transaction = databaseInstance.transaction(() => {
//       sampleEvents.forEach(event => insert.run(event));
//     });
    
//     transaction();
//   }
// }

// // Database helper functions
// export const databaseHelpers = {
//   events: {
//     all: () => databaseInstance.prepare('SELECT * FROM events ORDER BY date DESC').all(),
//     featured: () => databaseInstance.prepare('SELECT * FROM events WHERE is_featured = 1 ORDER BY date DESC').all(),
//     byCity: (city: string) => databaseInstance.prepare('SELECT * FROM events WHERE city = ? ORDER BY date DESC').all(city),
//     byId: (id: number) => databaseInstance.prepare('SELECT * FROM events WHERE id = ?').get(id),
//     create: (data: any) => {
//       const stmt = databaseInstance.prepare(`
//         INSERT INTO events (title_en, title_fr, description_en, description_fr, city, category, date, time, location, image_url, is_featured)
//         VALUES (@title_en, @title_fr, @description_en, @description_fr, @city, @category, @date, @time, @location, @image_url, @is_featured)
//       `);
//       return stmt.run(data);
//     },
//     update: (id: number, data: any) => {
//       const stmt = databaseInstance.prepare(`
//         UPDATE events 
//         SET title_en = @title_en, title_fr = @title_fr, 
//             description_en = @description_en, description_fr = @description_fr,
//             city = @city, category = @category, date = @date, time = @time,
//             location = @location, image_url = @image_url, is_featured = @is_featured
//         WHERE id = @id
//       `);
//       return stmt.run({ ...data, id });
//     },
//     delete: (id: number) => databaseInstance.prepare('DELETE FROM events WHERE id = ?').run(id),
//     countByCity: () => {
//       const result = databaseInstance.prepare(`
//         SELECT city, COUNT(*) as count 
//         FROM events 
//         GROUP BY city
//       `).all();
//       return result as { city: string; count: number }[];
//     }
//   },
//   discussions: {
//     all: () => databaseInstance.prepare('SELECT * FROM discussions WHERE approved = 1 ORDER BY created_at DESC').all(),
//     pending: () => databaseInstance.prepare('SELECT * FROM discussions WHERE approved = 0 ORDER BY created_at DESC').all(),
//     byCity: (city: string) => databaseInstance.prepare('SELECT * FROM discussions WHERE city = ? AND approved = 1 ORDER BY created_at DESC').all(city),
//     byEvent: (eventId: number) => databaseInstance.prepare('SELECT * FROM discussions WHERE event_id = ? AND approved = 1 ORDER BY created_at DESC').all(eventId),
//     create: (data: any) => {
//       const stmt = databaseInstance.prepare(`
//         INSERT INTO discussions (event_id, name, comment, city)
//         VALUES (@event_id, @name, @comment, @city)
//       `);
//       return stmt.run(data);
//     },
//     approve: (id: number) => databaseInstance.prepare('UPDATE discussions SET approved = 1 WHERE id = ?').run(id),
//     delete: (id: number) => databaseInstance.prepare('DELETE FROM discussions WHERE id = ?').run(id),
//     countPending: () => {
//       const result = databaseInstance.prepare('SELECT COUNT(*) as count FROM discussions WHERE approved = 0').get() as { count: number };
//       return result.count;
//     }
//   },
//   newsletter: {
//     subscribe: (email: string, city?: string, language: string = 'en') => {
//       try {
//         const stmt = databaseInstance.prepare(`
//           INSERT OR IGNORE INTO newsletter (email, city, language)
//           VALUES (@email, @city, @language)
//         `);
//         return stmt.run({ email, city, language });
//       } catch (error) {
//         console.error('Newsletter subscription error:', error);
//         throw error;
//       }
//     },
//     all: () => databaseInstance.prepare('SELECT * FROM newsletter ORDER BY subscribed_at DESC').all(),
//     count: () => {
//       const result = databaseInstance.prepare('SELECT COUNT(*) as count FROM newsletter').get() as { count: number };
//       return result.count;
//     },
//     unsubscribe: (email: string) => databaseInstance.prepare('DELETE FROM newsletter WHERE email = ?').run(email)
//   }
// };

// // Initialize database
// initDatabase();

// export default databaseHelpers;



import Database from 'better-sqlite3';
import path from 'path';

const database = new Database(process.env.DATABASE_PATH || './localpulse.db');

// Initialize database tables
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
      },
      {
    title_en: 'Vancouver Cherry Blossom Festival',
    title_fr: 'Festival des cerisiers en fleurs de Vancouver',
    description_en: 'Celebrate spring with cherry blossom viewing, cultural performances, and guided tours in Vancouver.',
    description_fr: 'Célébrez le printemps avec l\'observation des cerisiers en fleurs, des spectacles culturels et des visites guidées à Vancouver.',
    city: 'vancouver',
    category: 'arts',
    date: '2024-04-01',
    time: '9:00 AM',
    location: 'Queen Elizabeth Park',
    is_featured: 1
  },
  {
    title_en: 'Calgary Stampede Rodeo',
    title_fr: 'Rodéo du Stampede de Calgary',
    description_en: 'The greatest outdoor show on earth! Rodeo events, concerts, and western entertainment.',
    description_fr: 'Le plus grand spectacle en plein air sur terre ! Événements de rodéo, concerts et divertissement western.',
    city: 'calgary',
    category: 'sports',
    date: '2024-07-05',
    time: '2:00 PM',
    location: 'Stampede Park',
    is_featured: 1
  },
  {
    title_en: 'Ottawa Winterlude Festival',
    title_fr: 'Festival Winterlude d\'Ottawa',
    description_en: 'Celebrate Canadian winter with ice sculptures, snow slides, and outdoor activities.',
    description_fr: 'Célébrez l\'hiver canadien avec des sculptures sur glace, des glissades de neige et des activités de plein air.',
    city: 'ottawa',
    category: 'community',
    date: '2024-02-02',
    time: '10:00 AM',
    location: 'Rideau Canal',
    is_featured: 0
  },
  {
    title_en: 'Edmonton Folk Music Festival',
    title_fr: 'Festival de musique folk d\'Edmonton',
    description_en: 'Four days of folk music featuring artists from across Canada and around the world.',
    description_fr: 'Quatre jours de musique folk avec des artistes de partout au Canada et du monde entier.',
    city: 'edmonton',
    category: 'arts',
    date: '2024-08-08',
    time: '4:00 PM',
    location: 'Gallagher Park',
    is_featured: 0
  },
  {
    title_en: 'Toronto International Film Festival (TIFF)',
    title_fr: 'Festival international du film de Toronto (TIFF)',
    description_en: 'One of the largest publicly attended film festivals in the world, showcasing international cinema.',
    description_fr: 'L\'un des plus grands festivals de cinéma au monde, présentant le cinéma international.',
    city: 'toronto',
    category: 'arts',
    date: '2024-09-05',
    time: '6:00 PM',
    location: 'TIFF Bell Lightbox',
    is_featured: 1
  },
  {
    title_en: 'Montreal Grand Prix',
    title_fr: 'Grand Prix de Montréal',
    description_en: 'Formula 1 racing event attracting fans from around the world to Circuit Gilles Villeneuve.',
    description_fr: 'Événement de course de Formule 1 attirant des fans du monde entier au Circuit Gilles Villeneuve.',
    city: 'montreal',
    category: 'sports',
    date: '2024-06-07',
    time: '1:00 PM',
    location: 'Circuit Gilles Villeneuve',
    is_featured: 1
  },
  {
    title_en: 'Vancouver Sea Festival',
    title_fr: 'Festival de la mer de Vancouver',
    description_en: 'Celebrate maritime heritage with boat races, seafood feasts, and waterfront activities.',
    description_fr: 'Célébrez l\'héritage maritime avec des courses de bateaux, des festins de fruits de mer et des activités au bord de l\'eau.',
    city: 'vancouver',
    category: 'community',
    date: '2024-07-20',
    time: '11:00 AM',
    location: 'Granville Island',
    is_featured: 0
  },
  {
    title_en: 'Calgary Farmers Market',
    title_fr: 'Marché des agriculteurs de Calgary',
    description_en: 'Weekly market featuring local produce, artisan goods, and food trucks every Saturday.',
    description_fr: 'Marché hebdomadaire présentant des produits locaux, des produits artisanaux et des camions-restaurants tous les samedis.',
    city: 'calgary',
    category: 'food',
    date: '2024-03-09',
    time: '8:00 AM',
    location: 'Calgary Farmers Market',
    is_featured: 0
  },
  {
    title_en: 'Ottawa Tulip Festival',
    title_fr: 'Festival des tulipes d\'Ottawa',
    description_en: 'Celebrate spring with over a million tulips in bloom across Ottawa.',
    description_fr: 'Célébrez le printemps avec plus d\'un million de tulipes en fleurs à Ottawa.',
    city: 'ottawa',
    category: 'arts',
    date: '2024-05-10',
    time: '9:00 AM',
    location: 'Commissioners Park',
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
    delete: (id: number) => database.prepare('DELETE FROM discussions WHERE id = ?').run(id)
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
    }
  }
};


// Add to your existing database.ts file
// In the create function, make sure image_url is handled:

create: (data: any) => {
  const stmt = database.prepare(`
    INSERT INTO events (title_en, title_fr, description_en, description_fr, city, category, date, time, location, image_url, is_featured)
    VALUES (@title_en, @title_fr, @description_en, @description_fr, @city, @category, @date, @time, @location, @image_url, @is_featured)
  `);
  return stmt.run(data);
},

// Initialize database
initDatabase();

export default db;


