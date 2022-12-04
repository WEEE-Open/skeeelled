from starlette.authentication import AuthenticationBackend, AuthCredentials, SimpleUser


class ValidateJWT(AuthenticationBackend):
    async def authenticate(self, conn):
        print(conn.session)
        return AuthCredentials(["authenticated"]), SimpleUser("Sahircan")
