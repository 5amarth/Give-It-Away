import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
import os
import uuid
import re
import hashlib

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'C:\\Users\\Samarth R T\\Desktop\\'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


db = mysql.connector.connect(
    host="localhost",
    user="ant",
    password="ant1234",
    database="database_name"
)
cursor = db.cursor()





@app.route('/register', methods=['POST'])
def register():
    # Get user data from request body
    username = request.json['username']
    password = request.json['password']

    # Generate user id
    user_id = username[:4] + ''.join(random.choices(string.digits, k=4))

    # Check if username already exists in the database
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    if user:
        # Username already exists, return error response
        return jsonify({'error': 'Username already exists'}), 409

    # Insert new user data into database
    cursor.execute("INSERT INTO users (user_id, username, password) VALUES (%s, %s, %s)", (user_id, username, password))
    db.commit()

    # Return success response
    return jsonify({'message': 'User registered successfully'}), 201





@app.route('/login', methods=['POST'])
def login_user():
    # Get the request data
    data = request.get_json()

    # Get the username and password from the request data
    username = data['username']
    password = data['password']

    # Check if the user exists and the password matches
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    values = (username, password)
    cursor.execute(query, values)
    user = cursor.fetchone()

    if user:
        # User exists and password matches, return success message
        response = {
            'message': 'Login successful',
            'user_id': user[0],
            'username': user[1]
        }
        return jsonify(response), 200
    else:
        # User does not exist or password does not match, return error message
        response = {
            'message': 'Invalid username or password'
        }
        return jsonify(response), 401





def save_image(image):
    # Generate a unique filename for the image
    filename = str(uuid.uuid4()) + '.' + image.filename.split('.')[-1]
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Save the image to the upload folder
    image.save(filepath)
    return filepath


# Route to add new item
@app.route('/additem', methods=['POST'])
def additem():
    # Get item data from request body
    name = request.json['name']
    details = request.json['details']
    contact = request.json['contact']
    quantity = request.json['quantity']
    condition_ = request.json['condition_']
    image = request.files['image']
    visibility = request.json['visibility']
    status = 'available'

    # Generate a random 4 digit number
    random_number = str(random.randint(1000, 9999))

    # Generate item ID by hashing the name, quantity, and random number
    Item_id = hashlib.sha256((name + quantity + random_number).encode('utf-8')).hexdigest()[:8]

    # Save the image and get its filepath
    image_path = save_image(image)

    # Insert new item data into database with item id and image path
    sql = "INSERT INTO items (Item_id, name, details, contact, quantity, condition_, image_path, visibility, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (Item_id, name, details, contact, quantity, condition_, image_path, 1 if visibility else 0, status)
    cursor.execute(sql, val)
    db.commit()

    # Return success response
    response = {'message': 'Item added successfully'}
    response = jsonify(response)
    response.headers['Content-Type'] = 'application/json'
    return response, 201



# API for search
@app.route('/items', methods=['GET'])
def search_items():
    keyword = request.args.get('keyword')
    user_id = request.args.get('user_id')
    cursor = db.cursor(dictionary=True)
    query = "SELECT items.item_id, items.name, items.details, items.contact, items.quantity, items.condition_, items.image_path, items.visibility, items.status, users.username FROM items JOIN users ON items.user_id = users.user_id WHERE LOWER(items.name) REGEXP %s AND items.visibility = 1"
    params = [f'.*{re.escape(keyword.lower())}.*']
    if user_id:
        query += " AND items.user_id != %s"
        params.append(user_id)
    cursor.execute(query, params)
    items = cursor.fetchall()
    cursor.close()

    item_list = []
    for item in items:
        item_dict = {
            'item_id': item['item_id'],
            'name': item['name'],
            'details': item['details'],
            'contact': item['contact'],
            'condition_': item['condition_'],
            'quantity': item['quantity'],
            'image_path': item['image_path'],
            'status': item['status'],
            'username': item['username']
        }
        item_list.append(item_dict)
    return jsonify({'items': item_list})


# Route to update items
@app.route('/myitems/update/<item_id>', methods=['PUT'])
def update_item(item_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM items WHERE item_id=%s", [item_id])
    item = cur.fetchone()
    if not item:
        return jsonify({'error': 'Item not found'})

    name = request.json.get('name', item['name'])
    details = request.json.get('details', item['details'])
    contact = request.json.get('contact', item['contact'])
    condition_ = request.json.get('condition_', item['condition_'])
    quantity = request.json.get('quantity', item['quantity'])
    image_path = request.json.get('image_path', item['image_path'])
    visibility = request.json.get('visibility', item['visibility'])
    status = request.json.get('status', item['status'])

    cur.execute("UPDATE items SET name=%s, details=%s, contact=%s, condition_=%s, quantity=%s, image_path=%s, visibility=%s, status=%s WHERE item_id=%s", 
        (name, details, contact, condition_, quantity, image_path, visibility, status, item_id))
    mysql.connection.commit()
    cur.close()

    return jsonify({'result': True})






# Route to delete an item with a specific id
@app.route('/myitems/delete', methods=['DELETE'])
def delete_item():
    item_id = request.json['item_id']
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM items WHERE item_id = %s", (item_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'result': True})





# Route for viewing "my items"
@app.route('/myitems/<user_id>', methods=['GET'])
def get_my_items(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM items WHERE user_id = %s", (user_id,))
    items = cur.fetchall()
    cur.close()

    # Convert results to a JSON object
    item_list = []
    for item in items:
        item_dict = {
            'item_id': item['item_id'],
            'name': item['name'],
            'details': item['details'],
            'contact': item['contact'],
            'condition_': item['condition_'],
            'quantity': item['quantity'],
            'image_path': item['image_path'],
            'visibility': item['visibility'],
            'status': item['status']
        }
        item_list.append(item_dict)
    return jsonify({'items': item_list})





if __name__ == '__main__':
    app.run(debug=True)
