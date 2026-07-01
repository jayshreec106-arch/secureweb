import sqlite3
from werkzeug.security import generate_password_hash
import os

db_path = 'database.db'

def init_db():
    print("Initializing database...")
    conn = sqlite3.connect(db_path)
    
    # Read and execute schema.sql
    with open('schema.sql', 'r') as f:
        schema = f.read()
    conn.executescript(schema)
    
    # Insert default admin user if not exists
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", ('admin',))
    if not cursor.fetchone():
        hashed_password = generate_password_hash('admin123')
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', hashed_password))
        conn.commit()
        print("Default admin user created: admin / admin123")
    else:
        print("Admin user already exists.")
        
    conn.close()
    print("Database initialized successfully.")

if __name__ == '__main__':
    init_db()
