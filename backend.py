import imghdr
import mysql.connector
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import random
import string
import os
import uuid
import re
import hashlib
from io import BytesIO
import base64
from PIL import Image


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'C:\\Users\\Samarth R T\\MyProject\\Images'
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
    contact = request.json['contact']

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
    cursor.execute("INSERT INTO users (user_id, username, password, contact) VALUES (%s, %s, %s, %s)", (user_id, username, password, contact))
    db.commit()

    # Return success response with user_id
    response = {
        'message': 'User registered successfully',
        'user_id': user_id
    }
    return jsonify(response), 201




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
        # User exists and password matches, fetch the user_id from the database
        user_id_query = "SELECT user_id FROM users WHERE username = %s"
        cursor.execute(user_id_query, (username,))
        user_id = cursor.fetchone()[0]

        # Return success message with user_id and username
        response = {
            'message': 'Login successful',
            'user_id': user_id,
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
    img = Image.open(BytesIO(base64.b64decode(image)))
    filename = str(uuid.uuid4()) + '.jpg'
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    img.save(image_path)
    img.close()
    return image_path



# Route to add new item
@app.route('/additem', methods=['POST'])
def additem():
    # Get item data from request body
    name = request.form['name']
    details = request.form['details']
    quantity = request.form['quantity']
    condition_ = request.form['condition_']
    visibility = request.form['visibility']
    image = request.form['image']
    user_id = request.form['user_id']
    status = 'Available'

    # Generate a random 4 digit number
    random_number = str(random.randint(1000, 9999))

    # Generate item ID by hashing the name, quantity, and random number
    Item_id = hashlib.sha256((name + quantity + random_number).encode('utf-8')).hexdigest()[:8]

    image_path = save_image(image)

    # Get contact of the user_id from the users table
    sql_get_contact = "SELECT contact FROM users WHERE user_id = %s"
    cursor.execute(sql_get_contact, (user_id,))
    result = cursor.fetchone()
    contact = result[0]

    # Insert new item data into database with item id, image path, and contact of the user
    sql = "INSERT INTO items (Item_id, name, details, quantity, condition_, image_path, visibility, status, user_id, contact) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (Item_id, name, details, quantity, condition_, image_path, visibility, status, user_id, contact)
    cursor.execute(sql, val)
    db.commit()

    # Return success response
    response = {'message': 'Item added successfully'}
    return jsonify(response), 201





# API for search
@app.route('/items', methods=['GET'])
def search_items():
    keyword = request.args.get('keyword')
    user_id = request.args.get('user_id')
    cursor = db.cursor(dictionary=True)
    query = "SELECT items.item_id, items.name, items.details, items.contact, items.quantity, items.condition_, items.image_path, items.visibility, items.status, users.username FROM items JOIN users ON items.user_id = users.user_id WHERE LOWER(items.name) REGEXP %s AND items.visibility = 'true'"
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
            'status': item['status'],
            'username': item['username']
        }
        # Retrieve the image from the image path in the database
        image_path = item['image_path']
        if image_path:
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
            # Encode the image in base64 and add it to the item dictionary
            item_dict['image_data'] = base64.b64encode(image_bytes).decode('utf-8')
        else:
            item_dict['image'] = None
        item_list.append(item_dict)
    return jsonify({'items': item_list})




# Route to update items
@app.route('/myitems/update', methods=['PUT'])
def update_item():

    item_id = request.form['item_id']
    cur = db.cursor()
    cur.execute("SELECT * FROM items WHERE item_id=%s", [item_id])
    item = cur.fetchone()
    if not item:
        return jsonify({'error': 'Item not found'})
    
    print('request.form')
    name = request.form.get('name')
    details = request.form.get('details')
    contact = request.form.get('contact')
    condition_ = request.form.get('condition')
    quantity = request.form.get('quantity')
    image = request.form.get('image')
    visibility = request.form.get('visibility')
    status = request.form.get('status')
    item_id = request.form.get('item_id')

    if image:
        # delete the old image
        os.remove(item[5])

        # save the new image and get the image path
        image_path = save_image(image)

        # update the item with the new image path
        cur.execute("UPDATE items SET name=%s, details=%s, contact=%s, condition_=%s, quantity=%s, image_path=%s, visibility=%s, status=%s WHERE item_id=%s", 
            (name, details, contact, condition_, quantity, image_path, visibility, status, item_id))
    else:
        # if no new image was uploaded, update the item without changing the image path
        cur.execute("UPDATE items SET name=%s, details=%s, contact=%s, condition_=%s, quantity=%s, visibility=%s, status=%s WHERE item_id=%s", 
            (name, details, contact, condition_, quantity, visibility, status, item_id))

    db.commit()
    cur.close()

    return jsonify({'result': True})




# Route to delete an item with a specific id
@app.route('/myitems/delete', methods=['DELETE'])
def delete_item():
    item_id = request.json['item_id']
    cur = db.cursor()
    cur.execute("DELETE FROM items WHERE item_id = %s", (item_id,))
    db.commit()
    cur.close()

    return jsonify({'result': True})



# Route for viewing "my items"
@app.route('/myitems', methods=['GET'])
def get_my_items():
    user_id = request.args.get('user_id')
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM items WHERE user_id = %s", (user_id,))
    items = cur.fetchall()
    cur.close()

    # Convert results to a JSON object
    item_list = []
    for item in items:
        item_dict = {
            'Item_id': item['Item_id'],
            'name': item['name'],
            'details': item['details'],
            'contact': item['contact'],
            'condition_': item['condition_'],
            'quantity': item['quantity'],
            'visibility': item['visibility'],
            'status': item['status']
        }
        # Retrieve the image from the image path in the database
        image_path = item['image_path']
        if image_path:
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
            # Encode the image in base64 and add it to the item dictionary
            item_dict['image_data'] = base64.b64encode(image_bytes).decode('utf-8')
        else:
            item_dict['image_data'] = None
        item_list.append(item_dict)
    return jsonify({'items': item_list})



if __name__ == '__main__':
    app.run(debug=True)
