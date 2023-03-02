from starlette.authentication import AuthenticationBackend, AuthCredentials, SimpleUser


class ValidateJWT(AuthenticationBackend):
    async def authenticate(self, conn):
        print(conn.session)
        if not conn.session:
            print("NO SESSION")
            return
        return AuthCredentials(["authenticated"]), SimpleUser(conn.session.get("user_id"))
