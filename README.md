w2pchat
=======

web2py chat example.

it's based on bottle chat (https://github.com/iurisilvio/bottle-chat) that
in turns it's based in gevent webchat example (in django) that in turns
it's based in tornado webchat example.



HOW to run it
=============

install gevent:

```console
$ pip install gevent
```

then:

```console
$ cd <web2py_folder>/applications
$ git clone https://github.com/rpedroso/w2pchat
$ cd ..
$ python anyserver.py -s gevent
```

now:

go to http://localhost:8000/w2pchat and create a user or two.
then with to different browsers login and chat.
