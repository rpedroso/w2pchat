db = DAL('sqlite://storage.sqlite',
        pool_size=1, check_reserved=['all'],
        migrate_enabled=True, lazy_tables=True)

from gluon.tools import Auth
auth = Auth(db)

auth.define_tables(username=False, signature=False)

auth.settings.registration_requires_verification = False
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = True

db.define_table('chat',
        Field('me_from'),
        Field('me_body', 'text'),
        Field('me_html', 'text'),
        )
