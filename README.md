# TigerTalk

## Guide to installing, running, and deploying the server

To install and enter virtual environment:

	pipenv install django
	pipenv shell

To deploy on Heroku:

Api:
	princetontigertalk.herokuapp.com/admin/
	princetontigertalk.herokuapp.com/api/posts/
    princetontigertalk.herokuapp.com/api/posts/<int:pk>/
    princetontigertalk.herokuapp.com/api/posts/<int:pk>/comments/
    princetontigertalk.herokuapp.com/api/comments/
    princetontigertalk.herokuapp.com/api/comments/<int:pk>/
