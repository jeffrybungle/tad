from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Hello from Flask!</h1>'

@app.route('/api/users', methods=['GET'])
def get_users():
    users = [
        {"username": "admin1", "role": "admin"},
        {"username": "user1", "role": "user"}
    ]
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)