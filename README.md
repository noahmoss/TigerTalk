# TigerTalk

## Guide to installing and running the server

To install and enter virtual environment:

	pipenv install django
	pipenv shell

To run the server locally (with the correct environmental variables set):

	honcho start

The app should now be available at http://127.0.0.1:5000/.

Api:

	princetontigertalk.herokuapp.com/admin/
	princetontigertalk.herokuapp.com/api/posts/
    princetontigertalk.herokuapp.com/api/posts/<int:pk>/
    princetontigertalk.herokuapp.com/api/posts/<int:pk>/comments/
    princetontigertalk.herokuapp.com/api/comments/
    princetontigertalk.herokuapp.com/api/comments/<int:pk>/
