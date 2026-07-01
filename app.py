from flask import Flask, render_template, request, redirect, url_for, session, flash, g
import sqlite3
from werkzeug.security import check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'cyber_security_awareness_secret_key_123'
DATABASE = 'database.db'

# Database Helper Functions
def get_db():
    """Opens a new database connection if there is none yet for the current application context."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # Access columns by name like dict
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Closes the database connection at the end of the request."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    """Queries the database and returns a list of dictionaries."""
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

# Route: Home Page
@app.route('/')
def index():
    return render_template('index.html')

# Route: Cyber Crime Types Page
@app.route('/crimes')
def crimes():
    return render_template('crimes.html')

# Route: Cyber Safety Tips Page
@app.route('/safety')
def safety():
    return render_template('safety.html')

# Route: Awareness Quiz Page
@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

# Route: Contact / Report Form Page
@app.route('/report', methods=['GET', 'POST'])
def report():
    if request.method == 'POST':
        # Retrieve form data
        name = request.form.get('name')
        email = request.form.get('email')
        crime_type = request.form.get('crime_type')
        message = request.form.get('message')
        
        # Simple server-side validation
        if not name or not email or not crime_type or not message:
            flash('All fields are required!', 'danger')
            return redirect(url_for('report'))
        
        # Insert report into SQLite database
        try:
            db = get_db()
            db.execute(
                'INSERT INTO reports (name, email, crime_type, message) VALUES (?, ?, ?, ?)',
                (name, email, crime_type, message)
            )
            db.commit()
            flash('Your report has been successfully submitted and stored. Our admin team will look into it.', 'success')
        except Exception as e:
            print(f"Error inserting report: {e}")
            flash('An error occurred while submitting your report. Please try again.', 'danger')
            
        return redirect(url_for('report'))
        
    return render_template('report.html')

# Route: Admin Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    # If user is already logged in, redirect to admin page
    if 'logged_in' in session:
        return redirect(url_for('admin'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Retrieve user from database
        user = query_db('SELECT * FROM users WHERE username = ?', [username], one=True)
        
        if user and check_password_hash(user['password'], password):
            session['logged_in'] = True
            session['username'] = user['username']
            flash('Successfully logged in as administrator.', 'success')
            return redirect(url_for('admin'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')
            
    return render_template('login.html')

# Route: Admin Logout
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# Route: Admin Panel (Basic Dashboard)
@app.route('/admin')
def admin():
    # Authentication check
    if 'logged_in' not in session:
        flash('Please login to access the admin panel.', 'warning')
        return redirect(url_for('login'))
        
    # Fetch all reports ordered by date (newest first)
    reports = query_db('SELECT * FROM reports ORDER BY date DESC')
    return render_template('admin.html', reports=reports)

# Route: Delete Report (Admin action)
@app.route('/admin/delete/<int:report_id>', methods=['POST'])
def delete_report(report_id):
    # Authentication check
    if 'logged_in' not in session:
        flash('Unauthorized action.', 'danger')
        return redirect(url_for('login'))
        
    try:
        db = get_db()
        db.execute('DELETE FROM reports WHERE id = ?', (report_id,))
        db.commit()
        flash('Report deleted successfully.', 'success')
    except Exception as e:
        print(f"Error deleting report: {e}")
        flash('Could not delete the report. Please try again.', 'danger')
        
    return redirect(url_for('admin'))

if __name__ == '__main__':
    # Set to debug=True for development environment
    app.run(debug=True, host='127.0.0.1', port=5000)
