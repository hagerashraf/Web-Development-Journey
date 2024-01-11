from flask import Flask,request
from flask.json import jsonify
from flask.templating import render_template
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="DB_Project",
  database= 'test'
)
cursor = mydb.cursor()

app = Flask(__name__)

@app.route("/show_results",methods = ['POST'])
def show_results():
  if request.method == 'POST':
    json_data = request.get_json(force=True)
    Test_ID = json_data['ID']
    cursor.execute("SELECT ID FROM Tests WHERE Test_ID = %s ",(Test_ID))
    ID = cursor.fetchall()
    return jsonify(ID)

@app.route("/add_result",methods = ['POST'])
def add_result():
  if request.method == 'POST':
    user_json = request.get_json(force=True)
    patient_ID  = user_json["patient_ID"]
    Test_ID = user_json["Test_ID"]
    Test_Img = user_json["Test_Img"]
    Test_Report = user_json["Test_Report"]
    cursor.execute("INSERT INTO Tests SET Test_ID = %s,Test_Img = %s ,Test_Report = %s ,id = %s",(Test_ID,Test_Img,Test_Report,patient_ID))
    mydb.commit()
    return jsonify({"message":"updated"})