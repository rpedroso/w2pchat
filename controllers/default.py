# coding: utf-8
import chats


@auth.requires_login()
def index():
    return chats.index(db)


@auth.requires_signature()
def message_new():
    return chats.message_new(db)


@auth.requires_signature()
def message_updates():
    # need to unlock the session when using
    # session file, should not be need it when
    # using session in db, or in a cookie
    session._unlock(response)
    return chats.message_updates(db)


def user():
    return dict(form=auth())
