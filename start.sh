#!/bin/bash
cd /app/backend
python manage.py migrate --noinput &
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --timeout 120 --workers 1 --log-level info --capture-output
