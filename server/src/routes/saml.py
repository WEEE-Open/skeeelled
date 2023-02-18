from fastapi import APIRouter, Request, HTTPException, Response
from fastapi.responses import RedirectResponse
from onelogin.saml2.idp_metadata_parser import OneLogin_Saml2_IdPMetadataParser
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from starlette.responses import RedirectResponse
from utils import responses
from generate_test_data import TEST_STUDENT_ID
from urllib.error import URLError
from time import sleep

print("ANANANANANANANANANAN")
IDP_URL = "http://172.19.0.2:8080/realms/skeeelled/protocol/saml/descriptor"
# IDP_URL = "https://idp.polito.it/idp-metadata.xml"
SP_URL = "http://172.19.0.6:8000/saml"

router = APIRouter()

# TODO: Might delete in production
while True:
    try:
        idp_data = OneLogin_Saml2_IdPMetadataParser.parse_remote(IDP_URL)
        print("Connected to the IdP")
        break
    except URLError:
        print("Waiting for the IdP...")
        sleep(5)

print(idp_data)
settings = {
    "strict": False,    # for testing
    "debug": True,      # for testing
    "idp": idp_data["idp"],
    "sp": {
        "entityId": SP_URL + "/metadata",
        "assertionConsumerService": {
            "url": SP_URL + "/callback",
            "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        }
    }
}

print("BABAN")


class XMLResponse(Response):
    media_type = "application/xml"


async def prepare_from_fastapi_request(request: Request):
    form_data = await request.form()
    rv = {
        "http_host": request.client.host,
        "server_port": request.url.port,
        "script_name": request.url.path,
        "post_data": { },
        "get_data": { },
    }
    if request.query_params:
        rv["get_data"] = request.query_params,
    if "SAMLResponse" in form_data:
        rv["post_data"]["SAMLResponse"] = form_data["SAMLResponse"]
    if "RelayState" in form_data:
        rv["post_data"]["RelayState"] = form_data["RelayState"]
    return rv


@router.get("/login", response_class=RedirectResponse)
async def login(request: Request):
    req = await prepare_from_fastapi_request(request)
    auth = OneLogin_Saml2_Auth(req, settings)
    return auth.login()


@router.post("/callback", status_code=303, response_class=RedirectResponse, responses=responses(500, 401))
async def callback(request: Request):
    req = await prepare_from_fastapi_request(request)
    auth = OneLogin_Saml2_Auth(req, settings)
    auth.process_response()  # Process IdP response
    errors = auth.get_errors()  # This method receives an array with the errors
    if len(errors) > 0:
        raise HTTPException(500, "Error when processing SAML Response: %s %s" % (', '.join(errors), auth.get_last_error_reason()))
    if not auth.is_authenticated():  # This check if the response was ok and the user data retrieved or not (user authenticated)
        raise HTTPException(401)
    attr = auth.get_attributes()
    print("attr:")
    print(attr)
    request.session.update({"user_id": TEST_STUDENT_ID})
    return "https://google.com"


@router.get("/metadata", response_class=XMLResponse, responses=responses(500))
async def saml_metadata(request: Request):
    req = await prepare_from_fastapi_request(request)
    auth = OneLogin_Saml2_Auth(req, settings)
    saml_settings = auth.get_settings()
    metadata = saml_settings.get_sp_metadata()
    errors = saml_settings.validate_metadata(metadata)
    if len(errors) > 0:
        raise HTTPException(500, "Error found on Metadata: %s" % (', '.join(errors)))
    return metadata
