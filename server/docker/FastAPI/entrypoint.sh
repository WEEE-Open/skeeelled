#bin/sh

#here there are all the startup commands needed for django
#migrations for the db and connecting static volume


# starting wsgi
uvicorn main:app --host=0.0.0.0 --reload