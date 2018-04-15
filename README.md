# TigerTalk

## Guide to installing and running the server


To install Javascript dependencies:

	npm install


TigerTalk uses [pipenv](https://docs.pipenv.org/) to manage Python dependencies, so this must be installed as detailed on the pipenv site.

To install and enter the virtual environment:

	pipenv install django
	pipenv shell

Any changes to the ReactJS components must be bundled before being available to Django. Run the following command from the root directory:

	node_modules/.bin/webpack --config webpack.config.js

To run the server locally:

	python manage.py runserver

The server should now be available at http://127.0.0.1/8000.

To run the server locally, using environmental variables in a .env file:

	honcho start

The server should now be available at http://127.0.0.1/5000.

In case of the error 'ModuleNotFoundError: No module named 'webpack_loader', install django-webpack-loader via pip, and restart the server.

Any changes to the data models must be migrated before becoming visible. Run the following commands, prefixed by "honcho run" if using honcho:

	python manage.py makemigrations
	python manage.py migrate


If database migration issues occur, the database can be reset using:

	python manage.py reset_db

**DO NOT use this commend on the production database. This drops all tables to recreate the models.**
