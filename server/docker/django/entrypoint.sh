#bin/sh

#here there are all the startup commands needed for django
#migrations for the db and connecting static volume


# starting gunicorn wsgi
gunicorn wtp.wsgi:application --bind 0.0.0.0:8000