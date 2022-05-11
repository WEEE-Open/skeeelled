#bin/sh

#here there are all the startup commands needed for django
#migrations for the db and connecting static volume

python generate_test_data.py

# starting wsgi
uvicorn main:app --reload