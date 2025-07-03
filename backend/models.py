from database import get_db_connection

def find_user_by_emp_id(emp_id):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE emp_id = ?", (emp_id,)).fetchone()
    conn.close()
    return user

def insert_user(name, emp_id, password, role, department):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users (name, emp_id, password, role, department)
        VALUES (?, ?, ?, ?, ?)
    """, (name, emp_id, password, role, department))

    conn.commit()
    conn.close()
