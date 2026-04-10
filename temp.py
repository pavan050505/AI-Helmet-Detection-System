import requests
r=requests.post(''http://127.0.0.1:5000/api/auth/signup'',{json:{'email':'test2@example.com','password':'password123'}})
print(r.status_code, r.text)
