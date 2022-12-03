from fastapi import APIRouter, Request, HTTPException, Response
from onelogin.saml2.idp_metadata_parser import OneLogin_Saml2_IdPMetadataParser
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from starlette.responses import RedirectResponse

IDP_URL = "https://samltest.id/saml/idp"
SP_URL = "https://bbfc-2-198-120-57.eu.ngrok.io/saml"

router = APIRouter()

idp_data = OneLogin_Saml2_IdPMetadataParser.parse_remote(IDP_URL)
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
    callback_url = auth.login()
    response = RedirectResponse(url=callback_url)
    return response


@router.post("/callback")
async def callback():
    print("Callback")
    return "Hello SAML callback"


@router.get("/metadata", response_class=XMLResponse)
async def saml_metadata(request: Request):
    req = await prepare_from_fastapi_request(request)
    auth = OneLogin_Saml2_Auth(req, settings)
    saml_settings = auth.get_settings()
    metadata = saml_settings.get_sp_metadata()
    errors = saml_settings.validate_metadata(metadata)
    if len(errors) > 0:
        raise HTTPException(500, "Error found on Metadata: %s" % (', '.join(errors)))
    return metadata
