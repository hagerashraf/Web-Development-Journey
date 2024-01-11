from flask import Flask,request,redirect
from flask.json import jsonify
from flask_cors import CORS
import mysql.connector
import os
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="DB_Project",
  database= 'radiology'
)
cursor = mydb.cursor()
app = Flask(__name__)
CORS(app)

@app.route("/show_results",methods = ['POST'])
def show_results():
  if request.method == 'POST':
    json_data = request.get_json(force=True)
    Test_ID = json_data['Test_ID']
    P_ID = json_data['P_ID']
    cursor.execute("SELECT Test_Report,Test_Img FROM Tests WHERE Test_ID = %s AND Done_To = %s ",(Test_ID,P_ID))
    TEST = cursor.fetchall()
    print("hello")
    print(TEST)
    return jsonify(TEST)

app.config["IMAGE_UPLOAD"] = "D:/workspace/github/DataBase/Images/uploads"
@app.route("/add_result",methods = ['POST'])
def add_result():
  global p_id
  json_data = request.get_json(force = True)
  p_id = json_data["p_id"]
  test_id = json_data["test_id"]
  test_report = json_data["test_report"]
  cursor.execute("INSERT INTO tests(Done_To,Test_ID,Test_Report) VALUES(%s,%s,%s)",(p_id,test_id,test_report))
  mydb.commit()
  return jsonify("inserted")

@app.route("/add_img")
def add_img():
  global p_id
  img = request.files
  img.save(os.path.join(app.config["IMAGE_UPLOAD"],img.name))
  loc = os.path.join(app.config["IMAGE_UPLOAD"],img.name)
  cursor.execute("UPDATE tests SET Test_Img  = %s WHERE Done_to = %s",(loc,p_id))
  mydb.commit()
  return jsonify("inserted")

@app.route("/ID_Check",methods = ['POST'])
def ID_Check():
  json_data = request.get_json(force = True)
  ID = json_data["ID"]
  print(ID)
  cursor.execute("SELECT User_Name FROM employee WHERE ID = %s",(ID,))
  users = cursor.fetchall()
  if not users:
      return jsonify("error")
  return jsonify("found")

@app.route("/save_acc",methods = ['POST'])
def save_acc():
  json_data = request.get_json(force = True)
  username = json_data["user_name"]
  ID = json_data["ID"]
  password = json_data["password"]
  cursor.execute("UPDATE Employee SET User_Name = %s, Password  = %s WHERE ID = %s",(username,password,ID))
  mydb.commit()
  return jsonify({"message":"inserted"})

@app.route("/sign_in",methods = ['POST'])
def sign_in():
  json_data = request.get_json(force = True)
  ID = json_data["ID"]
  password = json_data["password"]
  cursor.execute("SELECT User_Name FROM employee WHERE ID = %s AND Password = %s",(ID,password))
  username = cursor.fetchall()
  return jsonify(username)

@app.route("/commit")
def commit():
  cursor.commit()

if __name__ == "__main__":
  app.run(debug = True)
