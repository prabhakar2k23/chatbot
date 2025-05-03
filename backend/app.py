from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Prabhakar@123456',  
    'database': 'mydatabase'
}

def db_data(user_message):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT response FROM messagetable WHERE message = %s"
        cursor.execute(query, (user_message,))
        result = cursor.fetchone()

        return result['response'] if result else "Sorry, I don't understand."
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json(force=True)
        if not data or 'message' not in data:
            return jsonify({'error': 'Invalid request, message key missing'}), 400
        
        user_message = data['message']
        reply = db_data(user_message)
        store_chat_history(user_message, reply)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Function to store chat history
def store_chat_history(user_message, bot_response):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        insert_query = "INSERT INTO chathistory (user_message, bot_response) VALUES (%s, %s)"
        cursor.execute(insert_query, (user_message, bot_response))
        conn.commit()
    except Exception as e:
        print(f"Error storing chat history: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Function to fetch chat history
def fetch_chat_history():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM chathistory ORDER BY id DESC"
        cursor.execute(query)
        history = cursor.fetchall()
        return history
    except Exception as e:
        return {"error": str(e)}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Fetch Chat History API
@app.route('/history', methods=['GET'])
def get_history():
    """API endpoint to get chat history"""
    history = fetch_chat_history()
    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
